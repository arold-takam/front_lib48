import {API_BASE_URL} from "../config.js";

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Sécurité Dynamique
    const AUTH_TOKEN = sessionStorage.getItem('userToken') || localStorage.getItem('userToken');
    const USER_MAIL = sessionStorage.getItem('userMail') || localStorage.getItem('userMail');

    if (!AUTH_TOKEN) return; // Le menu ne se charge pas si pas de token

    const authHeader = `Basic ${AUTH_TOKEN}`;

    // Sélecteurs
    const menuProfileLink = document.querySelector('.profile');
    const initialP = menuProfileLink.querySelector('.initial p');
    const nameP = menuProfileLink.querySelector('.info p');
    const emailB = menuProfileLink.querySelector('.info b');
    const newsBadge = document.querySelector('.news b');
    const borrowBadge = document.querySelector('.borrows b');

    /** 2. Charger les infos Utilisateur et Initiales */
    async function loadUserMenu() {
        try {
            const res = await fetch(`${API_BASE_URL}/user/get/byMail?mail=${USER_MAIL}`, {
                headers: { 'Authorization': authHeader }
            });

            if (res.ok) {
                const user = await res.json();
                nameP.textContent = user.name;
                emailB.textContent = user.mail;

                // Logique des initiales (Identique à ta version)
                const parts = user.name.trim().split(/\s+/).filter(p => p.length > 0);
                let initials = "";
                if (parts.length === 1) {
                    initials = parts[0].charAt(0).repeat(2);
                } else if (parts.length >= 2) {
                    const [p1, p2] = [parts[0].charAt(0), parts[1].charAt(0)];
                    initials = (p1.toUpperCase() === p2.toUpperCase()) ? p1 + p1 : p1 + p2;
                }
                initialP.textContent = initials.toUpperCase();

                // Charger les compteurs une fois l'ID récupéré
                loadStats(user.id);
            }
        } catch (e) { console.error("Erreur menu:", e); }
    }

    /** 3. Mappage des badges (+25 News, +5 Emprunts) */
    async function loadStats(userId) {
        try {
            // Emprunts : on compte la taille du tableau retourné
            const resBorrow = await fetch(`${API_BASE_URL}/borrowBook/get/all/byAbonneID/${userId}`, {
                headers: { 'Authorization': authHeader }
            });
            if (resBorrow.ok) {
                const borrows = await resBorrow.json();
                if(borrowBadge) borrowBadge.textContent = `+${borrows.length} Emprunts`;
            }

            // News : on compte tous les livres (ou les 10 derniers selon ton choix)
            const resBooks = await fetch(`${API_BASE_URL}/books/get/All`, {
                headers: { 'Authorization': authHeader }
            });
            if (resBooks.ok) {
                const books = await resBooks.json();
                if(newsBadge) newsBadge.textContent = `+${books.length} NEWS`;
            }
        } catch (e) { console.error("Erreur stats:", e); }
    }

    loadUserMenu();

    // --- Gestion de l'ouverture/fermeture (Ta logique intacte) ---
    const menuBtn = document.querySelector('.openMenu');
    const menu = document.querySelector('.menu');
    const menuClose = document.querySelector('.close');

    if(menuBtn) menuBtn.addEventListener('click', () => menu.classList.add('active'));
    if(menuClose) menuClose.addEventListener('click', () => menu.classList.remove('active'));
});