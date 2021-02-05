let selectedMovie, detailsModal, filmDetailsTimeout, detailsButtonClose;
let tabLinks = null;
let tabPanels = null;
let watchedButtonAdd = null;
let queueButtonAdd = null;

movieGallery.addEventListener('click', onFilmCardClickHandler);

function onFilmCardClickHandler(event) {
  if (event.target.nodeName === 'IMG') {
    let id = event.target.dataset.id;
    activateDetailsPage(id);
    toggleButtonWatcher(id);
  }
}

function activateDetailsPage(id, itsLibraryMovie) {
  selectedMovie = renderedMovies.find(movie => movie.id === Number(id));
  if (itsLibraryMovie) {
    let allLocalStorageMovies = [
      ...JSON.parse(localStorage.getItem('filmsQueue')),
      ...JSON.parse(localStorage.getItem('filmsWatched')),
    ];
    selectedMovie = allLocalStorageMovies.find(
      movie => movie.id === Number(id),
    );
  } else {
    selectedMovie = renderedMovies.find(movie => movie.id === Number(id));
  }
  openMovieDetails(selectedMovie);
}

fetchGenres();
console.log(genres);

function openMovieDetails(selectedMovie) {
  if (toTopBtn) {
    toTopBtn.classList.remove('show');
  }
  shadowShow();
  body.insertAdjacentHTML('beforeend', renderDetailFilmModal(selectedMovie));
  detailsModal = document.querySelector('#js-detailsPage');
  queueButtonAdd = document.querySelector('.button-add-to-queue');
  watchedButtonAdd = document.querySelector('.button-add-to-watch');
  tabPanels = document.querySelectorAll('.tabs-panel');
  tabLinks = document.querySelectorAll('.tabs a');

  filmDetailsTimeout = setTimeout(() => {
    detailsModal.classList.remove('hidden');
    detailsModal.classList.add('modal--active');
  }, 500);
  queueButtonAdd = document.querySelector('.button-add-to-queue');
  detailsButtonClose = document.querySelector('.close-details');

  getStorage();

  detailsButtonClose.addEventListener('click', closeModal);
  window.removeEventListener('mousemove', cursor);
  window.addEventListener('mousemove', cursorHandler.mousemove);
  detailsModal.addEventListener('mouseover', cursorHandler.onmouseover);
  detailsModal.addEventListener('mouseout', cursorHandler.onmouseout);
  window.addEventListener('keydown', onEscapeCloseDetails);
  document.addEventListener('click', onOverlayDetailsClose);

  let filmGeneres = genres
    .filter(el =>
      selectedMovie.genre_ids.find(movie => el.id === movie) ? true : false,
    )
    .reduce((acc, item) => acc + `${item.name}, `, '')
    .slice(0, -2);

  document.querySelector('#details-genre').textContent = filmGeneres;

  fetchMovies(selectedMovie.id).then(res => {
    document.getElementById('js-movieTrailer').innerHTML = `
        <iframe
            src="https://www.youtube.com/embed/${res}"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        ></iframe>
  `;
  });

  if (document.querySelector('.modal')) {
    focusCatcher(modal);
  } else {
    focusCatcher(html);
    bodyScrollControlShift();
    scrollPositionOnOpen();
    html.classList.add('modal__opened');
  }

  tabLinks.forEach(el => el.addEventListener('click', tabLinksCallback));

  runLocalStorage();
  focusSet(detailsModal);
  detailsModal.querySelector(FOCUSABLE_SELECTORS).focus();
  trapScreenReaderFocus(detailsModal);
}

function closeModal() {
  if (toTopBtn && !modal) {
    toTopBtn.classList.add('show');
  }
  document.querySelector('iframe').src = '';
  detailsModal.classList.add('hidden');
  detailsModal.classList.add('modal--moved');
  detailsModal.addEventListener('transitionend', transitionDetailsClose);
  detailsModal.classList.remove('modal--active');
  detailsButtonClose.removeEventListener('click', closeModal);
}

function transitionDetailsClose() {
  detailsModal.classList.remove('modal--moved');
  detailsModal.removeEventListener('transitionend', transitionDetailsClose);

  if (!modal) {
    window.removeEventListener('mousemove', cursorHandler.mousemove);
    detailsModal.removeEventListener('mouseover', cursorHandler.onmouseover);
    detailsModal.removeEventListener('mouseout', cursorHandler.onmouseout);
    cursorHandler.onclose();
    window.addEventListener('mousemove', cursor);
    focusSet(html);
    bodyScrollControlShift();
    scrollPositionOnClose();
    body.removeChild(shadow);
    shadow = null;
  }
  window.removeEventListener('keydown', onEscapeCloseDetails);
  document.removeEventListener('click', onOverlayDetailsClose);
  // Untrap screen reader focus
  untrapScreenReaderFocus(detailsModal);
  // restore focus to the triggering element
  clearTimeout(filmDetailsTimeout);
  filmDetailsTimeout = null;
  openModalBtn.focus();
  body.removeChild(detailsModal);
  detailsModal = null;
  tabLinks = null;
  tabPanels = null;
  watchedButtonAdd = null;
  queueButtonAdd = null;
  selectedMovie = null;
  detailsButtonClose = null;
}

function onEscapeCloseDetails(e) {
  if (e.which == 27 && detailsModal.classList.contains('details-container')) {
    e.preventDefault();
    closeModal();
    return;
  }
}

function onOverlayDetailsClose(e) {
  const wrap = e.target.classList.contains('details-container');
  if (!wrap) return;
  e.preventDefault();
  closeModal();
}

function tabLinksCallback(e) {
  e.preventDefault();

  document.querySelector('.tabs li.active').classList.remove('active');
  document.querySelector('.tabs-panel.active').classList.remove('active');

  const parentListItem = e.target.parentElement;
  parentListItem.classList.add('active');
  const index = [...parentListItem.parentElement.children].indexOf(
    parentListItem,
  );

  const panel = [...tabPanels].filter(
    el => el.getAttribute('data-index') == index,
  );
  panel[0].classList.add('active');
}

function toggleButtonWatcher(id) {
  let filmsWatchedFromLocalStorage = getArrayFromLocalStorage('filmsWatched');
  let filmsQueueFromLocalStorage = getArrayFromLocalStorage('filmsQueue');
  if (filmsWatchedFromLocalStorage !== null) {
    if (filmsWatchedFromLocalStorage.includes(id)) {
      watchedButtonAdd.classList.add('button-is-active');
      watchedButtonAdd.textContent = 'IN WATCHED';
    } else {
      watchedButtonAdd.classList.remove('button-is-active');
      watchedButtonAdd.textContent = 'ADD TO WATCHED';
    }
  }
  if (filmsQueueFromLocalStorage !== null) {
    if (filmsQueueFromLocalStorage.includes(id)) {
      queueButtonAdd.classList.add('button-is-active');
      queueButtonAdd.textContent = 'IN QUEUE';
    } else {
      queueButtonAdd.classList.remove('button-is-active');
      queueButtonAdd.textContent = 'ADD TO QUEUE';
    }
  }

  function getArrayFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(`${key}`));
  }
}

function runLocalStorage() {
  watchedButtonAdd.addEventListener('click', toggleToWatched);
  queueButtonAdd.addEventListener('click', toggleToQueue);

  function toggleToWatched() {
    let currentId = document.querySelector('.details-img').dataset.filmid;
    let filmsIdFromLocalStorage = getArrayFromLocalStorage('filmsWatched');
    if (filmsIdFromLocalStorage === null) {
      watchedButtonAdd.classList.add('button-is-active');
      watchedButtonAdd.textContent = 'IN WATCHED';
      localStorage.setItem('filmsWatched', JSON.stringify([currentId]));
    } else if (filmsIdFromLocalStorage.includes(currentId)) {
      watchedButtonAdd.classList.remove('button-is-active');
      watchedButtonAdd.textContent = 'ADD TO WATCHED';
      removeFilmIdFromArray('filmsWatched', currentId);
    } else {
      watchedButtonAdd.classList.add('button-is-active');
      watchedButtonAdd.textContent = 'IN WATCHED';
      addFilmIdArray('filmsWatched', currentId);
    }
  }

  function toggleToQueue() {
    let currentId = document.querySelector('.details-img').dataset.filmid;
    let filmsIdFromLocalStorage = getArrayFromLocalStorage('filmsQueue');
    if (filmsIdFromLocalStorage === null) {
      queueButtonAdd.classList.add('button-is-active');
      queueButtonAdd.textContent = 'IN QUEUE';
      localStorage.setItem('filmsQueue', JSON.stringify([currentId]));
    } else if (filmsIdFromLocalStorage.includes(currentId)) {
      queueButtonAdd.classList.remove('button-is-active');
      queueButtonAdd.textContent = 'ADD TO QUEUE';
      removeFilmIdFromArray('filmsQueue', currentId);
    } else {
      queueButtonAdd.classList.add('button-is-active');
      queueButtonAdd.textContent = 'IN QUEUE';

      addFilmIdArray('filmsQueue', currentId);
    }
  }

  function getArrayFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(`${key}`));
  }

  function setArrayToLocalStorage(key, arrayFilms) {
    localStorage.setItem(`${key}`, JSON.stringify(arrayFilms));
  }

  function addFilmIdArray(key, filmId) {
    let arrayFilms = getArrayFromLocalStorage(key);
    arrayFilms.push(filmId);
    setArrayToLocalStorage(key, arrayFilms);
  }

  function removeFilmIdFromArray(key, filmId) {
    let arrayFilms = getArrayFromLocalStorage(key);
    arrayFilms.splice(getArrayFromLocalStorage(key).indexOf(filmId), 1);
    setArrayToLocalStorage(key, arrayFilms);
  }
}
