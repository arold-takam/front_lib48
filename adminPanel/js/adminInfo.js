document.addEventListener('DOMContentLoaded', async () => {
    // Note pragmatique : Il faut connaître l'ID de l'admin.
    // On suppose qu'il est stocké dans le localStorage après le login.
    const adminId = localStorage.getItem('userId') || 1;
    const auth = btoa('toto@gmail.com:toto237');

    try {
        const response = await fetch(`http://localhost:8080/api/user/get/${adminId}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });

        if (!response.ok) throw new Error("Profil introuvable");
        const admin = await response.json();

        // Mapping des informations
        const bElements = document.querySelectorAll('.listInfo b');

        bElements[0].textContent = admin.name;         // Nom d'utilisateur
        bElements[1].textContent = admin.mail;         // Email
        // Le mot de passe reste masqué par sécurité (********)

        // Gestion de l'icône "œil" pour la mémoire visuelle
        const eyeIcon = document.querySelector('.eye img');
        eyeIcon.addEventListener('click', () => {
            alert("Par mesure de sécurité, le mot de passe ne peut pas être affiché en clair.");
        });

    } catch (err) {
        console.error("Erreur profil admin:", err);
    }
});