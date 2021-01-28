movieGallery.addEventListener('click', event => {
  if (event.target.nodeName === 'IMG') {
    let id = event.target.dataset.id;
    activateDetailsPage(id);
  }
});

detailsButtonClose.addEventListener('click', closeModal);
detailsModal.addEventListener('click', closeModal);
document.addEventListener("keydown", closeModal);

function closeModal(event) {
  if(event.target.classList.contains("details-container")
  ||event.target.classList.contains("details-close")
  ||event.target.nodeName==="use"
  ||event.key === "Escape"){
    body.classList.remove("blocked-scroll");
    detailsModal.classList.add('hidden');
  }
}

function activateDetailsPage(id) {
  let selectedMovie = renderedMovies.find(movie => movie.id === Number(id));

  console.log(selectedMovie);

  openMovieDetails(selectedMovie);
}

function openMovieDetails(selectedMovie) {
  body.classList.add("blocked-scroll");
  detailsModal.classList.remove('hidden');
  if(selectedMovie.poster_path){
  detailsPreviewImg.setAttribute(
    'src',
    `https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`,
  );
  }else{
    detailsPreviewImg.setAttribute(
      'src',
      '../images/plug.jpg',
    );
  }
  detailsTitle.textContent = selectedMovie.title;
  detailsDescription.textContent = selectedMovie.overview;
  detailsPopularuty.innerHTML = selectedMovie.popularity;
  detailsOriginalTitle.innerHTML = selectedMovie.original_title;
}
