document.addEventListener('DOMContentLoaded', async () => {
    const panelDown = document.querySelector('.panelDown');
    const auth = localStorage.getItem('auth');

    // 1. Sécurité : Si pas d'auth, on redirige
    if (!auth) {
        window.location.replace("login.html");
        return;
    }

    try {
        // 1. On récupère les users pour mapper le Nom -> ID (nécessaire pour le lien dynamique)
        const userRes = await fetch('http://localhost:8080/api/user/get', {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const allUsers = await userRes.json();

        // 2. On récupère l'historique complet via ton endpoint /get/All
        const historyRes = await fetch('http://localhost:8080/api/history/get/All', {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const histories = await historyRes.json();

        panelDown.innerHTML = ''; // Nettoyage des données statiques

        histories.forEach(h => {
            // Mapping pragmatique : on cherche l'ID correspondant au userName
            const foundUser = allUsers.find(u => u.name === h.userName);
            const userId = foundUser ? foundUser.id : '#';

            const dateStr = new Date(h.dateTime).toLocaleString('fr-FR');

            // Création de la structure cible
            const li = document.createElement('li');
            li.className = 'userLine';

            li.innerHTML = `
                <ul class="infoLine">
                    <li><a href="../html/aDashUser.html?id=${userId}">${h.userName}</a></li>
                    <li>${h.typeOpperation}</li>
                    <li class="${h.etatOperation.toLowerCase()}">${h.etatOperation}</li>
                    <li>${dateStr}</li>
                </ul>
            `;
            panelDown.appendChild(li);
        });

    } catch (err) {
        console.error("Erreur Dashboard:", err);
        panelDown.innerHTML = '<li class="userLine">Erreur de chargement.</li>';
    }
});