const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const activeClass = 'is-show';

toggle.addEventListener('click', function () {
    menu.classList.add(activeClass);
})

toggle.addEventListener('blur', function () {
    menu.classList.remove(activeClass);
})