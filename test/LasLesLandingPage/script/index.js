const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const activeClass = 'is-show';

toggle.addEventListener('click', function () {
    console.log(menu.classList);
    menu.classList.add(activeClass);
})

toggle.addEventListener('blur', function () {
    console.log("Thang");
    menu.classList.remove(activeClass);
})