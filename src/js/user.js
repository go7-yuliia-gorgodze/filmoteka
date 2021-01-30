const registrationButton = document.querySelector('.button_registration');
const logInButton = document.querySelector('.button_logIn');
const signOutButton = document.querySelector('.button_signOut');
const registrationMail = document.querySelector('.registration .mail');
const registrationPass = document.querySelector('.registration .pass');
const logInMail = document.querySelector('.logIn .mail');
const logInPass = document.querySelector('.logIn .pass');

registrationButton.addEventListener('click', event => {
  event.preventDefault();
  createUser(registrationMail.value, registrationPass.value);
  registrationMail.value = '';
  registrationPass.value = '';
});
logInButton.addEventListener('click', event => {
  event.preventDefault();
  logInUser(logInMail.value, logInPass.value);
  logInMail.value = '';
  logInPass.value = '';
});

signOutButton.addEventListener('click', event => {
  event.preventDefault();
  signOut();
});

function createUser(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Signed in
      var user = userCredential.user;
      console.log('register complite, user:', user);
      // ...
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('register error:', errorCode, errorMessage);
      // ..
    });
}

function logInUser(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Signed in
      var user = userCredential.user;
      console.log('logIn user:', user);
      // ...
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('login error:', errorCode, errorMessage);
    });
}
function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log('Sign-out successful');
    })
    .catch(error => {
      console.log('signOut error:', error);
      // An error happened.
    });
}
