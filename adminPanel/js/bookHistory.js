// 1. Fonction de chargement de l'historique
async function loadBookHistory(bookTitle) {
    const panelDown = document.querySelector('.panelDown');
    const auth = localStorage.getItem('auth'); // Récupération dynamique

    if (!panelDown || !auth) return;

    try {
        const response = await fetch(`http://localhost:8080/api/history/get/byBookTitle?bookTitle=${encodeURIComponent(bookTitle)}`, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });

        if (response.status === 401) {
            localStorage.clear();
            window.location.replace("login.html");
            return;
        }

        const histories = await response.json();
        panelDown.innerHTML = '';

        if (histories.length === 0) {
            panelDown.innerHTML = '<li class="bookLine">Aucun historique pour ce livre.</li>';
            return;
        }

        histories.forEach(h => {
            const type = h.typeOpperation;
            const etat = h.etatOperation;
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
    const auth = localStorage.getItem('auth');
    const params = new URLSearchParams(window.location.search);
    const bookID = params.get("id");

    // Sécurité : si pas d'auth, redirection immédiate
    if (!auth) {
        window.location.replace("login.html");
        return;
    }

    if (!bookID) return;

    try {
        // Note : Utilisation de l'URL propre avec auth dynamique
        const response = await fetch(`http://localhost:8080/api/books/get/byID/${bookID}`, {
            method: 'GET',
            headers: { 'Authorization': `Basic ${auth}` }
        });

        if (!response.ok) throw new Error("Erreur: " + response.status);

        const book = await response.json();

        // Affichage des détails
        displayBookDetails(book);

        // Chargement de l'historique avec le titre récupéré (ex: book.titre ou book.title selon ton API)
        await loadBookHistory(book.titre || book.bookTitle);

    } catch (err) {
        console.error("Erreur: ", err);
        const card = document.querySelector('.bookCard');
        if(card) card.innerHTML = `<p style='color: red;'>Erreur de chargement des données.</p>`;
    }
});