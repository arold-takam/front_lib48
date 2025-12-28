document.addEventListener('DOMContentLoaded', async () => {
    const credentials = btoa("tata@gmail.com:1234");
    const authHeader = `Basic ${credentials}`;

    // 1. Récupérer l'ID du livre dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
        window.location.href = "home.html";
        return;
    }

    // Sélecteurs DOM
    const availabilityDiv = document.querySelector('.available');
    const coverImg = document.querySelector('.coverBook');
    const bookTitle = document.querySelector('.cover .info h1');
    const bookAuthor = document.querySelector('.cover .info p');
    const bookEditor = document.querySelector('.details ul li:first-child p');
    const bookState = document.querySelector('.details ul li:last-child p');
    const ctaButton = document.querySelector('.cta');
    const relatedList = document.querySelector('.sameCate .screen ul');

    /** * Récupération de l'image sécurisée
     */
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

    /** * Chargement des détails du livre
     */
    async function loadBookDetails() {
        try {
            const response = await fetch(`http://localhost:8080/api/books/get/byID/${bookId}`, {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const book = await response.json();

                // Remplissage des infos
                bookTitle.textContent = book.titre;
                bookAuthor.textContent = book.auteur;
                bookEditor.textContent = book.editeur || "Non spécifié";
                bookState.textContent = book.etatLivre.replace('_', ' ');
                coverImg.src = await getSecureImage(book.id);

                // LIEN DYNAMIQUE VERS L'EMPRUNT
                ctaButton.href = `./borrowBook.html?bookId=${book.id}`;

                // Gestion disponibilité (visuel réaliste)
                if (!book.estDisponible) {
                    availabilityDiv.querySelector('.circle').style.backgroundColor = "red";
                    availabilityDiv.querySelector('p').textContent = "Ce livre est indisponible";
                    ctaButton.style.display = "none"; // On cache le bouton emprunter
                }

                // Charger les livres de la même catégorie
                loadRelatedBooks(book.category.nom);
            }
        } catch (error) { console.error("Erreur détails:", error); }
    }

    /** * Chargement de la section "Vous allez aimer"
     */
    async function loadRelatedBooks(categoryName) {
        try {
            const response = await fetch(`http://localhost:8080/api/books/get/byCategory?categorie=${categoryName}`, {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const books = await response.json();
                relatedList.innerHTML = '';

                // On affiche les livres sauf celui qu'on consulte déjà
                const filteredBooks = books.filter(b => b.id != bookId);

                for (const b of filteredBooks) {
                    const li = document.createElement('li');
                    const imgUrl = await getSecureImage(b.id);
                    li.innerHTML = `
                        <a href="./bookDetails.html?id=${b.id}" class="bookDetailsPage">
                            <div class="cover" style="background-image: url('${imgUrl}'); background-size: cover;">
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

    loadBookDetails();
});