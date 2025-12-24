async function loadCategories() {
    const panelDown = document.querySelector('.panelDown .bookLine');
    if (!panelDown) return;

    try {
        // 1. Récupérer toutes les catégories
        const catRes = await fetch('http://localhost:8080/api/categories/get/All', {
            headers: { 'Authorization': 'Basic ' + btoa('toto@gmail.com:toto237') }
        });
        const categories = await catRes.json();

        // 2. Récupérer tous les livres pour faire le comptage Front
        const bookRes = await fetch('http://localhost:8080/api/books/get/All', {
            headers: { 'Authorization': 'Basic ' + btoa('toto@gmail.com:toto237') }
        });
        const allBooks = await bookRes.json();

        panelDown.innerHTML = ''; // Nettoyage

        categories.forEach(cat => {
            // Filtrer les livres qui appartiennent à cette catégorie
            const count = allBooks.filter(book => book.category.id === cat.id).length;

            const ul = document.createElement('ul');
            ul.className = 'infoLine';
            ul.innerHTML = `
                <li><a href="../html/aDashCategoryDetails.html?id=${cat.id}">${cat.nom}</a></li>
                <li>${cat.description || 'Pas de description'}</li>
                <li>${count}</li>
            `;
            panelDown.appendChild(ul);
        });

    } catch (error) {
        console.error('Erreur:', error);
        panelDown.innerHTML = '<p>Erreur lors du chargement des catégories.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadCategories);