document.addEventListener("DOMContentLoaded", () => {
    /* ============================================================
       IMAGES
    ============================================================ */
    const imageWrapper = document.getElementById("image-wrapper");

    if (imageWrapper) {
        let index = parseInt(imageWrapper.dataset.index || 0);

        const validateFile = (file) => {
            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            const maxSize = 2 * 1024 * 1024;

            if (!allowedTypes.includes(file.type)) {
                alert("Type de fichier non autorisé");
                return false;
            }

            if (file.size > maxSize) {
                alert("Fichier trop lourd (max 2 Mo)");
                return false;
            }

            return true;
        };

        const initImageItem = (item, isNew = false) => {
            const input = item.querySelector(".item-input");
            const preview = item.querySelector(".image-preview");
            const placeholder = item.querySelector(".image-placeholder");
            const addBtn = item.querySelector(".item-add");
            const editBtn = item.querySelector(".item-edit");
            const closeBtn = item.querySelector(".item-close");
            const removeBtn = item.querySelector(".remove-item");
            const hiddenInput = item.querySelector(".uploaded-filename");
            const removedInput = item.querySelector(".removed-image");

            if (!hiddenInput) return;

            const showPreview = (src) => {
                preview.src = src;
                preview.classList.remove("hidden");
                placeholder?.classList.add("hidden");
            };

            const hidePreview = () => {
                preview.removeAttribute("src");
                preview.classList.add("hidden");
                placeholder?.classList.remove("hidden");
            };

            const updateUI = () => {
                const hasImage = !!hiddenInput.value;
                const isOpen = input && !input.classList.contains("w-0");

                addBtn?.classList.toggle("hidden", isOpen || hasImage);
                editBtn?.classList.toggle("hidden", !(hasImage && !isOpen));
                closeBtn?.classList.toggle("hidden", !isOpen);
                removeBtn?.classList.toggle("hidden", isOpen);
            };

            const openInput = () => input?.click();

            const closeInput = () => {
                input?.classList.add("w-0", "opacity-0");
                input?.classList.remove("w-full", "opacity-100");
                updateUI();
            };

            const handleUpload = async (file, replace = false) => {
                if (!validateFile(file)) return;

                try {
                    const image = await uploadImage(file);

                    const oldFilename = hiddenInput.value;

                    if (replace && oldFilename) {
                        await deleteTempImage(oldFilename);
                    }

                    hiddenInput.value = image.filename;
                    showPreview(image.url);

                    item.dataset.isTemp = "true";
                    item.dataset.wasTemp = "true";

                    updateUI();
                } catch (e) {
                    console.error(e);
                    alert(e.message || "Erreur serveur");
                }
            };

            input?.addEventListener("change", () => {
                if (input.files?.[0]) {
                    handleUpload(input.files[0], !!hiddenInput.value);
                }
            });

            addBtn?.addEventListener("click", openInput);
            editBtn?.addEventListener("click", openInput);
            closeBtn?.addEventListener("click", closeInput);

            removeBtn?.addEventListener("click", () => {
                if (!confirm("Supprimer cette image ?")) return;

                const filename = hiddenInput.value;

                if (removedInput && filename) {
                    removedInput.value = filename;
                }

                item.classList.add("opacity-30", "pointer-events-none");
            });

            const existingSrc = preview?.getAttribute("src");

            if (existingSrc) {
                preview.classList.remove("hidden");
                hiddenInput.value =
                    preview.dataset.filename || existingSrc.split("/").pop();
            } else {
                hidePreview();
            }

            isNew ? openInput() : updateUI();
        };

        const addImage = () => {
            const element = cloneTemplate("image-prototype", index);
            if (!element) return;

            imageWrapper.appendChild(element);

            index++;
            imageWrapper.dataset.index = index;

            initImageItem(element, true);
            smartScroll(imageWrapper, element);
        };

        document
            .getElementById("add-image")
            ?.addEventListener("click", addImage);

        imageWrapper
            .querySelectorAll(".media-item")
            .forEach((item) => initImageItem(item));
    }
});
