const body = document.querySelector('body');
const footerTheme = document.querySelector('footer');
const textFooter = document.querySelector('.footer-text-wrapper');

     function themeChange () {
        const switchToggle = document.querySelector("#theme-switch-toggle");

      function themeToggle (e) {  
           
            textFooter.classList.toggle("textFooter-dark")
            footerTheme.classList.toggle("footer-dark")
            body.classList.toggle("dark-theme");
            localStorage.setItem('checkboxStatus', e.target.checked);
            localStorage.setItem('light', body.classList.contains("dark-theme"));
        }
        
     switchToggle.addEventListener('change', themeToggle)

     if (localStorage.getItem("checkboxStatus") === 'false' && localStorage.getItem("light") === 'false') {
       footerTheme.classList.remove("footer-dark");
       body.classList.remove("dark-theme");
       
         
    } else if (localStorage.getItem("checkboxStatus") && localStorage.getItem("light")) {
       switchToggle.checked = true
       textFooter.classList.add("textFooter-dark");
       body.classList.add("dark-theme");
               
        }
}
themeChange()
 

