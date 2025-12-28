document.addEventListener('DOMContentLoaded', async () => {
    const credentials = btoa("tata@gmail.com:1234");
    const authHeader = `Basic ${credentials}`;

    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('name');

    const titleH1 = document.querySelector('.hero .top h1');
    const detailsP = document.querySelector('.details p');
    const bookList = document.querySelector('.books');

    if (!categoryName) {
        window.location.href = "home.html";
        return;
    }

    /** 1. Charger les détails de la catégorie (Titre et Description) */
    async function loadCategoryInfo() {
        try {
            const response = await fetch(`http://localhost:8080/api/categories/get/byName?name=${encodeURIComponent(categoryName)}`, {
                headers: { 'Authorization': authHeader }
            });
            if (response.ok) {
                const category = await response.json();
                titleH1.textContent = category.nom;
                detailsP.textContent = category.description || "Aucune description disponible pour cette catégorie.";
            }
        } catch (e) { console.error("Erreur détails catégorie:", e); }
    }

    /** 2. Récupération sécurisée des images */
    async function getSecureImage(id) {
        try {
            const res = await fetch(`http://localhost:8080/api/books/${id}/cover-image`, {
                headers: { 'Authorization': authHeader }
            });
            if (res.ok) return URL.createObjectURL(await res.blob());
        } catch (e) { console.error(e); }
        return "../ressources/images/fondMenu.jpg";
    }

    /** 3. Charger les livres de cette catégorie */
    async function loadCategoryBooks() {
        try {
            const response = await fetch(`http://localhost:8080/api/categories/get/byName?name=${encodeURIComponent(categoryName)}`, {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const category = await response.json();
                const bookCateList = await fetch(`http://localhost:8080/api/books/get/byCategory?categorie=${category.nom}`, {
                    headers: { 'Authorization': authHeader }
                });

                const books = await bookCateList.json();

                bookList.innerHTML = '';

                for (const book of books) {
                    const li = document.createElement('li');
                    const imgUrl = await getSecureImage(book.id);
                    li.innerHTML = `
                        <a href="./bookDetails.html?id=${book.id}" class="bookDetailsPage">
                            <div class="cover" style="background-image: url('${imgUrl}'); background-size: cover;">
                                <div class="category"><p>${book.category.nom.toUpperCase()}</p></div>
                            </div>
                            <div class="bookInfo">
                                <h2>${book.titre}</h2>
                                <h3>${book.auteur}</h3>
                            </div>
                        </a>`;
                    bookList.appendChild(li);
                }
            }
        } catch (e) { console.error("Erreur livres catégorie:", e); }
    }

    // Lancement des deux chargements
    loadCategoryInfo();
    loadCategoryBooks();
});