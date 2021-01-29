const myLibraryLink = document.querySelector('.link-library');
const myLibraryPage = document.querySelector('.my-library-page');
const myLibraryHeaderDiv = document.querySelector(".my-library-header-div");
const header = document.querySelector('header');
const homePageLink = document.querySelector('.link-header');
const homePageLogo = document.querySelector('.link-logo');

myLibraryLink.addEventListener('click', activeLibraryPage);
homePageLink.addEventListener('click',activeHomePage);
homePageLogo.addEventListener('click',activeHomePage);

function activeLibraryPage() {
  myLibraryLink.classList.add('current');
  homePageLink.classList.remove('current');
  homePage.classList.add('hidden');
  myLibraryPage.classList.remove('hidden');
  searchField.classList.add('hidden');
  header.classList.remove('header');
  header.classList.add('my-library-header');
  myLibraryHeaderDiv.classList.remove('hidden');
  headerError.innerHTML="";
}

function activeHomePage() {
  createStartupMarkup();
  myLibraryLink.classList.remove('current');
  homePageLink.classList.add('current');
  homePage.classList.remove('hidden');
  myLibraryPage.classList.add('hidden');
  searchField.classList.remove('hidden');
  header.classList.add('header');
  header.classList.remove('my-library-header');
  myLibraryHeaderDiv.classList.add('hidden');
}
