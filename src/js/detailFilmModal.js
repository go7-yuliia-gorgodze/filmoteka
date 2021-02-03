let selectedMovie;

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

    // openMovieDetails(selectedMovie);
    // document
    //     .querySelector('.details-img')
    //     .setAttribute('data-filmId', selectedMovie.id);

}