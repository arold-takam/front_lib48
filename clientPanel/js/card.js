document.addEventListener('DOMContentLoaded', async () => {
    const credentials = btoa("tata@gmail.com:1234");
    const authHeader = `Basic ${credentials}`;
    const ABONNE_ID = 2;

    const subscribeZone = document.querySelector('.subscribeZone');
    const cardItem = document.querySelector('.cardItem');

    // Éléments de la carte
    const typeSpan = document.querySelector('.type');
    const numP = document.querySelector('.number p');
    const dayDiv = document.querySelector('.day');
    const delBtn = document.querySelector('.del');
    const loadBtn = document.querySelector('.load');

    /** 1. Charger les données de la carte */
    async function loadCardInfo() {
        try {
            const response = await fetch(`http://localhost:8080/api/user/get/card/${ABONNE_ID}`, {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const card = await response.json();

                // Affichage du mode "Carte Active"
                subscribeZone.style.display = 'none';
                cardItem.style.display = 'flex';

                // Remplissage des données
                typeSpan.textContent = card.typeAbonnement; // ex: GOLD, PREMIUM
                numP.textContent = card.id;
                dayDiv.textContent = `${card.duree} jours`;

                loadBtn.href = `./subScribe.html?id=${ABONNE_ID}`;

            } else if (response.status === 404) {
                // Affichage du mode "Pas d'abonnement"
                subscribeZone.style.display = 'flex';
                cardItem.style.display = 'none';
            }
        } catch (e) {
            console.error("Erreur chargement carte:", e);
        }
    }

    /** 2. Supprimer la carte (Action Réaliste) */
    delBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm("Voulez-vous vraiment supprimer votre carte ?")) {
            try {
                const res = await fetch(`http://localhost:8080/api/user/delete/card/${ABONNE_ID}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': authHeader }
                });

                if (res.ok) {
                    alert("Carte supprimée avec succès.");
                    loadCardInfo(); // Rafraîchit l'affichage vers "subscribeZone"
                }
            } catch (e) { console.error("Erreur suppression:", e); }
        }
    });

    loadCardInfo();
});