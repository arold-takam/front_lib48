document.addEventListener('DOMContentLoaded', async () => {
    const auth = localStorage.getItem('auth');
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    const form = document.querySelector('.mainSect');
    const backBtn = document.querySelector('.back');
    const titleH2 = document.querySelector('h2');

    if (!bookId) {
        alert("ID du livre manquant.");
        window.location.href = "aDashBook.html";
        return;
    }

    // 1. Mise à jour du bouton retour avec l'ID pour ne pas perdre le contexte
    backBtn.href = `../html/aDashBookDetails.html?id=${bookId}`;

    // 2. Optionnel : Récupérer le titre pour la mémoire visuelle
    try {
        const response = await fetch(`http://localhost:8080/api/books/get/byID/${bookId}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        if (response.ok) {
            const book = await response.json();
            titleH2.textContent = `Voulez-vous supprimer le livre : "${book.titre}" ?`;
        }
    } catch (err) { console.error("Erreur récup titre", err); }

    // 3. Action de suppression
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/api/books/delete/${bookId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${auth}` }
            });

            if (response.status === 204 || response.ok) {
                alert("Livre supprimé avec succès.");
                window.location.href = "aDashBook.html"; // Retour à la liste
            } else {
                alert("Erreur lors de la suppression. Le livre est peut-être lié à un emprunt.");
            }
        } catch (error) {
            alert("Erreur technique de connexion.");
        }
    });
});