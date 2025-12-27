// security.js
(function() {
    const auth = localStorage.getItem('auth');

    // Si l'utilisateur n'est pas connecté et n'est pas sur la page login
    if (!auth && !window.location.pathname.includes('login.html')) {
        console.warn("Accès refusé : redirection vers le login.");
        window.location.href = "login.html";
    }
})();