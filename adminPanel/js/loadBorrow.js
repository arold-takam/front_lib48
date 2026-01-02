import {API_BASE_URL} from "../config.js";

document.addEventListener('DOMContentLoaded', async () => {
    const borrowContainer = document.querySelector('.borrowLine');
    const auth = localStorage.getItem('auth');

    if (!auth) {
        window.location.replace("login.html");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/borrowBook/get/all`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });

        const borrows = await response.json();
        borrowContainer.innerHTML = '';

        if (borrows.length === 0){
            borrowContainer.innerHTML = '<p style="font-size: large; color: red">No borrows found.</p>';
            return;
        }

        for (const b of borrows) {
            const titreLivre = b.BookTitle;
            let bookId = "#";
            let statusDispo = b.status;

            // --- LOGIQUE DE RÉCUPÉRATION DE L'ID ---
            try {
                // On cherche le livre par son titre pour obtenir son ID
                const bookRes = await fetch(`${API_BASE_URL}/books/get/byTitle?title=${encodeURIComponent(titreLivre)}`, {
                    headers: { 'Authorization': `Basic ${auth}` }
                });
                if (bookRes.ok) {
                    const bookData = await bookRes.json();
                    bookId = bookData.id; // On récupère l'ID réel
                }
            } catch (e) {
                console.warn(`Impossible de trouver l'ID pour : ${titreLivre}`);
            }

            // 2. Création de la ligne avec le vrai ID
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
        borrowContainer.innerHTML = '<ul class="infoLine"><li>Erreur technique.</li></ul>';
    }
});