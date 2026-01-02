import {API_BASE_URL} from "../config.js";

document.addEventListener('DOMContentLoaded', async () => {
    const auth = localStorage.getItem('auth');
    if (!auth) return window.location.replace("login.html");
    const authHeader = auth.startsWith('Basic ') ? auth : `Basic ${auth}`;

    const form = document.querySelector('.addBook');
    const categorySelect = document.querySelector('#category');

    // --- PHASE 1 : Remplir le select des catégories ---
    try {
        const res = await fetch(`${API_BASE_URL}/categories/get/All`, {
            headers: { 'Authorization': authHeader }
        });
        const categories = await res.json();
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id; // L'ID pour le @RequestParam long idCategory
            option.textContent = cat.nom;
            categorySelect.appendChild(option);
        });
    } catch (err) { console.error("Erreur chargement catégories", err); }

    // --- PHASE 2 : Soumission du formulaire ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // On utilise FormData pour gérer le fichier (Multipart)
        const formData = new FormData();

        // Paramètres simples (@RequestParam)
        formData.append('idCategory', categorySelect.value);
        formData.append('coverImage', document.querySelector('#cover').files[0]);

        // Champs du DTO (@ModelAttribute BookRequestDTO)
        // Spring fait le lien automatiquement avec les noms des attributs du Record
        formData.append('titre', document.querySelector('#bookTitle').value);
        formData.append('auteur', document.querySelector('#author').value);
        formData.append('editeur', document.querySelector('#editor').value);

        try {
            const response = await fetch(`${API_BASE_URL}/books/create`, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader
                    // /!\ NE PAS mettre de Content-Type, le navigateur le fait seul pour FormData
                },
                body: formData
            });

            if (response.status === 201) {
                alert("Livre ajouté avec succès !");
                window.location.href = "./aDashBook.html";
            } else {
                const error = await response.text();
                alert("Erreur : " + error);
            }
        } catch (error) {
            console.error(error);
            alert("Erreur technique lors de l'ajout.");
        }
    });
});