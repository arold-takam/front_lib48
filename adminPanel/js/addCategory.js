import {API_BASE_URL} from "../config.js";

document.addEventListener('DOMContentLoaded', () => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
        window.location.replace("login.html");
        return;
    }

    const form = document.querySelector('.addCategory');
    const titleInput = document.querySelector('#categoryTitle');
    const detailsInput = document.querySelector('#details');

    // 2. Gestion de la soumission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Création du corps de la requête selon ton CategoryRequestDTO (nom, description)
        const categoryData = {
            nom: titleInput.value.trim(),
            description: detailsInput.value.trim()
        };

        try {
            const response = await fetch(`${API_BASE_URL}/categories/create`, {
                method: 'POST',
                headers: {
                    'Authorization': auth.startsWith('Basic ') ? auth : `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryData)
            });

            if (response.status === 201) {
                alert("Catégorie ajoutée avec succès !");
                // Redirection vers la liste des catégories
                window.location.href = "./aDashCategory.html";
            } else if (response.status === 403) {
                alert("Erreur : Vous n'avez pas les droits d'administrateur.");
            } else {
                const errorMsg = await response.text();
                alert("Échec de l'ajout : " + (errorMsg || "Vérifiez les données."));
            }

        } catch (error) {
            console.error("Erreur technique :", error);
            alert("Impossible de joindre le serveur.");
        }
    });
});