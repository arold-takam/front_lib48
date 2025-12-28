document.addEventListener('DOMContentLoaded', async () => {
    const credentials = btoa("tata@gmail.com:1234");
    const authHeader = `Basic ${credentials}`;
    const USER_NAME = "tata"; // À dynamiser plus tard via le login

    const storyUl = document.querySelector('.stories');
    const filterForm = document.querySelector('.story .filter');
    const filterSelect = document.querySelector('#type');

    /** 1. Formater Date et Heure */
    function formatDateTime(isoString) {
        const dateObj = new Date(isoString);
        return {
            date: dateObj.toLocaleDateString('fr-FR'),
            time: dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')
        };
    }

    /** 2. Créer l'élément HTML d'une story */
    function createStoryItem(item) {
        const { date, time } = formatDateTime(item.dateOperation || new Date());
        const li = document.createElement('li');

        // Ajout d'un attribut data pour le filtrage
        li.setAttribute('data-etat', item.etatOperation);

        li.innerHTML = `
            <div class="top">
                <h2>${item.typeOpperation.replace('_', ' ')}</h2>
                <b class="${item.etatOperation.toLowerCase()}">${item.etatOperation}</b>
            </div>
            <div class="middle">
                <p>${item.details}</p>
                <span>Pour: <b>${item.bookTitle || "N/A"}</b></span>
            </div>
            <div class="bottom">
                <div class="date"><b>Le:</b><p>${date}</p></div>
                <div class="time"><b>A:</b><p>${time}</p></div>
            </div>`;
        return li;
    }

    /** 3. Charger l'historique */
    async function loadHistory() {
        try {
            const response = await fetch(`http://localhost:8080/api/history/get/byUsername?userName=${encodeURIComponent(USER_NAME)}`, {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const historyData = await response.json();
                storyUl.innerHTML = '';

                historyData.forEach(item => {
                    storyUl.appendChild(createStoryItem(item));
                });
            }
        } catch (e) {
            console.error("Erreur historique:", e);
        }
    }

    /** 4. Filtrage dynamique (Pragmatique) */
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const filterValue = filterSelect.value;
        const allStories = storyUl.querySelectorAll('li');

        allStories.forEach(li => {
            const etat = li.getAttribute('data-etat');
            if (filterValue === "TOUT" || etat === filterValue) {
                li.style.display = "flex";
            } else {
                li.style.display = "none";
            }
        });
    });

    loadHistory();
});