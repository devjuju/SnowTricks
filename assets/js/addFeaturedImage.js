document.addEventListener("DOMContentLoaded", () => {

    // 1️⃣ Récupération de l'input file pour la featured image
    let input = document.getElementById("featuredImage_raw")
        || document.querySelector('#featuredImageArea input[type="file"]')
        || document.querySelector('input[type="file"]');

    const placeholder = document.getElementById("placeholder");
    const previewContainer = document.getElementById("previewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const deleteBtn = document.getElementById("deleteImageBtn");
    const featuredArea = document.getElementById("featuredImageArea");
    const msgEl = document.getElementById("featuredImageMsg");

    if (!input || !featuredArea) {
        console.error("featured image : input ou zone introuvable", { input, featuredArea });
        return;
    }

    // 2️⃣ Ouvrir le sélecteur au clic sur la zone (sauf sur le bouton supprimer)
    featuredArea.addEventListener("click", (e) => {
        if (e.target.closest("#deleteImageBtn")) return;
        input.click();
    });

    // 3️⃣ Afficher l'aperçu lors du changement de fichier
    input.addEventListener("change", () => {
        if (!input.files || !input.files[0]) return;

        const file = input.files[0];
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        const maxSize = 2 * 1024 * 1024; // 2MB

        // ✅ Vérification type et taille
        if (!allowedTypes.includes(file.type)) {
            msgEl.textContent = "Format non supporté (JPG, PNG ou WebP).";
            input.value = "";
            return;
        }
        if (file.size > maxSize) {
            msgEl.textContent = "Fichier trop volumineux (max 2MB).";
            input.value = "";
            return;
        }
        msgEl.textContent = "";

        // ✅ Créer et afficher l'URL d'aperçu
        const objectUrl = URL.createObjectURL(file);
        imagePreview.src = objectUrl;
        imagePreview.onload = () => URL.revokeObjectURL(objectUrl); // libération mémoire

        placeholder.classList.add("hidden");
        previewContainer.classList.remove("hidden");
    });

    // 4️⃣ Supprimer l'image sélectionnée
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        try {
            input.value = "";
            if (input.value !== "") {
                // Recréer l'input pour certains navigateurs
                const newInput = input.cloneNode();
                input.parentNode.replaceChild(newInput, input);
                input = newInput;
                input.addEventListener("change", () => {
                    if (input.files && input.files[0]) {
                        const file = input.files[0];
                        const objectUrl = URL.createObjectURL(file);
                        imagePreview.src = objectUrl;
                        imagePreview.onload = () => URL.revokeObjectURL(objectUrl);
                        placeholder.classList.add("hidden");
                        previewContainer.classList.remove("hidden");
                    }
                });
            }
        } catch (err) {
            console.error("Erreur lors du reset de l'input :", err);
        }

        // ✅ Remise à zéro visuelle
        imagePreview.src = "";
        previewContainer.classList.add("hidden");
        placeholder.classList.remove("hidden");
        msgEl.textContent = "";
    });

});
