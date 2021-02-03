let selectedMovie;

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
}