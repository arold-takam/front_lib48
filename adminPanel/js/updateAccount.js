// 1. Fonction de pré-remplissage
import {API_BASE_URL} from "../config.js";

async function fillForm(auth, adminId) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/get/${adminId}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });

        if (response.ok) {
            const admin = await response.json();
            document.getElementById('name').value = admin.name;
            document.getElementById('mail').value = admin.mail;
        }
    } catch (err) {
        console.error("Erreur de pré-remplissage:", err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const auth = localStorage.getItem('auth');
    const adminId = localStorage.getItem('userId');
    const currentMail = localStorage.getItem('userMail');
    const updateForm = document.querySelector('.updateAccount');
    const eyeIcon = document.querySelector('.eye');
    const passInput = document.getElementById('pass');

    // Sécurité de base
    if (!auth || !adminId) {
        window.location.replace("login.html");
        return;
    }

    // Gestion de l'icône de visibilité
    eyeIcon.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        eyeIcon.src = isPass ? "../ressources/images/eyeClosed.png" : "../ressources/images/eyeOpen.png";
    });

    // Remplissage des données actuelles
    await fillForm(auth, adminId);

    // Soumission du formulaire
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newName = document.getElementById('name').value;
        const newMail = document.getElementById('mail').value;
        const newPass = passInput.value.trim();

        // PRAGMATISME : On construit l'objet dynamiquement
        const updateData = {
            name: newName,
            mail: newMail,
            password: newPass
        };

        // Si le mot de passe est saisi, on l'ajoute. Sinon, on ne l'envoie pas.
        if (newPass !== "") {
            updateData.password = newPass;
        }

        try {
            // Ton endpoint : PUT /user/update/{userID}?roleName=GERANT
            const response = await fetch(`${API_BASE_URL}/user/update/${adminId}?roleName=GERANT`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                // MISE À JOUR DE LA CLÉ D'AUTHENTIFICATION (Si mail ou pass change)
                if (newMail !== currentMail || newPass !== "") {
                    const finalMail = newMail || currentMail;

                    // Si nouveau pass saisi, on l'utilise, sinon on ne peut pas
                    // recalculer l'auth (car on n'a pas l'ancien pass en clair).
                    // On part du principe que si l'admin change son mail mais pas son pass,
                    // il faudra qu'il se reconnecte ou que tu gères l'ancien pass en session.

                    if (newPass !== "") {
                        const newAuthString = btoa(`${finalMail}:${newPass}`);
                        localStorage.setItem('auth', newAuthString);
                    }
                    localStorage.setItem('userMail', finalMail);
                }

                alert("Compte mis à jour !");
                window.location.reload();
            } else {
                const error = await response.text();
                alert("Erreur : " + error);
            }
        } catch (err) {
            console.error("Erreur technique:", err);
            alert("Le serveur ne répond pas.");
        }
    });
});