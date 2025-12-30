document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    const auth = localStorage.getItem('auth');
    if (!bookId || !auth) return window.location.replace("aDashBook.html");

    const authHeader = auth.startsWith('Basic ') ? auth : `Basic ${auth}`;
    const form = document.querySelector('.updBook');

    // 1. Charger les catégories et les données actuelles du livre
    try {
        // Charger catégories
        const catRes = await fetch('http://localhost:8080/api/categories/get/All', {
            headers: { 'Authorization': authHeader }
        });
        const categories = await catRes.json();
        const catSelect = document.querySelector('#category');
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.id;
            opt.textContent = cat.nom;
            catSelect.appendChild(opt);
        });

        // Charger données du livre
        const bookRes = await fetch(`http://localhost:8080/api/books/get/byID/${bookId}`, {
            headers: { 'Authorization': authHeader }
        });
        const book = await bookRes.json();

        // Remplir le formulaire
        document.querySelector('#bookTitle').value = book.titre;
        document.querySelector('#author').value = book.auteur;
        document.querySelector('#editor').value = book.editeur;
        document.querySelector('#state').value = book.livreEtat || "NEUF";
        catSelect.value = book.categorie.id;
        document.querySelector(book.estDisponible ? '#yes' : '#no').checked = true;

    } catch (err) { console.error("Erreur initialisation:", err); }

    // 2. Soumission du formulaire (PUT)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // @RequestParam
        formData.append('livreEtat', document.querySelector('#state').value);
        formData.append('idCategory', document.querySelector('#category').value);

        const fileInput = document.querySelector('#cover');
        if (fileInput.files[0]) {
            formData.append('coverImage', fileInput.files[0]);
        }

        // @ModelAttribute BookUpDateDTO
        formData.append('titre', document.querySelector('#bookTitle').value);
        formData.append('auteur', document.querySelector('#author').value);
        formData.append('editeur', document.querySelector('#editor').value);
        formData.append('estDisponible', document.querySelector('#yes').checked);

        try {
            const response = await fetch(`http://localhost:8080/api/books/update/${bookId}`, {
                method: 'PUT',
                headers: { 'Authorization': authHeader },
                body: formData
            });

            if (response.ok) {
                alert("Livre mis à jour !");
                window.location.href = "./aDashBook.html";
            } else {
                alert("Erreur lors de la mise à jour.");
            }
        } catch (error) {
            alert("Erreur réseau.");
        }
    });
});