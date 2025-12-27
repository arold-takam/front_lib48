document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const catId = params.get("id");
    const auth = btoa('toto@gmail.com:toto237');

    if (!catId) return;

    try {
        // 1. Récupérer les infos de la catégorie pour le titre (Cible 1)
        const catResponse = await fetch(`http://localhost:8080/api/categories/get/All`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const categories = await catResponse.json();
        const currentCat = categories.find(c => c.id == catId);

        if (currentCat) {
            document.querySelector('.titleFrame h1').textContent = currentCat.nom;

            // Préparer les liens de modification/suppression avec l'ID (Cible 2)
            document.querySelector('.update').href = `./aUpdateCategory.html?id=${catId}`;
            document.querySelector('.del').href = `./aDelCategory.html?id=${catId}`;

            // 2. Charger les livres de cette catégorie (Cible 2 - Liste)
            await loadBooksByCategory(currentCat.nom, auth);
        }

    } catch (err) {
        console.error("Erreur d'initialisation:", err);
    }
});

async function loadBooksByCategory(categoryName, auth) {
    const panelDown = document.querySelector('.panelDown');

    try {
        const response = await fetch(`http://localhost:8080/api/books/get/byCategory?categorie=${encodeURIComponent(categoryName)}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });

        if (!response.ok) throw new Error("Erreur de récupération des livres");
        const books = await response.json();

        panelDown.innerHTML = ''; // Nettoyage

        books.forEach(book => {
            const li = document.createElement('li');
            li.className = 'bookLine';
            li.innerHTML = `
                <ul class="infoLine">
                    <li><a href="../html/aDashBookDetails.html?id=${book.id}">${book.titre}</a></li>
                    <li>${book.auteur}</li>
                    <li>${book.etatLivre}</li>
                    <li class="${book.estDisponible ? 'status-ok' : 'status-no'}">
                        ${book.estDisponible ? 'DISPONIBLE' : 'EMPRUNTÉ'}
                    </li>
                </ul>
            `;
            panelDown.appendChild(li);
        });
    } catch (err) {
        panelDown.innerHTML = '<p style="padding:20px;">Aucun livre dans cette catégorie.</p>';
    }
}