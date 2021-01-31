const watchedFilms = document.querySelector('.watched-list');
const watchedButton = document.querySelector('#watched');
const queueButton = document.querySelector('#queue');

function createLibraryCardFunc(imgPath, filmTitle, movieId, voteAverage) {
  const libraryCard = document.createElement('li');
  libraryCard.classList.add('library-film');
  libraryCard.setAttribute('data-id', movieId);

  const libraryCardImage = document.createElement('img');
  if (imgPath === null) {
    libraryCardImage.setAttribute('src', '../images/plug.jpg');
    libraryCardImage.setAttribute('alt', 'No image found!');
  } else {
    libraryCardImage.setAttribute(
      'src',
      `https://image.tmdb.org/t/p/w500${imgPath}`,
    );
    libraryCardImage.setAttribute('alt', filmTitle);
  }

  const movieTitle = document.createElement('p');
  movieTitle.classList.add('library-film-title');
  movieTitle.textContent = filmTitle;

  const filmRating = document.createElement('div');
  filmRating.classList.add('library-film-rating');
  filmRating.textContent = voteAverage;
  libraryCard.appendChild(libraryCardImage);
  libraryCard.appendChild(movieTitle);
  libraryCard.appendChild(filmRating);

  libraryCard.addEventListener('click', () => activateDetailsPage(movieId, true));
  
  return libraryCard;
}

watchedButton.addEventListener('click', drawWatchedFilmList);
queueButton.addEventListener('click', drawQueueFilmList);

function drawWatchedFilmList() {
  watchedButton.classList.add('button-active');
  queueButton.classList.remove('button-active');

  watchedFilms.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const moviesWatched = JSON.parse(localStorage.getItem('filmsWatched'));
  console.log(moviesWatched);

  if (moviesWatched.length !== 0 && moviesWatched !== null) {
    moviesWatched.forEach(el =>
      fragment.append(
        createLibraryCardFunc(
          el.poster_path,
          el.title,
          el.id,
          el.vote_average,
        ),
      ),
    );
    watchedFilms.setAttribute('data-name', 'watched');
    watchedFilms.append(fragment);
  }

  if (moviesWatched.length === 0 || moviesWatched === null) {
    const emptyStorage = document.createElement('p');
    emptyStorage.classList.add('empty-storage');
    emptyStorage.textContent =
      'You do not have watched movies. Try to add them.';

    watchedFilms.append(emptyStorage);
  }
  return;
}

function drawQueueFilmList() {
  queueButton.classList.add('button-active');
  watchedButton.classList.remove('button-active');

  watchedFilms.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const moviesQueue = JSON.parse(localStorage.getItem('filmsQueue'));
  console.log(moviesQueue);

  if (moviesQueue !== null && moviesQueue.length !== 0) {
    moviesQueue.forEach(el =>
      fragment.append(
        createLibraryCardFunc(
          el.poster_path,
          el.title,
          el.id,
          el.vote_average,
        ),
      ),
    );
    watchedFilms.setAttribute('data-name', 'queue');
    watchedFilms.append(fragment);
  }

  if (moviesQueue === null || moviesQueue.length === 0) {
    const emptyStorage = document.createElement('p');
    emptyStorage.classList.add('empty-storage');
    emptyStorage.textContent =
      'You do not have to queue movies to watch. Try to add them.';

    watchedFilms.append(emptyStorage);
  }
  return;
  
}
