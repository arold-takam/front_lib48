document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.signIn');
    const eyeIcon = document.querySelector('.eye');
    const passInput = document.getElementById('pass');

    // 1. Gestion visuelle du mot de passe (Mémoire visuelle)
    eyeIcon.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        eyeIcon.src = isPass ? "../ressources/images/eyeClosed.png" : "../ressources/images/eyeOpen.png";
    });

    // 2. Traitement du formulaire
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const mail = document.getElementById('mail').value;
        const password = passInput.value;

        // Préparation du DTO pour ton @PostMapping "/login"
        const loginData = {
            mail: mail,
            password: password
        };

        // Chaîne Basic Auth pour les futurs appels
        const authString = btoa(`${mail}:${password}`);

        try {
            const response = await fetch('http://localhost:8080/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                // Succès : On stocke l'auth dans le localStorage
                localStorage.setItem('auth', authString);
                localStorage.setItem('userMail', mail);

                // On pourrait récupérer l'ID et le Role ici si ton login renvoyait un objet,
                // mais comme il renvoie un String, on redirige simplement.
                alert("Connexion réussie !");
                window.location.href = "../html/aDashHome.html";
            } else {
                const errorMsg = await response.text();
                alert("Échec : " + errorMsg);
            }
        } catch (err) {
            console.error("Erreur connexion:", err);
            alert("Le serveur ne répond pas.");
        }
    });
});

//TODO: implement security and logout from gemini.