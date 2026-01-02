import {API_BASE_URL} from "../config.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.inscription');
    const mailInput = document.querySelector('#mail');
    const passInput = document.querySelector('#pass');
    const seeBtn = document.querySelector('.see');
    const rememberMe = document.querySelector('#mind');

    /** 1. Gestion de la visibilité du mot de passe */
    seeBtn.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        seeBtn.querySelector('img').src = isPass
            ? "../ressources/images/eyeClosed.png"
            : "../ressources/images/eyeOpen.png";
    });

    /** 2. Tentative de connexion */
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const mail = mailInput.value.trim();
        const password = passInput.value;

        // Préparation du DTO pour le controller
        const loginRequest = { mail, password };

        try {
            const response = await fetch(`${API_BASE_URL}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginRequest)
            });

            if (response.ok) {
                // Création du Token Basic Auth
                const token = btoa(`${mail}:${password}`);

                // Choix pragmatique du stockage
                const storage = rememberMe.checked ? localStorage : sessionStorage;
                storage.setItem('userToken', token);
                storage.setItem('userMail', mail); // Utile pour récupérer l'ID plus tard

                // Redirection vers l'accueil
                alert("Connexion effectuee avec success!");
                window.location.href = "./home.html";
            } else {
                alert("Identifiants incorrects. Veuillez réessayer.");
            }
        } catch (error) {
            console.error("Erreur technique login:", error);
            alert("Impossible de contacter le serveur.");
        }
    });
});