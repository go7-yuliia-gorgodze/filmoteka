let detailsModal;
let detailsButtonClose;
let watchedButtonAdd;
let queueButtonAdd;


function openMovieDetails(selectedMovie) {

    // console.log(selectedMovie);
    // toTopBtn.classList.remove('show');
    document.body.insertAdjacentHTML('beforeend', renderDetailFilmModal());

    detailsModal = document.querySelector('#js-detailsPage');

    detailsButtonClose = document.querySelector('.button-close');
    console.log(detailsButtonClose);
    console.log(detailsModal);
    timeout = setTimeout(() => detailsModal.classList.add('modal--active'), 500);

    shadowShow();

    body.classList.add('blocked-scroll');

    detailsModal.classList.remove('hidden');
    tabLinks = document.querySelectorAll('.tabs a');
    tabPanels = document.querySelectorAll('.tabs-panel');

    let tabLinks;
    let tabPanels;

    for (let el of tabLinks) {
        el.addEventListener('click', e => {
            e.preventDefault();

            document.querySelector('.tabs li.active').classList.remove('active');
            document.querySelector('.tabs-panel.active').classList.remove('active');

            const parentListItem = el.parentElement;
            parentListItem.classList.add('active');
            const index = [...parentListItem.parentElement.children].indexOf(
                parentListItem,
            );

            const panel = [...tabPanels].filter(
                el => el.getAttribute('data-index') == index,
            );
            panel[0].classList.add('active');
        });
    }


    detailsButtonClose.addEventListener('click', closeModal);
    // detailsModal.addEventListener('click', closeModal);
    document.addEventListener('keydown', closeModal);

    if (selectedMovie.poster_path) {
        // const detailsPreviewImg
        document.querySelector('#js-previewImg').setAttribute(
            'src',
            `https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`,
        );
    } else {
        document.querySelector('#js-previewImg').setAttribute('src', '../images/plug.jpg');
    }
    document.querySelector('#js-detailsText').textContent = selectedMovie.overview;
    fetchMovies(selectedMovie.id).then(res => {
        // movieTrailer
        console.log("res ", res);
        const markup = `
    <iframe

      src="https://www.youtube.com/embed/${res}"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;
        document.getElementById('js-movieTrailer').insertAdjacentHTML('beforeend', markup);
    })();
    watchedButtonAdd = document.querySelector('.button-add-to-watch');
    queueButtonAdd = document.querySelector('.button-add-to-queue');

    // const detailsModal = document.querySelector('#js-detailsPage');

    // const detailsTitle
    document.querySelector('.details-title').textContent = selectedMovie.title;
    // const detailsDescription

    // const detailsPopularuty =
    document.querySelector('#details-popularity').innerHTML = selectedMovie.popularity;
    document.querySelector('#details-originalTitle').textContent = selectedMovie.original_title;
    document.querySelector('#js-detailsVote').textContent = selectedMovie.vote_average;
    document.querySelector('#js-detailsVote').textContent = `/ ${selectedMovie.vote_count}`;
    // const detailsGenre =
    document.querySelector('#details-genre').textContent = String(
        genres
            .filter(el =>
                selectedMovie.genre_ids.find(movie => el.id === movie) ? true : false,
            )
            .reduce((acc, item) => acc + `${item.name}, `, ''),
    ).slice(0, -2);;
    // const detailsOriginalTitle =
    document.querySelector('#details-originalTitle').textContent = selectedMovie.original_title;;
    // const detailsButtonClose = document.querySelector('.button-close');
    // const movieTrailer = document.getElementById('js-movieTrailer');



    // detailsTitle.textContent = selectedMovie.title;
    // detailsDescription.textContent = selectedMovie.overview;
    // detailsPopularuty.innerHTML = selectedMovie.popularity;
    // document.querySelector('#details-originalTitle').textContent = selectedMovie.original_title;
    // detailsVote.textContent = selectedMovie.vote_average;
    // detailsVotes.textContent = `/ ${selectedMovie.vote_count}`;
    // detailsGenre.textContent = String(
    //     genres
    //         .filter(el =>
    //             selectedMovie.genre_ids.find(movie => el.id === movie) ? true : false,
    //         )
    //         .reduce((acc, item) => acc + `${item.name}, `, ''),
    // ).slice(0, -2);


};

function closeModal(event) {
    if (
        event.target.classList.contains('details-container') ||
        event.target.classList.contains('details-close') ||
        event.target.nodeName === 'use' ||
        event.key === 'Escape'
    ) {
        // toTopBtn.classList.add('show');
        body.classList.remove('blocked-scroll');
        detailsModal.classList.add('hidden');
        // stop player youtube
        document.querySelector('iframe').src = '';
    }
    body.removeChild(detailsModal);
    body.removeChild(shadow);

}

let selectedMovie;

