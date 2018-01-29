$(document).ready(function() {

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBdjhuTi-2Do8ad2_Yhb5AkkDBqLRjCqIo",
  authDomain: "flash-card-generator.firebaseapp.com",
  databaseURL: "https://flash-card-generator.firebaseio.com",
  projectId: "flash-card-generator",
  storageBucket: "",
  messagingSenderId: "762972856862"
};
firebase.initializeApp(config);


// Controls moving user on to next page once logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);
    window.location.href="landing.html";
  } else {
    console.log("No user found");
  }
});

// Submit button for signing in through firebase
$("#signInSubmit").click(function (event) {
  event.preventDefault();
  var email = $("#loginEmail").val();
  var password = $("#loginPassword").val();
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error.code + " " + error.message);
    alert('Invalid Credentials');
  });
});


// Allows users to sign up through firebase
$("#form_login_signup").click(function () {
  let signUpHtml = '<h1>Sign up</h1><div class="form-group"><label for="signUpEmail">Email address</label><input type="email" class="form-control" id="signUpEmail" aria-describedby="emailHelp" placeholder="Enter email"></div><div class="form-group"><label for="signUpPassword">Password</label><input type="password" class="form-control" id="signUpPassword" placeholder="Password"></div><div class="form-group"><label for="signUpPassword2">Verify Password</label><input type="password" class="form-control" id="signUpPassword2" placeholder="Enter Pasword Again"></div><div class="form-check"><label class="form-check-label"><input type="checkbox" class="form-check-input">I am not a Robot.</label></div><a href="../landing.html"><div type="submit" class="btn btn-primary" id="signUpSubmit">Sign Up</div></a>';
  
  $(".topText").addClass("hide");
  $("#form_login").empty();
  $("#indexDisplayArea").empty().append(signUpHtml);
  $("#signUpSubmit").click(function (event) {
    event.preventDefault();
    let email = $("#signUpEmail").val();
    let password = $("#signUpPassword").val();
    let signPassTwo = $("#signUpPassword2").val();
    if (password === signPassTwo) {
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
      console.log(error);
      });
    } else {
      alert("Your passwords did not match");
    }
  });
});

});