searchField.addEventListener('submit', event => {
  event.preventDefault();

  inputValue = event.currentTarget.elements[0].value;
  console.log(inputValue);
  searchField.reset();
  createMarkup();
});

function fetchFilms() {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&page=${pageNumber}&include_adult=false&query=${inputValue}`,
  )
    .then(response => response.json())
    .then(data => {
      return data;
    });
}

function fetchPopularFilms() {
  return fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`,
  )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    });
}
