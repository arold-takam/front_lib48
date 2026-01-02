import {API_BASE_URL} from "../config.js";

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Récupération dynamique du Token et du Mail
    const AUTH_TOKEN = sessionStorage.getItem('userToken') || localStorage.getItem('userToken');
    const USER_MAIL = sessionStorage.getItem('userMail') || localStorage.getItem('userMail');

    if (!AUTH_TOKEN) {
        window.location.href = "./login.html";
        return;
    }

    const authHeader = `Basic ${AUTH_TOKEN}`;
    let currentAbonneID = null;

    const subscribeZone = document.querySelector('.subscribeZone');
    const cardItem = document.querySelector('.cardItem');

    // Éléments de la carte
    const typeSpan = document.querySelector('.type');
    const numP = document.querySelector('.number p');
    const dayDiv = document.querySelector('.day');
    const delBtn = document.querySelector('.del');
    const loadBtn = document.querySelector('.load');

    /** 2. Récupérer l'ID de l'abonné via son mail */
    async function getAbonneID() {
        try {
            const res = await fetch(`${API_BASE_URL}/user/get/byMail?mail=${USER_MAIL}`, {
                headers: { 'Authorization': authHeader }
            });
            if (res.ok) {
                const user = await res.json();
                currentAbonneID = user.id;
                loadCardInfo(); // Une fois l'ID obtenu, on charge la carte
            }
        } catch (e) { console.error("Erreur ID utilisateur:", e); }
    }

    /** 3. Charger les données de la carte */
    async function loadCardInfo() {
        if (!currentAbonneID) return;

        try {
            const response = await fetch(`${API_BASE_URL}/user/get/card/${currentAbonneID}`, {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const card = await response.json();
                subscribeZone.style.display = 'none';
                cardItem.style.display = 'flex';

                typeSpan.textContent = card.typeAbonnement;
                numP.textContent = card.cardNumber;
                dayDiv.textContent = `${card.duree} jours`;

                loadBtn.href = `./subScribe.html?id=${currentAbonneID}`;
            } else {
                subscribeZone.style.display = 'flex';
                cardItem.style.display = 'none';
            }
        } catch (e) { console.error("Erreur carte:", e); }
    }

    /** 4. Supprimer la carte */
    delBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm("Voulez-vous vraiment supprimer votre carte ?")) {
            try {
                const res = await fetch(`${API_BASE_URL}/user/delete/card/${currentAbonneID}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': authHeader }
                });

                if (res.ok) {
                    alert("Carte supprimée.");
                    loadCardInfo();
                }
            } catch (e) { console.error("Erreur suppression:", e); }
        }
    });

    getAbonneID();
});