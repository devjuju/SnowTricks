document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('avatar-container');
    const preview = document.getElementById('avatar-preview');
    const placeholder = document.getElementById('avatar-placeholder');
    const fileInput = container.querySelector('input[type="file"]');
    const deleteInput = document.querySelector('[name$="[deleteAvatar]"]');
    const deleteBtn = document.getElementById('delete-avatar');
    const editBtn = document.getElementById('edit-avatar');

    const existingImage = container.dataset.existingImage;

    // ----------------------
    // Helpers
    // ----------------------
    const showAvatar = () => {
        preview.classList.remove('opacity-0');
        placeholder.classList.add('opacity-0');
        deleteBtn.classList.remove('hidden');
    };

    const hideAvatar = () => {
        preview.src = '';
        preview.classList.add('opacity-0');
        placeholder.classList.remove('opacity-0');
        deleteBtn.classList.add('hidden');
    };

    // ----------------------
    // Init
    // ----------------------
    if (existingImage) {
        preview.src = existingImage;
        showAvatar();
    } else {
        hideAvatar();
    }

    // ----------------------
    // Upload / preview
    // ----------------------
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            showAvatar();
        };
        reader.readAsDataURL(file);

        deleteInput.value = 0;
    });

    // ----------------------
    // Delete avatar
    // ----------------------
    deleteBtn.addEventListener('click', () => {
        hideAvatar();
        fileInput.value = '';
        deleteInput.value = 1;
    });

    // ----------------------
    // Edit click
    // ----------------------
    editBtn.addEventListener('click', () => {
        fileInput.click();
    });
});

