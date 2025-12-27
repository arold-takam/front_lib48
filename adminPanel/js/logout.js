document.addEventListener('DOMContentLoaded', () => {
    const logoutForm = document.querySelector('.mainSect');

    logoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Destruction des données de session
        localStorage.clear();

        // 2. Redirection vers l'entrée du programme
        // replace() est mieux que href pour empêcher le bouton "retour" du navigateur
        window.location.replace("../index.html");
    });
});