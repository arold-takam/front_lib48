const params = new URLSearchParams(window.location.search);
const bookID = params.get("id");

console.log("Book ID = " + bookID);

const name = "toto@gmail.com";
const password = "toto237";
const auth = btoa(`${name}:${password}`);

async function loadBookDetails() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/books/get/byID/${bookID}`,{
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
            }
        });

        if (!response.ok) throw new Error("Erreur: "+response.status);

        const book = await response.json();
        displayBookDetails(book);
    }catch(err) {
        console.error("Erreur: ", err);
        document.querySelector('.bookCard').innerHTML = `<p style = 'padding: 20px; color: red; font-size: x-large;'>Impossible de charger les détails du livre.</p>`;
    }
}

function displayBookDetails(book) {
    const pageTitle = document.querySelector('.titleFrame h1');
    pageTitle.innerHTML = `<h1>${book.titre}</h1>`;

    console.log("Book page url: ", book.urlCoverImage);

    const card = document.querySelector('.bookCard .card');
    card.style.background = `url(${book.urlCoverImage}) center no-repeat || url("../ressources/images/fondMenu.jpg") center no-repeat`;
    card.style.backgroundSize = "cover";

    const infoList = document.querySelector('.bookCard .groupInfo');
    infoList.innerHTML = `
        <li>
            <p>Catégorie :</p>
            <b>${book.category?.nom || 'N/A'}</b>
        </li>
        <li>
            <p>Auteur :</p>
            <b>${book.auteur}</b>
        </li>
        <li>
            <p>Éditeur :</p>
            <b>${book.editeur}</b>
        </li>
        <li>
            <p>État du livre :</p>
            <b>${book.etatLivre}</b>
        </li>
        <li>
            <p>Disponibilité :</p>
            <b>${book.estDisponible ? 'DISPONIBLE' : 'EMPRUNTE'}</b>
        </li>
    `;
}

document.addEventListener('DOMContentLoaded', loadBookDetails);