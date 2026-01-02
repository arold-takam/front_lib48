import {API_BASE_URL} from "../config.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.signIn');
    const passInput = document.getElementById('pass');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const mail = document.getElementById('mail').value;
        const password = passInput.value;
        const loginData = { mail, password };
        const authString = btoa(`${mail}:${password}`);

        try {
            // 1. Tentative de connexion
            const loginResponse = await fetch(`${API_BASE_URL}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            if (loginResponse.ok) {
                // 2. Récupération des détails de l'utilisateur pour vérifier son rôle
                const userResponse = await fetch(`${API_BASE_URL}/user/get/byMail?mail=${mail}`, {
                    headers: { 'Authorization': `Basic ${authString}` }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();

                    // 3. Vérification stricte du rôle GERANT
                    if (userData.roleName === 'GERANT') {
                        localStorage.setItem('auth', authString);
                        localStorage.setItem('userMail', mail);
                        localStorage.setItem('userRole', userData.roleName);

                        alert("Bienvenue, Administrateur.");
                        window.location.href = "../html/aDashHome.html";
                    } else {
                        // C'est un ABONNE qui tente d'entrer sur l'admin
                        alert("Accès refusé : Cet espace est réservé aux administrateurs.");
                        window.location.href = "../../index.html";
                    }
                }
            } else {
                alert("Identifiants incorrects.");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur de connexion au serveur.");
        }
    });
});