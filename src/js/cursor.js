const mouseCursor = document.getElementById('cursor');

let navLinks = document.querySelectorAll('a');
let button = document.querySelectorAll('button');
const body = document.querySelector('body');

window.addEventListener('mousemove', cursor);
function cursor(e) {
  mouseCursor.style.top = e.pageY + 'px';
  mouseCursor.style.left = e.pageX + 'px';
}

navLinks.forEach(link => {
  link.addEventListener('mouseleave', () => {
    mouseCursor.classList.remove('cursor');
    mouseCursor.classList.add('cursor-n');
    body.classList.remove('cursor-none');
  });
  link.addEventListener('mouseover', () => {
    mouseCursor.classList.add('cursor');
    mouseCursor.classList.remove('cursor-n');
    body.classList.add('cursor-none');
  });
});
button.forEach(button => {
  button.addEventListener('mouseleave', () => {
    mouseCursor.classList.remove('cursor');
    mouseCursor.classList.add('cursor-n');
    body.classList.remove('cursor-none');
  });
  button.addEventListener('mouseover', () => {
    mouseCursor.classList.add('cursor');
    mouseCursor.classList.remove('cursor-n');
    body.classList.add('cursor-none');
  });
});
