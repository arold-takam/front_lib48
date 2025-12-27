async function fetchAndDisplayBooks() {
    const container = document.querySelector('.panel .panelDown');
    console.log(container)

    const auth = localStorage.getItem('auth');

    // 1. Sécurité : Si pas d'auth, on redirige
    if (!auth) {
        window.location.replace("login.html");
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_URL}/books/get/All`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
            }
        });

        if (!response.ok) throw new Error("Erreur " + response.status);

        const books = await response.json();
        container.innerHTML = "";
        if (books.length === 0){
            container.innerHTML = `<p style='padding:20px; color:red; font-size: x-large;'>No Book yet...</p>`;
        }

        books.forEach(book => {
            const li = document.createElement('li');
            li.className = 'bookLine';
            li.innerHTML = `
                <ul class="infoLine">
                    <li><a href="../html/aDashBookDetails.html?id=${book.id}">${book.titre}</a></li>
                    <li>${book.auteur}</li>
                    <li>${book.etatLivre}</li>
                    <li>${book.estDisponible ? 'DISPONIBLE' : 'EMPRUNTÉ'}</li>
                </ul>
            `;
            container.appendChild(li);
        });

    } catch (error) {
        console.error("Erreur:", error);
        container.innerHTML = `<p style='padding:20px; color:red; font-size: x-large;'>Accès refusé ou serveur éteint.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayBooks);