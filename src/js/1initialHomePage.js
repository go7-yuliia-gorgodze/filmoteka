'use strict';

const searchField = document.querySelector('#js-form');
const moviesList = document.querySelector('#js-moviesList');

const apiKey = '15ca756df476082b053254128d393ba0';
let inputValue = '';
let pageNumber = 1;

let renderedMovies = [];


function createMarkup() {
  fetchFilms().then(result => {
    moviesList.innerHTML = '';
    result.results.forEach(element => {
      moviesList.insertAdjacentHTML(
        'beforeend',
        createCard(element.poster_path, element.title),
      );
    });
  });
}

function createCard(imgPath, movieTitle) {
  const movieItem = document.createElement('li');
  movieItem.classList.add('main__movieItem');
  movieItem.setAttribute('id', 'js-movieItem');

  const previewImg = document.createElement('img');
  previewImg.classList.add('main__previewImgItem');
  previewImg.setAttribute('src', `https://image.tmdb.org/t/p/w500/${imgPath}`);

  const previewImgTitle = document.createElement('h2');
  previewImgTitle.classList.add('main__previewImgTitle');
  previewImgTitle.textContent = movieTitle;

  movieItem.append(previewImg, previewImgTitle);

  return movieItem.outerHTML;
}
