'use strict';

let moviesList = document.querySelector('#js-moviesList');

const apiKey = '15ca756df476082b053254128d393ba0';
let inputValue = 'super';
let pageNumber = 1;

let renderedMovies = [];

function fetchFilms() {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&page=${pageNumber}&include_adult=false&query=${inputValue}`,
  )
    .then(response => response.json())
    .then(data => {
      return data;
    });
}

function createMarkup() {
  fetchFilms().then(result => {
    moviesList.innerHTML = '';
    result.results.forEach(element => {
      moviesList.insertAdjacentHTML(
        'beforeend',
        createCard(element.backdrop_path, element.title),
      );
    });
  });
}

createMarkup();

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
