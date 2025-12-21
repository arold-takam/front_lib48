const menuBtn = document.querySelector('.openMenu');
const menu = document.querySelector('.menu');
const menuClose = document.querySelector('.close');

menuBtn.addEventListener('click', () => {
    menu.classList.add('active');
});

menuClose.addEventListener('click', () => {
    menu.classList.remove('active');
})