var username = document.querySelector("#username");
var password = document.querySelector("#password");

var regBtn = document.querySelector("#regBtn");
var login = document.querySelector("#LoginBtn");
var USERDETAILS = "";
login.addEventListener("click", function(e) {
  let adminUsers = JSON.parse(localStorage.getItem("admin"));
  let cusers = JSON.parse(localStorage.getItem("cuser"));

  let isAdmin = false;
  let isuser = false;

  for (let i = 0; i < adminUsers.length; i++) {
    if (username.value == adminUsers[i].usr) {
      if (password.value == adminUsers[i].pass) {
        isAdmin = true;
        USERDETAILS = username.value;
        break;
      }
    }
  }

  for (let i = 0; i < cusers.length; i++) {
    if (username.value == cusers[i].usr) {
      if (password.value == cusers[i].pass) {
        USERDETAILS = username.value;
        isuser = true;
        break;
      }
    }
  }

  if (isAdmin) {
    alert("Welcome Admin");
    // window.location.assign("./admin.html");
    window.location.href = `./admin.html`;
    sessionStorage.setItem("currentAdmin", JSON.stringify(USERDETAILS));
  } else if (isuser) {
    alert("Welcome User");
    // window.location.assign("./customer.html");
    window.location.href = `./customer.html`;
    sessionStorage.setItem("currentUser", JSON.stringify(USERDETAILS));
  } else {
    alert("Invalid User");
  }

  console.log(username.value);
  console.log(password.value);

  e.preventDefault();
});

regBtn.addEventListener("click", function(e) {
  alert("Registered..");

  adminUsers = [
    { usr: "siva", pass: "123" },
    { usr: "arjun", pass: "456" }
  ];
  users = [
    { usr: "abc", pass: "abc123" },
    { usr: "xyz", pass: "xyz123" }
  ];

  localStorage.setItem("admin", JSON.stringify(adminUsers));
  localStorage.setItem("cuser", JSON.stringify(users));

  console.log("item added to localStorage");
  e.preventDefault();
});

function register() {
  console.log("register..");
}
