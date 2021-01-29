function removePreloader() {
  document.querySelector('.loader').classList.add('is-hiden');
}

function addPreloader() {
  document.querySelector('.loader').classList.remove('is-hiden');
}

// preloader on start page
// window.onload = function () {
//   addPreloader();
//   window.setTimeout(function () {
//     addPreloader();
//     removePreloader();
//   }, 500);
// };
