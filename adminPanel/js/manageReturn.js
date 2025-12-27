document.addEventListener('DOMContentLoaded', async () => {
    const auth = localStorage.getItem('auth');
    const gerantId = localStorage.getItem('userId');
    const returnForm = document.querySelector('.returnForm');
    const borrowSelect = document.getElementById('borrowId');

    if (!auth || !gerantId) {
        window.location.replace("login.html");
        return;
    }

    // 1. Charger les emprunts actifs pour remplir le SELECT
    async function loadActiveBorrows() {
        try {
            const response = await fetch('http://localhost:8080/api/borrowBook/get/all', {
                headers: { 'Authorization': `Basic ${auth}` }
            });

            if (response.ok) {
                const borrows = await response.json();

                // On vide les options statiques (sauf la première par défaut)
                borrowSelect.innerHTML = '<option value="DÉFAUT" selected disabled>(---Choisir l\'emprunt---)</option>';

                // On filtre pour ne proposer que ce qui n'est pas encore rendu
                borrows.filter(b => b.status !== 'RENDU').forEach(borrow => {
                    const option = document.createElement('option');
                    option.value = borrow.id; // L'ID que le DTO attend
                    option.textContent = `${borrow.book} (Abonné: ${borrow.abonneName || 'Inconnu'})`;
                    borrowSelect.appendChild(option);
                });
            }
        } catch (err) {
            console.error("Erreur chargement emprunts:", err);
        }
    }

    await loadActiveBorrows();

    // 2. Soumission du retour
    returnForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const selectedBorrowId = borrowSelect.value;
        const selectedEtat = document.getElementById('etatLivre').value;

        if (selectedBorrowId === "DÉFAUT" || selectedEtat === "DÉFAUT") {
            alert("Veuillez sélectionner un emprunt et un état.");
            return;
        }

        // Ton DTO attend l'ID de l'emprunt
        const returnRequestDTO = {
            borrowID: parseInt(selectedBorrowId)
        };

        try {
            // URL: /create/{idReturnGerantID}?etatLivre=...
            const response = await fetch(`http://localhost:8080/api/returnBook/create/${gerantId}?etatLivre=${selectedEtat}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(returnRequestDTO)
            });

            if (response.ok) {
                alert("Retour enregistré avec succès !");
                window.location.href = "./aDashReturn.html";
            } else {
                const errorMsg = await response.text();
                alert("Erreur: " + errorMsg);
            }
        } catch (err) {
            console.error("Erreur technique:", err);
            alert("Impossible de joindre le serveur.");
        }
    });
});