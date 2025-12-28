document.addEventListener('DOMContentLoaded', async () => {
    // 1. CONFIGURATION (Identifiants de test pour l'abonné)
    const credentials = btoa("tata@gmail.com:1234");
    const authHeader = `Basic ${credentials}`;

    // 2. CIBLES DOM
    const newBooksList = document.querySelector('.new .screen ul');
    const hotBooksList = document.querySelector('.hot .screen ul');
    const categoryList = document.querySelector('.categories .screen ul');

    /**
     * Récupère l'image en Blob avec Authentification et gère le repli (fallback)
     */
    async function getSecureImage(bookId) {
        try {
            const response = await fetch(`http://localhost:8080/api/books/${bookId}/cover-image`, {
                headers: { 'Authorization': authHeader }
            });
            if (response.ok) {
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            }
        } catch (error) {
            console.error(`Erreur image livre ${bookId}:`, error);
        }
        // Retourne l'image par défaut si le fetch échoue ou si l'image n'existe pas
        return "../ressources/images/fondMenu.jpg";
    }

    /**
     * Crée l'élément <li> pour un livre
     */
    async function createBookHTML(book) {
        const coverUrl = await getSecureImage(book.id);
        const li = document.createElement('li');

        li.innerHTML = `
            <a href="./bookDetails.html?id=${book.id}" class="bookDetailsPage">
                <div class="cover" style="background-image: url('${coverUrl}'); background-size: cover;">
                    <div class="category"><p>${book.category.nom.toUpperCase()}</p></div>
                </div>
                <div class="bookInfo">
                    <h2>${book.titre}</h2>
                    <h3>${book.auteur}</h3>
                </div>
            </a>`;
        return li;
    }

    /**
     * Charge tous les livres et les affiche intégralement dans les deux sections
     */
    async function loadBooks() {
        try {
            const response = await fetch('http://localhost:8080/api/books/get/All', {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const books = await response.json();

                newBooksList.innerHTML = '';
                hotBooksList.innerHTML = '';

                for (const book of books) {
                    const bookElement = await createBookHTML(book);

                    // Ajout à la section "Nouvelles Sorties"
                    newBooksList.appendChild(bookElement);

                    // Ajout à la section "Tendances" (clone pour duplication physique)
                    hotBooksList.appendChild(bookElement.cloneNode(true));
                }
            }
        } catch (error) {
            console.error("Erreur chargement livres:", error);
        }
    }

    /**
     * Charge toutes les catégories et les affiche
     */
    async function loadCategories() {
        try {
            const response = await fetch('http://localhost:8080/api/categories/get/All', {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const categories = await response.json();
                categoryList.innerHTML = '';

                categories.forEach(cat => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <a href="./categoryBook.html?name=${encodeURIComponent(cat.nom)}">
                            <h4>${cat.nom}</h4>
                        </a>`;
                    categoryList.appendChild(li);
                });
            }
        } catch (error) {
            console.error("Erreur chargement catégories:", error);
        }
    }

    // LANCEMENT GLOBAL
    loadBooks();
    loadCategories();
});