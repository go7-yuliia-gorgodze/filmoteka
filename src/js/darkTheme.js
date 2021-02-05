const body = document.querySelector('body');
const footerTheme = document.querySelector('footer');
const textFooter = document.querySelector('.footer-text-wrapper');
const copyrightFooter = document.querySelector('.footer-copyright');
const creatorsFooter = document.querySelector('.footer-creators');
const switchToggle = document.querySelector('#theme-switch-toggle');

let detailsWrapper;// const detailsWrapper = document.querySelector('.details-wrapper');
let detailsInfo;// const detailsInfo = document.querySelector('.details-information');
let detailsContainer;// const detailsContainer = document.querySelector('.details-container');
let detailsList;// const detailsList = document.querySelector('.details-inf-list');
let detailsListSecondary;// const detailsListSecondary = document.querySelector(
//   '.details-inf-list-secondary'

// );

let tabs;// const tabs = document.querySelector('.tabs');
let tabsContent;// const tabsContent = document.querySelector('.tabs-content');
let buttonToWatch;// const buttonToWatch = document.querySelector('.button-add-to-watch');
let buttonToQueue;// const buttonToQueue = document.querySelector('.button-add-to-queue');
const paginationButton = document.querySelector('.pagination__button');

const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};

switchToggle.addEventListener('click', themeChange);

getStorage();
function getStorage() {
  console.log("click");
  const themeCheck = localStorage.getItem('Theme:');
  if (themeCheck === null || themeCheck === 'light-theme') {
    setLocalStorage(Theme.LIGHT);
    lightTheme();
  } else if (themeCheck === 'dark-theme') {
    darkTheme();
  }
}

function darkTheme() {
  body.classList.add('darkTheme');
  footerTheme.classList.add('darkTheme');
  textFooter.classList.add('darkTheme');
  copyrightFooter.classList.add('darkTheme');

  paginationButton.classList.add('darkTheme');
  creatorsFooter.classList.add('darkTheme');
  if (detailsWrapper) {
    setElementsForThemeToggling();

    detailsWrapper.classList.add('darkTheme');
    detailsInfo.classList.add('darkTheme');
    detailsContainer.classList.add('darkTheme');
    detailsList.classList.add('darkTheme');
    detailsListSecondary.classList.add('darkTheme');
    tabs.classList.add('darkTheme');
    tabsContent.classList.add('darkTheme');
    buttonToWatch.classList.add('darkTheme');
    buttonToQueue.classList.add('darkTheme');
  }

  // detailsWrapper.classList.add('darkTheme');
  // detailsInfo.classList.add('darkTheme');
  // detailsContainer.classList.add('darkTheme');
  // detailsList.classList.add('darkTheme');
  // detailsListSecondary.classList.add('darkTheme');
  // tabs.classList.add('darkTheme');
  // tabsContent.classList.add('darkTheme');
  // buttonToWatch.classList.add('darkTheme');
  // buttonToQueue.classList.add('darkTheme');

  switchToggle.checked = true;
};

function lightTheme() {
  body.classList.remove('darkTheme');
  footerTheme.classList.remove('darkTheme');
  textFooter.classList.remove('darkTheme');
  copyrightFooter.classList.remove('darkTheme');

  creatorsFooter.classList.remove('darkTheme');
  if (detailsWrapper) {
    setElementsForThemeToggling();

    detailsWrapper.classList.remove('darkTheme');
    detailsInfo.classList.remove('darkTheme');
    detailsContainer.classList.remove('darkTheme');
    detailsList.classList.remove('darkTheme');
    detailsListSecondary.classList.remove('darkTheme');
    tabs.classList.remove('darkTheme');
    tabsContent.classList.remove('darkTheme');
    buttonToWatch.classList.remove('darkTheme');
    buttonToQueue.classList.remove('darkTheme');
  }

  // detailsWrapper.classList.remove('darkTheme');
  // detailsInfo.classList.remove('darkTheme');
  // detailsContainer.classList.remove('darkTheme');
  // detailsList.classList.remove('darkTheme');
  // detailsListSecondary.classList.remove('darkTheme');
  // tabs.classList.remove('darkTheme');
  // tabsContent.classList.remove('darkTheme');
  // buttonToWatch.classList.remove('darkTheme');
  // buttonToQueue.classList.remove('darkTheme');
  paginationButton.classList.remove('darkTheme');

  switchToggle.checked = false;
};

function themeChange() {
  if (switchToggle.checked) {
    darkTheme();
    setLocalStorage(Theme.DARK);
  } else {
    lightTheme();
    setLocalStorage(Theme.LIGHT);
  };
};

function setLocalStorage(info) {
  localStorage.setItem('Theme:', info);
};

function setElementsForThemeToggling() {

  detailsWrapper = document.querySelector('.details-wrapper');
  detailsInfo = document.querySelector('.details-information');
  detailsContainer = document.querySelector('.details-container');
  document.querySelector('.details-inf-list');
  detailsListSecondary = document.querySelector('.details-inf-list-secondary');
  tabs = document.querySelector('.tabs');
  tabsContent = document.querySelector('.tabs-content');
  buttonToWatch = document.querySelector('.button-add-to-watch');
  buttonToQueue = document.querySelector('.button-add-to-queue');
};