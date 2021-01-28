'use strict';
(function paginationClicker() {
  clickerInit(nextPage, previousPage);
  let buttonsNumbers = [1, 2, 3, 4, 5];
  function clickerInit() {
    document.querySelector('.pagination').addEventListener('click', element => {
      console.log(element.target.dataset.index);
      switch (element.target.dataset.index) {
        case 'left':
          buttonsNumbers = previousPage(buttonsNumbers);
          renderNumbers(buttonsNumbers);
          break;

        case 'right':
          buttonsNumbers = nextPage(buttonsNumbers);
          console.log(buttonsNumbers);
          renderNumbers(buttonsNumbers);
          break;

        case '1':
          break;

        case '2':
          buttonsNumbers = previousPage(buttonsNumbers);
          renderNumbers(buttonsNumbers);
          break;

        case '3':
          break;

        case '4':
          buttonsNumbers = nextPage(buttonsNumbers);
          renderNumbers(buttonsNumbers);
          break;

        case '5':
          break;
      }
    });
  }
  function renderNumbers(buttonsNumbers) {
    Array.from(document.querySelectorAll('.pagination__number')).forEach(
      (e, i) => {
        console.dir(e.textContent, i, buttonsNumbers);
        e.textContent = buttonsNumbers[i];
      },
    );
  }
  function nextPage(buttonsNumbers) {
    return buttonsNumbers.map(e => {
      return e + 1;
    });
  }
  function previousPage(buttonsNumbers) {
    return buttonsNumbers.map(e => {
      return e - 1;
    });
  }
  console.log(document.querySelectorAll('.pagination__number'));
})();
