movieGallery.addEventListener('click', event => {
  let id = event.target.dataset.id;
  activateDetailsPage(id);
});

function activateDetailsPage(id) {
  homePage.classList.add('is-hidden');

  let selectedMovie = renderedMovies.find(movie => movie.id === Number(id));

  console.log(selectedMovie);

  openMovieDetails(selectedMovie);
}

function fetchGenres() {
  fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`,
  )
    .then(data => data.json())
    .then(response => {
      genres = [...response.genres];
    })
    .catch(error => console.log(error));
}

function openMovieDetails(selectedMovie) {
  detailsPreviewImg.setAttribute(
    'src',
    `https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`,
  );
  detailsTitle.textContent = selectedMovie.title;
  detailsDescription.textContent = selectedMovie.overview;
  detailsPopularuty.innerHTML = selectedMovie.popularity;
  detailsOriginalTitle.textContent = selectedMovie.original_title;
  detailsGenre.textContent = String(
    genres
      .filter(el =>
        selectFilm.genre_ids.find(item => el.id === item) ? true : false,
      )
      .reduce((acc, item) => acc + `${item.name}, `, ''),
  ).slice(0, -2);
}
