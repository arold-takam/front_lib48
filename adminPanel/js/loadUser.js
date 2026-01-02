import {API_BASE_URL} from "../config.js";

async function loadSideProfil(auth, userMail) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/get/byMail?mail=${userMail}`, {
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

document.addEventListener('DOMContentLoaded', async () => {
    const panelDown = document.querySelector('.panelDown');
    const auth = localStorage.getItem('auth');
    const userMail = localStorage.getItem('userMail');

    if (!auth) {
        window.location.replace("login.html");
        return;
    }

    await loadSideProfil(auth, userMail);

    try {
        // 1. Récupérer TOUT l'historique via history/get/All
        const historyRes = await fetch(`${API_BASE_URL}/history/get/All`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const histories = await historyRes.json();

        // 2. Récupérer TOUS les users pour mapper le nom -> ID (indispensable pour ton lien)
        const userRes = await fetch(`${API_BASE_URL}/user/get`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const allUsers = await userRes.json();

        panelDown.innerHTML = '';

        // userActivity.js corrigé

        histories.forEach(h => {
            // 1. Correction du mapping : on compare le nom de l'historique avec le 'name' de l'utilisateur
            // On utilise h.userName (ou utilisateurNom selon ton DTO)
            const userObj = allUsers.find(u => u.name === h.userName);
            const userId = userObj ? userObj.id : '#';

            // 2. Correction des noms de champs (Opperation avec deux 'p' comme dans ton Java)
            const dateStr = new Date(h.dateTime).toLocaleString('fr-FR');

            const li = document.createElement('li');
            li.className = 'userLine';

            li.innerHTML = `
        <ul class="infoLine">
            <li><a href="../html/aDashUser.html?id=${userId}">${h.userName}</a></li>
            <li>${h.typeOpperation}</li>
            <li class="${h.etatOperation ? h.etatOperation.toLowerCase() : ''}">${h.etatOperation}</li>
            <li>${dateStr}</li>
        </ul>
    `;
            panelDown.appendChild(li);
        });

    } catch (error) {
        console.error('Erreur Mapping History:', error);
        panelDown.innerHTML = '<li class="userLine">Erreur de chargement des activités</li>';
    }
});