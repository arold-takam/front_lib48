import {API_BASE_URL} from "../config.js";

document.addEventListener('DOMContentLoaded', async () => {
    const auth = localStorage.getItem('auth');
    const connectedMail = localStorage.getItem('userMail'); // Stocké au login

    // 1. Récupérer l'ID dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('id');

    const form = document.querySelector('.mainSect');
    const deleteBtn = document.querySelector('.ok');
    const backBtn = document.querySelector('.back');
    const titleH2 = document.querySelector('.mainSect h2');

    if (!targetUserId) return;

    // 2. Transmettre l'ID au bouton de retour (si besoin de revenir à la fiche précise)
    backBtn.href = `./aDashUser.html?id=${targetUserId}`;

    try {
        // 3. Récupérer les infos de l'utilisateur cible pour comparer le mail
        const response = await fetch(`${API_BASE_URL}/user/get/${targetUserId}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const targetUser = await response.json();

        // 4. PROTECTION PRAGMATIQUE : L'admin ne peut pas se supprimer
        if (targetUser.mail === connectedMail) {
            titleH2.textContent = "Action impossible : Vous ne pouvez pas supprimer votre propre compte.";
            titleH2.style.color = "red";
            titleH2.style.fontSize = "1.8rem";
            deleteBtn.disabled = true;
            deleteBtn.style.opacity = "0.5";
            deleteBtn.style.cursor = "not-allowed";
        }

        // 5. Validation de la suppression
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const deleteResponse = await fetch(`${API_BASE_URL}/user/delete/${targetUserId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${auth}` }
            });

            if (deleteResponse.ok) {
                alert("Utilisateur supprimé avec succès.");
                window.location.href = "aDashAccount.html"; // Retour à la liste globale
            } else {
                alert("Erreur lors de la suppression.");
            }
        });

    } catch (error) {
        console.error("Erreur:", error);
    }
});