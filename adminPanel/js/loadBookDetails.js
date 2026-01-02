import {API_BASE_URL} from "../config.js";

const params = new URLSearchParams(window.location.search);
const bookID = params.get("id");
const auth = localStorage.getItem('auth');

if (!auth) {
    window.location.replace("login.html");
}

console.log(bookID);

// 1. Fonction pour récupérer une image protégée par Auth
async function fetchProtectedImage(url) {
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        if (!response.ok) return "../ressources/images/fondMenu.jpg";

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (err) {
        return "../ressources/images/fondMenu.jpg";
    }
}

async function loadBookDetails() {
    try {
        const response = await fetch(`${API_BASE_URL}/books/get/byID/${bookID}`, {
            method: 'GET',
            headers: { 'Authorization': `Basic ${auth}` }
        });

        if (response.status === 401) {
            localStorage.clear();
            window.location.replace("login.html");
            return;
        }

        if (!response.ok) throw new Error("Erreur: " + response.status);

        const book = await response.json();
        displayBookDetails(book);
    } catch (err) {
        console.error("Erreur: ", err);
        const card = document.querySelector('.bookCard');
        if (card) card.innerHTML = `<p style='color: red;'>Impossible de charger les détails.</p>`;
    }
}

async function displayBookDetails(book) {
    // Titre
    const pageTitle = document.querySelector('.titleFrame h1');
    if (pageTitle) pageTitle.textContent = book.titre;

    // Image avec gestion du 401
    const card = document.querySelector('.bookCard .card');
    if (card) {
        const imageUrl = book.urlCoverImage || "../ressources/images/fondMenu.jpg";

        card.style.backgroundImage = `url(${imageUrl})`;
        card.style.backgroundPosition = "center";
        card.style.backgroundSize = "cover";
    }

    // Infos
    const infoList = document.querySelector('.bookCard .groupInfo');
    if (infoList) {
        infoList.innerHTML = `
            <li><p>Catégorie :</p><b>${book.category?.nom || 'N/A'}</b></li>
            <li><p>Auteur :</p><b>${book.auteur}</b></li>
            <li><p>Éditeur :</p><b>${book.editeur}</b></li>
            <li><p>État :</p><b>${book.etatLivre}</b></li>
            <li><p>Disponibilité :</p><b>${book.estDisponible ? 'DISPONIBLE' : 'EMPRUNTÉ'}</b></li>
        `;
    }

    // Mise à jour sidebar
    const sidebarMail = document.querySelector('.profile .info p');
    if (sidebarMail) sidebarMail.textContent = localStorage.getItem('userMail');

// GESTION DES CTA------------------------------------------------------------
    const delBtn = document.querySelector('.del');
    if (delBtn) {
        delBtn.href = `../html/aDelBook.html?id=${book.id}`;
    }

    const updBtn = document.querySelector('.cta .update');
    if (updBtn) {
        updBtn.href = `../html/aUpdateBook.html?id=${book.id}`;
    }

    window.displayBookDetails = displayBookDetails;
}

document.addEventListener('DOMContentLoaded', loadBookDetails);