const registrationButton = document.querySelector('.button_registration');
const registrationMail = document.querySelector('.registration .mail');
const registrationPass = document.querySelector('.registration .pass');
const logInMail = document.querySelector('.logIn .mail');
const logInPass = document.querySelector('.logIn .pass');

registrationButton.addEventListener('click', event => {
  event.preventDefault();
  firebase
    .auth()
    .createUserWithEmailAndPassword(
      registrationMail.value,
      registrationPass.value,
    )
    .then(userCredential => {
      // Signed in
      var user = userCredential.user;
      console.log('register complite, user:', user);
      // ...
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // ..
    });
});
