document.addEventListener('DOMContentLoaded', async () => {
    const panelDown = document.querySelector('.panelDown');
    const auth = localStorage.getItem('auth');
    const gerantID = localStorage.getItem('userId');

    // 1. Sécurité : Si pas d'auth, on redirige
    if (!auth) {
        window.location.replace("login.html");
        return;
    }

    try {
        // 1. Récupération de tous les retours via le controller
        const response = await fetch(`http://localhost:8080/api/returnBook/get/all/${gerantID}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const returns = await response.json();

        panelDown.innerHTML = ''; // Nettoyage de la cible

        if (returns.length === 0){
            panelDown.innerHTML = `<h1>Aucun retour enregistre pour l'instant</h1>`;
        }

        // 2. Boucle asynchrone pour traiter chaque retour
        for (const r of returns) {
            console.log(r);
            let bookId = "#";
            const titreLivre = r.livreName; // On suppose que le DTO contient le titre

            try {
                // Récupération de l'ID via le titre pour le lien détails
                const bookRes = await fetch(`http://localhost:8080/api/books/get/byTitle?title=${encodeURIComponent(titreLivre)}`, {
                    headers: { 'Authorization': `Basic ${auth}` }
                });
                if (bookRes.ok) {
                    const bookData = await bookRes.json();
                    bookId = bookData.id;
                }
            } catch (err) {
                console.error("ID non trouvé pour le livre:", titreLivre);
            }

            // 3. Création de la structure HTML conforme à ta cible
            const dateStr = r.dateRetour ? new Date(r.dateRetour).toLocaleDateString('fr-FR') : 'Date inconnue';
            const li = document.createElement('li');
            li.className = 'returnLine';

            li.innerHTML = `
                <ul class="infoLine">
                    <li><a href="../html/aDashBookDetails.html?id=${bookId}">${titreLivre}</a></li>
                    <li class="success">SUCCESS</li>
                    <li>${r.message || 'Retour effectué avec succès'}</li>
                    <li>${dateStr}</li>
                </ul>
            `;
            panelDown.appendChild(li);
        }
    } catch (err) {
        console.error("Erreur lors du mappage des retours:", err);
        panelDown.innerHTML = '<li class="returnLine">Erreur de chargement des retours.</li>';
    }
});