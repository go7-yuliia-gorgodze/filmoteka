const FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

const openModalBtn = document.querySelector('.open-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modal = document.querySelector('.modal');
const main = document.querySelector('main');
const header = document.querySelector('header');
const html = document.documentElement;
let scrollPosition = window.pageYOffset;

function focusCatcher() {
    const focusableElements = html.querySelectorAll(FOCUSABLE_SELECTORS);
    focusableElements.forEach(el => el.setAttribute('tabindex', '-1'));
};

function focusSet(element) {
    const focusableElements = element.querySelectorAll(FOCUSABLE_SELECTORS);
    focusableElements.forEach(el => el.removeAttribute('tabindex'));
};

function trapScreenReaderFocus() { 
    modal.removeAttribute('aria-hidden');
    main.setAttribute('aria-hidden', 'true');
    header.setAttribute('aria-hidden', 'true');
};

function untrapScreenReaderFocus() {
    modal.setAttribute('aria-hidden', 'true');
    main.removeAttribute('aria-hidden');
    header.removeAttribute('aria-hidden');
};
 
function scrollPositionOnOpen() { 
        scrollPosition = window.pageYOffset;
    html.style.top = -scrollPosition + "px";
}

function scrollPositionOnClose() { 
        html.classList.remove("modal__opened");
    window.scrollTo(0, scrollPosition);
    html.style.top = "";
};

function openModalWindow() {
    // show the modal
    modal.classList.add('modal--active');
    closeModalBtn.addEventListener('click', closeModalWindow);  
    // Trap the tab focus by disable tabbing on all elements outside of your modal.  Because the modal is a sibling of main, this is easier. Make sure to check if the element is visible, or already has a tabindex so you can restore it when you untrap.
    
        // Focus the first element within the modal. Make sure the element is visible and doesnt have focus disabled (tabindex=-1);
    focusCatcher();
    console.log(modal.querySelector(FOCUSABLE_SELECTORS));
    focusSet(modal);
    
    // const focusableElementsMain = main.querySelectorAll(FOCUSABLE_SELECTORS);
    // focusableElementsMain.forEach(el => el.setAttribute('tabindex', '-1'));
    // const focusableElementsHeader = header.querySelectorAll(FOCUSABLE_SELECTORS);
    // focusableElementsHeader.forEach(el => el.setAttribute('tabindex', '-1'));

    scrollPositionOnOpen();
    html.classList.add("modal__opened"); 
    // Trap the screen reader focus as well with aria roles. This is much easier as our main and modal elements are siblings, otherwise you'd have to set aria-hidden on every screen reader focusable element not in the modal.
    trapScreenReaderFocus();
};

function closeModalWindow() {
    // hide the modal
    modal.classList.add("modal--moved");
    modal.addEventListener("transitionend", transitionClose);
    modal.classList.remove('modal--active');
    closeModalBtn.removeEventListener('click', closeModal);
};

function transitionClose() { 
    modal.classList.remove("modal--moved");
    modal.removeEventListener("transitionend", transitionClose);
    focusSet(html);
    scrollPositionOnClose();
    // Untrap screen reader focus
    untrapScreenReaderFocus();
    // restore focus to the triggering element
    openModalBtn.focus();      
};

openModalBtn.addEventListener('click', openModalWindow);
