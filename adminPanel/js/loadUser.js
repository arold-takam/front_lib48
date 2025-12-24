document.addEventListener('DOMContentLoaded', async () => {
    const panelDown = document.querySelector('.panelDown');
    const auth = btoa('toto@gmail.com:toto237');

    try {
        // 1. Récupérer TOUT l'historique via history/get/All
        const historyRes = await fetch('http://localhost:8080/api/history/get/All', {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const histories = await historyRes.json();

        // 2. Récupérer TOUS les users pour mapper le nom -> ID (indispensable pour ton lien)
        const userRes = await fetch('http://localhost:8080/api/user/get', {
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