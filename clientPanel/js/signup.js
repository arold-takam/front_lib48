document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.inscription');
    const nameInput = document.querySelector('#name');
    const mailInput = document.querySelector('#mail');
    const passInput = document.querySelector('#pass');
    const seeBtn = document.querySelector('.see');
    const rememberMe = document.querySelector('#mind');

    /** 1. Gestion visuelle du mot de passe */
    seeBtn.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        seeBtn.querySelector('img').src = isPass
            ? "../ressources/images/eyeClosed.png"
            : "../ressources/images/eyeOpen.png";
    });

    /** 2. Envoi des données au contrôleur */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Préparation du DTO correspondant à UserRequestDTO
        const userRequestDTO = {
            name: nameInput.value.trim(),
            mail: mailInput.value.trim(),
            password: passInput.value
        };

        try {
            // Appel à l'endpoint /user/register avec roleName en paramètre
            const response = await fetch(`http://localhost:8080/user/register?roleName=ABONNE`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userRequestDTO)
            });

            if (response.status === 201) {
                // Succès : On stocke les credentials si "Se souvenir de moi" est coché
                const credentials = btoa(`${userRequestDTO.mail}:${userRequestDTO.password}`);
                const storage = rememberMe.checked ? localStorage : sessionStorage;

                storage.setItem('userToken', credentials);
                storage.setItem('userMail', userRequestDTO.mail);

                alert("Compte créé avec succès !");
                window.location.href = "./home.html";
            } else if (response.status === 400) {
                alert("Erreur : Les données saisies sont invalides ou l'email existe déjà.");
            } else {
                alert("Une erreur est survenue lors de l'inscription.");
            }

        } catch (error) {
            console.error("Erreur technique:", error);
            alert("Impossible de contacter le serveur.");
        }
    });
});