function showLogin(){
  var login = document.getElementById("login-container");
  var start = document.getElementById("start-container");

  if (login.style.display === "none") {
    login.style.display = "block";
    start.style.display = "none";
  } else {
    login.style.display = "none";
    start.style.display = "block";
  }
}
