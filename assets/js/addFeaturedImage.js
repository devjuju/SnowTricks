document.addEventListener("DOMContentLoaded", () => {

    // 1) Récupérer l'input file : on essaie l'ID "featuredImage_raw", sinon on cherche un input[type=file] dans le formulaire.
    let input = document.getElementById("featuredImage_raw");
    if (!input) {
        // fallback : chercher un input file dans la zone
        input = document.querySelector('#featuredImageArea input[type="file"]');
    }
    if (!input) {
        // fallback global : tout input file (utile si Symfony a renommé complètement)
        input = document.querySelector('input[type="file"]');
    }

    const placeholder = document.getElementById("placeholder");
    const previewContainer = document.getElementById("previewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const deleteBtn = document.getElementById("deleteImageBtn");
    const featuredArea = document.getElementById("featuredImageArea");

    if (!input || !featuredArea) {
        console.error("featured image : input ou zone introuvable", { input, featuredArea });
        return;
    } else {
        console.log("featured image : input trouvé ->", input);
    }

    // 2) Ouvrir le sélecteur au clic sur la zone (mais pas si on clique sur le bouton supprimer)
    featuredArea.addEventListener("click", (e) => {
        // si le clic vient du bouton supprimer, on ne lance pas le sélecteur
        if (e.target.closest && e.target.closest("#deleteImageBtn")) {
            return;
        }
        // some browsers won't open if input has display:none; using .click() fonctionne généralement.
        try {
            input.click();
        } catch (err) {
            console.error("Impossible d'ouvrir le sélecteur de fichier :", err);
        }
    });

    // 3) Afficher l'aperçu lorsque le fichier change
    input.addEventListener("change", () => {
        if (input.files && input.files[0]) {
            const file = input.files[0];

            // vérification simple (taille & type) — adapte si besoin
            const allowedTypes = ["image/jpeg", "image/png"];
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (!allowedTypes.includes(file.type)) {
                document.getElementById("featuredImageMsg").textContent = "Format non supporté (JPG/PNG seulement).";
                input.value = "";
                return;
            }
            if (file.size > maxSize) {
                document.getElementById("featuredImageMsg").textContent = "Fichier trop volumineux (max 2MB).";
                input.value = "";
                return;
            }
            document.getElementById("featuredImageMsg").textContent = "";

            // créer l'URL d'aperçu
            imagePreview.src = URL.createObjectURL(file);

            placeholder.classList.add("hidden");
            previewContainer.classList.remove("hidden");
        } else {
            // aucun fichier choisi (ex : annulation)
            console.log("Aucun fichier sélectionné (annulation).");
        }
    });

    // 4) Supprimer l'image sélectionnée (reset)
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // empêche l'ouverture du sélecteur
        // reset de l'input file : méthode robuste pour réinitialiser
        try {
            input.value = "";
            // pour certains navigateurs, recréer l'input est plus fiable :
            if (input.value !== "") {
                const newInput = input.cloneNode();
                input.parentNode.replaceChild(newInput, input);
                input = newInput;
                // ré-attacher l'écouteur 'change'
                input.addEventListener("change", () => {
                    if (input.files && input.files[0]) {
                        const file = input.files[0];
                        imagePreview.src = URL.createObjectURL(file);
                        placeholder.classList.add("hidden");
                        previewContainer.classList.remove("hidden");
                    }
                });
            }
        } catch (err) {
            console.error("Erreur lors du reset de l'input :", err);
        }

        imagePreview.src = "";
        previewContainer.classList.add("hidden");
        placeholder.classList.remove("hidden");
    });

});
