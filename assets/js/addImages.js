document.addEventListener("DOMContentLoaded", () => {
    const addImageBtn = document.getElementById("add-image");
    const wrapper = document.getElementById("images-wrapper");
    const template = document.getElementById("image-template");

    addImageBtn.addEventListener("click", () => {
        const clone = template.content.cloneNode(true);
        const item = clone.querySelector(".image-item");
        const input = clone.querySelector(".image-input");
        const placeholder = clone.querySelector(".placeholder");
        const preview = clone.querySelector(".image-preview");

        item.addEventListener("click", () => input.click());

        input.addEventListener("change", () => {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = e => {
                preview.src = e.target.result;
                preview.classList.remove("hidden");
                placeholder.classList.add("hidden");
            };
            reader.readAsDataURL(file);
        });

        clone.querySelector(".remove-image").addEventListener("click", e => {
            e.stopPropagation();
            item.remove();
        });

        wrapper.appendChild(clone);
    });
});
