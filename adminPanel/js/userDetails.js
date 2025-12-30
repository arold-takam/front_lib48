// 1. Définition des fonctions d'abord (Pragmatisme)
async function loadUserHistory(userName, auth) {
    const panelDown = document.querySelector('.panelDown');
    if (!panelDown) return;

    try {
        const response = await fetch(`http://localhost:8080/api/history/get/byUsername?userName=${encodeURIComponent(userName)}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const activities = await response.json();

        panelDown.innerHTML = '';

        activities.forEach(act => {
            const dateStr = new Date(act.dateTime).toLocaleString('fr-FR');
            const li = document.createElement('li');
            li.className = 'userLine';
            li.innerHTML = `
                <ul class="infoLine">
                   <li>${act.typeOpperation}</li>
                   <li class="${act.etatOperation.toLowerCase()}">${act.etatOperation}</li>
                   <li>${dateStr}</li>
                </ul>`;
            panelDown.appendChild(li);
        });
    } catch (err) {
        panelDown.innerHTML = '<li class="userLine">Aucune activité trouvée.</li>';
    }
}

async function loadSideProfil(auth, userMail) {
    try {
        const response = await fetch(`http://localhost:8080/api/user/get/byMail?mail=${userMail}`, {
            headers: {'Authorization': `Basic ${auth}`}
        });
        if (!response.ok) return;
        const admin = await response.json();

        const sidebarName = document.querySelector('.profile .info h1');
        const sidebarMail = document.querySelector('.profile .info p');
        if (sidebarName) sidebarName.textContent = admin.name;
        if (sidebarMail) sidebarMail.textContent = admin.mail;

        localStorage.setItem('userId', admin.id);
    } catch (e) { console.error("Sidebar error:", e); }
}

// 2. Point d'entrée principal
document.addEventListener('DOMContentLoaded', async () => {
    const auth = localStorage.getItem('auth');
    const userMail = localStorage.getItem('userMail');

    if (!auth) {
        window.location.replace("login.html");
        return;
    }

    await loadSideProfil(auth, userMail);

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");
    if (!userId){
        window.location.replace("./aDashHome.html");

        return;
    }


    const deleteLink = document.querySelector('.del');
    deleteLink.href = `aDelUser.html?id=${userId}`;

    const revokeLink = document.querySelector('.revoke');
    revokeLink.href = `aRevoke.html?id=${userId}`;

    // Exemple de ce que ton script de liste doit générer :
    try {
        const userRes = await fetch(`http://localhost:8080/api/user/get/${userId}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });

        if (userRes.status === 401) {
            localStorage.clear();
            window.location.replace("login.html");
            return;
        }

        const user = await userRes.json();

        // Mapping Infos
        const infoLabels = document.querySelectorAll('.groupInfo b');
        if(infoLabels.length >= 3) {
            infoLabels[0].textContent = user.name;
            infoLabels[1].textContent = user.mail;
            infoLabels[2].textContent = user.roleName || user.role;
        }

        // Mapping Carte
        const cardZone = document.querySelector('.card');
        if (cardZone) {
            if (user.roleName === 'GERANT') {
                cardZone.style.display = 'none';
            } else if (user.carteAbonnement) {
                cardZone.querySelector('h2').textContent = `Carte ${user.carteAbonnement.typeAbonnement}`;
                cardZone.querySelector('p b').textContent = user.carteAbonnement.cardNumber;
                cardZone.querySelector('.middle b').textContent = `${user.carteAbonnement.duree} jours`;
            } else {
                cardZone.innerHTML = "<h2 style='padding:20px'>Aucune carte active</h2>";
            }
        }

        // Appel de l'historique (maintenant bien défini plus haut)
        await loadUserHistory(user.name, auth);

    } catch (err) {
        console.error("Erreur de chargement du profil:", err);
    }
});