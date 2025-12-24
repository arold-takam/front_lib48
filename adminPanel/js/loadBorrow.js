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

        // On utilise 'for...of' car 'forEach' ne gère pas bien l'asynchrone (await)
        for (const b of borrows) {
            const titreLivre = b.BookTitle;
            let bookId = "#"; // Valeur par défaut si non trouvé
            let statusDispo = "INCONNU";

            try {
                // 1. Appel au controller via le titre du livre
                const response = await fetch(`http://localhost:8080/api/books/get/byTitle?title=${encodeURIComponent(titreLivre)}`, {
                    headers: { 'Authorization': `Basic ${auth}` }
                });

                if (response.ok) {
                    const bookData = await response.json();
                    bookId = bookData.id; // On récupère l'ID
                    statusDispo = bookData.estDisponible ? "TERMINE" : "EN COURS";
                }
            } catch (err) {
                console.error("Erreur lors de la récupération de l'ID du livre:", err);
            }

            // 2. Création de la ligne avec l'ID récupéré
            const ul = document.createElement('ul');
            ul.className = 'infoLine';

            ul.innerHTML = `
        <li><a href="../html/aDashBookDetails.html?id=${bookId}">${titreLivre}</a></li>
        <li class="${statusDispo.toLowerCase()}">${statusDispo}</li>
        <li>Emprunt de ${b.delaiEmprunt} jours</li>
        <li>${new Date(b.dateEmprunt).toLocaleDateString('fr-FR')}</li>
    `;

            borrowContainer.appendChild(ul);
        }

    } catch (err) {
        console.error("Erreur Emprunts:", err);
        borrowContainer.innerHTML = '<ul class="infoLine"><li>Erreur de chargement des emprunts</li></ul>';
    }
});