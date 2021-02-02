const body = document.querySelector('body');
const footerTheme = document.querySelector('footer');
const textFooter = document.querySelector('.footer-text-wrapper');
const switchToggle = document.querySelector("#theme-switch-toggle");
const Theme = {
    LIGHT: 'light-theme',
    DARK: 'dark-theme',
  };
  
  switchToggle.addEventListener('click', themeChange);
  
  getStorage();
  function getStorage() {
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
       switchToggle.checked = true;
  }
  
  function lightTheme() {
    body.classList.remove('darkTheme');
    footerTheme.classList.remove('darkTheme');
   textFooter.classList.remove('darkTheme');
    
    switchToggle.checked = false;
  }
  
  function themeChange() {
    if (switchToggle.checked) {
      darkTheme();
      setLocalStorage(Theme.DARK);
    } else {
      lightTheme();
      setLocalStorage(Theme.LIGHT);
    }
  }
  
  function setLocalStorage(info) {
    localStorage.setItem('Theme:', info);
  }


 

