document.addEventListener('DOMContentLoaded', async () => {
    const credentials = btoa("tata@gmail.com:1234");
    const authHeader = `Basic ${credentials}`;
    const DEFAULT_GERANT_ID = 1;

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');

    // Cibles DOM
    const mainTitle = document.querySelector('main h1');
    const bookTitleDisplay = document.querySelector('.coverBook h2');
    const bookImgDisplay = document.querySelector('.coverBook img');
    const warningState = document.querySelector('.warning p i');
    const relatedList = document.querySelector('.sameCate .screen ul');
    const borrowForm = document.querySelector('.validateBorrow');

    if (!bookId) {
        window.location.href = "home.html";
        return;
    }

    /** 1. Utitaire pour les images */
    async function getSecureImage(id) {
        try {
            const res = await fetch(`http://localhost:8080/api/books/${id}/cover-image`, {
                headers: { 'Authorization': authHeader }
            });
            if (res.ok) {
                const blob = await res.blob();
                return URL.createObjectURL(blob);
            }
        } catch (e) { console.error(e); }
        return "../ressources/images/fondMenu.jpg";
    }

    /** 2. Charger les infos du livre et la section "Même catégorie" */
    async function loadPageData() {
        try {
            const response = await fetch(`http://localhost:8080/api/books/get/byID/${bookId}`, {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const book = await response.json();

                // Dynamisation des textes
                mainTitle.textContent = `Emprunt de : ${book.titre}`;
                bookTitleDisplay.textContent = book.titre;
                warningState.textContent = book.etatLivre.replace('_', ' ');
                bookImgDisplay.src = await getSecureImage(book.id);

                // Charger les recommandations (même catégorie)
                loadRelated(book.category.nom);
            }
        } catch (e) { console.error(e); }
    }

    /** 3. Dynamiser "Vous allez aimer" */
    async function loadRelated(categoryName) {
        try {
            const response = await fetch(`http://localhost:8080/api/books/get/byCategory?categorie=${categoryName}`, {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const books = await response.json();
                relatedList.innerHTML = '';

                // On exclut le livre actuel des recommandations
                const others = books.filter(b => b.id != bookId);

                for (const b of others) {
                    const li = document.createElement('li');
                    const img = await getSecureImage(b.id);
                    li.innerHTML = `
                        <a href="./bookDetails.html?id=${b.id}" class="bookDetailsPage">
                            <div class="cover" style="background-image: url('${img}'); background-size: cover;">
                                <div class="category"><p>${b.category.nom.toUpperCase()}</p></div>
                            </div>
                            <div class="bookInfo">
                                <h2>${b.titre}</h2>
                                <h3>${b.auteur}</h3>
                            </div>
                        </a>`;
                    relatedList.appendChild(li);
                }
            }
        } catch (e) { console.error(e); }
    }

    /** 4. Soumission du formulaire */
    borrowForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const delay = document.getElementById('delay').value;

        const requestData = {
            bookID: parseInt(bookId),
            abonneID: 2, // Tata
            delaiEmprunt: parseInt(delay)
        };

        try {
            const res = await fetch(`http://localhost:8080/api/borrowBook/create/${DEFAULT_GERANT_ID}`, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (res.ok) {
                const msg = encodeURIComponent("Votre emprunt a été enregistré avec succès");
                window.location.href = `./loadingPage.html?status=success&message=${msg}`;
            } else {
                const msg = encodeURIComponent("Une erreur est survenue lors de l'emprunt");
                window.location.href = `./loadingPage.html?status=error&message=${msg}`;
            }
        } catch (err) { console.error(err); }
    });

    loadPageData();
});