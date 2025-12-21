
const asideSection = document.querySelector('aside');
const mainSection = document.querySelector('main');
const menuBtn = document.querySelector('.menuIcon');

const profile = asideSection.querySelector('.profile');
const separator = asideSection.querySelector('.separator');
const menu = asideSection.querySelector('.menu');
const footer = asideSection.querySelector('footer');


console.log(asideSection, mainSection, menuBtn);

let isMenuActive = false;

menuBtn.addEventListener('click', () => {
    if (!isMenuActive) {
        asideSection.style.width = '4%';
        menuBtn.innerHTML = '<img src="../ressources/images/menuOpen.png" alt="menu close icon">';

        profile.style.display = 'none';
        separator.style.display = 'none';
        menu.style.display = 'none';
        footer.style.display = 'none';

        isMenuActive = true;
    }else {
        asideSection.style.width = '32%';
        menuBtn.innerHTML = '<img src="../ressources/images/menuClose.png" alt="menu close icon">';

        profile.style.display = 'flex';
        separator.style.display = 'flex';
        menu.style.display = 'flex';
        footer.style.display = 'flex';

        isMenuActive = false;
    }
});
