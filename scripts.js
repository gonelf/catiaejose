// common

let alergies_placeholder = "Exemplos: vegetariano, vegan, glúten, lactose, leite, ovo, marisco, peixe, amendoim e frutos secos, soja...";
$(".alergies").attr("placeholder", alergies_placeholder);

let message_solo = "Temos todo o prazer em convidar-te para celebrares connosco este dia tão especial. Abaixo podes encontrar uma área dedicada à confirmação da tua presença.";
let message_family = "Temos todo o prazer em convidar-te para celebrares connosco este dia tão especial. Abaixo podes encontrar uma área dedicada à confirmação da tua presença, e também à da tua família, a quem estendemos o convite com todo o gosto!";

// functions

function fetch(user) {
  let gid = user.fields.GID;
  getUsersByGID(gid, function(data){
    // success
    users = data['records'];
    setCookie("catiaejose.com-users", encodeURI(JSON.stringify(data['records'])), 10);
    $("#modal-loading").hide();
    populateInfo(user, users);
  }, function(){
    //error
    setCookie("catiaejose.com-user", 0, -1);
    window.location.href = "./index.html";
  });
}

function start(user) {
  if(!getCookie("catiaejose.com-user")){
    window.location.href = "./index.html";
  }
  else {
    var users = [];

    if (getCookie("catiaejose.com-users")) {
      // console.log("cache");
      // console.log(getCookie("catiaejose.com-users"));
      users = JSON.parse(getCookie("catiaejose.com-users"));
      populateInfo(user, users);
      return users;
    }
    else {
      // console.log("fetch");
      $("#modal-loading").show();
      fetch(user);
    }
  }
}

function populateInfo(mainuser, users) {
  // console.log(users);
  $("#welcome").html("Olá, "+mainuser.fields.name+".");
  $("#cards-row").html("");
  $("#message").text((users.length > 1 ? message_family : message_solo));
  $.each(users.reverse(), function(index, user){
    var name = (!user.fields.name || user.fields.name == "") ? ((user.fields.type == 'plusone') ? "Plus One" : "Filho/a") : user.fields.name ;
    var confirmed = (user.fields.confirmed) ? "<span class='confirmado'>Confirmado</span>" : '<span>&nbsp;</span>';
    var confirm_btn = (user.fields.confirmed) ? "Alterar confirmação" : 'Confirmar presença';
    var confirm_btn_class = (user.fields.confirmed) ? "btn" : "btn-gold";
    $("#cards-row").append('<div class="card">'+
      '<h6>'+name+'</h6>'+
      confirmed+
      '<button type="button" name="button" usertype="'+user.fields.type+'" userid="'+user.id+'" class="'+confirm_btn_class+' confirm">'+confirm_btn+'</button>'+
    '</div>');
  });
}

function hideForms() {
  $('#adulto').hide();
  $('#plusone').hide();
  $('#kid-known').hide();
  $('#kid-unkown').hide();
}

function formSubmit(target) {
  $("#modal-loading").show();
  $("#modal-overlay").hide();
  var form = $('#'+target).serializeArray().reduce(function(obj, item) {
    obj[item.name] = item.value;
    return obj;
  }, {});
  let id = $('#'+target+' #id').val();
  let data = {'id': id, 'fields': form};
  updateUserRecord(data, function(data){
    // console.log("success");
    fetch(user);
    $("#modal-overlay").hide();
  }, function(){
    // console.log("error");
    $("#modal-overlay").hide();
  })
}

// listners

$("#close").click(function(){
  $('#modal-overlay').toggle();
});

$("body").on("click", ".confirm", function(e){
  if (!users){
    users = JSON.parse(getCookie("catiaejose.com-users"));
  }
  let type = $(e.target).attr("usertype");
  let userid = $(e.target).attr("userid");
  // console.log(userid);
  var user;
  $.each(users, function(i, u) {
    if(u.id == userid) {
      // console.log(u);
      user = u;
    }
  });

  hideForms();

  $("#modal-overlay").show();
  $("#"+type).show();

  // data
  $(".modal-title").html(user.fields.name);
  let name = (user.fields.name) ? user.fields.name : "";
  $("#"+type+" #name").val(name);
  let email = (user.fields.email) ? user.fields.email : "";
  $("#"+type+" #email").val(email);
  let phone = (user.fields.phone) ? user.fields.phone : "";
  $("#"+type+" #phone").val(phone);
  let alergies = (user.fields.alergies) ? user.fields.alergies : "";
  $("#"+type+" #alergies").html(alergies);
  (user.fields.confirmed || user.fields.confirmed != "") ? $(".confirm_"+user.fields.confirmed).prop('checked', true): "" ;
  (user.fields.age || user.fields.age != "") ? $(".age_"+user.fields.age).prop('checked', true): "" ;
  $("#"+type+" #id").val(user.id);
});

$("body").on("click", ".btn-form", function(e){
  // console.log(e.target.name);
  formSubmit(e.target.name);
  return false;
});

$(".menu-items").click(function(e){
  $(".menu-items").removeClass("active");
  $(e.target).addClass("active");
  $('html, body').animate({
      scrollTop: $(e.target.id).offset().top
  }, 500);
  $(".sidebar").hide();
});

$(".mobile-menu").click(function(e){
  $(".sidebar").show();
});


// start

$("#modal-loading").hide();
$("#modal-overlay").hide();

// console.log(getCookie("catiaejose.com-user"));
let user = JSON.parse(getCookie("catiaejose.com-user"));
// console.log(user);

var users = start(user);
