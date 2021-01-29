const watchedFilms = document.querySelector('.watched-list');
const watchedButton = document.querySelector('#watched');
const queueButton = document.querySelector('#queue');

const createLibraryCardFunc = function (
  imgPath,
  filmTitle,
  movieId,
  voteAverage,
) {
  const libraryCard = document.createElement('li');
  libraryCard.classList.add('library-film');
  libraryCard.setAttribute('data-id', movieId);

  const libraryCardImage = document.createElement('img');
  libraryCardImage.setAttribute(
    'src',
    'https://image.tmdb.org/t/p/' + 'w500' + imgPath,
  );
  libraryCardImage.setAttribute('alt', filmTitle);

  const movieTitle = document.createElement('p');
  movieTitle.classList.add('library-film-title');
  movieTitle.textContent = filmTitle;

  const filmRating = document.createElement('div');
  filmRating.classList.add('library-film-rating');
  filmRating.textContent = voteAverage;
  libraryCard.appendChild(libraryCardImage);
  libraryCard.appendChild(movieTitle);
  libraryCard.appendChild(filmRating);
  return libraryCard;
};

// queueButton.addEventListener('click', drawQueueFilmList);
// watchedButton.addEventListener('click', drawWatchedFilmList);

const drawQueueFilmList = function () {
  queueButton.classList.add('button-active');
  watchedButton.classList.remove('button-active');

  const fragment = document.createDocumentFragment();
  const moviesQueue = JSON.parse(localStorage.getItem('filmsQueue'));

  if (moviesQueue.length > 0) {
    moviesQueue.forEach(el =>
      fragment.append(
        createLibraryCardFunc(
          el.backdrop_path,
          el.title,
          el.id,
          el.vote_average,
        ),
      ),
    );
    watchedFilms.setAttribute('data-name', 'queue');
    watchedFilms.innerHTML = '';
    watchedFilms.append(fragment);
    //   watchedFilms.addEventListener('click', activeDetailsPage);
  }

  if (localStorage.getItem('filmsQueue') === null || moviesQueue.length === 0) {
    const fragment = document.createDocumentFragment();
    const emptyStorage = document.createElement('p');
    emptyStorage.classList.add('empty-storage');
    emptyStorage.textContent =
      'OOPS! Seems that you do not have to queue movies to watch. Try to add them.';
    fragment.append(emptyStorage);
    films.innerHTML = '';
    films.append(fragment);
    return;
  }
};

const drawWatchedFilmList = function () {
  watchedButton.classList.add('button-active');
  queueButton.classList.remove('button-active');

  const fragment = document.createDocumentFragment();
  const moviesWatched = JSON.parse(localStorage.getItem('filmsWatched'));

  if (moviesWatched.length > 0) {
    moviesWatched.forEach(el =>
      fragment.append(
        createLibraryCardFunc(
          el.backdrop_path,
          el.title,
          el.id,
          el.vote_average,
        ),
      ),
    );
    watchedFilms.setAttribute('data-name', 'watched');
    watchedFilms.innerHTML = '';
    watchedFilms.append(fragment);
    //   watchedFilms.addEventListener('click', activeDetailsPage);
  }

  if (
    localStorage.getItem('filmsWatched') === null ||
    moviesWatched.length === 0
  ) {
    const fragment = document.createDocumentFragment();
    const emptyStorage = document.createElement('p');
    emptyStorage.classList.add('empty-storage');
    emptyStorage.textContent =
      'OOPS! You do not have watched movies. Try to add them.';
    fragment.append(emptyStorage);
    watchedFilms.innerHTML = '';
    watchedFilms.append(fragment);
    return;
  }
};
