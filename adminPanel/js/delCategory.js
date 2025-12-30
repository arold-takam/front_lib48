document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    const auth = localStorage.getItem('auth');

    if (!categoryId || !auth) {
        window.location.replace("aDashCategory.html");
        return;
    }

    const authHeader = auth.startsWith('Basic ') ? auth : `Basic ${auth}`;
    const form = document.querySelector('.mainSect');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/api/categories/delete/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': authHeader
                }
            });

            if (response.status === 204 || response.ok) {
                alert("Catégorie supprimée avec succès.");
                window.location.href = "./aDashCategory.html";
            } else if (response.status === 400) {
                alert("Erreur : Cette catégorie est peut-être liée à des livres existants.");
            } else {
                alert("Erreur lors de la suppression.");
            }
        } catch (error) {
            console.error("Erreur technique :", error);
            alert("Impossible de joindre le serveur.");
        }
    });
});