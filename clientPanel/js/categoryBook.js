document.addEventListener('DOMContentLoaded', async () => {
    const credentials = btoa("tata@gmail.com:1234");
    const authHeader = `Basic ${credentials}`;

    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('name');

    const titleH1 = document.querySelector('.hero .top h1');
    const bookList = document.querySelector('.books');

    if (!categoryName) {
        window.location.href = "home.html";
        return;
    }

    titleH1.textContent = categoryName;

    /** Récupération sécurisée des images */
    async function getSecureImage(id) {
        try {
            const res = await fetch(`http://localhost:8080/api/books/${id}/cover-image`, {
                headers: { 'Authorization': authHeader }
            });
            if (res.ok) return URL.createObjectURL(await res.blob());
        } catch (e) { console.error(e); }
        return "../ressources/images/fondMenu.jpg";
    }

    /** Charger les livres de cette catégorie */
    async function loadCategoryBooks() {
        try {
            const response = await fetch(`http://localhost:8080/api/books/get/byCategory?categorie=${encodeURIComponent(categoryName)}`, {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const books = await response.json();
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
        } catch (e) { console.error(e); }
    }

    loadCategoryBooks();
});