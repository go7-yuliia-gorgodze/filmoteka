const FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

const openModalBtn = document.querySelector('.open-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modal = document.querySelector('.modal');
const main = document.querySelector('main');
const header = document.querySelector('header');
const html = document.documentElement;
let scrollPosition = window.pageYOffset;

function openModalWindow() {
    // show the modal
    modal.classList.add('modal--active');
    closeModalBtn.addEventListener('click', closeModalWindow);
    // Focus the first element within the modal. Make sure the element is visible and doesnt have focus disabled (tabindex=-1);
    modal.querySelector(FOCUSABLE_SELECTORS).focus();

    // Trap the tab focus by disable tabbing on all elements outside of your modal.  Because the modal is a sibling of main, this is easier. Make sure to check if the element is visible, or already has a tabindex so you can restore it when you untrap.    
    const focusableElements = main.querySelectorAll(FOCUSABLE_SELECTORS);
    focusableElements.forEach(el => el.setAttribute('tabindex', '-1'));

    scrollPosition = window.pageYOffset;
    html.style.top = -scrollPosition + "px";
    html.classList.add("modal__opened");
    
    // Trap the screen reader focus as well with aria roles. This is much easier as our main and modal elements are siblings, otherwise you'd have to set aria-hidden on every screen reader focusable element not in the modal.
    modal.removeAttribute('aria-hidden');
    main.setAttribute('aria-hidden', 'true');
    header.setAttribute('aria-hidden', 'true');
};

function closeModalWindow() {
    // hide the modal
    modal.classList.add("modal--moved");
    modal.addEventListener("transitionend", transitionClose);
    modal.classList.remove('modal--active');
    closeModalBtn.removeEventListener('click', closeModal);
};

function transitionClose() { 
    if (modal.classList.contains('modal--active')) { 
        return;
    };

    modal.classList.remove("modal--moved");
   // modal.removeEventListener("transitionend", transitionClose);
    const focusableElements = main.querySelectorAll(FOCUSABLE_SELECTORS);
    focusableElements.forEach(el => el.removeAttribute('tabindex'));

    html.classList.remove("modal__opened");
    window.scrollTo(0, scrollPosition);
    html.style.top = "";

    // Untrap screen reader focus
    modal.setAttribute('aria-hidden', 'true');
    main.removeAttribute('aria-hidden');
    header.removeAttribute('aria-hidden', 'true');

    // restore focus to the triggering element
    openModalBtn.focus();
       
};

openModalBtn.addEventListener('click', openModalWindow);
