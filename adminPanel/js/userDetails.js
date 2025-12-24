document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");
    const auth = btoa('toto@gmail.com:toto237');

    if (!userId) return;

    try {
        // 1. Récupérer les données de l'utilisateur
        const userRes = await fetch(`http://localhost:8080/api/user/get/${userId}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const user = await userRes.json();

        // 2. Mapping des informations de base (userInfo)
        const infoList = document.querySelectorAll('.groupInfo b');
        infoList[0].textContent = user.name;
        infoList[1].textContent = user.mail;
        infoList[2].textContent = user.roleName;

        // 3. Gestion Pragmatique de la Carte (Gérant vs Abonné)
        const cardZone = document.querySelector('.card');
        if (user.roleName === 'GERANT') {
            cardZone.style.display = 'none'; // L'admin n'a pas de carte
        } else if (user.carteAbonnement) {
            cardZone.querySelector('h2').textContent = `Carte ${user.carteAbonnement.typeAbonnement}`;
            cardZone.querySelector('p b').textContent = user.carteAbonnement.cardNumber;
            cardZone.querySelector('.middle b').textContent = `${user.carteAbonnement.duree} jours`;
            // Lien dynamique pour révoquer
            cardZone.querySelector('.revoke').href = `aRevoke.html?id=${userId}`;
        } else {
            cardZone.innerHTML = "<h2>Aucune carte active</h2>";
        }

        // 4. Charger l'historique spécifique de cet utilisateur
        await loadUserHistory(user.name, auth);

    } catch (err) {
        console.error("Erreur de chargement du profil:", err);
    }
});

async function loadUserHistory(userName, auth) {
    const panelDown = document.querySelector('.panelDown');
    try {
        const response = await fetch(`http://localhost:8080/api/history/get/byUsername?userName=${encodeURIComponent(userName)}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const activities = await response.json();
        console.log(activities);

        panelDown.innerHTML = ''; // Vide la liste fictive

        activities.forEach(act => {
            const dateStr = new Date(act.dateTime).toLocaleString('fr-FR');

            // On crée le LI parent
            const li = document.createElement('li');
            li.className = 'userLine';

            // On injecte l'UL enfant avec les 3 colonnes respectives
            li.innerHTML = `
                <ul class="infoLine">
                   <li>${act.typeOpperation}</li>
                   <li class="${act.etatOperation.toLowerCase()}">${act.etatOperation}</li>
                   <li>${dateStr}</li>
                </ul>
            `;
            panelDown.appendChild(li);
        });
    } catch (err) {
        panelDown.innerHTML = '<li class="userLine"><ul class="infoLine"><li>Aucune activité</li></ul></li>';
    }
}