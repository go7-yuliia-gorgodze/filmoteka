const genres = () => {
  const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&page=${pageNumber}&include_adult=false&query=${inputValue}`;
  return fetch(apiUrl + '/genres')
    .then(response => response.json())
    .then(data => {
      const res = data.results;
      return res;
    });
};

async function getGenres() {
  try {
      const res = await genres();
      return res.filter(g => g);
  }
  catch(e) {
      console.log('err', e);
  }  
  console.log(res);   
}

