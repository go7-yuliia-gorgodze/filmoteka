const FOCUSABLE_SELECTORS =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

const openModalBtn = document.querySelector('.open-modal');

const main = document.querySelector('main');
const header = document.querySelector('header');

const html = document.documentElement;
let modal, closeModalBtn, modalCollaboratorsList;

const collaborators = [
  {
    src: '../images/jpg/Margot_Robbie.jpg',
    alt: 'Марго Робби',
    collaboratorName: 'Юля',
    filmName: 'alibi.com',
  },
  {
    src: '../images/jpg/Natalie_Portman.jpg',
    alt: 'Natalie Portman',
    collaboratorName: 'Валентина',
    filmName: 'Leon: The Professional',
  },
  {
    src: '../images/png/Charlie_Hunnam.png',
    alt: 'Чарли Ханнем',
    collaboratorName: 'MAXCOM',
    filmName: 'Побег из Претории',
  },
  {
    src: '../images/jpg/Til_Schweiger.jpg',
    alt: 'Til Schweiger',
    collaboratorName: 'Mikhail',
    filmName: 'Knockin` on Heaven`s Door',
  },
  {
    src: '../images/jpg/AbdulovA.jpg',
    alt: 'Олександр Абдулов',
    collaboratorName: 'Pankov Dmytro',
    filmName: 'Чародеи',
  },
  {
    src: '',
    alt: 'alt alt alt',
    collaboratorName: 'Оля',
    filmName: 'alibi.com',
  },
  {
    src: '',
    alt: 'alt alt alt',
    collaboratorName: 'Аня',
    filmName: 'alibi.com',
  },
  {
    src: '',
    alt: 'alt alt alt',
    collaboratorName: 'Антон',
    filmName: 'alibi.com',
  },
];

let scrollPosition = window.pageYOffset;

function createModalWindow() {
  return `
    <div class="modal" role="dialog" aria-labelledby="Modal_Title" aria-describedby="Modal_Description" aria-hidden="true" >
    <div class="modal-wrap">
        <div class="modal-content">
             <button class="button-close close-modal">
                <svg class="details-close">
                    <use href="../images/symbol-defs.svg#close"></use>
                </svg>
            </button>
            <h2 id="modal_Title">Our team</h2>
            <ul class="modal-our_team_list">
                
            </ul> 
        </div>
    </div>
  </div>
</div>
    `;
}

function fetchFilmModal(film) {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&include_adult=false&query=${film}`,
  )
    .then(response => response.json())
    .then(data => {
      console.log('Fetched data', data);
      return data;
    });
}

function modalCollaboratorFilm(e) {
  if (!e.target.classList.contains('modal-card_btn_text')) {
    return;
  }

  console.log(e.target.textContent);
  const film = e.target.textContent || 'alibi.com';
  fetchFilmModal(film).then(({ results }) => {
    console.log(results[0].id);
    modal.style.zIndex = 1;
    openMovieDetails(results[0]);
  });
}

function focusCatcher() {
  const focusableElements = html.querySelectorAll(FOCUSABLE_SELECTORS);
  focusableElements.forEach(el => el.setAttribute('tabindex', '-1'));
}

function focusSet(element) {
  const focusableElements = element.querySelectorAll(FOCUSABLE_SELECTORS);
  focusableElements.forEach(el => el.removeAttribute('tabindex'));
}

function trapScreenReaderFocus() {
  modal.removeAttribute('aria-hidden');
  main.setAttribute('aria-hidden', 'true');
  header.setAttribute('aria-hidden', 'true');
}

function untrapScreenReaderFocus() {
  modal.setAttribute('aria-hidden', 'true');
  main.removeAttribute('aria-hidden');
  header.removeAttribute('aria-hidden');
}

function scrollPositionOnOpen() {
  scrollPosition = window.pageYOffset;
  html.style.top = -scrollPosition + 'px';
}

function scrollPositionOnClose() {
  html.classList.remove('modal__opened');
  window.scrollTo(0, scrollPosition);
  html.style.top = '';
}

function bodyScrollControlShift() {
  let marginSize = window.innerWidth - html.clientWidth;
  if (marginSize) {
    html.style.marginRight = marginSize + 'px';
    return;
  }
  html.style.marginRight = '';
}

function onOverlayClickClose(e) {
  const wrap = e.target.classList.contains('modal-wrap');
  if (!wrap) return;
  e.preventDefault();
  closeModalWindow();
}

function onEscapeClose(e) {
  if (e.which == 27 && modal.classList.contains('modal--active')) {
    e.preventDefault();
    closeModalWindow();
    return;
  }
}

function renderCollaboratorCard(obj) {
  return `
    <li class="modal-our_team_item">
        <div class="modal-our_tem_card-wrapper">
            <div class="modal_window-thumb">
                <img class="modal_window-img" src="${obj.src}" alt="${obj.alt}">
            </div>
            <p class="modal-developer_name">${obj.collaboratorName}</p>
            <button class="modal-card_btn">
                <span class="modal-card_btn_text">
                    ${obj.filmName}
                </span>
            </button>
        </div>
    </li>
    `;
}

function markup(array) {
  let markup = array.reduce((acc, e) => {
    let item = renderCollaboratorCard(e);
    acc += item;
    return acc;
  }, '');
  return markup;
}

function openModalWindow() {
  document.body.insertAdjacentHTML('beforeend', createModalWindow());
  modal = document.querySelector('.modal');
  closeModalBtn = document.querySelector('.close-modal');
  modalCollaboratorsList = document.querySelector('.modal-our_team_list');
  modalCollaboratorsList.insertAdjacentHTML('beforeend', markup(collaborators));

  modal.classList.add('modal--active');

  closeModalBtn.addEventListener('click', closeModalWindow);
  document.addEventListener('click', onOverlayClickClose);
  window.addEventListener('keydown', onEscapeClose);
  openModalBtn.removeEventListener('click', openModalWindow);
  modalCollaboratorsList.addEventListener('click', modalCollaboratorFilm);

  focusCatcher();
  modal.querySelector(FOCUSABLE_SELECTORS).focus();
  focusSet(modal);

  bodyScrollControlShift();
  scrollPositionOnOpen();

  html.classList.add('modal__opened');
  // Trap the screen reader focus as well with aria roles. This is much easier as our main and modal elements are siblings, otherwise you'd have to set aria-hidden on every screen reader focusable element not in the modal.
  trapScreenReaderFocus();
}

function closeModalWindow() {
  // hide the modal
  modal.classList.add('modal--moved');
  modal.addEventListener('transitionend', transitionClose);
  modal.classList.remove('modal--active');
  closeModalBtn.removeEventListener('click', closeModal);
}

function transitionClose() {
  modal.classList.remove('modal--moved');
  modalCollaboratorsList.innerHTML = '';
  modal.removeEventListener('transitionend', transitionClose);
  document.removeEventListener('click', onOverlayClickClose);
  window.removeEventListener('keydown', onEscapeClose);
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
}

openModalBtn.addEventListener('click', openModalWindow);
