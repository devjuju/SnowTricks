document.addEventListener("DOMContentLoaded", () => {
    /* ============================================================
       COLLAPSE MOBILE
    ============================================================ */
    const collapseBtn = document.querySelector(
        '[data-collapse-toggle="media-collapse"]',
    );
    const collapseTarget = document.getElementById("media-collapse");
    const icon = collapseBtn?.querySelector("i");

    if (collapseBtn && collapseTarget) {
        collapseBtn.addEventListener("click", () => {
            collapseTarget.classList.toggle("hidden");
            icon?.classList.toggle("rotate-180");
        });
    }

    /* ============================================================
       UTILS
    ============================================================ */
    const isDesktopLayout = (wrapper) =>
        window.getComputedStyle(wrapper).flexDirection === "row";

    const smartScroll = (wrapper, element) => {
        element.scrollIntoView({
            behavior: "smooth",
            inline: isDesktopLayout(wrapper) ? "start" : "nearest",
            block: isDesktopLayout(wrapper) ? "nearest" : "start",
        });
    };

    /* ============================================================
       TEMPLATE SAFE CLONE
    ============================================================ */
    const cloneTemplate = (templateId, index) => {
        const template = document.getElementById(templateId);
        if (!template) return null;

        const clone = template.content.cloneNode(true);

        clone.querySelectorAll("*").forEach((el) => {
            [...el.attributes].forEach((attr) => {
                if (attr.value.includes("__name__")) {
                    attr.value = attr.value.replace(/__name__/g, index);
                }
            });
        });

        return clone.firstElementChild;
    };

    /* ============================================================
       API HELPERS
    ============================================================ */
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("images[]", file);

        const res = await fetch("/profile/images/temp", {
            method: "POST",
            body: formData,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        });

        const data = await res.json();

        if (!res.ok || !data.images?.[0]) {
            throw new Error(data.error || "Erreur upload");
        }

        return data.images[0];
    };

    const deleteTempImage = async (filename) => {
        await fetch("/profile/images/temp/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ filename }),
        });
    };

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

    /* ============================================================
       VIDEOS
    ============================================================ */
    const videoWrapper = document.getElementById("video-wrapper");

    if (videoWrapper) {
        let videoIndex = parseInt(videoWrapper.dataset.index || 0);

        const extractYoutubeId = (url) => {
            try {
                const parsed = new URL(url);
                let id = null;

                if (parsed.hostname.includes("youtube.com")) {
                    id = parsed.searchParams.get("v");
                } else if (parsed.hostname === "youtu.be") {
                    id = parsed.pathname.substring(1);
                }

                return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
            } catch {
                return null;
            }
        };

        const initVideoItem = (item, isNew = false) => {
            const input = item.querySelector(".item-input");
            if (!input) return;

            const preview = item.querySelector("iframe");
            const placeholder = item.querySelector(".video-placeholder");
            const addBtn = item.querySelector(".item-add");
            const editBtn = item.querySelector(".item-edit");
            const closeBtn = item.querySelector(".item-close");
            const removeBtn = item.querySelector(".remove-item");
            const removedInput = item.querySelector(".removed-video");

            const updatePreview = () => {
                const id = extractYoutubeId(input.value.trim());

                if (id) {
                    preview.src = `https://www.youtube.com/embed/${id}`;
                    preview.classList.remove("hidden");
                    placeholder?.classList.add("hidden");
                } else {
                    preview.src = "";
                    preview.classList.add("hidden");
                    placeholder?.classList.remove("hidden");
                }
            };

            const updateUI = () => {
                const hasValue = input.value.trim() !== "";
                const isOpen = !input.classList.contains("w-0");

                addBtn?.classList.toggle("hidden", isOpen || hasValue);
                editBtn?.classList.toggle("hidden", !(hasValue && !isOpen));
                closeBtn?.classList.toggle("hidden", !isOpen);
                removeBtn?.classList.toggle("hidden", isOpen);
            };

            const openInput = () => {
                input.classList.remove("w-0", "opacity-0");
                input.classList.add("w-full", "opacity-100");
                updateUI();
                input.focus();
            };

            const closeInput = () => {
                input.classList.add("w-0", "opacity-0");
                input.classList.remove("w-full", "opacity-100");
                updateUI();
            };

            input.addEventListener("input", () => {
                updatePreview();
                updateUI();
            });

            addBtn?.addEventListener("click", openInput);
            editBtn?.addEventListener("click", openInput);
            closeBtn?.addEventListener("click", closeInput);

            removeBtn?.addEventListener("click", () => {
                if (!confirm("Supprimer cette vidéo ?")) return;

                if (removedInput) {
                    removedInput.value = item.dataset.id || "new";
                }

                item.classList.add("opacity-30", "pointer-events-none");
            });

            updatePreview();
            isNew ? openInput() : updateUI();
        };

        const addVideo = () => {
            const element = cloneTemplate("video-prototype", videoIndex);
            if (!element) return;

            videoWrapper.appendChild(element);

            videoIndex++;
            videoWrapper.dataset.index = videoIndex;

            initVideoItem(element, true);
            smartScroll(videoWrapper, element);
        };

        document
            .getElementById("add-video")
            ?.addEventListener("click", addVideo);

        videoWrapper
            .querySelectorAll(".media-item")
            .forEach((item) => initVideoItem(item));
    }
});
