document.addEventListener('DOMContentLoaded', async () => {
    // 1. Récupération de l'ID depuis l'URL (ex: updateCategory.html?id=2)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    const auth = localStorage.getItem('auth');

    if (!categoryId || !auth) {
        window.location.replace("aDashCategory.html");
        return;
    }

    const authHeader = auth.startsWith('Basic ') ? auth : `Basic ${auth}`;
    const form = document.querySelector('.updateCategory');
    const titleInput = document.querySelector('#categoryTitle');
    const detailsInput = document.querySelector('#details');

    // 2. Pré-remplissage du formulaire
    try {
        const getRes = await fetch(`http://localhost:8080/api/categories/get/byID/${categoryId}`, {
            headers: { 'Authorization': authHeader }
        });
        if (getRes.ok) {
            const category = await getRes.json();
            titleInput.value = category.nom;
            detailsInput.value = category.description;
        }
    } catch (err) { console.error("Erreur chargement:", err); }

    // 3. Envoi de la modification (PUT)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updateData = {
            nom: titleInput.value.trim(),
            description: detailsInput.value.trim()
        };

        try {
            const response = await fetch(`http://localhost:8080/api/categories/update/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                alert("Catégorie mise à jour !");
                window.location.href = "./aDashCategory.html";
            } else {
                alert("Erreur lors de la modification.");
            }
        } catch (error) {
            alert("Erreur technique de connexion.");
        }
    });
});