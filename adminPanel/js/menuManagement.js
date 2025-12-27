document.addEventListener('DOMContentLoaded', async () => {
    // 1. Sécurité Pragmatique
    const auth = localStorage.getItem('auth');
    const userMail = localStorage.getItem('userMail');

    if (!auth) {
        window.location.replace("login.html");
        return;
    }

    // 2. Gestion du Menu (Ton code existant adapté)
    const asideSection = document.querySelector('aside');
    const menuBtn = document.querySelector('.menuIcon');
    const profile = asideSection.querySelector('.profile');
    const separator = asideSection.querySelector('.separator');
    const menu = asideSection.querySelector('.menu');
    const footer = asideSection.querySelector('footer');

    let isMenuActive = false;

    menuBtn.addEventListener('click', () => {
        if (!isMenuActive) {
            asideSection.style.width = '4%';
            menuBtn.innerHTML = '<img src="../ressources/images/menuOpen.png" alt="menu open icon">';
            [profile, separator, menu, footer].forEach(el => el.style.display = 'none');
            isMenuActive = true;
        } else {
            asideSection.style.width = '32%';
            menuBtn.innerHTML = '<img src="../ressources/images/menuClose.png" alt="menu close icon">';
            [profile, separator, menu, footer].forEach(el => el.style.display = 'flex');
            isMenuActive = false;
        }
    });

    // 3. Chargement dynamique du Profil Admin (Aside)
    try {
        const response = await fetch(`http://localhost:8080/api/user/get/byMail?mail=${userMail}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });

        if (response.ok) {
            const admin = await response.json();
            profile.querySelector('h1').textContent = admin.name;
            profile.querySelector('p').textContent = admin.mail;
            localStorage.setItem('userId', admin.id); // Pragmatique pour les futurs updates
        }
    } catch (err) {
        console.error("Erreur sidebar:", err);
    }
});