document.addEventListener('DOMContentLoaded', async () => {
    // 1. Récupération dynamique de la session
    const AUTH_TOKEN = sessionStorage.getItem('userToken') || localStorage.getItem('userToken');
    const USER_MAIL = sessionStorage.getItem('userMail') || localStorage.getItem('userMail');

    if (!AUTH_TOKEN) {
        window.location.href = "./login.html";
        return;
    }

    const authHeader = `Basic ${AUTH_TOKEN}`;

    const form = document.querySelector('.chooseCard');

    // Mapping intact vers tes Enums Java
    const typeMapping = {
        'standard': 'STANDART',
        'custum': 'CUSTUM',
        'vip': 'VIP'
    };

    /** Workflow de soumission */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const selectedRadio = form.querySelector('input[name="typeCard"]:checked');
        if (!selectedRadio) {
            alert("Veuillez choisir une carte.");
            return;
        }

        const typeAbonnement = typeMapping[selectedRadio.id];

        try {
            // Étape A : Récupérer l'ID de l'utilisateur via son mail de session
            const userRes = await fetch(`http://localhost:8080/api/user/get/byMail?mail=${USER_MAIL}`, {
                headers: { 'Authorization': authHeader }
            });
            const user = await userRes.json();
            const ABONNE_ID = user.id;

            // Étape B : Vérifier l'existence d'une carte (Ton workflow dynamique)
            const checkRes = await fetch(`http://localhost:8080/api/user/get/card/${ABONNE_ID}`, {
                headers: { 'Authorization': authHeader }
            });

            let response;
            if (checkRes.ok) {
                // MISE À JOUR (PUT)
                response = await fetch(`http://localhost:8080/api/user/subscribe/card/byAbonne/${ABONNE_ID}?typeAbonnement=${typeAbonnement}`, {
                    method: 'PUT',
                    headers: { 'Authorization': authHeader }
                });
            } else {
                // CRÉATION (POST)
                response = await fetch(`http://localhost:8080/api/user/create/card/${ABONNE_ID}?typeAbonnement=${typeAbonnement}`, {
                    method: 'POST',
                    headers: { 'Authorization': authHeader }
                });
            }

            if (response.ok) {
                alert("Souscription effectuée avec succès !");
                window.location.href = "./profile.html";
            } else {
                alert("Erreur lors de la souscription.");
            }

        } catch (error) {
            console.error("Erreur technique:", error);
            alert("Le serveur ne répond pas.");
        }
    });
});