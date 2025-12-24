// bookHistory.js

// 1. Fonction de chargement de l'historique
async function loadBookHistory(bookTitle) {
    const panelDown = document.querySelector('.panel .panelDown');
    if (!panelDown) return;

    try {
        const response = await fetch(`http://localhost:8080/api/history/get/byBookTitle?bookTitle=${encodeURIComponent(bookTitle)}`, {
            headers: {
                'Authorization': 'Basic ' + btoa('toto@gmail.com:toto237')
            }
        });

        if (!response.ok) throw new Error('Historique introuvable');
        const histories = await response.json();

        panelDown.innerHTML = ''; // Nettoyage
        histories.forEach(h => {
            const dateStr = new Date(h.dateTime).toLocaleString('fr-FR');
            const li = document.createElement('li');
            li.className = 'bookLine';
            li.innerHTML = `
                <ul class="infoLine">
                    <li>${h.typeOpperation}</li>
                    <li class="${h.etatOperation.toLowerCase()}">${h.etatOperation}</li>
                    <li>${dateStr}</li>
                </ul>
            `;
            panelDown.appendChild(li);
        });
    } catch (error) {
        console.error('Erreur:', error);
        panelDown.innerHTML = '<li class="bookLine">Aucune activité trouvée.</li>';
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