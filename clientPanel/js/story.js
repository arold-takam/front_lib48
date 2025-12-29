document.addEventListener('DOMContentLoaded', async () => {
    // 1. Récupération dynamique de la session
    const AUTH_TOKEN = sessionStorage.getItem('userToken') || localStorage.getItem('userToken');
    const USER_MAIL = sessionStorage.getItem('userMail') || localStorage.getItem('userMail');

    if (!AUTH_TOKEN) {
        window.location.href = "./login.html";
        return;
    }

    const authHeader = `Basic ${AUTH_TOKEN}`;

    const storyUl = document.querySelector('.stories');
    const filterForm = document.querySelector('.story .filter');
    const filterSelect = document.querySelector('#type');

    /** 2. Formater Date et Heure */
    function formatDateTime(isoString) {
        const dateObj = new Date(isoString);
        return {
            date: dateObj.toLocaleDateString('fr-FR'),
            time: dateObj.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            }).replace(':', 'h')
        };
    }

    /** 3. Créer l'élément HTML (Ta structure intacte) */
    function createStoryItem(item) {
        const { date, time } = formatDateTime(item.dateTime);
        const li = document.createElement('li');
        li.setAttribute('data-etat', item.etatOperation);

        li.innerHTML = `
        <div class="top">
            <h2>${item.typeOpperation.replace(/_/g, ' ')}</h2>
            <b class="${item.etatOperation.toLowerCase()}">${item.etatOperation}</b>
        </div>
        <div class="middle">
            <p>${item.details}</p> 
            <span>Pour: <b>${item.bookTitle}</b></span>
        </div>
        <div class="bottom">
            <div class="date"><b>Le:</b><p>${date}</p></div>
            <div class="time"><b>A:</b><p>${time}</p></div>
        </div>`;
        return li;
    }

    /** 4. Charger l'historique dynamiquement */
    async function loadHistory() {
        try {
            // Étape 1 : Récupérer le nom de l'utilisateur via son mail
            const userRes = await fetch(`http://localhost:8080/api/user/get/byMail?mail=${USER_MAIL}`, {
                headers: { 'Authorization': authHeader }
            });
            const user = await userRes.json();

            // Étape 2 : Charger l'historique avec le bon USER_NAME
            const response = await fetch(`http://localhost:8080/api/history/get/byUsername?userName=${encodeURIComponent(user.name)}`, {
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

    /** 5. Filtrage dynamique (Ta logique conservée) */
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