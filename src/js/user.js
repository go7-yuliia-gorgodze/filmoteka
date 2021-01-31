const registrationButton = document.querySelector('.button_registration');
const logInButton = document.querySelector('.button_logIn');
const signOutButton = document.querySelector('.button_signOut');
const registrationMail = document.querySelector('.registration .mail');
const registrationPass = document.querySelector('.registration .pass');
const logInMail = document.querySelector('.logIn .mail');
const logInPass = document.querySelector('.logIn .pass');
const formModal = document.querySelector('.form-modal');
const formButtonClose = document.querySelector('.form-button-close');
const registrationForm = document.querySelector('.registration');
const logInForm = document.querySelector('.logIn');

let user = localStorage['userId'];

registrationButton.addEventListener('click', event => {
  event.preventDefault();
  openRegistrationModal();
  console.log(user);
  createUser(registrationMail.value, registrationPass.value);
  registrationMail.value = '';
  registrationPass.value = '';
});
logInButton.addEventListener('click', event => {
  event.preventDefault();
  openLogINModal();
  console.log(user);
  logInUser(logInMail.value, logInPass.value);
  logInMail.value = '';
  logInPass.value = '';
});
signOutButton.addEventListener('click', event => {
  event.preventDefault();
  console.log(user);
  signOut();
});

formButtonClose.addEventListener('click', closeFormModal);
formModal.addEventListener('click', closeFormModal);
document.addEventListener('keydown', closeFormModal);

function openRegistrationModal() {
  formModal.classList.remove('hidden');
  body.classList.add('blocked-scroll');
  registrationForm.classList.remove('hidden');
}
function openLogINModal() {
  formModal.classList.remove('hidden');
  body.classList.add('blocked-scroll');
  logInForm.classList.remove('hidden');
}
function closeFormModal(event) {
  if (
    event.target.classList.contains('form-modal') ||
    event.target.classList.contains('form-close') ||
    event.target.nodeName === 'use' ||
    event.key === 'Escape'
  ) {
    body.classList.remove('blocked-scroll');
    formModal.classList.add('hidden');
    registrationForm.classList.add('hidden');
    logInForm.classList.add('hidden');
  }
}
function createUser(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Signed in
      user = userCredential.user.uid;
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
      user = userCredential.user.uid;
      localStorage.setItem('userId', user);
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
  user = undefined;
}
const filmId = '2';
function writeUserWatchedFilm() {
  firebase
    .database()
    .ref('users/' + user.uid + '/watched/')
    .set([filmId]);
}

function writeUserQueueFilm() {
  firebase
    .database()
    .ref('users/' + userId + '/queue/')
    .set([filmId]);
}
function isLogIn() {
  user !== undefined;
}
