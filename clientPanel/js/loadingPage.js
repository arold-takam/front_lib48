document.addEventListener('DOMContentLoaded', () => {
    // 1. Protection de la page
    const AUTH_TOKEN = sessionStorage.getItem('userToken') || localStorage.getItem('userToken');

    if (!AUTH_TOKEN) {
        window.location.href = "./login.html";
        return;
    }

    // 2. Récupération des paramètres (Ta logique existante)
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');

    const titleH1 = document.querySelector('.loading h1');
    const descP = document.querySelector('.loading p');
    const iconImg = document.querySelector('.loading figure img');

    // 3. Mise à jour dynamique
    if (message) {
        descP.textContent = decodeURIComponent(message);
    }

    if (status === 'error') {
        titleH1.textContent = "Échec de l'action";
        titleH1.style.color = "#FF4B4B"; // Rouge pragmatique pour l'erreur
        // iconImg.src = "../ressources/images/error.png";
    }

    // 4. Redirection automatique courte (500ms comme demandé)
    setTimeout(() => {
        // Retour au profil pour voir les changements (Emprunts ou Infos)
        window.location.href = "./profile.html";
    }, 500);
});