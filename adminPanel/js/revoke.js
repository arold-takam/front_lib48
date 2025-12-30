document.addEventListener('DOMContentLoaded', async () => {
    const auth = localStorage.getItem('auth');
    const userMail = localStorage.getItem('userMail');

    // 1. Récupération de l'ID de l'abonné (cible)
    const urlParams = new URLSearchParams(window.location.search);
    const abonneID = urlParams.get('id');

    const form = document.querySelector('.mainSect');
    const backBtn = document.querySelector('.back');

    if (!abonneID) return;

    // Gestion du bouton retour
    backBtn.href = `./aDashUser.html?id=${abonneID}`;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            // 2. Récupérer l'ID du gérant connecté via son mail
            const adminRes = await fetch(`http://localhost:8080/api/user/get/byMail?mail=${userMail}`, {
                headers: { 'Authorization': `Basic ${auth}` }
            });
            const adminData = await adminRes.json();
            const gerantID = adminData.id;

            // 3. Appel au endpoint de révocation
            // Format: PUT /revoque/card/{abonneID}?gerantID={gerantID}
            const response = await fetch(`http://localhost:8080/api/user/revoque/card/${abonneID}?gerantID=${gerantID}`, {
                method: 'PUT',
                headers: { 'Authorization': `Basic ${auth}` }
            });

            if (response.ok) {
                alert("Carte révoquée avec succès !");
                window.location.href = `./aDashUser.html?id=${abonneID}`;
            } else {
                alert("Erreur lors de la révocation.");
            }
        } catch (error) {
            console.error("Erreur technique:", error);
        }
    });
});