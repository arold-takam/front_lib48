document.addEventListener('DOMContentLoaded', async () => {
    const borrowContainer = document.querySelector('.borrowLine');
    const auth = btoa('toto@gmail.com:toto237');

    // Idée réaliste : on récupère l'ID du gérant ou de l'abonne connecté
    const currentUserId = 1;

    try {
        // Pour l'admin, on récupère TOUS les emprunts via le gerantID
        const response = await fetch(`http://localhost:8080/api/borrowBook/get/all`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });

        const borrows = await response.json();
        borrowContainer.innerHTML = ''; // Nettoyage des lignes fictives
        if (borrows.length === 0){
            borrowContainer.innerHTML = '<p style="font-size: large; color: red">No borrows found.</p>';
        }

        borrows.forEach(b => {
            // 1. Accès sécurisé aux données imbriquées
            const livre = b.BookTitle;
            const titreLivre = livre;
            // TODO: Intergrer la recuperation des ID.

            // 2. Gestion du statut (boolean vers texte)
            const statutTexte = (livre && livre.estDisponible) ? "DISPONIBLE" : "EMPRUNTÉ";
            const statutClasse = statutTexte.toLowerCase();

            // 3. Gestion de la date (dateEmprunt dans ton modèle Java)
            const dateStr = b.dateEmprunt ? new Date(b.dateEmprunt).toLocaleDateString('fr-FR') : 'Date inconnue';

            // 4. Création de l'élément cible
            const ul = document.createElement('ul');
            ul.className = 'infoLine';

            ul.innerHTML = `
        <li><a href="../html/aDashBookDetails.html?id=${bookId}">${titreLivre}</a></li>
        <li class="${statutClasse}">${statutTexte}</li>
        <li>Emprunt de ${b.delaiEmprunt} jours</li>
        <li>${dateStr}</li>
    `;

            borrowContainer.appendChild(ul);
        });

    } catch (err) {
        console.error("Erreur Emprunts:", err);
        borrowContainer.innerHTML = '<ul class="infoLine"><li>Erreur de chargement des emprunts</li></ul>';
    }
});