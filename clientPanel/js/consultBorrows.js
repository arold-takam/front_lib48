document.addEventListener('DOMContentLoaded', async () => {
    // 1. Récupération dynamique du Token et du Mail
    const AUTH_TOKEN = sessionStorage.getItem('userToken') || localStorage.getItem('userToken');
    const USER_MAIL = sessionStorage.getItem('userMail') || localStorage.getItem('userMail');

    if (!AUTH_TOKEN) {
        window.location.href = "./login.html";
        return;
    }

    const authHeader = `Basic ${AUTH_TOKEN}`;

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

            if (!bookRes.ok || bookRes.status === 204) return;

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

            if (borrow.status === "TERMINE") {
                doneUl.appendChild(li);
            } else {
                runningUl.appendChild(li);
            }
        } catch (e) { console.error(e); }
    }

    /** 3. Charger tous les emprunts de l'abonné connecté */
    async function loadUserBorrows() {
        try {
            // Récupération de l'ID via le mail
            const userRes = await fetch(`http://localhost:8080/api/user/get/byMail?mail=${USER_MAIL}`, {
                headers: { 'Authorization': authHeader }
            });
            const user = await userRes.json();

            const response = await fetch(`http://localhost:8080/api/borrowBook/get/all/byAbonneID/${user.id}`, {
                headers: { 'Authorization': authHeader }
            });

            if (response.ok) {
                const borrows = await response.json();
                doneUl.innerHTML = '';
                runningUl.innerHTML = '';

                for (const borrow of borrows) {
                    await createAndAppendBorrowItem(borrow);
                }

                // Mise à jour du compteur menu (Pragmatique : reflet de la réalité)
                const counter = document.querySelector('.borrows b');
                if(counter) counter.textContent = `+${borrows.length} Emprunts`;
            }
        } catch (e) { console.error(e); }
    }

    loadUserBorrows();

    // --- Gestion des Boutons (Ta logique intacte) ---
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