document.addEventListener("DOMContentLoaded", () => {
    const imageContainer = document.getElementById("image-container");
    const imagePreview = document.getElementById("image-preview");
    const imagePlaceholder = document.getElementById("image-placeholder");
    const imageActions = document.getElementById("image-actions");
    const editButton = document.getElementById("edit-image");
    const deleteButton = document.getElementById("delete-image");

    // Le champ file Symfony (input type="file")
    const fileInput = imageContainer.querySelector('input[type="file"]');

    // Afficher l'aperçu de l'image
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imagePreview.src = event.target.result;
                imagePreview.style.opacity = "1";
                imagePlaceholder.style.opacity = "0";
                imageActions.style.opacity = "1";
            };
            reader.readAsDataURL(file);
        }
    });

    // Cliquer sur l'image pour ouvrir le selecteur
    imageContainer.addEventListener("click", (e) => {
        // Évite de réouvrir si on clique sur Edit/Delete
        if (e.target.closest("#edit-image") || e.target.closest("#delete-image")) return;
        fileInput.click();
    });

    // Edit button (réouvre le sélecteur)
    editButton.addEventListener("click", () => {
        fileInput.click();
    });

    // Delete button (réinitialise l'image)
    deleteButton.addEventListener("click", () => {
        fileInput.value = ""; // réinitialise le champ file
        imagePreview.src = "";
        imagePreview.style.opacity = "0";
        imagePlaceholder.style.opacity = "1";
        imageActions.style.opacity = "0";
    });

    // Hover pour montrer les actions
    imageContainer.addEventListener("mouseenter", () => {
        if (imagePreview.src) {
            imageActions.style.opacity = "1";
        }
    });
    imageContainer.addEventListener("mouseleave", () => {
        if (imagePreview.src) {
            imageActions.style.opacity = "0.8";
        }
    });
});
