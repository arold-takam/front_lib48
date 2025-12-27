document.addEventListener('DOMContentLoaded', async () => {
    const auth = localStorage.getItem('auth');
    const gerantId = localStorage.getItem('userId');
    const returnForm = document.querySelector('.returnForm');
    const borrowSelect = document.getElementById('borrowId');
    const dateInput = document.getElementById('dateRetour');

    // 1. Sécurité & Initialisation
    if (!auth || !gerantId) { window.location.replace("login.html"); return; }
    if (dateInput) dateInput.valueAsDate = new Date(); // Date du jour par défaut

    // 2. Charger les emprunts EN_COURS (Pragmatique : liste propre)
    async function loadActiveBorrows() {
        try {
            const response = await fetch('http://localhost:8080/api/borrowBook/get/all/byStatus?status=EN_COURS', {
                headers: { 'Authorization': `Basic ${auth}` }
            });

            if (response.ok) {
                const borrows = await response.json();
                borrowSelect.innerHTML = '<option value="DÉFAUT" selected disabled>(---Choisir l\'emprunt---)</option>';

                borrows.forEach(b => {
                    const option = document.createElement('option');
                    option.value = b.idBorrow; // Correspond au record ReturnRequestDTO(..., int borrowBookID)
                    option.textContent = `${b.BookTitle} (Abonné: ${b.abonneName})`;
                    borrowSelect.appendChild(option);
                });
            }
        } catch (err) { console.error("Erreur de chargement:", err); }
    }

    await loadActiveBorrows();

    // 3. Soumission du retour
    returnForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const selectedBorrowId = borrowSelect.value;
        const selectedEtat = document.getElementById('etatLivre').value;
        const selectedDate = document.getElementById('dateRetour').value;

        if (selectedBorrowId === "DÉFAUT" || selectedEtat === "DÉFAUT" || !selectedDate) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        // Mapping exact vers ton ReturnRequestDTO(LocalDate dateRetour, int borrowBookID)
        const returnRequestDTO = {
            dateRetour: selectedDate,
            borrowBookID: parseInt(selectedBorrowId)
        };

        try {
            // URL attendue: /create/{idGerant}?etatLivre=...
            const response = await fetch(`http://localhost:8080/api/returnBook/create/${gerantId}?etatLivre=${selectedEtat}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(returnRequestDTO)
            });

            if (response.ok) {
                alert("✅ Retour enregistré ! Les pénalités ont été appliquées si nécessaire.");
                window.location.href = "./aDashReturn.html";
            } else {
                const errorMsg = await response.text();
                alert("⚠️ Échec du retour : " + errorMsg);
            }
        } catch (err) {
            alert("Serveur indisponible.");
        }
    });
});