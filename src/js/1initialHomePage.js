'use strict';

const movieGallery = document.querySelector('#js-moviesList');
const libraryGallery = document.querySelector('#js-library');

console.log(libraryGallery);

const searchField = document.querySelector('#js-form');
const searchInput = document.querySelector('#search');
const moviesList = document.querySelector('#js-moviesList');
const detailsPage = document.querySelector('#js-detailsPage');
const homePage = document.querySelector('#js-homePage');
const headerError = document.querySelector('.error-message');

//detailsPage refs
const detailsModal = document.querySelector('#js-detailsPage');
const detailsPreviewImg = document.querySelector('#js-previewImg');
const detailsVote = document.querySelector('#js-detailsVote');
const detailsVotes = document.querySelector('#js-detailsVotes');
const detailsTitle = document.querySelector('.details-title');
const detailsDescription = document.querySelector('#js-detailsText');
const detailsPopularuty = document.querySelector('#details-popularity');
// const detailsGenre = document.querySelector('#details-genre');
const detailsOriginalTitle = document.querySelector('#details-originalTitle');
// const detailsButtonClose = document.querySelector('.button-close');
const movieTrailer = document.getElementById('js-movieTrailer');

const body = document.querySelector('body');

const apiKey = '5f4a8cd7bcedd7efa785bad615b94f98';
let inputValue = '';
let pageNumber = 1;
let genres;

let renderedMovies = [];

function createMarkup() {
  addPreloader();
  fetchFilms().then(result => {
    // console.log(result);
    if (inputValue === '') {
      removePreloader();
      headerError.textContent = 'Please enter movie name';
      return;
    } else {
      moviesList.innerHTML = '';
      headerError.textContent = '';
    }

    result.results.forEach(element => {
      fetchMoviesId(element.id).then(res => {
        // console.log(res);
        moviesList.insertAdjacentHTML(
          'beforeend',
          createCard(
            res.poster_path,
            res.title,
            res.id,
            res.release_date,
            res.vote_average,
            res.production_countries[0].name,
            res.budget,
            res.revenue,
            res.genres,
          ),
        );
      });
    });

    if (result.results.length === 0) {
      removePreloader();
      headerError.textContent =
        'No movies were found. Please specify your request';
      createStartupMarkup();
    }

    removePreloader();
    renderedMovies = result.results;
    return renderedMovies;
  });
}

function createStartupMarkup() {
  addPreloader();
  fetchPopularFilms().then(result => {
    moviesList.innerHTML = '';
    result.results.forEach(element => {
      fetchMoviesId(element.id).then(res => {
        // console.log(res.genres);
        moviesList.insertAdjacentHTML(
          'beforeend',
          createCard(
            res.poster_path,
            res.title,
            res.id,
            res.release_date,
            res.vote_average,
            res.production_countries[0].name,
            res.budget,
            res.revenue,
            res.genres,
          ),
        );
      });
    });
    removePreloader();
    renderedMovies = result.results;
    return renderedMovies;
  });
}

function createCard(
  imgPath,
  movieTitle,
  movieId,
  date,
  avgVote,
  country,
  budget,
  revenue,
  genres,
) {
  const movieItem = document.createElement('li');
  movieItem.classList.add('main__movieItem');
  movieItem.setAttribute('id', 'js-movieItem');

  const previewImg = document.createElement('img');
  previewImg.classList.add('main__previewImgItem');
  if (imgPath) {
    previewImg.setAttribute(
      'src',
      `https://image.tmdb.org/t/p/w500/${imgPath}`,
    );
  } else {
    previewImg.setAttribute('src', '../images/plug.jpg');
  }

  const previewImgTitle = document.createElement('h2');
  previewImgTitle.classList.add('main__previewImgTitle');
  previewImg.setAttribute('data-id', movieId);
  previewImg.setAttribute('id', 'js-image');

  const previewInfoBlock = createShortDescription(
    avgVote,
    date,
    country,
    budget,
    revenue,
    genres,
  );

  const releaseYear = new Date(date).getFullYear();
  if (!Number.isNaN(releaseYear)) {
    previewImgTitle.textContent = `${movieTitle} (${releaseYear})`;
  } else {
    previewImgTitle.textContent = movieTitle;
  }
  movieItem.append(previewImg, previewImgTitle, previewInfoBlock);
  return movieItem.outerHTML;
}

function createShortDescription(
  vote,
  releaseDate,
  country,
  budget,
  revenue,
  movieGenres,
) {
  console.log(movieGenres);

  let genres = movieGenres
    .reduce((acc, item) => acc + `${item.name}, `, '')
    .slice(0, -2);

  console.log(genres);

  //   let genres = movieGenres
  //     .filter(el => {
  //       el.find(movie => el.id === movie) ? true : false;
  //     })
  //     .reduce((acc, item) => acc + `${item.name}, `, '')
  //     .slice(0, -2);

  const previewInfoBlock = document.createElement('div');
  previewInfoBlock.classList.add('main__previewInfoBlock');
  previewInfoBlock.innerHTML = `
  <h2 id="js-minicardVotes" class="minicard__title">Avarage raiting</h2>
<span class="minicard__description">${vote}</span>
<h2 id="js-minicardReleaseDate" class="minicard__title">Release date</h2>
<p class="minicard__description">${releaseDate}</p>
<h2 id="js-minicardCountry" class="minicard__title">Country of Origin</h2>
<p class="minicard__description">${country}</p>
<h2 id="js-minicardRevenue" class="minicard__title">Budget/Revenue</h2>
<p class="minicard__description">
  $${budget / 1000000}mln/$${Math.round(revenue / 1000000)}mln
</p>
<h2 id="js-minicardRevenue" class="minicard__title">Genres</h2>
<p class="minicard__description">${genres}</p>`;

  return previewInfoBlock;
}
