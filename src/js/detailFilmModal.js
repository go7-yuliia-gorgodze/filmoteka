let selectedMovie, detailsModal, filmDetailsTimeout, detailsButtonClose;

movieGallery.addEventListener('click', onFilmCardClickHandler);

function onFilmCardClickHandler(event) {
    if (event.target.nodeName === 'IMG') {
        let id = event.target.dataset.id;
        activateDetailsPage(id);
        // toggleButtonWatcher(id);
    }
};

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
    };

    console.log(selectedMovie);

    openMovieDetails(selectedMovie);
    // document
    //     .querySelector('.details-img')
    //     .setAttribute('data-filmId', selectedMovie.id);
};

function openMovieDetails(selectedMovie) {
    if (toTopBtn) { toTopBtn.classList.remove('show') };
    shadowShow();
    body.insertAdjacentHTML('beforeend', renderDetailFilmModal());

    detailsModal = document.querySelector('#js-detailsPage');

    filmDetailsTimeout = setTimeout(() => detailsModal.classList.add('modal--active'), 500);

    console.log(detailsModal);

    detailsButtonClose = document.querySelector('.button-close');

    detailsButtonClose.addEventListener('click', closeModal);

    console.log(FOCUSABLE_SELECTORS);

    detailsModal.querySelector(FOCUSABLE_SELECTORS).focus();

    focusSet(detailsModal);

    html.classList.add("modal__opened");

    if (document.querySelector('.modal')) {

        scrollPositionOnOpen();
        console.log(modal);
        focusCatcher(modal);
    } else { focusCatcher(html); }





};

function closeModal(event) {
    if (toTopBtn) { toTopBtn.classList.add('show'); }
    if (
        event.target.classList.contains('details-container') ||
        event.target.classList.contains('details-close') ||
        event.target.nodeName === 'use' ||
        event.key === 'Escape'
    ) {
        console.log("CLICK");
        // body.classList.remove('blocked-scroll');
        detailsModal.classList.add('hidden');
        // stop player youtube
        // document.querySelector('iframe').src = '';
    }
}