async function loadCategories() {
    const panelDown = document.querySelector('.panelDown .bookLine');
    if (!panelDown) return;

    // 1. Récupération de l'auth dynamique
    const auth = localStorage.getItem('auth');
    if (!auth) {
        window.location.replace("login.html");
        return;
    }

    try {
        const headers = {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
        };

        // 2. Récupérer toutes les catégories
        const catRes = await fetch('http://localhost:8080/api/categories/get/All', { headers });

        if (catRes.status === 401) { window.location.replace("login.html"); return; }
        const categories = await catRes.json();

        // 3. Récupérer tous les livres
        const bookRes = await fetch('http://localhost:8080/api/books/get/All', { headers });
        const allBooks = await bookRes.json();

        panelDown.innerHTML = '';
        if (categories.length === 0){
            panelDown.innerHTML = `<p style='padding:20px; color:red; font-size: x-large;'>No Category yet...</p>`;
        }

        categories.forEach(cat => {
            // Comptage pragmatique des livres par catégorie
            const count = allBooks.filter(book => book.category && book.category.id === cat.id).length;

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
        panelDown.innerHTML = '<p style="padding:20px">Erreur lors du chargement des catégories.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadCategories);