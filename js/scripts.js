'use strict';

var movieGallery = document.querySelector('#js-moviesList');
var libraryGallery = document.querySelector('#js-library');
console.log(libraryGallery);
var searchField = document.querySelector('#js-form');
var searchInput = document.querySelector('#search');
var moviesList = document.querySelector('#js-moviesList');
var detailsPage = document.querySelector('#js-detailsPage');
var homePage = document.querySelector('#js-homePage');
var headerError = document.querySelector('.error-message'); //detailsPage refs

var detailsModal = document.querySelector('#js-detailsPage');
var detailsPreviewImg = document.querySelector('#js-previewImg');
var detailsVote = document.querySelector('#js-detailsVote');
var detailsVotes = document.querySelector('#js-detailsVotes');
var detailsTitle = document.querySelector('.details-title');
var detailsDescription = document.querySelector('#js-detailsText');
var detailsPopularuty = document.querySelector('#details-popularity'); // const detailsGenre = document.querySelector('#details-genre');

var detailsOriginalTitle = document.querySelector('#details-originalTitle'); // const detailsButtonClose = document.querySelector('.button-close');

var movieTrailer = document.getElementById('js-movieTrailer');
var body = document.querySelector('body');
var apiKey = '5f4a8cd7bcedd7efa785bad615b94f98';
var inputValue = '';
var pageNumber = 1;
var genres;
var renderedMovies = [];

function createMarkup() {
  addPreloader();
  fetchFilms().then(function (result) {
    // console.log(result);
    if (inputValue === '') {
      removePreloader();
      headerError.textContent = 'Please enter movie name';
      return;
    } else {
      moviesList.innerHTML = '';
      headerError.textContent = '';
    }

    result.results.forEach(function (element) {
      fetchMoviesId(element.id).then(function (res) {
        // console.log(res);
        moviesList.insertAdjacentHTML('beforeend', createCard(res.poster_path, res.title, res.id, res.release_date, res.vote_average, res.budget, res.revenue, res.genres));
      });
    });

    if (result.results.length === 0) {
      removePreloader();
      headerError.textContent = 'No movies were found. Please specify your request';
      createStartupMarkup();
    }

    removePreloader();
    renderedMovies = result.results;
    return renderedMovies;
  });
}

function createStartupMarkup() {
  addPreloader();
  fetchPopularFilms().then(function (result) {
    moviesList.innerHTML = '';
    result.results.forEach(function (element) {
      fetchMoviesId(element.id).then(function (res) {
        // console.log(res.genres);
        moviesList.insertAdjacentHTML('beforeend', createCard(res.poster_path, res.title, res.id, res.release_date, res.vote_average, res.budget, res.revenue, res.genres));
      });
    });
    removePreloader();
    renderedMovies = result.results;
    return renderedMovies;
  });
}

function createCard(imgPath, movieTitle, movieId, date, avgVote, budget, revenue, genres) {
  var movieItem = document.createElement('li');
  movieItem.classList.add('main__movieItem');
  movieItem.setAttribute('id', 'js-movieItem');
  var previewImg = document.createElement('img');
  previewImg.classList.add('main__previewImgItem');

  if (imgPath) {
    previewImg.setAttribute('src', "https://image.tmdb.org/t/p/w500/".concat(imgPath));
  } else {
    previewImg.setAttribute('src', './images/plug.jpg');
  }

  previewImg.setAttribute('data-id', movieId);
  previewImg.setAttribute('id', 'js-image');
  var previewImgTitle = document.createElement('h2');
  previewImgTitle.classList.add('main__previewImgTitle');
  console.log(previewImgTitle);
  var previewTitleContainer = document.createElement('div');
  previewTitleContainer.classList.add('main__previewTitleContainer');
  previewTitleContainer.append(previewImgTitle);
  console.log(previewTitleContainer);
  var previewInfoBlock = createShortDescription(avgVote, date, budget, revenue, genres);
  var releaseYear = new Date(date).getFullYear();

  if (!Number.isNaN(releaseYear)) {
    previewImgTitle.textContent = "".concat(movieTitle, " (").concat(releaseYear, ")");
  } else {
    previewImgTitle.textContent = movieTitle;
  }

  movieItem.append(previewImg, previewTitleContainer, previewInfoBlock);
  return movieItem.outerHTML;
}

function createShortDescription(vote, releaseDate, budget, revenue, movieGenres) {
  console.log(movieGenres);
  var genres = movieGenres.reduce(function (acc, item) {
    return acc + "".concat(item.name, ", ");
  }, '').slice(0, -2);
  console.log(genres); //   let genres = movieGenres
  //     .filter(el => {
  //       el.find(movie => el.id === movie) ? true : false;
  //     })
  //     .reduce((acc, item) => acc + `${item.name}, `, '')
  //     .slice(0, -2);

  var previewInfoBlock = document.createElement('div');
  previewInfoBlock.classList.add('main__previewInfoBlock');
  previewInfoBlock.innerHTML = "\n  <h2 id=\"js-minicardVotes\" class=\"minicard__title\">Avarage raiting</h2>\n<span class=\"minicard__description\">".concat(vote, "</span>\n\n<h2 id=\"js-minicardReleaseDate\" class=\"minicard__title\">Release date</h2>\n<p class=\"minicard__description\">").concat(releaseDate, "</p>\n\n<h2 id=\"js-minicardRevenue\" class=\"minicard__title\">Genres</h2>\n<p class=\"minicard__description\">").concat(genres, "</p>");
  return previewInfoBlock;
}
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var debounce = function debounce(fn, ms) {
  var timeout;
  return function () {
    var _arguments = arguments,
        _this = this;

    var fnCall = function fnCall() {
      fn.apply(_this, _arguments);
    };

    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
};

function inputChange() {
  if (searchInput.value.length != 0) {
    scrollToSectionHomePage();
    inputValue = searchInput.value;
    dischargePaginationAndCreateMarkup();
    searchField.reset();
  }
}

searchInput.addEventListener('input', debounce(inputChange, 1500));
searchField.addEventListener('submit', function (event) {
  event.preventDefault();
  scrollToSectionHomePage();
  inputValue = event.currentTarget.elements[0].value;
  searchField.reset();
  dischargePaginationAndCreateMarkup();
});

function fetchFilms() {
  return fetch("https://api.themoviedb.org/3/search/movie?api_key=".concat(apiKey, "&language=en-US&page=").concat(pageNumber, "&include_adult=false&query=").concat(inputValue)).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
    return data;
  });
}

function fetchPopularFilms() {
  return fetch("https://api.themoviedb.org/3/movie/popular?api_key=".concat(apiKey, "&language=en-US&page=").concat(pageNumber)).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
    return data;
  });
}

function fetchGenres() {
  fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=".concat(apiKey, "&language=en-US")).then(function (data) {
    return data.json();
  }).then(function (res) {
    // console.log(res);
    genres = _toConsumableArray(res.genres);
  }).catch(function (err) {
    return console.log(err);
  });
}

function fetchMovies(movieId) {
  return fetch("https://api.themoviedb.org/3/movie/".concat(movieId, "/videos?api_key=").concat(apiKey, "&language=en-US")).then(function (res) {
    return res.json();
  }).then(function (data) {
    return data.results[0].key;
  });
}

function fetchMoviesId(movieId) {
  return fetch("https://api.themoviedb.org/3/movie/".concat(movieId, "?api_key=").concat(apiKey, "&language=en-US")).then(function (res) {
    return res.json();
  }).then(function (data) {
    // console.log(data);
    return data;
  });
}

function paginationNavigation(arr) {
  pageNumber = arr[2];
  if (inputValue === '') createStartupMarkup();else createMarkup();
}
"use strict";

var myLibraryLink = document.querySelector('.link-library');
var myLibraryPage = document.querySelector('.my-library-page');
var myLibraryHeaderDiv = document.querySelector('.my-library-header-div');
var header = document.querySelector('header');
var homePageLink = document.querySelector('.link-header');
var homePageLogo = document.querySelector('.link-logo');
myLibraryLink.addEventListener('click', function () {
  activeLibraryPage();
  drawWatchedFilmList();
});
homePageLink.addEventListener('click', activeHomePage);
homePageLogo.addEventListener('click', activeHomePage);

var activeHomePage = function activeHomePage() {
  inputValue = '';
  dischargePaginationAndCreateMarkup();
  myLibraryLink.classList.remove('current');
  homePageLink.classList.add('current');
  homePage.classList.remove('hidden');
  myLibraryPage.classList.add('hidden');
  searchField.classList.remove('hidden');
  header.classList.add('header');
  header.classList.remove('my-library-header');
  myLibraryHeaderDiv.classList.add('hidden');
  localStorage.setItem('activePage', 'activeHomePage');
};

var activeLibraryPage = function activeLibraryPage() {
  myLibraryLink.classList.add('current');
  homePageLink.classList.remove('current');
  homePage.classList.add('hidden');
  myLibraryPage.classList.remove('hidden');
  searchField.classList.add('hidden');
  header.classList.remove('header');
  header.classList.add('my-library-header');
  myLibraryHeaderDiv.classList.remove('hidden');
  headerError.innerHTML = '';
  localStorage.setItem('activePage', 'activeLibraryPage');
};

if (localStorage.getItem('activePage') === 'activeHomePage') {
  activeHomePage();
} else {
  activeLibraryPage();
}
"use strict";
"use strict";

var watchedFilms = document.querySelector('.watched-list');
var watchedButton = document.querySelector('#watched');
var queueButton = document.querySelector('#queue');
watchedButton.addEventListener('click', drawWatchedFilmList);
queueButton.addEventListener('click', drawQueueFilmList);

function drawWatchedFilmList() {
  activePage(watchedButton, queueButton);
  watchedFilms.innerHTML = '';
  var moviesWatched = JSON.parse(localStorage.getItem('filmsWatched'));

  if (moviesWatched === null || moviesWatched.length === 0) {
    watchedFilms.innerHTML = "<img class=\"catch-error-pagination\" src=\"./images/image1.jpg\" />";
  } else {
    createWatchCard(moviesWatched);
  }

  return;
}

function drawQueueFilmList() {
  activePage(queueButton, watchedButton);
  watchedFilms.innerHTML = '';
  var moviesQueue = JSON.parse(localStorage.getItem('filmsQueue'));

  if (moviesQueue === null || moviesQueue.length === 0) {
    watchedFilms.innerHTML = "<img class=\"catch-error-pagination\" src=\"./images/image1.jpg\" />";
  } else {
    createQueqeCard(moviesQueue);
  }

  return;
}

function createWatchCard(moviesWatched) {
  moviesWatched.forEach(function (el) {
    fetchMoviesId(el).then(function (res) {
      console.log(res);
      watchedFilms.insertAdjacentHTML('beforeend', createCard(res.poster_path, res.title, res.id, res.release_date, res.vote_average));
    });
  });
}

function createQueqeCard(moviesQueue) {
  moviesQueue.forEach(function (el) {
    fetchMoviesId(el).then(function (res) {
      console.log(res);
      watchedFilms.insertAdjacentHTML('beforeend', createCard(res.poster_path, res.title, res.id, res.release_date, res.vote_average));
    });
  });
}

function activePage(active, notActive) {
  active.classList.add('button-active');
  notActive.classList.remove('button-active');
}
"use strict";

function removePreloader() {
  document.querySelector('.loader').classList.add('is-hidden');
}

function addPreloader() {
  document.querySelector('.loader').classList.remove('is-hidden');
} // preloader on start page
// window.onload = function () {
//   addPreloader();
//   window.setTimeout(function () {
//     addPreloader();
//     removePreloader();
//   }, 500);
// };
"use strict";

var FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
var openModalBtn = document.querySelector('.open-modal'); // elements for block

var main = document.querySelector('main');
var header = document.querySelector('header');
var html = document.documentElement; // variables

var modal, closeModalBtn, modalCollaboratorsList, shadow, timeout;
var scrollPosition = window.pageYOffset;

function scrollPositionOnOpen() {
  // console.log('SCROLL', window.pageYOffset);
  scrollPosition = window.pageYOffset;
  html.style.top = -scrollPosition + "px";
}

;

function scrollPositionOnClose() {
  html.classList.remove("modal__opened");
  window.scrollTo(0, scrollPosition);
  html.style.top = "";
}

;

function fetchFilmModal(film) {
  return fetch("https://api.themoviedb.org/3/search/movie?api_key=".concat(apiKey, "&language=en-US&include_adult=false&query=").concat(film)).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log("Fetched data", data);
    return data;
  });
}

;

function modalCollaboratorFilm(e) {
  if (!e.target.classList.contains('modal-card_btn_text')) {
    return;
  }

  ;
  var film = e.target.textContent || 'alibi.com';
  fetchFilmModal(film).then(function (_ref) {
    var results = _ref.results;
    // modal.style.zIndex = 1;
    // shadow.style.zIndex = 0;
    openMovieDetails(results[0]);
  }).catch(function (e) {
    return "ERROR ".concat(e);
  });
}

;

function focusCatcher(element) {
  var focusableElements = element.querySelectorAll(FOCUSABLE_SELECTORS);
  focusableElements.forEach(function (el) {
    return el.setAttribute('tabindex', '-1');
  });
}

;

function focusSet(element) {
  var focusableElements = element.querySelectorAll(FOCUSABLE_SELECTORS);
  focusableElements.forEach(function (el) {
    return el.removeAttribute('tabindex');
  });
}

;

function trapScreenReaderFocus(element) {
  element.removeAttribute('aria-hidden');
  main.setAttribute('aria-hidden', 'true');
  header.setAttribute('aria-hidden', 'true');
}

;

function untrapScreenReaderFocus(element) {
  element.setAttribute('aria-hidden', 'true');
  main.removeAttribute('aria-hidden');
  header.removeAttribute('aria-hidden');
}

;

function bodyScrollControlShift() {
  var marginSize = window.innerWidth - html.clientWidth;

  if (marginSize) {
    html.style.marginRight = marginSize + "px";
    return;
  }

  ;
  html.style.marginRight = "";
}

;

function onOverlayClickClose(e) {
  var wrap = e.target.classList.contains('modal-wrap');
  if (!wrap) return;
  e.preventDefault();
  closeModalWindow();
}

;

function onEscapeClose(e) {
  if (e.which == 27 && modal.classList.contains('modal--active')) {
    e.preventDefault();
    closeModalWindow();
    return;
  }

  ;
}

;

function markup(objectsArray, templateFunction) {
  var markup = objectsArray.reduce(function (acc, e) {
    var item = templateFunction(e);
    acc += item;
    return acc;
  }, '');
  return markup;
}

;
var cursorHandler = {
  currentElem: null,
  mouseCursor: document.getElementById('cursor'),
  onmouseover: function onmouseover(event) {
    var target = event.target.closest('button') || event.target.closest('a');
    if (!target) return;
    if (!body.contains(target)) return;
    this.currentElem = target;
    mouseCursor.classList.add('cursor');
    mouseCursor.classList.remove('cursor-n');
    body.classList.add('cursor-none');
  },
  onmouseout: function onmouseout(event) {
    if (!this.currentElem) return;
    var relatedTarget = event.relatedTarget;

    while (relatedTarget) {
      if (relatedTarget == !this.currentElem) return;
      relatedTarget = relatedTarget.parentNode;
    }

    ;
    cursorHandler.onclose(); // mouseCursor.classList.remove('cursor');
    // mouseCursor.classList.add('cursor-n');
    // body.classList.remove('cursor-none');

    this.currentElem = null;
  },
  onclose: function onclose() {
    mouseCursor.classList.remove('cursor');
    mouseCursor.classList.add('cursor-n');
    body.classList.remove('cursor-none');
  },
  mousemove: function mousemove(event) {
    mouseCursor.style.top = event.pageY + scrollPosition + 'px';
    mouseCursor.style.left = event.pageX + 'px';
  }
};

function shadowShow() {
  if (shadow) {
    return;
  }

  ;
  shadow = document.createElement('div');
  shadow.classList.add('modal__shadow');
  document.body.appendChild(shadow);
}

;

function openModalWindow() {
  document.body.insertAdjacentHTML('beforeend', createModalWindow());
  modal = document.querySelector('.modal');
  closeModalBtn = document.querySelector('.close-modal');
  modalCollaboratorsList = document.querySelector('.modal-our_team_list');
  modalCollaboratorsList.insertAdjacentHTML("beforeend", markup(collaborators, renderCollaboratorCard));
  timeout = setTimeout(function () {
    modal.classList.add('modal--active');
  }, 500);
  shadowShow();
  window.removeEventListener('mousemove', cursor);
  window.addEventListener('mousemove', cursorHandler.mousemove);
  modal.addEventListener('mouseover', cursorHandler.onmouseover);
  modal.addEventListener('mouseout', cursorHandler.onmouseout);
  cursorHandler.onclose();

  if (toTopBtn) {
    toTopBtn.classList.remove('show');
  }

  focusCatcher(html);
  getStorage();
  closeModalBtn.addEventListener('click', closeModalWindow);
  document.addEventListener("click", onOverlayClickClose);
  window.addEventListener("keydown", onEscapeClose);
  openModalBtn.removeEventListener('click', openModalWindow);
  modalCollaboratorsList.addEventListener('click', modalCollaboratorFilm);
  modal.querySelector(FOCUSABLE_SELECTORS).focus();
  focusSet(modal);
  bodyScrollControlShift();
  scrollPositionOnOpen();
  html.classList.add("modal__opened"); // Trap the screen reader focus as well with aria roles. This is much easier as our main and modal elements are siblings, otherwise you'd have to set aria-hidden on every screen reader focusable element not in the modal.

  trapScreenReaderFocus(modal);
}

;

function closeModalWindow() {
  // hide the modal
  modal.classList.add("modal--moved");
  modal.addEventListener("transitionend", transitionClose);
  modal.classList.remove('modal--active');
  closeModalBtn.removeEventListener('click', closeModalWindow);
}

;

function transitionClose() {
  modal.classList.remove("modal--moved");
  modalCollaboratorsList.innerHTML = '';
  modal.removeEventListener("transitionend", transitionClose);
  document.removeEventListener("click", onOverlayClickClose);
  window.removeEventListener("keydown", onEscapeClose);
  modalCollaboratorsList.removeEventListener('click', modalCollaboratorFilm);
  window.removeEventListener('mousemove', cursorHandler.mousemove);
  modal.removeEventListener('mouseover', cursorHandler.onmouseover);
  modal.removeEventListener('mouseout', cursorHandler.onmouseout);
  cursorHandler.onclose();
  window.addEventListener('mousemove', cursor);
  openModalBtn.addEventListener('click', openModalWindow);
  focusSet(html);
  bodyScrollControlShift();
  scrollPositionOnClose(); // Untrap screen reader focus

  untrapScreenReaderFocus(modal); // restore focus to the triggering element

  openModalBtn.focus();
  body.removeChild(modal);
  body.removeChild(shadow);
  clearTimeout(timeout);
  shadow = null;
  modal = null;
  timeout = null;
}

;
openModalBtn.addEventListener('click', openModalWindow); // const props = {
//     data: null,
//     modalWindowTemplate: null,
//     defaultTemplates: null,
// };
// const collaborators = [{
//     src: '../images/jpg/Margot_Robbie_cr.jpg',
//     alt: 'Марго Робби',
//     collaboratorName: 'Юля',
//     filmName: 'alibi.com'
// },
// {
//     src: '../images/jpg/Natalie_Portman_cr.jpg',
//     alt: 'Natalie Portman',
//     collaboratorName: 'Валентина',
//     filmName: 'Leon: The Professional'
// },
// {
//     src: '../images/png/Charlie_Hunnam.png',
//     alt: 'Чарли Ханнем',
//     collaboratorName: 'MAXCOM',
//     filmName: 'Побег из Претории'
// },
// {
//     src: '../images/jpg/Til_Schweiger_cr.jpg',
//     alt: 'Til Schweiger',
//     collaboratorName: 'Mikhail',
//     filmName: 'Knockin` on Heaven`s Door'
// }, {
//     src: '../images/jpg/AbdulovA.jpg',
//     alt: 'Олександр Абдулов',
//     collaboratorName: 'Pankov Dmytro',
//     filmName: 'Чародеи'
// },
// {
//     src: '../images/jpg/Johnny_Depp.jpg',
//     alt: 'alt alt alt',
//     collaboratorName: 'Dimas',
//     filmName: 'Fear and Loathing in Las Vegas'
// },
// {
//     src: '../images/jpg/Adam_Sandler.jpg',
//     alt: 'Adam Sandler',
//     collaboratorName: 'Victor',
//     filmName: 'Большой папа'
// },
// {
//     src: '../images/jpg/Tim_Robbins.jpg',
//     alt: 'Tim Robbins',
//     collaboratorName: 'Осипов Сергей',
//     filmName: 'Побег из Шоушенка'
//     // filmName: 'ghjdgjg'
// }
// ];
// const collaboratorsModalProps = {
//     data: collaborators,
//     modalWindowTemplate: createModalWindow,
//     defaultTemplates: renderCollaboratorCard,
//     blockingElements: [main, header],
//     hideElements: [[toTopBtn, 'show']],
//     elementToSelect: '.modal-our_team_list',
//     openModalBtn: document.querySelector('.open-modal')
// };
// class ModalWindow {
//     constructor(props) {
//         this.modal = false;
//         this.openModalBtn = false;
//         this.closeModalBtn = false;
//         this.shadow = false;
//         this.timeout = false;
//         this.modalSelectedElement = null;
//         this.scrollPosition = window.pageYOffset;
//         this.FOCUSABLE_SELECTORS = [
//             'a[href]',
//             'area[href]',
//             'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
//             'select:not([disabled]):not([aria-hidden])',
//             'textarea:not([disabled]):not([aria-hidden])',
//             'button:not([disabled]):not([aria-hidden])',
//             'iframe',
//             'object',
//             'embed',
//             '[contenteditable]',
//             '[tabindex]:not([tabindex^="-"])'
//         ];
//         this.currentElem = null;
//         this.mouseCursor = document.getElementById('cursor');
//         this.body = document.body;
//         this.html = document.documentElement;
//         this.props = props;
//     };
//     scrollPositionOnOpen() {
//         this.scrollPosition = window.pageYOffset;
//         this.html.style.top = -this.scrollPosition + "px";
//     };
//     scrollPositionOnClose() {
//         this.html.classList.remove("modal__opened");
//         window.scrollTo(0, this.scrollPosition);
//         this.html.style.top = "";
//     };
//     fetchFilmModal(film) {
//         return fetch(
//             `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&include_adult=false&query=${film}`,
//         )
//             .then(response => response.json())
//             .then(data => {
//                 console.log("Fetched data", data);
//                 return data;
//             });
//     };
//     modalSelectFilm(e) {
//         if (!e.target.classList.contains('modal-card_btn_text')) {
//             return;
//         };
//         const film = e.target.textContent || 'alibi.com';
//         this.fetchFilmModal(film).then(({ results }) => {
//             modal.style.zIndex = 1;
//             shadow.style.zIndex = 0;
//             openMovieDetails(results[0]);
//         })
//             .catch(e => `ERROR ${e}`);
//     };
//     focusCatcher() {
//         const focusableElements = this.html.querySelectorAll(this.FOCUSABLE_SELECTORS);
//         focusableElements.forEach(el => el.setAttribute('tabindex', '-1'));
//     };
//     focusSet(elements) {
//         const focusableElements = elements.querySelectorAll(this.FOCUSABLE_SELECTORS);
//         focusableElements.forEach(el => el.removeAttribute('tabindex'));
//     };
//     trapScreenReaderFocus() {
//         this.modal.removeAttribute('aria-hidden');
//         console.log(this.props.blockingElements);
//         this.props.blockingElements.forEach(el => el.setAttribute('aria-hidden', 'true'));
//     };
//     untrapScreenReaderFocus() {
//         this.modal.setAttribute('aria-hidden', 'true');
//         this.props.blockingElements.forEach(el => el.removeAttribute('aria-hidden'));
//     };
//     bodyScrollControlShift() {
//         let marginSize = window.innerWidth - this.html.clientWidth;
//         if (marginSize && this.modal) {
//             this.html.style.marginRight = marginSize + "px";
//             console.log("in ", this.html.style.marginRight);
//             return;
//         };
//         this.html.style.marginRight = "0px";
//         console.log("after ", this.html.style.marginRight);
//     };
//     onOverlayClickClose(e) {
//         const wrap = e.target.classList.contains('modal-wrap');
//         if (!wrap) return;
//         e.preventDefault();
//         this.closeModalWindow().bind(this);
//     };
//     onEscapeClose(e) {
//         if (e.which == 27 && modal.classList.contains('modal--active')) {
//             e.preventDefault();
//             closeModalWindow().bind(this);
//             return;
//         };
//     };
//     markup(objectsArray, templateFunction) {
//         let markup = objectsArray.reduce((acc, e) => {
//             let item = templateFunction(e);
//             acc += item;
//             return acc;
//         }, '');
//         return markup;
//     };
//     onmouseover(event) {
//         let target = event.target.closest('button');
//         if (!target) return;
//         if (!this.modal.contains(target)) return;
//         this.currentElem = target;
//         this.mouseCursor.classList.add('cursor');
//         this.mouseCursor.classList.remove('cursor-n');
//         this.body.classList.add('cursor-none');;
//     };
//     onmouseout(event) {
//         if (!this.currentElem) return;
//         let relatedTarget = event.relatedTarget;
//         while (relatedTarget) {
//             if (relatedTarget == !this.currentElem) return;
//             relatedTarget = relatedTarget.parentNode;
//         };
//         this.mouseCursor.classList.remove('cursor');
//         this.mouseCursor.classList.add('cursor-n');
//         this.body.classList.remove('cursor-none');
//         this.currentElem = null;
//     };
//     shadowShow() {
//         this.shadow = document.createElement('div');
//         this.shadow.classList.add('modal__shadow');
//         document.body.appendChild(this.shadow);
//     };
//     hideElements(arr) {
//         console.log(arr);
//         arr.forEach(el => {
//             if (el[0]) {
//                 el[0].classList.remove(el[1]);
//             }
//         });
//     };
//     openModalWindow() {
//         this.openModalBtn = this.props.openModalBtn;
//         const modal = this.props.modalWindowTemplate();
//         document.body.insertAdjacentHTML('beforeend', modal);
//         this.modal = document.querySelector('.modal');
//         this.closeModalBtn = document.querySelector('.close-modal');
//         this.modalSelectedElement = document.querySelector(this.props.elementToSelect);
//         this.modalSelectedElement.insertAdjacentHTML("beforeend", this.markup(this.props.data, this.props.defaultTemplates));
//         this.shadowShow();
//         this.modal.addEventListener('mouseover', this.onmouseover.bind(this));
//         this.modal.addEventListener('mouseout', this.onmouseout.bind(this));
//         this.hideElements(this.props.hideElements);
//         this.closeModalBtn.addEventListener('click', this.closeModalWindow.bind(this));
//         document.addEventListener("click", this.onOverlayClickClose.bind(this));
//         window.addEventListener("keydown", this.onEscapeClose.bind(this));
//         this.openModalBtn.removeEventListener('click', this.openModalWindow.bind(this));
//         this.modalSelectedElement.addEventListener('click', this.modalSelectFilm.bind(this));
//         this.timeout = setTimeout(() => {
//             this.modal.classList.add('modal--active');
//         }, 500);
//         // this.modal.querySelector(this.FOCUSABLE_SELECTORS).focus();
//         this.focusSet(this.modal);
//         this.bodyScrollControlShift();
//         this.scrollPositionOnOpen();
//         this.html.classList.add("modal__opened");
//         this.trapScreenReaderFocus();
//     };
//     closeModalWindow() {
//         // hide the modal
//         this.modal.classList.add("modal--moved");
//         this.modal.addEventListener("transitionend", this.transitionClose.bind(this));
//         this.modal.classList.remove('modal--active');
//         this.closeModalBtn.removeEventListener('click', this.closeModalWindow.bind(this));
//     };
//     transitionClose() {
//         this.modal.classList.remove("modal--moved");
//         console.log(this.modalSelectedElement);
//         this.modalSelectedElement.innerHTML = '';
//         this.modal.removeEventListener("transitionend", this.transitionClose.bind(this));
//         document.removeEventListener("click", this.onOverlayClickClose.bind(this));
//         window.removeEventListener("keydown", this.onEscapeClose.bind(this));
//         this.modalSelectedElement.removeEventListener('click', this.modalSelectFilm.bind(this));
//         this.modal.removeEventListener('mouseover', this.onmouseover.bind(this));
//         this.modal.removeEventListener('mouseout', this.onmouseout.bind(this));
//         this.openModalBtn.addEventListener('click', this.openModalWindow.bind(this));
//         this.focusSet(this.html);
//         this.html.style.marginRight = 0 + "px";
//         this.scrollPositionOnClose();
//         // Untrap screen reader focus
//         this.untrapScreenReaderFocus();
//         // restore focus to the triggering element
//         this.openModalBtn.focus();
//         this.modal.parentNode.removeChild(this.modal);
//         this.shadow.parentNode.removeChild(this.shadow);
//         this.modal = false;
//         this.shadow = false;
//     };
// };
// const collaboratorsModalWindow = new ModalWindow(collaboratorsModalProps);
// openModalBtn.addEventListener('click', collaboratorsModalWindow.openModalWindow.bind(collaboratorsModalWindow));
"use strict";

var pageCarousel = '1';

function Carousel(frameSelector, sliderSelector, slidesSelector, btnLeftSelector, btnRightSelector) {
  //A variable to store the position of the slides
  var position = 0;
  var frame = document.querySelector(frameSelector);
  var slides = document.querySelectorAll(slidesSelector);
  console.log(frame, slides);
  var slidesNumber = slides.length;
  var leftButton = document.querySelector(btnLeftSelector);
  var rightButton = document.querySelector(btnRightSelector);
  var slider = document.querySelector(sliderSelector);
  frame.classList.add('frame');
  slider.classList.add('slider'); //Event listeners when the user clicks on the arrows

  leftButton.addEventListener('click', function () {
    carousel.left();
  });
  rightButton.addEventListener('click', function () {
    carousel.right();
  });

  function moveSlide(value) {
    position += value;
    slider.style.left = position + 'px';
  }

  return {
    right: function right() {
      if (position > -3100) {
        moveSlide(-199);
      } else {
        position = slidesNumber - 1;
        slider.style.left = position + 'px';
        pageCarousel = Number(pageCarousel) + 1;
        pageCarousel = pageCarousel + '';
        getUpcomingFilms(pageCarousel);
      }
    },
    left: function left() {
      if (position === 0) {
        moveSlide(0);
      } else if (position < 0) {
        moveSlide(200);
      } else {
        position = slidesNumber - 1;
        slider.style.left = position + 'px';
      }
    }
  };
}

var carousel = new Carousel('#frame', '#slider', '#slider .slide', '.arrowLeft', '.arrowRight');

var getUpcomingFilms = function getUpcomingFilms(pageCarousel) {
  fetch("https://api.themoviedb.org/3/movie/upcoming?api_key=".concat(apiKey, "&language=en-US&page=").concat(pageCarousel)).then(function (list) {
    return list.json();
  }).then(function (list) {
    var listRef = document.querySelector('#slider');
    list.results.map(function (el) {
      listRef.innerHTML += "<div class=\"slider-box slide\">\n                  <div class=\"slider-photo\">\n                    <a href=\"#\" class=\"carousel-link\">\n                      <img src=\"https://image.tmdb.org/t/p/w200".concat(el.poster_path, "\" class=\"img-carousel\" />\n                    </a>\n                    <p class=\"release-date\">Available from</br>\"").concat(el.release_date, "\"</p>\n                  </div>");
    });
  }).catch(function (error) {
    console.log(error);
  });
};

getUpcomingFilms(pageCarousel);
setInterval(function () {
  carousel.right();
}, 3000);
"use strict";

var mouseCursor = document.getElementById('cursor'); // const body = document.body;

var navLinks = document.querySelectorAll('a');
var button = document.querySelectorAll('button');
var body = document.querySelector('body');
window.addEventListener('mousemove', cursor);

function cursor(e) {
  mouseCursor.style.top = e.pageY + 'px';
  mouseCursor.style.left = e.pageX + 'px';
}

navLinks.forEach(function (link) {
  link.addEventListener('mouseleave', function () {
    mouseCursor.classList.remove('cursor');
    mouseCursor.classList.add('cursor-n');
    body.classList.remove('cursor-none');
  });
  link.addEventListener('mouseover', function () {
    mouseCursor.classList.add('cursor');
    mouseCursor.classList.remove('cursor-n');
    body.classList.add('cursor-none');
  });
});
button.forEach(function (button) {
  button.addEventListener('mouseleave', function () {
    mouseCursor.classList.remove('cursor');
    mouseCursor.classList.add('cursor-n');
    body.classList.remove('cursor-none');
  });
  button.addEventListener('mouseover', function () {
    mouseCursor.classList.add('cursor');
    mouseCursor.classList.remove('cursor-n');
    body.classList.add('cursor-none');
  });
}); // const cursorHandler = {
//   currentElem: null,
//   // mouseCursor: document.getElementById('cursor'),
//   // body: document.body,
//   onmouseover: function (event) {
//     let target = event.target.closest('button');
//     if (!target) return;
//     if (!body.contains(target)) return;
//     this.currentElem = target;
//     mouseCursor.classList.add('cursor');
//     mouseCursor.classList.remove('cursor-n');
//     body.classList.add('cursor-none');;
//   },
//   onmouseout: function (event) {
//     if (!this.currentElem) return;
//     let relatedTarget = event.relatedTarget;
//     while (relatedTarget) {
//       if (relatedTarget == !this.currentElem) return;
//       relatedTarget = relatedTarget.parentNode;
//     };
//     mouseCursor.classList.remove('cursor');
//     mouseCursor.classList.add('cursor-n');
//     body.classList.remove('cursor-none');
//     this.currentElem = null;
//   }
// };
// body.addEventListener('mouseover', cursorHandler.onmouseover);
// body.addEventListener('mouseout', cursorHandler.onmouseout);
"use strict";

var body = document.querySelector('body');
var footerTheme = document.querySelector('footer');
var textFooter = document.querySelector('.footer-text-wrapper');
var copyrightFooter = document.querySelector('.footer-copyright');
var creatorsFooter = document.querySelector('.footer-creators');
var switchToggle = document.querySelector('#theme-switch-toggle');
var detailsWrapper; // const detailsWrapper = document.querySelector('.details-wrapper');

var detailsInfo; // const detailsInfo = document.querySelector('.details-information');

var detailsContainer; // const detailsContainer = document.querySelector('.details-container');

var detailsList; // const detailsList = document.querySelector('.details-inf-list');

var detailsListSecondary; // const detailsListSecondary = document.querySelector(
//   '.details-inf-list-secondary'
// );

var tabs; // const tabs = document.querySelector('.tabs');

var tabsContent; // const tabsContent = document.querySelector('.tabs-content');

var buttonToWatch; // const buttonToWatch = document.querySelector('.button-add-to-watch');

var buttonToQueue; // const buttonToQueue = document.querySelector('.button-add-to-queue');

var ourTeamModal;
var paginationButton = document.querySelector('.pagination__button');
var Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme'
};
switchToggle.addEventListener('click', themeChange);
getStorage();

function getStorage() {
  console.log("click");
  var themeCheck = localStorage.getItem('Theme:');

  if (themeCheck === null || themeCheck === 'light-theme') {
    setLocalStorage(Theme.LIGHT);
    lightTheme();
  } else if (themeCheck === 'dark-theme') {
    darkTheme();
  }
}

function darkTheme() {
  body.classList.add('darkTheme');
  footerTheme.classList.add('darkTheme');
  textFooter.classList.add('darkTheme');
  copyrightFooter.classList.add('darkTheme');
  paginationButton.classList.add('darkTheme');
  creatorsFooter.classList.add('darkTheme');

  if (detailsModal) {
    setDetailsFilmThemeToggling();
    detailsWrapper.classList.add('darkTheme');
    detailsInfo.classList.add('darkTheme');
    detailsContainer.classList.add('darkTheme');
    detailsList.classList.add('darkTheme');
    detailsListSecondary.classList.add('darkTheme');
    tabs.classList.add('darkTheme');
    tabsContent.classList.add('darkTheme');
    buttonToWatch.classList.add('darkTheme');
    buttonToQueue.classList.add('darkTheme');
  }

  ;

  if (modal) {
    setOurTeamThemeToggling();
    ourTeamModal.classList.add('darkTheme');
  }

  ; // detailsWrapper.classList.add('darkTheme');
  // detailsInfo.classList.add('darkTheme');
  // detailsContainer.classList.add('darkTheme');
  // detailsList.classList.add('darkTheme');
  // detailsListSecondary.classList.add('darkTheme');
  // tabs.classList.add('darkTheme');
  // tabsContent.classList.add('darkTheme');
  // buttonToWatch.classList.add('darkTheme');
  // buttonToQueue.classList.add('darkTheme');

  switchToggle.checked = true;
}

;

function lightTheme() {
  body.classList.remove('darkTheme');
  footerTheme.classList.remove('darkTheme');
  textFooter.classList.remove('darkTheme');
  copyrightFooter.classList.remove('darkTheme');
  creatorsFooter.classList.remove('darkTheme');

  if (detailsModal) {
    setDetailsFilmThemeToggling();
    detailsWrapper.classList.remove('darkTheme');
    detailsInfo.classList.remove('darkTheme');
    detailsContainer.classList.remove('darkTheme');
    detailsList.classList.remove('darkTheme');
    detailsListSecondary.classList.remove('darkTheme');
    tabs.classList.remove('darkTheme');
    tabsContent.classList.remove('darkTheme');
    buttonToWatch.classList.remove('darkTheme');
    buttonToQueue.classList.remove('darkTheme');
  }

  ;

  if (modal) {
    setOurTeamThemeToggling();
    ourTeamModal.classList.remove('darkTheme');
  }

  ; // detailsWrapper.classList.remove('darkTheme');
  // detailsInfo.classList.remove('darkTheme');
  // detailsContainer.classList.remove('darkTheme');
  // detailsList.classList.remove('darkTheme');
  // detailsListSecondary.classList.remove('darkTheme');
  // tabs.classList.remove('darkTheme');
  // tabsContent.classList.remove('darkTheme');
  // buttonToWatch.classList.remove('darkTheme');
  // buttonToQueue.classList.remove('darkTheme');

  paginationButton.classList.remove('darkTheme');
  switchToggle.checked = false;
}

;

function themeChange() {
  if (switchToggle.checked) {
    darkTheme();
    setLocalStorage(Theme.DARK);
  } else {
    lightTheme();
    setLocalStorage(Theme.LIGHT);
  }

  ;
}

;

function setLocalStorage(info) {
  localStorage.setItem('Theme:', info);
}

;

function setDetailsFilmThemeToggling() {
  detailsWrapper = document.querySelector('.details-wrapper');
  detailsInfo = document.querySelector('.details-information');
  detailsContainer = document.querySelector('.details-container');
  detailsList = document.querySelector('.details-inf-list');
  detailsListSecondary = document.querySelector('.details-inf-list-secondary');
  tabs = document.querySelector('.tabs');
  tabsContent = document.querySelector('.tabs-content');
  buttonToWatch = document.querySelector('.button-add-to-watch');
  buttonToQueue = document.querySelector('.button-add-to-queue');
}

;

function setOurTeamThemeToggling() {
  ourTeamModal = document.querySelector('.modal-content');
}
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var selectedMovie, detailsModal, filmDetailsTimeout, detailsButtonClose;
var tabLinks = null;
var tabPanels = null;
var watchedButtonAdd = null;
var queueButtonAdd = null;
movieGallery.addEventListener('click', onFilmCardClickHandler);

function onFilmCardClickHandler(event) {
  if (event.target.nodeName === 'IMG') {
    var id = event.target.dataset.id;
    activateDetailsPage(id);
    toggleButtonWatcher(id);
  }
}

function activateDetailsPage(id, itsLibraryMovie) {
  selectedMovie = renderedMovies.find(function (movie) {
    return movie.id === Number(id);
  });

  if (itsLibraryMovie) {
    var allLocalStorageMovies = [].concat(_toConsumableArray(JSON.parse(localStorage.getItem('filmsQueue'))), _toConsumableArray(JSON.parse(localStorage.getItem('filmsWatched'))));
    selectedMovie = allLocalStorageMovies.find(function (movie) {
      return movie.id === Number(id);
    });
  } else {
    selectedMovie = renderedMovies.find(function (movie) {
      return movie.id === Number(id);
    });
  }

  openMovieDetails(selectedMovie);
}

fetchGenres();
console.log(genres);

function openMovieDetails(selectedMovie) {
  if (toTopBtn) {
    toTopBtn.classList.remove('show');
  }

  shadowShow();
  body.insertAdjacentHTML('beforeend', renderDetailFilmModal(selectedMovie));
  detailsModal = document.querySelector('#js-detailsPage');
  queueButtonAdd = document.querySelector('.button-add-to-queue');
  watchedButtonAdd = document.querySelector('.button-add-to-watch');
  tabPanels = document.querySelectorAll('.tabs-panel');
  tabLinks = document.querySelectorAll('.tabs a');
  filmDetailsTimeout = setTimeout(function () {
    detailsModal.classList.remove('hidden');
    detailsModal.classList.add('modal--active');
  }, 500);
  queueButtonAdd = document.querySelector('.button-add-to-queue');
  detailsButtonClose = document.querySelector('.close-details');
  getStorage();
  detailsButtonClose.addEventListener('click', closeModal);
  window.removeEventListener('mousemove', cursor);
  window.addEventListener('mousemove', cursorHandler.mousemove);
  detailsModal.addEventListener('mouseover', cursorHandler.onmouseover);
  detailsModal.addEventListener('mouseout', cursorHandler.onmouseout);
  window.addEventListener('keydown', onEscapeCloseDetails);
  document.addEventListener('click', onOverlayDetailsClose);
  var filmGeneres = genres.filter(function (el) {
    return selectedMovie.genre_ids.find(function (movie) {
      return el.id === movie;
    }) ? true : false;
  }).reduce(function (acc, item) {
    return acc + "".concat(item.name, ", ");
  }, '').slice(0, -2);
  document.querySelector('#details-genre').textContent = filmGeneres;
  fetchMovies(selectedMovie.id).then(function (res) {
    document.getElementById('js-movieTrailer').innerHTML = "\n        <iframe\n            src=\"https://www.youtube.com/embed/".concat(res, "\"\n            frameborder=\"0\"\n            allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\"\n            allowfullscreen\n        ></iframe>\n  ");
  });

  if (document.querySelector('.modal')) {
    focusCatcher(modal);
  } else {
    focusCatcher(html);
    bodyScrollControlShift();
    scrollPositionOnOpen();
    html.classList.add('modal__opened');
  }

  tabLinks.forEach(function (el) {
    return el.addEventListener('click', tabLinksCallback);
  });
  runLocalStorage();
  focusSet(detailsModal);
  detailsModal.querySelector(FOCUSABLE_SELECTORS).focus();
  trapScreenReaderFocus(detailsModal);
}

function closeModal() {
  if (toTopBtn && !modal) {
    toTopBtn.classList.add('show');
  }

  document.querySelector('iframe').src = '';
  detailsModal.classList.add('hidden');
  detailsModal.classList.add('modal--moved');
  detailsModal.addEventListener('transitionend', transitionDetailsClose);
  detailsModal.classList.remove('modal--active');
  detailsButtonClose.removeEventListener('click', closeModal);
}

function transitionDetailsClose() {
  detailsModal.classList.remove('modal--moved');
  detailsModal.removeEventListener('transitionend', transitionDetailsClose);

  if (!modal) {
    window.removeEventListener('mousemove', cursorHandler.mousemove);
    detailsModal.removeEventListener('mouseover', cursorHandler.onmouseover);
    detailsModal.removeEventListener('mouseout', cursorHandler.onmouseout);
    cursorHandler.onclose();
    window.addEventListener('mousemove', cursor);
    focusSet(html);
    bodyScrollControlShift();
    scrollPositionOnClose();
    body.removeChild(shadow);
    shadow = null;
  }

  window.removeEventListener('keydown', onEscapeCloseDetails);
  document.removeEventListener('click', onOverlayDetailsClose); // Untrap screen reader focus

  untrapScreenReaderFocus(detailsModal); // restore focus to the triggering element

  clearTimeout(filmDetailsTimeout);
  filmDetailsTimeout = null;
  openModalBtn.focus();
  body.removeChild(detailsModal);
  detailsModal = null;
  tabLinks = null;
  tabPanels = null;
  watchedButtonAdd = null;
  queueButtonAdd = null;
  selectedMovie = null;
  detailsButtonClose = null;
}

function onEscapeCloseDetails(e) {
  if (e.which == 27 && detailsModal.classList.contains('details-container')) {
    e.preventDefault();
    closeModal();
    return;
  }
}

function onOverlayDetailsClose(e) {
  var wrap = e.target.classList.contains('details-container');
  if (!wrap) return;
  e.preventDefault();
  closeModal();
}

function tabLinksCallback(e) {
  e.preventDefault();
  document.querySelector('.tabs li.active').classList.remove('active');
  document.querySelector('.tabs-panel.active').classList.remove('active');
  var parentListItem = e.target.parentElement;
  parentListItem.classList.add('active');

  var index = _toConsumableArray(parentListItem.parentElement.children).indexOf(parentListItem);

  var panel = _toConsumableArray(tabPanels).filter(function (el) {
    return el.getAttribute('data-index') == index;
  });

  panel[0].classList.add('active');
}

function toggleButtonWatcher(id) {
  var filmsWatchedFromLocalStorage = getArrayFromLocalStorage('filmsWatched');
  var filmsQueueFromLocalStorage = getArrayFromLocalStorage('filmsQueue');

  if (filmsWatchedFromLocalStorage !== null) {
    if (filmsWatchedFromLocalStorage.includes(id)) {
      watchedButtonAdd.classList.add('button-is-active');
      watchedButtonAdd.textContent = 'IN WATCHED';
    } else {
      watchedButtonAdd.classList.remove('button-is-active');
      watchedButtonAdd.textContent = 'ADD TO WATCHED';
    }
  }

  if (filmsQueueFromLocalStorage !== null) {
    if (filmsQueueFromLocalStorage.includes(id)) {
      queueButtonAdd.classList.add('button-is-active');
      queueButtonAdd.textContent = 'IN QUEUE';
    } else {
      queueButtonAdd.classList.remove('button-is-active');
      queueButtonAdd.textContent = 'ADD TO QUEUE';
    }
  }

  function getArrayFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem("".concat(key)));
  }
}

function runLocalStorage() {
  watchedButtonAdd.addEventListener('click', toggleToWatched);
  queueButtonAdd.addEventListener('click', toggleToQueue);

  function toggleToWatched() {
    var currentId = document.querySelector('.details-img').dataset.filmid;
    var filmsIdFromLocalStorage = getArrayFromLocalStorage('filmsWatched');

    if (filmsIdFromLocalStorage === null) {
      watchedButtonAdd.classList.add('button-is-active');
      watchedButtonAdd.textContent = 'IN WATCHED';
      localStorage.setItem('filmsWatched', JSON.stringify([currentId]));
    } else if (filmsIdFromLocalStorage.includes(currentId)) {
      watchedButtonAdd.classList.remove('button-is-active');
      watchedButtonAdd.textContent = 'ADD TO WATCHED';
      removeFilmIdFromArray('filmsWatched', currentId);
    } else {
      watchedButtonAdd.classList.add('button-is-active');
      watchedButtonAdd.textContent = 'IN WATCHED';
      addFilmIdArray('filmsWatched', currentId);
    }
  }

  function toggleToQueue() {
    var currentId = document.querySelector('.details-img').dataset.filmid;
    var filmsIdFromLocalStorage = getArrayFromLocalStorage('filmsQueue');

    if (filmsIdFromLocalStorage === null) {
      queueButtonAdd.classList.add('button-is-active');
      queueButtonAdd.textContent = 'IN QUEUE';
      localStorage.setItem('filmsQueue', JSON.stringify([currentId]));
    } else if (filmsIdFromLocalStorage.includes(currentId)) {
      queueButtonAdd.classList.remove('button-is-active');
      queueButtonAdd.textContent = 'ADD TO QUEUE';
      removeFilmIdFromArray('filmsQueue', currentId);
    } else {
      queueButtonAdd.classList.add('button-is-active');
      queueButtonAdd.textContent = 'IN QUEUE';
      addFilmIdArray('filmsQueue', currentId);
    }
  }

  function getArrayFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem("".concat(key)));
  }

  function setArrayToLocalStorage(key, arrayFilms) {
    localStorage.setItem("".concat(key), JSON.stringify(arrayFilms));
  }

  function addFilmIdArray(key, filmId) {
    var arrayFilms = getArrayFromLocalStorage(key);
    arrayFilms.push(filmId);
    setArrayToLocalStorage(key, arrayFilms);
  }

  function removeFilmIdFromArray(key, filmId) {
    var arrayFilms = getArrayFromLocalStorage(key);
    arrayFilms.splice(getArrayFromLocalStorage(key).indexOf(filmId), 1);
    setArrayToLocalStorage(key, arrayFilms);
  }
}
"use strict";

// realle time
document.querySelector('.footer-copyright-year').innerHTML = new Date().getFullYear();
'use strict';

var buttonsNumbers = [-1, 0, 1, 2, 3];
clickerInit();

function clickerInit() {
  var buttonLeftRef = document.querySelector('.pagination__button[data-index = "left"]');
  var buttonRightRef = document.querySelector('.pagination__button[data-index = "right"]');
  var buttonOneRef = document.querySelector('.pagination__button[data-index = "1"]');
  var buttonTwoRef = document.querySelector('.pagination__button[data-index = "2"]');
  var buttonThreeRef = document.querySelector('.pagination__button[data-index = "3"]');
  var buttonFourRef = document.querySelector('.pagination__button[data-index = "4"]');
  var buttonFiveRef = document.querySelector('.pagination__button[data-index = "5"]');
  document.querySelector('.pagination').addEventListener('click', function (element) {
    switch (element.target.dataset.index) {
      case 'left':
        buttonsNumbers = previousPage(buttonsNumbers);
        renderNumbers(buttonsNumbers);
        scrollToSectionHomePage();
        break;

      case 'right':
        buttonsNumbers = nextPage(buttonsNumbers);
        renderNumbers(buttonsNumbers);
        scrollToSectionHomePage();
        break;

      case '1':
        buttonsNumbers = previousTwoPage(buttonsNumbers);
        renderNumbers(buttonsNumbers);
        scrollToSectionHomePage();
        break;

      case '2':
        buttonsNumbers = previousPage(buttonsNumbers);
        renderNumbers(buttonsNumbers);
        scrollToSectionHomePage();
        break;

      case '3':
        break;

      case '4':
        buttonsNumbers = nextPage(buttonsNumbers);
        renderNumbers(buttonsNumbers);
        scrollToSectionHomePage();
        break;

      case '5':
        buttonsNumbers = nextTwoPage(buttonsNumbers);
        renderNumbers(buttonsNumbers);
        scrollToSectionHomePage();
        break;
    }

    if (Number(buttonThreeRef.textContent) > 1) {
      buttonLeftRef.classList.remove('pagination__button_disabled');
    } else {
      buttonLeftRef.classList.add('pagination__button_disabled');
    }

    paginationNavigation(buttonsNumbers);
  });
}

function renderNumbers(newButtonsNumbers) {
  Array.from(document.querySelectorAll('.pagination__number')).forEach(function (e, i) {
    e.textContent = newButtonsNumbers[i];

    if (e.textContent < 1) {
      e.textContent = '';
      e.classList.add('pagination__button_disabled');
    } else {
      e.classList.remove('pagination__button_disabled');
    }
  });
}

function nextPage(buttonsNumbers) {
  return buttonsNumbers.map(function (e) {
    return e + 1;
  });
}

function nextTwoPage(buttonsNumbers) {
  return buttonsNumbers.map(function (e) {
    return e + 2;
  });
}

function previousPage(buttonsNumbers) {
  return buttonsNumbers.map(function (e) {
    return e - 1;
  });
}

function previousTwoPage(buttonsNumbers) {
  return buttonsNumbers.map(function (e) {
    return e - 2;
  });
}

function dischargePaginationAndCreateMarkup() {
  buttonsNumbers = [-1, 0, 1, 2, 3];
  renderNumbers(buttonsNumbers);
  paginationNavigation(buttonsNumbers);
}

function scrollToSectionHomePage() {
  var mediaQuery = window.matchMedia('(max-width: 767px)');
  mediaQuery.addListener(handleTabletChange);
  handleTabletChange(mediaQuery);

  function handleTabletChange(e) {
    if (e.matches) {
      window.scrollTo({
        top: 250,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: 670,
        behavior: 'smooth'
      });
    }
  }
}
"use strict";

var toTopBtn = document.getElementById('to-top-button');
window.addEventListener('scroll', function () {
  if (document.documentElement.scrollTop > 300) toTopBtn.classList.add('show');else toTopBtn.classList.remove('show');
});
toTopBtn.addEventListener('click', function (e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var registrationButton = document.querySelector('.register-button');
var logInButton = document.querySelector('.log-in-button');
var openRegistrFormButton = document.querySelector('.button_registration');
var openLogInFormButton = document.querySelector('.button_logIn');
var signOutButton = document.querySelector('.button_signOut');
var registrationMail = document.querySelector('.registration .mail');
var registrationPass = document.querySelector('.registration .pass');
var logInMail = document.querySelector('.logIn .mail');
var logInPass = document.querySelector('.logIn .pass');
var formModal = document.querySelector('.form-modal');
var formButtonClose = document.querySelector('.form-button-close');
var registrationForm = document.querySelector('.registration');
var logInForm = document.querySelector('.logIn');
var user = localStorage['userId'];

function toggleButtonLogIn() {
  if (isLogIn()) {
    openLogInFormButton.innerHTML = "<svg class='button-icon'><use href='./images/sprite.svg#signout'></use></svg>";
  } else {
    openLogInFormButton.innerHTML = "<svg class='button-icon'><use href='./images/sprite.svg#login'></use></svg>";
  }
}

toggleButtonLogIn();
openRegistrFormButton.addEventListener('click', function (event) {
  event.preventDefault();
  openRegistrationModal();
});
openLogInFormButton.addEventListener('click', function (event) {
  event.preventDefault();

  if (isLogIn()) {
    signOut();
    openLogInFormButton.innerHTML = "<svg class='button-icon'><use href='../images/svg/sprite.svg#login'></use></svg>";
  } else {
    openLogINModal();
  }
});
registrationButton.addEventListener('click', function (event) {
  event.preventDefault();
  console.log(user);
  createUser(registrationMail.value, registrationPass.value);
  registrationMail.value = '';
  registrationPass.value = '';
});
logInButton.addEventListener('click', function (event) {
  event.preventDefault();
  console.log(user);
  logInUser(logInMail.value, logInPass.value);
  logInMail.value = '';
  logInPass.value = '';
});
formButtonClose.addEventListener('click', closeFormModal);
formModal.addEventListener('click', closeFormModal);
document.addEventListener('keydown', closeFormModal);

function openRegistrationModal() {
  formModal.classList.remove('hidden');
  body.classList.add('blocked-scroll');
  registrationForm.classList.remove('hidden');
}

function openLogINModal() {
  formModal.classList.remove('hidden');
  body.classList.add('blocked-scroll');
  logInForm.classList.remove('hidden');
}

function closeFormModal(event) {
  if (event.target.classList.contains('form-modal') || event.target.classList.contains('form-close') || event.target.nodeName === 'use' || event.key === 'Escape') {
    body.classList.remove('blocked-scroll');
    formModal.classList.add('hidden');
    registrationForm.classList.add('hidden');
    logInForm.classList.add('hidden');
  }

  toggleButtonLogIn();
}

function createUser(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function (userCredential) {
    // Signed in
    user = userCredential.user.uid;
    console.log('register complite, user:', user); // ...
  }).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log('register error:', errorCode, errorMessage); // ..
  });
}

function logInUser(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password).then(function (userCredential) {
    // Signed in
    user = userCredential.user.uid;
    localStorage.setItem('userId', user);
    console.log('logIn user:', user); // ...
  }).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log('login error:', errorCode, errorMessage);
  });
}

function signOut() {
  user = undefined;
  localStorage.removeItem('userId');
} //data base


function writeUserWatchedFilm(filmId) {
  firebase.database().ref('users/' + user + '/watched').update(_defineProperty({}, filmId, true));
}

function writeUserQueueFilm(filmId) {
  firebase.database().ref('users/' + user + '/queue').update(_defineProperty({}, filmId, true));
}

function removeUserWatchedFilm(filmId) {
  firebase.database().ref('users/' + user + '/watched/' + filmId).remove();
}

function removeUserQueueFilm(filmId) {
  firebase.database().ref('users/' + user + '/queue/' + filmId).remove();
}

var userWatchedRef = firebase.database().ref('users/' + user + '/watched/');

function updateUserWatched() {
  userWatchedRef.on('value', function (snapshot) {
    if (snapshot.val()) {
      localStorage.setItem('filmsWatched', JSON.stringify(Object.keys(snapshot.val())));
    } else {
      localStorage.removeItem('filmsWatched');
    }
  });
}

var userQueueRef = firebase.database().ref('users/' + user + '/queue/');

function updateUserQueue() {
  userQueueRef.on('value', function (snapshot) {
    if (snapshot.val()) {
      localStorage.setItem('filmsQueue', JSON.stringify(Object.keys(snapshot.val())));
    } else {
      localStorage.removeItem('filmsQueue');
    }
  });
}

updateUserQueue();
updateUserWatched();

function isLogIn() {
  return user !== undefined;
} //for library page


if (localStorage.getItem('activePage') === 'activeLibraryPage') {
  activeLibraryPage();
  drawWatchedFilmList();
  console.log(libraryGallery);
  libraryGallery.addEventListener('click', function (event) {
    console.log('click');

    if (event.target.nodeName === 'IMG') {
      var id = event.target.dataset.id;
      activateDetailsPage(id);
      toggleButtonWatcher(id);
    }
  });
}
"use strict";

var collaborators = [{
  src: './images/Margot_Robbie_cr.jpg',
  alt: 'Margot Robbie',
  collaboratorName: 'Yuliia',
  filmName: 'alibi.com'
}, {
  src: './images/Natalie_Portman_cr.jpg',
  alt: 'Natalie Portman',
  collaboratorName: 'Valentina',
  filmName: 'Leon: The Professional'
}, {
  src: './images/Charlie_Hunnam.png',
  alt: 'Charlie Hunnam',
  collaboratorName: 'Max',
  filmName: 'Escape from Pretoria'
}, {
  src: './images/Til_Schweiger_cr.jpg',
  alt: 'Til Schweiger',
  collaboratorName: 'Mikhail',
  filmName: 'Knockin` on Heaven`s Door'
}, {
  src: './images/AbdulovA.jpg',
  alt: 'Aleksandr Abdulov',
  collaboratorName: 'Dmytro',
  filmName: 'Charodei'
}, {
  src: './images/Johnny_Depp.jpg',
  alt: 'Johnny Depp',
  collaboratorName: 'Dimas',
  filmName: 'Fear and Loathing in Las Vegas'
}, {
  src: './images/Adam_Sandler.jpg',
  alt: 'Adam Sandler',
  collaboratorName: 'Victor',
  filmName: 'Big Daddy'
}, {
  src: './images/Tim_Robbins.jpg',
  alt: 'Tim Robbins',
  collaboratorName: 'Sergey',
  filmName: 'The Shawshank Redemption'
}];
"use strict";

function renderCollaboratorCard(obj) {
  return "\n    <li class=\"modal-our_team_item\">\n        <div class=\"modal-our_tem_card-wrapper\">\n            <div class=\"modal_window-thumb\">\n                <img class=\"modal_window-img\" src=\"".concat(obj.src, "\" alt=\"").concat(obj.alt, "\">\n            </div>\n            <p class=\"modal-developer_name\">").concat(obj.collaboratorName, "</p>\n            <button class=\"modal-card_btn\">\n                <span class=\"modal-card_btn_text\">\n                    ").concat(obj.filmName, "\n                </span>\n            </button>\n        </div>\n    </li>\n    ");
}

;
"use strict";

function renderDetailFilmModal(movie) {
  console.log(movie);
  return "\n    <div id=\"js-detailsPage\" class=\"details-container details-page hidden\">\n  <div class=\"details-wrapper\">\n    <img\n      id=\"js-previewImg\"\n      class=\"details-img\"\n      src=\"https://image.tmdb.org/t/p/w500/".concat(movie.poster_path ? movie.poster_path : './images/plug.jpg', "\"\n      alt=\"film-preview\"\n      width=\"100%\"\n      height=\"100%\"\n      data-filmId=").concat(movie.id, "\n    />\n    <div class=\"details-information\">\n      <button class=\"button-close close-details\">\n        <svg class=\"details-close\">\n          <use href=\"./images/symbol-defs.svg#close\"></use>\n        </svg>\n      </button>\n      <h1 class=\"details-title\">").concat(movie.title ? movie.title : 'a fistful of lead', "</h1>\n      <div class=\"details-inf\">\n        <ul class=\"details-inf-list\">\n          <li>Vote / Votes</li>\n          <li>Popularity</li>\n          <li>Original Title</li>\n          <li>Genre</li>\n        </ul>\n        <ul class=\"details-inf-list details-inf-list-secondary\">\n          <li>\n            <span id=\"js-detailsVote\" class=\"text-orange\">").concat(movie.vote_average ? movie.vote_average : '0.0', "</span>\n            <span id=\"js-detailsVotes\">/").concat(movie.vote_count ? movie.vote_count : '0000', "</span>\n          </li>\n          <li id=\"details-popularity\">").concat(movie.popularity ? movie.popularity : '100.2', "</li>\n          <li id=\"details-originalTitle\">").concat(movie.original_title ? movie.original_title : 'a fistful of lead', "</li>\n          <li id=\"details-genre\">Western</li>\n        </ul>\n      </div>\n\n      <div class=\"tabs-container\">\n        <ul class=\"tabs\">\n          <li class=\"active\">\n            <a href=\"\">ABOUT</a>\n          </li>\n          <li>\n            <a href=\"\">TRAILER</a>\n          </li>\n        </ul>\n        <div class=\"tabs-content\">\n          <div\n            id=\"js-detailsText\"\n            class=\"tabs-panel active\"\n            data-index=\"0\"\n          >").concat(movie.overview, "</div>\n          <div\n            id=\"js-movieTrailer\"\n            class=\"movie-trailer tabs-panel\"\n            data-index=\"1\"\n          ></div>\n          <div class=\"tabs-panel\" data-index=\"2\">\n            <p></p>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"details-button-list\">\n        <button class=\"details-button button-add-to-watch\">\n          add to Watched\n        </button>\n        <button class=\"details-button button-add-to-queue\">add to queue</button>\n      </div>\n    </div>\n  </div>\n</div>\n    ");
}
"use strict";

function createModalWindow() {
  return "\n    <div class=\"modal\" role=\"dialog\" aria-labelledby=\"Modal_Title\" aria-describedby=\"Modal_Description\" aria-hidden=\"true\" >\n    <div class=\"modal-wrap\">\n        <div class=\"modal-content\">\n             <button class=\"button-close close-modal\">\n                <svg class=\"details-close\">\n                    <use href=\"./images/symbol-defs.svg#close\"></use>\n                </svg>\n            </button>\n            <h2 id=\"modal_Title\">Our team</h2>\n            <ul class=\"modal-our_team_list\">\n                \n            </ul> \n        </div>\n    </div>\n  </div>\n</div>\n    ";
}