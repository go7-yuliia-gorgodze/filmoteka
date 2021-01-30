const FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

const openModalBtn = document.querySelector('.open-modal');
const closeModalBtn = document.querySelector('.close-modal');
const modal = document.querySelector('.modal');
const main = document.querySelector('main');
const header = document.querySelector('header');
const html = document.documentElement;
const modalCollaboratorsList = document.querySelector('.modal-our_team_list');

let scrollPosition = window.pageYOffset;

console.dir(modalCollaboratorsList);

modalCollaboratorsList.addEventListener('click', e => { 
    if (!e.target.classList.contains('modal-card_btn_text')) { 
        return;
    }
    // console.log(e.target.classList.contains('modal-card_btn_text'));
    fetchFilmModal().then(({ results }) => {
        console.log(results[0].id);
        modal.style.zIndex = 1;
        openMovieDetails(results[0]);
    });
});



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
function bodyScrollControlShift() {
    
    let marginSize = window.innerWidth - html.clientWidth;
    if (marginSize) {
        html.style.marginRight = marginSize + "px";
        return;
    }
    html.style.marginRight = "";
};

function onOverleyClickClose(e) {
    const wrap = e.target.classList.contains('modal-wrap');
    if (!wrap) return;
    e.preventDefault();
    closeModalWindow();
}

function onEscapeClose(e) {
    if (e.which == 27&&modal.classList.contains('modal--active')) {
        e.preventDefault();
        closeModalWindow();
        return;
    }
};



function fetchFilmModal() {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&include_adult=false&query=alibi.com`,
  )
    .then(response => response.json())
    .then(data => {
      console.log("Fetched data",data);
      return data;
    });
};



function openModalWindow() {
    // show the modal  
    modal.classList.add('modal--active');


    closeModalBtn.addEventListener('click', closeModalWindow);
    document.addEventListener("click", onOverleyClickClose);
    window.addEventListener("keydown", onEscapeClose);
    openModalBtn.removeEventListener('click', openModalWindow);

    // Trap the tab focus by disable tabbing on all elements outside of your modal.  Because the modal is a sibling of main, this is easier. Make sure to check if the element is visible, or already has a tabindex so you can restore it when you untrap.
    
        // Focus the first element within the modal. Make sure the element is visible and doesnt have focus disabled (tabindex=-1);
    focusCatcher();
    // console.log(modal.querySelector(FOCUSABLE_SELECTORS));
    modal.querySelector(FOCUSABLE_SELECTORS).focus();
    focusSet(modal);

    bodyScrollControlShift();
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
    document.removeEventListener("click", onOverleyClickClose);
    window.removeEventListener("keydown", onEscapeClose);
    openModalBtn.addEventListener('click', openModalWindow);
    focusSet(html);
    bodyScrollControlShift();
    scrollPositionOnClose();
    // Untrap screen reader focus
    untrapScreenReaderFocus();
    // restore focus to the triggering element
    openModalBtn.focus();      
};

openModalBtn.addEventListener('click', openModalWindow);
