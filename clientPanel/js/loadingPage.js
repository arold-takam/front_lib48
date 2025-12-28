document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');

    const titleH1 = document.querySelector('.loading h1');
    const descP = document.querySelector('.loading p');
    const iconImg = document.querySelector('.loading figure img');

    // 1. Mise à jour du message
    if (message) {
        descP.textContent = message;
    }

    // 2. Gestion visuelle de l'échec (optionnel mais réaliste)
    if (status === 'error') {
        titleH1.textContent = "Échec de l'emprunt";
        titleH1.style.color = "red";
        iconImg.src = "../ressources/images/errorBtn.png"; // Assure-toi d'avoir cette icône
    }

    // 3. Redirection automatique après 500ms
    setTimeout(() => {
        // Redirection vers le suivi des emprunts
        window.location.href = "./borrowTrack.html";
    }, 500);
});