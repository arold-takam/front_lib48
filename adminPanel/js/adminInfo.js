document.addEventListener('DOMContentLoaded', async () => {
    const auth = localStorage.getItem('auth');
    const userMail = localStorage.getItem('userMail'); // On utilise le mail stocké au login

    if (!auth) {
        window.location.replace("login.html");
        return;
    }

    try {
        // RÉALISME : On récupère le profil via le mail (ou nom) car l'ID est inconnu au départ
        const response = await fetch(`http://localhost:8080/api/user/get/byMail?mail=${userMail}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });

        if (!response.ok) throw new Error("Profil introuvable");

        const admin = await response.json();

        // PRAGMATISME : Maintenant qu'on a le profil, on stocke l'ID pour les prochaines fois !
        localStorage.setItem('userId', admin.id);

        // 1. Mapping de la section centrale (ce que tu avais déjà)
        const bElements = document.querySelectorAll('.listInfo b');
        if (bElements.length >= 2) {
            bElements[0].textContent = admin.name;
            bElements[1].textContent = admin.mail;
        }

    // 2. AJUSTEMENT : Mapping de la section Profil (Sidebar / Aside)
            const sidebarName = document.querySelector('.profile .info h1');
            const sidebarMail = document.querySelector('.profile .info p');

            if (sidebarName) sidebarName.textContent = admin.name;
            if (sidebarMail) sidebarMail.textContent = admin.mail;

        // Mapping des informations
        const cElements = document.querySelectorAll('.listInfo b');
        if (cElements.length >= 2) {
            cElements[0].textContent = admin.name;
            cElements[1].textContent = admin.mail;
        }

        // Gestion de l'icône "œil"
        const eyeIcon = document.querySelector('.eye img');
        eyeIcon?.addEventListener('click', () => {
            alert("Par mesure de sécurité, le mot de passe ne peut pas être affiché en clair.");
        });

    } catch (err) {
        console.error("Erreur profil admin:", err);
        // Si le profil est vraiment introuvable, retour au login
        // window.location.replace("login.html");
    }
});