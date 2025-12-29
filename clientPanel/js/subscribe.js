document.addEventListener('DOMContentLoaded', () => {
    const credentials = btoa("tata@gmail.com:1234");
    const authHeader = `Basic ${credentials}`;
    const ABONNE_ID = 2;

    const form = document.querySelector('.chooseCard');

    // Mapping de tes IDs HTML vers tes Enums Java (TypeAbonnement)
    const typeMapping = {
        'standard': 'STANDART', // Adapté à ton Enum
        'custum': 'CUSTUM',
        'vip': 'VIP'
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Récupérer le type choisi
        const selectedRadio = form.querySelector('input[name="typeCard"]:checked');
        if (!selectedRadio) {
            alert("Veuillez choisir une carte.");
            return;
        }

        const typeAbonnement = typeMapping[selectedRadio.id];

        try {
            // 2. Vérifier si l'utilisateur a déjà une carte (Workflow dynamique)
            const checkRes = await fetch(`http://localhost:8080/api/user/get/card/${ABONNE_ID}`, {
                headers: { 'Authorization': authHeader }
            });

            let response;
            if (checkRes.ok) {
                // CAS : RÉABONNEMENT / MISE À JOUR (PUT)
                response = await fetch(`http://localhost:8080/api/user/subscribe/card/byAbonne/${ABONNE_ID}?typeAbonnement=${typeAbonnement}`, {
                    method: 'PUT',
                    headers: { 'Authorization': authHeader }
                });
            } else {
                // CAS : PREMIER ABONNEMENT (POST)
                response = await fetch(`http://localhost:8080/api/user/create/card/${ABONNE_ID}?typeAbonnement=${typeAbonnement}`, {
                    method: 'POST',
                    headers: { 'Authorization': authHeader }
                });
            }

            // 3. Traitement du résultat
            if (response.ok) {
                alert("Souscription effectuée avec succes!");
                window.location.href = "./profile.html";
            } else {
                const errorData = await response.text();
                alert("Erreur: " + errorData);
            }

        } catch (error) {
            console.error("Erreur workflow abonnement:", error);
            alert("Une erreur technique est survenue.");
        }
    });
});