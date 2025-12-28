document.addEventListener('DOMContentLoaded', async () => {
    const credentials = btoa("tata@gmail.com:1234");
    const authHeader = `Basic ${credentials}`;
    const ABONNE_ID = 2;

    // Sélecteurs Listes
    const doneUl = document.querySelector(".doneList ul");
    const runningUl = document.querySelector(".runningList ul");

    /** 1. Formater la date et l'heure */
    function formatDateTime(dateString) {
        const dateObj = new Date(dateString);
        return {
            date: dateObj.toLocaleDateString('fr-FR'),
            time: dateObj.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            }).replace(':', 'h')
        };
    }

    /** 2. Créer et injecter l'élément HTML d'un emprunt */
    async function createAndAppendBorrowItem(borrow) {
        try {
            const bookRes = await fetch(`http://localhost:8080/api/borrowBook/get/bookBorrowed/byTitle?bookTitle=${encodeURIComponent(borrow.BookTitle)}`, {
                headers: { 'Authorization': authHeader }
            });

            // VERIFICATION : Si la réponse est vide ou en erreur, on arrête proprement
            if (!bookRes.ok || bookRes.status === 204) {
                console.warn(`Livre non trouvé pour le titre: ${borrow.BookTitle}`);
                return;
            }

            const book = await bookRes.json();
            const { date, time } = formatDateTime(borrow.dateEmprunt);

            const li = document.createElement('li');
            li.innerHTML = `
                <a href="./bookDetails.html?id=${book.id}">
                    <h3>${book.titre}</h3>
                    <div class="stamp">
                        <div class="date"><b>Le:</b><p>${date}</p></div>
                        <div class="time"><b>A:</b><p>${time}</p></div>
                    </div>
                </a>`;

            // Distribution dans la bonne liste selon le statut
            if (borrow.status === "TERMINE") {
                doneUl.appendChild(li);
            } else {
                runningUl.appendChild(li);
            }
        } catch (e) {
            console.error("Erreur sur l'emprunt ID " + borrow.id, e);
        }
    }

    /** 3. Charger tous les emprunts de l'abonné */
    async function loadUserBorrows() {
        try {
            const response = await fetch(`http://localhost:8080/api/borrowBook/get/all/byAbonneID/${ABONNE_ID}`, {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const borrows = await response.json();
                // Nettoyage initial
                doneUl.innerHTML = '';
                runningUl.innerHTML = '';

                // On traite chaque emprunt
                for (const borrow of borrows) {
                    await createAndAppendBorrowItem(borrow);
                }

                // Mise à jour du compteur menu
                const counter = document.querySelector('.borrows b');
                if(counter) counter.textContent = `+${borrows.length} Emprunts`;
            }
        } catch (e) {
            console.error("Erreur tracking global:", e);
        }
    }

    // Lancement du chargement
    loadUserBorrows();

    // --- Gestion des Boutons (Ton code existant) ---
    let doneBtn = document.querySelector(".btnList .done");
    let notDoneBtn = document.querySelector(".btnList .notDone");
    let doneList = document.querySelector(".screen .doneList");
    let runningList = document.querySelector(".screen .runningList");

    doneBtn.addEventListener("click", () => {
        doneList.style.display = 'flex';
        doneBtn.style.backgroundColor = '#0061FF';
        doneBtn.style.color = 'white';
        notDoneBtn.style.backgroundColor = 'white';
        notDoneBtn.style.color = 'black';
        runningList.style.display = 'none';
    });

    notDoneBtn.addEventListener("click", () => {
        runningList.style.display = 'flex';
        notDoneBtn.style.backgroundColor = 'black';
        notDoneBtn.style.color = 'white';
        doneBtn.style.backgroundColor = 'white';
        doneBtn.style.color = '#0061FF';
        doneList.style.display = 'none';
    });
});