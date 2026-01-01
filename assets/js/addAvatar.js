document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("avatarInput");
    const area = document.getElementById("avatarArea");
    const placeholder = document.getElementById("avatarPlaceholder");
    const previewContainer = document.getElementById("avatarPreviewContainer");
    const imagePreview = document.getElementById("avatarPreview");
    const deleteBtn = document.getElementById("avatarDeleteBtn");
    const deleteFlag = document.getElementById("delete_avatar");
    const msgEl = document.getElementById("avatarMsg");

    if (!input || !area) return;

    area.addEventListener("click", (e) => {
        if (e.target.closest("#avatarDeleteBtn")) return;
        msgEl.textContent = "";
        input.click();
    });

    input.addEventListener("change", () => {
        if (!input.files || !input.files[0]) return;

        const file = input.files[0];
        const allowed = ["image/jpeg", "image/png", "image/webp"];

        if (!allowed.includes(file.type) || file.size > 2 * 1024 * 1024) {
            msgEl.textContent = "Avatar invalide (JPG, PNG, WebP – 2MB max)";
            input.value = "";
            return;
        }

        deleteFlag.value = "0";

        const url = URL.createObjectURL(file);
        imagePreview.src = url;
        imagePreview.onload = () => URL.revokeObjectURL(url);

        placeholder.classList.add("hidden");
        previewContainer.classList.remove("hidden");
    });

    if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            input.value = "";
            deleteFlag.value = "1";
            imagePreview.src = "";
            previewContainer.classList.add("hidden");
            placeholder.classList.remove("hidden");
        });
    }
});