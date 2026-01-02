import {API_BASE_URL} from "../config.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.inscription');
    const nameInput = document.querySelector('#name');
    const mailInput = document.querySelector('#mail');
    const passInput = document.querySelector('#pass');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Correspondance exacte avec ton UserRequestDTO (name, mail, password)
        const userData = {
            name: nameInput.value.trim(),
            mail: mailInput.value.trim(),
            password: passInput.value
        };

        // Rôle par défaut pour une inscription client
        const role = "ABONNE";

        try {
            const response = await fetch(`${API_BASE_URL}/user/register?roleName=${role}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.status === 201) {
                alert("Inscription réussie !");
                window.location.href = "./login.html";
            } else {
                const errorText = await response.text();
                alert("Échec : " + (errorText || "Vérifiez vos informations."));
            }
        } catch (error) {
            console.error("Erreur technique :", error);
            alert("Impossible de joindre le serveur.");
        }
    });

    // Optionnel : Petit bonus pour l'œil (réaliste)
    const eyeIcon = document.querySelector('.see');
    eyeIcon.addEventListener('click', () => {
        passInput.type = passInput.type === 'password' ? 'text' : 'password';
    });
});