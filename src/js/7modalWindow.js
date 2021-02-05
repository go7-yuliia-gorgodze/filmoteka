const FOCUSABLE_SELECTORS =
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

const openModalBtn = document.querySelector('.open-modal');

// elements for block
const main = document.querySelector('main');
const header = document.querySelector('header');
const html = document.documentElement;

// variables

let modal, closeModalBtn, modalCollaboratorsList, shadow, timeout;
let scrollPosition = window.pageYOffset;

function scrollPositionOnOpen() {
    // console.log('SCROLL', window.pageYOffset);
    scrollPosition = window.pageYOffset;
    html.style.top = -scrollPosition + "px";
};

function scrollPositionOnClose() {

    html.classList.remove("modal__opened");
    window.scrollTo(0, scrollPosition);
    html.style.top = "";
};

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
    };

    const film = e.target.textContent || 'alibi.com';
    fetchFilmModal(film).then(({ results }) => {
        // modal.style.zIndex = 1;
        // shadow.style.zIndex = 0;
        openMovieDetails(results[0]);
    })
        .catch(e => `ERROR ${e}`);
};

function focusCatcher(element) {
    const focusableElements = element.querySelectorAll(FOCUSABLE_SELECTORS);
    focusableElements.forEach(el => el.setAttribute('tabindex', '-1'));
};

function focusSet(element) {
    const focusableElements = element.querySelectorAll(FOCUSABLE_SELECTORS);
    focusableElements.forEach(el => el.removeAttribute('tabindex'));
};

function trapScreenReaderFocus(element) {
    element.removeAttribute('aria-hidden');
    main.setAttribute('aria-hidden', 'true');
    header.setAttribute('aria-hidden', 'true');
};

function untrapScreenReaderFocus(element) {
    element.setAttribute('aria-hidden', 'true');
    main.removeAttribute('aria-hidden');
    header.removeAttribute('aria-hidden');
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
        let target = event.target.closest('button') || event.target.closest('a');
        if (!target) return;
        if (!body.contains(target)) return;
        this.currentElem = target;
        mouseCursor.classList.add('cursor');
        mouseCursor.classList.remove('cursor-n');
        body.classList.add('cursor-none');
    },

    onmouseout: function (event) {
        if (!this.currentElem) return;
        let relatedTarget = event.relatedTarget;
        while (relatedTarget) {
            if (relatedTarget == !this.currentElem) return;
            relatedTarget = relatedTarget.parentNode;
        };

        cursorHandler.onclose();
        // mouseCursor.classList.remove('cursor');
        // mouseCursor.classList.add('cursor-n');
        // body.classList.remove('cursor-none');
        this.currentElem = null;
    },

    onclose: function () {
        mouseCursor.classList.remove('cursor');
        mouseCursor.classList.add('cursor-n');
        body.classList.remove('cursor-none');
    },

    mousemove: function (event) {
        mouseCursor.style.top = event.pageY + scrollPosition + 'px';
        mouseCursor.style.left = event.pageX + 'px';
    }
};

function shadowShow() {
    if (shadow) { return };

    shadow = document.createElement('div');
    shadow.classList.add('modal__shadow');
    document.body.appendChild(shadow);
};

function openModalWindow() {

    document.body.insertAdjacentHTML('beforeend', createModalWindow());
    modal = document.querySelector('.modal');
    closeModalBtn = document.querySelector('.close-modal');
    modalCollaboratorsList = document.querySelector('.modal-our_team_list');
    modalCollaboratorsList.insertAdjacentHTML("beforeend", markup(collaborators, renderCollaboratorCard));
    timeout = setTimeout(() => {
        modal.classList.add('modal--active');
    }, 500);

    shadowShow();

    window.removeEventListener('mousemove', cursor);
    window.addEventListener('mousemove', cursorHandler.mousemove);
    modal.addEventListener('mouseover', cursorHandler.onmouseover);
    modal.addEventListener('mouseout', cursorHandler.onmouseout);
    cursorHandler.onclose();

    if (toTopBtn) { toTopBtn.classList.remove('show'); }

    focusCatcher(html);

    // creatorsFooter = document.querySelector('.footer-creators');
    // console.log(creatorsFooter);
    // getStorage();

    closeModalBtn.addEventListener('click', closeModalWindow);
    document.addEventListener("click", onOverlayClickClose);
    window.addEventListener("keydown", onEscapeClose);
    openModalBtn.removeEventListener('click', openModalWindow);
    modalCollaboratorsList.addEventListener('click', modalCollaboratorFilm);
    modal.querySelector(FOCUSABLE_SELECTORS).focus();
    focusSet(modal);

    bodyScrollControlShift();
    scrollPositionOnOpen();

    html.classList.add("modal__opened");
    // Trap the screen reader focus as well with aria roles. This is much easier as our main and modal elements are siblings, otherwise you'd have to set aria-hidden on every screen reader focusable element not in the modal.
    trapScreenReaderFocus(modal);
};

function closeModalWindow() {
    // hide the modal
    modal.classList.add("modal--moved");
    modal.addEventListener("transitionend", transitionClose);
    modal.classList.remove('modal--active');
    closeModalBtn.removeEventListener('click', closeModalWindow);
};

function transitionClose() {
    modal.classList.remove("modal--moved");
    modalCollaboratorsList.innerHTML = '';

    modal.removeEventListener("transitionend", transitionClose);
    document.removeEventListener("click", onOverlayClickClose);
    window.removeEventListener("keydown", onEscapeClose);
    modalCollaboratorsList.removeEventListener('click', modalCollaboratorFilm);


    window.removeEventListener('mousemove', cursorHandler.mousemove);
    modal.removeEventListener('mouseover', cursorHandler.onmouseover);
    modal.removeEventListener('mouseout', cursorHandler.onmouseout);
    cursorHandler.onclose();
    window.addEventListener('mousemove', cursor);


    openModalBtn.addEventListener('click', openModalWindow);
    focusSet(html);
    bodyScrollControlShift();
    scrollPositionOnClose();
    // Untrap screen reader focus
    untrapScreenReaderFocus(modal);
    // restore focus to the triggering element
    openModalBtn.focus();
    body.removeChild(modal);
    body.removeChild(shadow);
    clearTimeout(timeout);
    shadow = null;
    modal = null;
    timeout = null;
};

openModalBtn.addEventListener('click', openModalWindow);

// const props = {
//     data: null,
//     modalWindowTemplate: null,
//     defaultTemplates: null,
// };

// const collaborators = [{
//     src: '../images/jpg/Margot_Robbie_cr.jpg',
//     alt: 'Марго Робби',
//     collaboratorName: 'Юля',
//     filmName: 'alibi.com'
// },
// {
//     src: '../images/jpg/Natalie_Portman_cr.jpg',
//     alt: 'Natalie Portman',
//     collaboratorName: 'Валентина',
//     filmName: 'Leon: The Professional'
// },
// {
//     src: '../images/png/Charlie_Hunnam.png',
//     alt: 'Чарли Ханнем',
//     collaboratorName: 'MAXCOM',
//     filmName: 'Побег из Претории'
// },
// {
//     src: '../images/jpg/Til_Schweiger_cr.jpg',
//     alt: 'Til Schweiger',
//     collaboratorName: 'Mikhail',
//     filmName: 'Knockin` on Heaven`s Door'
// }, {
//     src: '../images/jpg/AbdulovA.jpg',
//     alt: 'Олександр Абдулов',
//     collaboratorName: 'Pankov Dmytro',
//     filmName: 'Чародеи'
// },
// {
//     src: '../images/jpg/Johnny_Depp.jpg',
//     alt: 'alt alt alt',
//     collaboratorName: 'Dimas',
//     filmName: 'Fear and Loathing in Las Vegas'
// },
// {
//     src: '../images/jpg/Adam_Sandler.jpg',
//     alt: 'Adam Sandler',
//     collaboratorName: 'Victor',
//     filmName: 'Большой папа'
// },
// {
//     src: '../images/jpg/Tim_Robbins.jpg',
//     alt: 'Tim Robbins',
//     collaboratorName: 'Осипов Сергей',
//     filmName: 'Побег из Шоушенка'
//     // filmName: 'ghjdgjg'
// }
// ];


// const collaboratorsModalProps = {
//     data: collaborators,
//     modalWindowTemplate: createModalWindow,
//     defaultTemplates: renderCollaboratorCard,
//     blockingElements: [main, header],
//     hideElements: [[toTopBtn, 'show']],
//     elementToSelect: '.modal-our_team_list',
//     openModalBtn: document.querySelector('.open-modal')
// };

// class ModalWindow {
//     constructor(props) {
//         this.modal = false;
//         this.openModalBtn = false;
//         this.closeModalBtn = false;
//         this.shadow = false;
//         this.timeout = false;
//         this.modalSelectedElement = null;
//         this.scrollPosition = window.pageYOffset;
//         this.FOCUSABLE_SELECTORS = [
//             'a[href]',
//             'area[href]',
//             'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
//             'select:not([disabled]):not([aria-hidden])',
//             'textarea:not([disabled]):not([aria-hidden])',
//             'button:not([disabled]):not([aria-hidden])',
//             'iframe',
//             'object',
//             'embed',
//             '[contenteditable]',
//             '[tabindex]:not([tabindex^="-"])'
//         ];
//         this.currentElem = null;
//         this.mouseCursor = document.getElementById('cursor');
//         this.body = document.body;
//         this.html = document.documentElement;
//         this.props = props;
//     };

//     scrollPositionOnOpen() {

//         this.scrollPosition = window.pageYOffset;
//         this.html.style.top = -this.scrollPosition + "px";
//     };

//     scrollPositionOnClose() {

//         this.html.classList.remove("modal__opened");
//         window.scrollTo(0, this.scrollPosition);
//         this.html.style.top = "";
//     };

//     fetchFilmModal(film) {
//         return fetch(
//             `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&include_adult=false&query=${film}`,
//         )
//             .then(response => response.json())
//             .then(data => {
//                 console.log("Fetched data", data);
//                 return data;
//             });
//     };

//     modalSelectFilm(e) {

//         if (!e.target.classList.contains('modal-card_btn_text')) {
//             return;
//         };

//         const film = e.target.textContent || 'alibi.com';
//         this.fetchFilmModal(film).then(({ results }) => {
//             modal.style.zIndex = 1;
//             shadow.style.zIndex = 0;
//             openMovieDetails(results[0]);
//         })
//             .catch(e => `ERROR ${e}`);
//     };

//     focusCatcher() {
//         const focusableElements = this.html.querySelectorAll(this.FOCUSABLE_SELECTORS);
//         focusableElements.forEach(el => el.setAttribute('tabindex', '-1'));
//     };

//     focusSet(elements) {
//         const focusableElements = elements.querySelectorAll(this.FOCUSABLE_SELECTORS);
//         focusableElements.forEach(el => el.removeAttribute('tabindex'));
//     };

//     trapScreenReaderFocus() {
//         this.modal.removeAttribute('aria-hidden');
//         console.log(this.props.blockingElements);
//         this.props.blockingElements.forEach(el => el.setAttribute('aria-hidden', 'true'));
//     };

//     untrapScreenReaderFocus() {
//         this.modal.setAttribute('aria-hidden', 'true');
//         this.props.blockingElements.forEach(el => el.removeAttribute('aria-hidden'));
//     };

//     bodyScrollControlShift() {
//         let marginSize = window.innerWidth - this.html.clientWidth;
//         if (marginSize && this.modal) {
//             this.html.style.marginRight = marginSize + "px";
//             console.log("in ", this.html.style.marginRight);
//             return;
//         };

//         this.html.style.marginRight = "0px";
//         console.log("after ", this.html.style.marginRight);
//     };

//     onOverlayClickClose(e) {
//         const wrap = e.target.classList.contains('modal-wrap');
//         if (!wrap) return;
//         e.preventDefault();
//         this.closeModalWindow().bind(this);
//     };

//     onEscapeClose(e) {
//         if (e.which == 27 && modal.classList.contains('modal--active')) {
//             e.preventDefault();
//             closeModalWindow().bind(this);
//             return;
//         };
//     };

//     markup(objectsArray, templateFunction) {
//         let markup = objectsArray.reduce((acc, e) => {
//             let item = templateFunction(e);
//             acc += item;
//             return acc;
//         }, '');
//         return markup;
//     };

//     onmouseover(event) {
//         let target = event.target.closest('button');
//         if (!target) return;
//         if (!this.modal.contains(target)) return;
//         this.currentElem = target;
//         this.mouseCursor.classList.add('cursor');
//         this.mouseCursor.classList.remove('cursor-n');
//         this.body.classList.add('cursor-none');;
//     };

//     onmouseout(event) {
//         if (!this.currentElem) return;
//         let relatedTarget = event.relatedTarget;
//         while (relatedTarget) {
//             if (relatedTarget == !this.currentElem) return;
//             relatedTarget = relatedTarget.parentNode;
//         };

//         this.mouseCursor.classList.remove('cursor');
//         this.mouseCursor.classList.add('cursor-n');
//         this.body.classList.remove('cursor-none');
//         this.currentElem = null;
//     };

//     shadowShow() {

//         this.shadow = document.createElement('div');
//         this.shadow.classList.add('modal__shadow');
//         document.body.appendChild(this.shadow);
//     };

//     hideElements(arr) {
//         console.log(arr);
//         arr.forEach(el => {
//             if (el[0]) {
//                 el[0].classList.remove(el[1]);
//             }
//         });
//     };

//     openModalWindow() {
//         this.openModalBtn = this.props.openModalBtn;
//         const modal = this.props.modalWindowTemplate();
//         document.body.insertAdjacentHTML('beforeend', modal);
//         this.modal = document.querySelector('.modal');
//         this.closeModalBtn = document.querySelector('.close-modal');

//         this.modalSelectedElement = document.querySelector(this.props.elementToSelect);
//         this.modalSelectedElement.insertAdjacentHTML("beforeend", this.markup(this.props.data, this.props.defaultTemplates));


//         this.shadowShow();

//         this.modal.addEventListener('mouseover', this.onmouseover.bind(this));
//         this.modal.addEventListener('mouseout', this.onmouseout.bind(this));


//         this.hideElements(this.props.hideElements);
//         this.closeModalBtn.addEventListener('click', this.closeModalWindow.bind(this));
//         document.addEventListener("click", this.onOverlayClickClose.bind(this));
//         window.addEventListener("keydown", this.onEscapeClose.bind(this));
//         this.openModalBtn.removeEventListener('click', this.openModalWindow.bind(this));

//         this.modalSelectedElement.addEventListener('click', this.modalSelectFilm.bind(this));
//         this.timeout = setTimeout(() => {
//             this.modal.classList.add('modal--active');
//         }, 500);
//         // this.modal.querySelector(this.FOCUSABLE_SELECTORS).focus();
//         this.focusSet(this.modal);
//         this.bodyScrollControlShift();
//         this.scrollPositionOnOpen();
//         this.html.classList.add("modal__opened");
//         this.trapScreenReaderFocus();
//     };

//     closeModalWindow() {
//         // hide the modal
//         this.modal.classList.add("modal--moved");
//         this.modal.addEventListener("transitionend", this.transitionClose.bind(this));
//         this.modal.classList.remove('modal--active');
//         this.closeModalBtn.removeEventListener('click', this.closeModalWindow.bind(this));
//     };

//     transitionClose() {
//         this.modal.classList.remove("modal--moved");
//         console.log(this.modalSelectedElement);
//         this.modalSelectedElement.innerHTML = '';

//         this.modal.removeEventListener("transitionend", this.transitionClose.bind(this));
//         document.removeEventListener("click", this.onOverlayClickClose.bind(this));
//         window.removeEventListener("keydown", this.onEscapeClose.bind(this));
//         this.modalSelectedElement.removeEventListener('click', this.modalSelectFilm.bind(this));

//         this.modal.removeEventListener('mouseover', this.onmouseover.bind(this));
//         this.modal.removeEventListener('mouseout', this.onmouseout.bind(this));

//         this.openModalBtn.addEventListener('click', this.openModalWindow.bind(this));
//         this.focusSet(this.html);
//         this.html.style.marginRight = 0 + "px";
//         this.scrollPositionOnClose();
//         // Untrap screen reader focus
//         this.untrapScreenReaderFocus();
//         // restore focus to the triggering element
//         this.openModalBtn.focus();
//         this.modal.parentNode.removeChild(this.modal);
//         this.shadow.parentNode.removeChild(this.shadow);
//         this.modal = false;
//         this.shadow = false;
//     };
// };


// const collaboratorsModalWindow = new ModalWindow(collaboratorsModalProps);

// openModalBtn.addEventListener('click', collaboratorsModalWindow.openModalWindow.bind(collaboratorsModalWindow));