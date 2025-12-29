document.addEventListener('DOMContentLoaded', async () => {
    const credentials = btoa("tata@gmail.com:1234");
    const authHeader = `Basic ${credentials}`;
    const USER_ID = 2;

    const form = document.querySelector('.inscription');
    const nameInput = document.querySelector('#name');
    const mailInput = document.querySelector('#mail');
    const passInput = document.querySelector('#pass');
    const seeBtn = document.querySelector('.see');

    /** 1. Charger les infos actuelles (Pragmatisme : ne pas faire deviner l'user) */
    async function loadCurrentInfo() {
        try {
            const res = await fetch(`http://localhost:8080/api/user/get/${USER_ID}`, {
                headers: { 'Authorization': authHeader }
            });
            if (res.ok) {
                const user = await res.json();
                nameInput.value = user.name;
                mailInput.value = user.mail;
            }
        } catch (e) { console.error("Erreur chargement profil:", e); }
    }

    /** 2. Gestion de la visibilité du mot de passe */
    seeBtn.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        seeBtn.querySelector('img').src = isPass
            ? "../ressources/images/eyeClose.png"
            : "../ressources/images/eyeOpen.png";
    });

    /** 3. Soumission du formulaire */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Sécurité front-end pour Name et Mail (ton backend ne vérifie pas le vide ici)
        if (!nameInput.value.trim() || !mailInput.value.trim()) {
            alert("Le nom et l'email sont obligatoires.");
            return;
        }

        // Construction du DTO
        const updateDTO = {
            name: nameInput.value.trim(),
            mail: mailInput.value.trim(),
            password: passInput.value.trim() === "" ? "" : passInput.value
        };

        // Ajout du password UNIQUEMENT s'il n'est pas vide
        // Ton backend gère le .isBlank(), donc "" ou null conservera l'ancien
        if (passInput.value.trim() !== "") {
            updateDTO.password = passInput.value;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/user/update/${USER_ID}?roleName=ABONNE`, {
                method: 'PUT',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateDTO)
            });

            if (response.ok) {
                alert("Compte modifié avec succes !");

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