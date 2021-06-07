// common

let alergies_placeholder = "Exemplos: vegetariano, vegan, glúten, lactose, leite, ovo, marisco, peixe, amendoim e frutos secos, soja...";
$(".alergies").attr("placeholder", alergies_placeholder);
message = "Temos todo o prazer em convidar-te para celebrares connosco este dia tão especial. Abaixo podes encontrar uma área dedicada à confirmação da tua presença, e também à da tua família, a quem estendemos o convite com todo o gosto!";
message_solo = "Temos todo o prazer em convidar-te para celebrares connosco este dia tão especial. Abaixo podes encontrar uma área dedicada à confirmação da tua presença.";

// functions

function fetch(user) {
  let gid = user.fields.GID;
  getUsersByGID(gid, function(data){
    // success
    users = data['records'];
    setCookie("catiaejose.com-users", JSON.stringify(data['records']), 10);
    getCookie("catiaejose.com-users");

    $("#modal-loading").hide();
    populateInfo(user, users);
  }, function(){
    //error
    setCookie("catiaejose.com-user", "", 0);
    window.location.href = "./index.html";
  });
}

function start(user) {
  if(!getCookie("catiaejose.com-user")){
    window.location.href = "./index.html";
  }
  else {
    // var users = [];

    if (getCookie("catiaejose.com-users")) {
      // console.log("cache");
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
  plusone = false;
  $.each(users.reverse(), function(index, user){
    var name = (!user.fields.name || user.fields.name == "") ? ((user.fields.type == 'plusone') ? "Plus One" : "Filho/a") : user.fields.name ;
    var confirmed = (user.fields.confirmed) ? (user.fields.confirmed == "Sim" ? "<span class='confirmado'>Confirmado</span>" : "<span class='confirmado_nao'>Não posso ir</span>") : '<span>&nbsp;</span>';
    var confirm_btn = (user.fields.confirmed) ? "Alterar confirmação" : 'Confirmar presença';
    var confirm_btn_class = (user.fields.confirmed) ? "btn" : "btn-gold";
    $("#cards-row").append('<div class="card">'+
      '<h6>'+name+'</h6>'+
      confirmed+
      '<button type="button" name="button" usertype="'+user.fields.type+'" userid="'+user.id+'" class="'+confirm_btn_class+' confirm">'+confirm_btn+'</button>'+
    '</div>');
    if (user.fields.type == 'plusone') plusone = true;
  });
  (!plusone && users.length > 1) ? $("#message").text(message) : $("#message").text(message_solo);
}

function hideForms() {
  $('#adulto').hide();
  $('#plusone').hide();
  $('#kid-known').hide();
  $('#kid-unknown').hide();
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
  let name = (user.fields.name) ? user.fields.name : "";
  $(".modal-title").html(name);
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
  if($(this).closest('form')[0].checkValidity()){
    e.preventDefault();
    formSubmit(e.target.name);
  }
});

$(".menu-items").click(function(e){
  $(".menu-items").removeClass("active");
  $(e.target).addClass("active");
  $('html, body').animate({
      scrollTop: $(e.target.id).offset().top
  }, 500);
  // console.log($(".sidebar").css("position"));
  if($(".sidebar").css("position") == "absolute"){
    $(".sidebar").hide();
  }
});


$(".mobile-menu").click(function(e){
  $(".sidebar").show();
});

click = false;

$("#modal-card").click(function(e){
  // console.log("click - card");
  click = true;
  setTimeout(function(){ click = false; }, 500);
})

$("#modal-overlay").click(function(e){
  // console.log("click - modal");
  if (!click) {
    $("#modal-overlay").hide();
  }
})

setInterval(function(){
  if($(".sidebar").css("position") == "static"){
    $(".sidebar").show();
  }
}, 500);

// start

$("#modal-loading").hide();
$("#modal-overlay").hide();

let user = JSON.parse(getCookie("catiaejose.com-user"));
var users = start(user);

getActiveFAQs(function(data){
  // console.log(data);
  $.each(data.records.reverse(), function(key, record){
    // console.log(record.fields.pergunta);
    let faq = '<div class="faq-card">'+
      '<h6>'+record.fields.pergunta+'</h6>'+
      '<p>'+record.fields.resposta+'</p>'+
    '</div>';
    $(faq).insertBefore('#ghost');
  });
});
