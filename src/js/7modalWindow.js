const FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

const openModalBtn = document.querySelector('.open-modal');

const main = document.querySelector('main');
const header = document.querySelector('header');

const html = document.documentElement;
let modal, closeModalBtn, modalCollaboratorsList;




let scrollPosition = window.pageYOffset;



function fetchFilmModal(film) {
    return fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&include_adult=false&query=${film}`,
    )
        .then(response => response.json())
        .then(data => {
            console.log("Fetched data", data);
            return data;
        });
};

function modalCollaboratorFilm(e) {
    if (!e.target.classList.contains('modal-card_btn_text')) {
        return;
    }

    const film = e.target.textContent || 'alibi.com';
    fetchFilmModal(film).then(({ results }) => {
        modal.style.zIndex = 1;
        openMovieDetails(results[0]);
    })
        .catch(e => `ERROR ${e}`);
}

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
};

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
    };
    html.style.marginRight = "";
};

function onOverlayClickClose(e) {
    const wrap = e.target.classList.contains('modal-wrap');
    if (!wrap) return;
    e.preventDefault();
    closeModalWindow();
};

function onEscapeClose(e) {
    if (e.which == 27 && modal.classList.contains('modal--active')) {
        e.preventDefault();
        closeModalWindow();
        return;
    };
};



function markup(objectsArray, templateFunction) {
    let markup = objectsArray.reduce((acc, e) => {
        let item = templateFunction(e);
        acc += item;
        return acc;
    }, '');
    return markup;
};


const cursorHandler = {
    currentElem: null,
    mouseCursor: document.getElementById('cursor'),

    onmouseover: function (event) {
        let target = event.target.closest('button');
        if (!target) return;
        if (!modal.contains(target)) return;
        this.currentElem = target;
        mouseCursor.classList.add('cursor');
        mouseCursor.classList.remove('cursor-n');
        body.classList.add('cursor-none');;
    },

    onmouseout: function (event) {
        if (!this.currentElem) return;
        let relatedTarget = event.relatedTarget;
        while (relatedTarget) {
            if (relatedTarget == !this.currentElem) return;
            relatedTarget = relatedTarget.parentNode;
        };

        mouseCursor.classList.remove('cursor');
        mouseCursor.classList.add('cursor-n');
        body.classList.remove('cursor-none');
        this.currentElem = null;
    }
};


// function changeCursor() {
//     body.addEventListener('mouseover', cursorHandler.onmouseover);
//     body.addEventListener('mouseout', cursorHandler.onmouseout);
// };

function openModalWindow() {

    document.body.insertAdjacentHTML('beforeend', createModalWindow());
    modal = document.querySelector('.modal');
    closeModalBtn = document.querySelector('.close-modal');
    modalCollaboratorsList = document.querySelector('.modal-our_team_list');
    modalCollaboratorsList.insertAdjacentHTML("beforeend", markup(collaborators, renderCollaboratorCard));

    modal.classList.add('modal--active');
    // const cursor = new cursorHandler;

    // console.log(cursor);

    modal.addEventListener('mouseover', cursorHandler.onmouseover);
    modal.addEventListener('mouseout', cursorHandler.onmouseout);

    toTopBtn.classList.remove('show');

    closeModalBtn.addEventListener('click', closeModalWindow);
    document.addEventListener("click", onOverlayClickClose);
    window.addEventListener("keydown", onEscapeClose);
    openModalBtn.removeEventListener('click', openModalWindow);
    modalCollaboratorsList.addEventListener('click', modalCollaboratorFilm);
    // window.addEventListener('mousemove', cursor);

    body.addEventListener('mouseover', cursorHandler.onmouseover);
    body.addEventListener('mouseout', cursorHandler.onmouseout);
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
    modalCollaboratorsList.innerHTML = '';

    modal.removeEventListener("transitionend", transitionClose);
    document.removeEventListener("click", onOverlayClickClose);
    window.removeEventListener("keydown", onEscapeClose);
    modalCollaboratorsList.removeEventListener('click', modalCollaboratorFilm);

    openModalBtn.addEventListener('click', openModalWindow);
    focusSet(html);
    bodyScrollControlShift();
    scrollPositionOnClose();
    // Untrap screen reader focus
    untrapScreenReaderFocus();
    // restore focus to the triggering element
    openModalBtn.focus();
    modal.parentNode.removeChild(modal);
};

openModalBtn.addEventListener('click', openModalWindow);
