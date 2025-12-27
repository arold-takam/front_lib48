document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");

    if (bookId) {
        // On réinjecte l'ID dans le bouton retour
        const backBtn = document.querySelector('.back');
        if (backBtn) {
            backBtn.href = `aDashBookDetails.html?id=${bookId}`;
        }
    }
});