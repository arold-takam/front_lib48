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
    let currentUserID = null; // Sera récupéré dynamiquement

    const form = document.querySelector('.inscription');
    const nameInput = document.querySelector('#name');
    const mailInput = document.querySelector('#mail');
    const passInput = document.querySelector('#pass');
    const seeBtn = document.querySelector('.see');

    /** 1. Charger les infos actuelles (Dynamisation de l'ID) */
    async function loadCurrentInfo() {
        try {
            // On récupère d'abord l'utilisateur par son mail de session
            const userRes = await fetch(`${API_BASE_URL}/user/get/byMail?mail=${USER_MAIL}`, {
                headers: { 'Authorization': authHeader }
            });

            if (userRes.ok) {
                const user = await userRes.json();
                currentUserID = user.id; // On stocke l'ID réel pour l'update plus tard

                // Remplissage des inputs avec ta logique existante
                nameInput.value = user.name;
                mailInput.value = user.mail;
            }
        } catch (e) { console.error("Erreur chargement profil:", e); }
    }

    /** 2. Gestion de la visibilité (Ta logique intacte) */
    seeBtn.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        seeBtn.querySelector('img').src = isPass
            ? "../ressources/images/eyeClose.png"
            : "../ressources/images/eyeOpen.png";
    });

    /** 3. Soumission du formulaire (Ta logique de DTO préservée) */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!nameInput.value.trim() || !mailInput.value.trim()) {
            alert("Le nom et l'email sont obligatoires.");
            return;
        }

        const updateDTO = {
            name: nameInput.value.trim(),
            mail: mailInput.value.trim(),
            password: passInput.value.trim() === "" ? "" : passInput.value
        };

        if (passInput.value.trim() !== "") {
            updateDTO.password = passInput.value;
        }

        try {
            // Utilisation de l'ID dynamique récupéré au chargement
            const response = await fetch(`${API_BASE_URL}/user/update/${currentUserID}?roleName=ABONNE`, {
                method: 'PUT',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateDTO)
            });

            if (response.ok) {
                // Mise à jour du mail en session au cas où l'utilisateur l'a changé
                sessionStorage.setItem('userMail', updateDTO.mail);

                alert("Compte modifié avec succès !");
                window.location.href = "./profile.html";
            } else {
                const errorText = await response.text();
                alert("Erreur lors de la mise à jour : " + errorText);
            }
        } catch (e) {
            console.error("Erreur technique:", e);
            alert("Le serveur ne répond pas.");
        }
    });

    loadCurrentInfo();
});