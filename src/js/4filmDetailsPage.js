movieGallery.addEventListener('click', event => {
  let id = event.target.dataset.id;
  activateDetailsPage(id);
});

function activateDetailsPage(id) {
  homePage.classList.add('is-hidden');
  searchField.classList.remove('is-hidden');

  let selectedMovie = renderedMovies.find(movie => movie.id === Number(id));

  console.log(selectedMovie);

  openMovieDetails(selectedMovie);
}

function openMovieDetails(selectedMovie) {
  detailsPreviewImg.setAttribute(
    'src',
    `https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`,
  );
  detailsTitle.textContent = selectedMovie.title;
  detailsDescription.textContent = selectedMovie.overview;
  detailsPopularuty.innerHTML = selectedMovie.popularity;
  detailsOriginalTitle.innerHTML = selectedMovie.original_title;
}
