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
    console.log(result);
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
        console.log(res);
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
    // console.log(result);
    moviesList.innerHTML = '';
    result.results.forEach(element => {
      fetchMoviesId(element.id).then(res => {
        // console.log(res.production_countries[0].name);
        moviesList.insertAdjacentHTML(
          'beforeend',
          createCard(
            res.poster_path,
            res.title,
            res.id,
            res.release_date,
            res.vote_average,
            res.production_countries.name,
            res.budget,
            res.revenue,
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

function createShortDescription(vote, releaseDate, country, budget, revenue) {
  const previewInfoBlock = document.createElement('div');
  previewInfoBlock.classList.add('main__previewInfoBlock');
  previewInfoBlock.innerHTML = `
  <p id="js-minicardVotes" class="minicard__votes">Avarage raiting | <span class="text-orange">${vote}</span></p>
  <p id="js-minicardDate" class="minicard__date">Release date | ${releaseDate}</p>
  <p id="js-minicardDate" class="minicard__date">Country of origin | ${country}</p>
  <p id="js-minicardDate" class="minicard__date">Budget/Revenue | $${
    budget / 1000000
  }mln/$${Math.round(revenue / 1000000)}mln</p>`;
  return previewInfoBlock;
}
