'use strict';
let buttonsNumbers = [-1, 0, 1, 2, 3];
clickerInit();

function clickerInit() {
    const buttonLeftRef = document.querySelector(
        '.pagination__button[data-index = "left"]',
    );
    const buttonRightRef = document.querySelector(
        '.pagination__button[data-index = "right"]',
    );
    const buttonOneRef = document.querySelector(
        '.pagination__button[data-index = "1"]',
    );
    const buttonTwoRef = document.querySelector(
        '.pagination__button[data-index = "2"]',
    );
    const buttonThreeRef = document.querySelector(
        '.pagination__button[data-index = "3"]',
    );
    const buttonFourRef = document.querySelector(
        '.pagination__button[data-index = "4"]',
    );
    const buttonFiveRef = document.querySelector(
        '.pagination__button[data-index = "5"]',
    );
    document.querySelector('.pagination').addEventListener('click', element => {
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
    Array.from(document.querySelectorAll('.pagination__number')).forEach(
        (e, i) => {
            e.textContent = newButtonsNumbers[i];
            if (e.textContent < 1) {
                e.textContent = '';
                e.classList.add('pagination__button_disabled');
            } else {
                e.classList.remove('pagination__button_disabled');
            }
        },
    );
};

function nextPage(buttonsNumbers) {
    return buttonsNumbers.map(e => {
        return e + 1;
    });
};

function nextTwoPage(buttonsNumbers) {
    return buttonsNumbers.map(e => {
        return e + 2;
    });
};

function previousPage(buttonsNumbers) {
    return buttonsNumbers.map(e => {
        return e - 1;
    });
};

function previousTwoPage(buttonsNumbers) {
    return buttonsNumbers.map(e => {
        return e - 2;
    });
};

function dischargePaginationAndCreateMarkup() {
    buttonsNumbers = [-1, 0, 1, 2, 3];
    renderNumbers(buttonsNumbers);
    paginationNavigation(buttonsNumbers);
};

function scrollToSectionHomePage() {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    mediaQuery.addListener(handleTabletChange);
    handleTabletChange(mediaQuery);

    function handleTabletChange(e) {
        if (e.matches) {
            window.scrollTo({
                top: 250,
                behavior: 'smooth',
            });
        } else {
            window.scrollTo({
                top: 670,
                behavior: 'smooth',
            });
        };
    };
};