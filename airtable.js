function getRecordByEmail(email, callback) {

  let formula = "SEARCH('"+email+"',email)";
  // console.log("https://api.airtable.com/v0/apptnwzBVBTiGDyNl/ids?filterByFormula="+formula);
  $.ajax({
    url: "https://api.airtable.com/v0/apptnwzBVBTiGDyNl/ids?filterByFormula="+formula,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer keybSe3wdoIEJsvGv");
    },
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    processData: false,
    success: function (data) {
      // console.log(JSON.stringify(data));
      callback(data);
    },
    error: function(){
      // console.log("Cannot get data");
      error();
    }
  });
}

function getUsersByGID(GID, callback, error) {

  let formula = "(GID="+GID+")";
  // console.log("https://api.airtable.com/v0/apptnwzBVBTiGDyNl/users?filterByFormula="+formula+"&"+
  // "sort%5B0%5D%5Bfield%5D=ID&sort%5B0%5D%5Bdirection%5D=desc");
  $.ajax({
    url: 'https://api.airtable.com/v0/apptnwzBVBTiGDyNl/users?filterByFormula='+formula+
    "&sort%5B0%5D%5Bfield%5D=ID&sort%5B0%5D%5Bdirection%5D=desc",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer keybSe3wdoIEJsvGv");
    },
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    processData: false,
    success: function (data) {
      // console.log(data);
      callback(data);
    },
    error: function(){
      // console.log("Cannot get data");
      error();
    }
  });
}

function updateUserRecord(record, callback, error) {
  // console.log("https://api.airtable.com/v0/apptnwzBVBTiGDyNl/users");
  let data = {'records': [record]};
  // console.log(data);
  $.ajax({
    url: "https://api.airtable.com/v0/apptnwzBVBTiGDyNl/users",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer keybSe3wdoIEJsvGv");
    },
    type: 'PATCH',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(data),
    processData: false,
    success: function (data) {
      // console.log(data);
      callback(data);
    },
    error: function(){
      // console.log("Cannot get data");
      error();
    }
  });
}
