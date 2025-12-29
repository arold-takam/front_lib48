document.addEventListener('DOMContentLoaded', async () => {
    const credentials = btoa("tata@gmail.com:1234");
    const authHeader = `Basic ${credentials}`;
    const USER_ID = 2;

    const menuProfileLink = document.querySelector('.profile');
    const initialP = menuProfileLink.querySelector('.initial p');
    const nameP = menuProfileLink.querySelector('.info p');
    const emailB = menuProfileLink.querySelector('.info b');

    async function loadMenuData() {
        try {
            const res = await fetch(`http://localhost:8080/api/user/get/${USER_ID}`, {
                headers: { 'Authorization': authHeader }
            });

            if (res.ok) {
                const user = await res.json();

                // 1. Remplissage du Nom et Email
                nameP.textContent = user.name;
                emailB.textContent = user.mail;

                // 2. Logique des initiales (Règle : 2 lettres obligatoires)
                const parts = user.name.trim().split(/\s+/).filter(p => p.length > 0);
                let initials = "";

                if (parts.length === 1) {
                    // Un seul nom -> on double la lettre (ex: "Tata" -> "TT")
                    const char = parts[0].charAt(0);
                    initials = char + char;
                } else if (parts.length >= 2) {
                    const firstChar = parts[0].charAt(0);
                    const secondChar = parts[1].charAt(0);

                    if (firstChar.toUpperCase() === secondChar.toUpperCase()) {
                        // Initiales identiques -> on double (ex: "Thomas Traoré" -> "TT")
                        initials = firstChar + firstChar;
                    } else {
                        // Deux initiales différentes
                        initials = firstChar + secondChar;
                    }
                }

                initialP.textContent = initials.toUpperCase();
            }
        } catch (e) {
            console.error("Erreur chargement menu:", e);
        }
    }

    loadMenuData();

    // Ton code de comportement existant
    const menuBtn = document.querySelector('.openMenu');
    const menu = document.querySelector('.menu');
    const menuClose = document.querySelector('.close');

    menuBtn.addEventListener('click', () => menu.classList.add('active'));
    menuClose.addEventListener('click', () => menu.classList.remove('active'));
});