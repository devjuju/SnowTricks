document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('image-container');
    const input = container.querySelector('input[type="file"]');
    const preview = document.getElementById('image-preview');
    const placeholder = document.getElementById('image-placeholder');
    const actions = document.getElementById('image-actions');
    const editBtn = document.getElementById('edit-image');
    const deleteBtn = document.getElementById('delete-image');
    const deleteHidden = document.getElementById('delete-featured-image');

    const existingImage = container.dataset.existingImage;
    if (existingImage) {
        preview.src = existingImage;
        preview.style.opacity = 1;
        placeholder.style.opacity = 0;
        deleteBtn.style.display = 'inline-flex';
        actions.style.opacity = 1;
    }

    // Upload nouvelle image
    input.addEventListener('change', function () {
        const file = input.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner une image');
            input.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.opacity = 1;
            placeholder.style.opacity = 0;
            deleteBtn.style.display = 'inline-flex';
            deleteHidden.value = 0;
            actions.style.opacity = 1;
        };
        reader.readAsDataURL(file);
    });

    // Edit
    editBtn.addEventListener('click', () => input.click());

    // Delete
    deleteBtn.addEventListener('click', function () {
        input.value = '';
        preview.src = '';
        preview.style.opacity = 0;
        placeholder.style.opacity = 1;
        deleteBtn.style.display = 'none';
        container.dataset.existingImage = '';
        deleteHidden.value = 1;
        actions.style.opacity = 0;
    });
});
