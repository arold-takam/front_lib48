import {API_BASE_URL} from "../config.js";

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Récupération dynamique de la session
    const AUTH_TOKEN = sessionStorage.getItem('userToken') || localStorage.getItem('userToken');
    const USER_MAIL = sessionStorage.getItem('userMail') || localStorage.getItem('userMail');

    if (!AUTH_TOKEN) {
        window.location.href = "./login.html";
        return;
    }

    const authHeader = `Basic ${AUTH_TOKEN}`;

    const infoList = document.querySelector('.infoline');
    const initialDiv = document.querySelector('.infoProfile .initial');
    const passP = document.querySelector('.pass p');
    const seeBtn = document.querySelector('.see');

    let realPassword = "";

    /** 2. Charger les informations utilisateur via le Mail stocké */
    async function loadUserProfile() {
        try {
            // Pragmatique : on récupère l'utilisateur par son mail de session
            const response = await fetch(`${API_BASE_URL}/user/get/byMail?mail=${USER_MAIL}`, {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const user = await response.json();

                // 1. Remplissage des infos textuelles
                infoList.querySelector('li:nth-child(1) p').textContent = user.name;
                infoList.querySelector('li:nth-child(2) p').textContent = user.mail;
                infoList.querySelector('li:nth-child(4) p').textContent = user.roleName;

                // 2. Ta Logique des initiales (Intacte)
                const parts = user.name.trim().split(/\s+/).filter(p => p.length > 0);
                let finalInitials = "";

                if (parts.length === 1) {
                    const char = parts[0].charAt(0);
                    finalInitials = char + char;
                } else if (parts.length >= 2) {
                    const firstChar = parts[0].charAt(0);
                    const secondChar = parts[1].charAt(0);
                    finalInitials = (firstChar.toUpperCase() === secondChar.toUpperCase())
                        ? firstChar + firstChar
                        : firstChar + secondChar;
                }
                initialDiv.textContent = finalInitials.toUpperCase();

                // 3. Gestion du mot de passe
                realPassword = user.password || "********";
            }
        } catch (e) {
            console.error("Erreur profil:", e);
        }
    }

    /** 3. Gestion de la visibilité (Ta logique intacte) */
    seeBtn.addEventListener('click', () => {
        if (passP.textContent === "********") {
            passP.textContent = realPassword;
            seeBtn.querySelector('img').src = "../ressources/images/eyeClosedd.png";
        } else {
            passP.textContent = "********";
            seeBtn.querySelector('img').src = "../ressources/images/eyeOpen.png";
        }
    });

    loadUserProfile();
});