movieGallery.addEventListener('click', event => {
  if (event.target.nodeName === 'IMG') {
    let id = event.target.dataset.id;
    activateDetailsPage(id);
  }
});

detailsButtonClose.addEventListener('click', closeModal);
detailsModal.addEventListener('click', closeModal);
document.addEventListener('keydown', closeModal);

function closeModal(event) {
  if (
    event.target.classList.contains('details-container') ||
    event.target.classList.contains('details-close') ||
    event.target.nodeName === 'use' ||
    event.key === 'Escape'
  ) {
    toTopBtn.classList.add('show');
    body.classList.remove('blocked-scroll');
    detailsModal.classList.add('hidden');
    // stop player youtube
    document.querySelector('iframe').src = '';
  }
}

function activateDetailsPage(id, itsLibraryMovie) {
  // let selectedMovie = renderedMovies.find(movie => movie.id === Number(id));
  let selectedMovie;
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

function openMovieDetails(selectedMovie) {
  toTopBtn.classList.remove('show');
  body.classList.add('blocked-scroll');
  detailsModal.classList.remove('hidden');
  if (selectedMovie.poster_path) {
    detailsPreviewImg.setAttribute(
      'src',
      `https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`,
    );
  } else {
    detailsPreviewImg.setAttribute('src', '../images/plug.jpg');
  }

  fetchMovies(selectedMovie.id).then(res => {
    movieTrailer.innerHTML = `
    <iframe
      
      src="https://www.youtube.com/embed/${res}"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;
  });

  detailsTitle.textContent = selectedMovie.title;
  detailsDescription.textContent = selectedMovie.overview;
  detailsPopularuty.innerHTML = selectedMovie.popularity;
  detailsOriginalTitle.textContent = selectedMovie.original_title;
  detailsVote.textContent = selectedMovie.vote_average;
  console.log(selectedMovie.id);
  detailsVotes.textContent = `/ ${selectedMovie.vote_count}`;
  detailsGenre.textContent = String(
    genres
      .filter(el =>
        selectedMovie.genre_ids.find(movie => el.id === movie) ? true : false,
      )
      .reduce((acc, item) => acc + `${item.name}, `, ''),
  ).slice(0, -2);

  // console.log(youtubeId);
  monitorButtonStatusText() 
}

const fistTitle = document.getElementById('details-title-first');
const secondTitle = document.getElementById('details-title-secondary');
const detailsTextContainer = document.getElementById('js-detailsText');

fistTitle.addEventListener('click', () => {
  fistTitle.classList.add('is-active');
  secondTitle.classList.remove('is-active');
  movieTrailer.classList.add('is-hidden');
  detailsTextContainer.classList.remove('is-hidden');
});

secondTitle.addEventListener('click', () => {
  fistTitle.classList.remove('is-active');
  secondTitle.classList.add('is-active');
  detailsTextContainer.classList.add('is-hidden');
  movieTrailer.classList.remove('is-hidden');
});


const watchedButtonAdd = document.querySelector('.button-add-to-watch');
const queueButtonAdd = document.querySelector('.button-add-to-queue');
console.log(watchedButtonAdd);
console.log(queueButtonAdd);


function monitorButtonStatusText() {
  
  let moviesWatched = [];
  localStorageData = localStorage.getItem('filmsWatched');
  if (localStorageData !== null) {
    moviesWatched.push(...JSON.parse(localStorageData));
  }
  if (moviesWatched.find(el => el.id === selectedMovie.id)) {
    watchedButtonAdd.textContent = 'Delete from watched';
  } else {
    watchedButtonAdd.textContent = 'Add to watched';
  }

  let moviesQueue = [];
  let localStorageData = localStorage.getItem('filmsQueue');
  if (localStorageData !== null) {
    moviesQueue.push(...JSON.parse(localStorageData));
  }
  if (moviesQueue.find(el => el.id === selectedMovie.id)) {
    queueButtonAdd.textContent = 'Delete from queue';
  } else {
    queueButtonAdd.textContent = 'Add to queue';
  }
  
}

watchedButtonAdd.addEventListener('click', toggleToQueue);
queueButtonAdd.addEventListener('click', toggleToWatched);

function toggleToWatched() {
  
  let moviesWatchedLocalStorage = [];
  let localStorageData = localStorage.getItem('filmsWatched');
  if (localStorageData !== null) {
    moviesWatchedLocalStorage.push(...JSON.parse(localStorageData));
  }
  if (moviesWatchedLocalStorage.find(el => el.id === selectedMovie.id)) {
    moviesWatchedLocalStorage = moviesWatchedLocalStorage.filter(el => el.id !== selectedMovie.id);
  } else {
    moviesWatchedLocalStorage.push(selectedMovie);
  }
  localStorage.setItem('filmsWatched', JSON.stringify(moviesWatchedLocalStorage));
  monitorButtonStatusText();
}

function toggleToQueue() {

  let moviesQueueLocalStorage = [];
  let localStorageData = localStorage.getItem('filmsQueue');
  if (localStorageData !== null) {
    moviesQueueLocalStorage.push(...JSON.parse(localStorageData));
  }
  if (moviesQueueLocalStorage.find(el => el.id === selectedMovie.id)) {
    moviesQueueLocalStorage = moviesQueueLocalStorage.filter(el => el.id !== selectedMovie.id);
  } else {
    moviesQueueLocalStorage.push(selectedMovie);
  }
  localStorage.setItem('filmsQueue', JSON.stringify(moviesQueueLocalStorage));
  monitorButtonStatusText();
}




