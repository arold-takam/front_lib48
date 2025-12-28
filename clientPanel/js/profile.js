document.addEventListener('DOMContentLoaded', async () => {
    const credentials = btoa("tata@gmail.com:1234");
    const authHeader = `Basic ${credentials}`;
    const USER_ID = 2; // ID de l'abonné connecté

    const infoList = document.querySelector('.infoline');
    const initialDiv = document.querySelector('.infoProfile .initial');
    const passP = document.querySelector('.pass p');
    const seeBtn = document.querySelector('.see');

    let realPassword = "";

    /** 1. Charger les informations utilisateur */
    async function loadUserProfile() {
        try {
            const response = await fetch(`http://localhost:8080/api/user/get/${USER_ID}`, {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const user = await response.json();

                // 1. Remplissage des infos textuelles
                infoList.querySelector('li:nth-child(1) p').textContent = user.name;
                infoList.querySelector('li:nth-child(2) p').textContent = user.mail;
                infoList.querySelector('li:nth-child(4) p').textContent = user.roleName;

                // 2. Logique des initiales (Placée ICI, après réception de 'user')
                // Logique des initiales personnalisée
                const parts = user.name.trim().split(/\s+/).filter(p => p.length > 0);

                let finalInitials = "";

                if (parts.length === 1) {
                    // Cas 1 : Un seul nom -> on double la première lettre
                    const char = parts[0].charAt(0);
                    finalInitials = char + char;
                } else if (parts.length >= 2) {
                    const firstChar = parts[0].charAt(0);
                    const secondChar = parts[1].charAt(0);

                    if (firstChar.toUpperCase() === secondChar.toUpperCase()) {
                        // Cas 2 : Deux noms avec la même initiale -> on double
                        finalInitials = firstChar + firstChar;
                    } else {
                        // Cas classique : Deux initiales différentes
                        finalInitials = firstChar + secondChar;
                    }
                }

                initialDiv.textContent = finalInitials.toUpperCase();

// Debug pour confirmer
                console.log(`Nom: ${user.name} -> Initiales: ${finalInitials.toUpperCase()}`);

                // 3. Gestion du mot de passe
                realPassword = user.password || "********";
            }
        } catch (e) {
            console.error("Erreur profil:", e);
        }
    }

    /** 2. Gestion de la visibilité du mot de passe */
    seeBtn.addEventListener('click', () => {
        if (passP.textContent === "********") {
            passP.textContent = realPassword;
            seeBtn.querySelector('img').src = "../ressources/images/eyeClosed.png"; // Change l'icône
        } else {
            passP.textContent = "********";
            seeBtn.querySelector('img').src = "../ressources/images/eyeOpen.png";
        }
    });

    loadUserProfile();
});