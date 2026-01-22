document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('avatar-container');
    const input = container.querySelector('input[type="file"]');
    const preview = document.getElementById('avatar-preview');
    const placeholder = document.getElementById('avatar-placeholder');
    const actions = document.getElementById('avatar-actions');
    const editBtn = document.getElementById('edit-avatar');
    const deleteBtn = document.getElementById('delete-avatar');
    const deleteHidden = document.getElementById('profile_deleteAvatarImage');

    let hasImage = false;

    // Image existante
    const existingImage = container.dataset.existingImage;
    if (existingImage) {
        preview.src = existingImage;
        preview.classList.remove('opacity-0');
        preview.classList.add('opacity-100');
        placeholder.classList.add('opacity-0');
        hasImage = true;
        actions.classList.remove('pointer-events-none');
    } else {
        actions.classList.add('pointer-events-none');
    }

    // Upload nouvelle image
    input.addEventListener('change', function () {
        const file = input.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove('opacity-0');
            preview.classList.add('opacity-100');
            placeholder.classList.add('opacity-0');
            hasImage = true;
            deleteHidden.value = 0;
            actions.classList.remove('pointer-events-none');
        };
        reader.readAsDataURL(file);
    });

    // Edit
    editBtn.addEventListener('click', () => input.click());

    // Delete
    deleteBtn.addEventListener('click', function () {
        input.value = '';
        preview.src = '';
        preview.classList.add('opacity-0');
        placeholder.classList.remove('opacity-0');
        hasImage = false;
        deleteHidden.value = 1;
        actions.classList.add('pointer-events-none');
    });
});
