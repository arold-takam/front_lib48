// bookHistory.js

// 1. Fonction de chargement de l'historique
async function loadBookHistory(bookTitle) {
    const panelDown = document.querySelector('.panelDown'); // Cible directe
    if (!panelDown) return;

    try {
        const response = await fetch(`http://localhost:8080/api/history/get/byBookTitle?bookTitle=${encodeURIComponent(bookTitle)}`, {
            headers: {
                'Authorization': 'Basic ' + btoa('toto@gmail.com:toto237')
            }
        });

        const histories = await response.json();

        // Vider la liste avant d'ajouter
        panelDown.innerHTML = '';

        if (histories.length === 0) {
            panelDown.innerHTML = '<li class="bookLine">Aucun historique pour ce livre.</li>';
            return;
        }

        histories.forEach(h => {
            // Mapping strict sur ton JSON Postman
            const type = h.typeOpperation; // 2 'p'
            const etat = h.etatOperation;  // 1 'p'
            const dateStr = h.dateTime ? new Date(h.dateTime).toLocaleString('fr-FR') : 'Date inconnue';

            const li = document.createElement('li');
            li.className = 'bookLine';
            li.innerHTML = `
                <ul class="infoLine">
                    <li>${type}</li>
                    <li class="${etat.toLowerCase()}">${etat}</li>
                    <li>${dateStr}</li>
                </ul>
            `;
            panelDown.appendChild(li);
        });
    } catch (error) {
        console.error('Erreur fetch:', error);
        panelDown.innerHTML = '<li class="bookLine">Erreur de connexion au serveur.</li>';
    }
}

// 2. Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const bookID = params.get("id");

    if (!bookID) return;

    try {
        // Récupération des détails du livre (pour avoir le titre)
        const response = await fetch(`${CONFIG.API_URL}/books/get/byID/${bookID}`, {
            method: 'GET',
            headers: { 'Authorization': `Basic ${auth}` }
        });

        if (!response.ok) throw new Error("Erreur: " + response.status);

        const book = await response.json();

        // Affichage des détails (ta fonction existante)
        displayBookDetails(book);

        // CHAÎNAGE SOLID : Une fois le livre chargé, on charge son historique
        await loadBookHistory(book.titre);

    } catch (err) {
        console.error("Erreur: ", err);
        const card = document.querySelector('.bookCard');
        if(card) card.innerHTML = `<p style='color: red;'>Erreur de chargement des données.</p>`;
    }
});