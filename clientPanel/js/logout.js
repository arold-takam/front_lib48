document.addEventListener('DOMContentLoaded', () => {
    // Ciblage de ton bouton spécifique
    const logoutBtn = document.querySelector('.out');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Prompt de confirmation réaliste
            const confirmLogout = confirm("Voulez-vous vraiment vous déconnecter ?");

            if (confirmLogout) {
                // 2. Nettoyage complet des traces de session
                sessionStorage.clear();
                localStorage.removeItem('userToken');
                localStorage.removeItem('userMail');

                // 3. Redirection immédiate vers le login
                window.location.href = "./login.html";
            }
        });
    }
});