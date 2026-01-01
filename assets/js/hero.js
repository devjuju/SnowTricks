document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('image-container');
    const input = container.querySelector('input[type="file"]');
    const preview = document.getElementById('image-preview');
    const placeholder = document.getElementById('image-placeholder');
    const actions = document.getElementById('image-actions');
    const editBtn = document.getElementById('edit-image');
    const deleteBtn = document.getElementById('delete-image');

    // Vérifier si une image existante est définie
    const existingImage = container.dataset.existingImage;

    if (existingImage) {
        preview.src = existingImage;
        preview.style.opacity = 1;
        placeholder.style.opacity = 0;
        actions.style.opacity = 1;
    } else {
        // Pas d'image existante → afficher le placeholder
        preview.style.opacity = 0;
        placeholder.style.opacity = 1;
        actions.style.opacity = 0;
    }

    // Changement de fichier
    input.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner une image');
            input.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            preview.src = event.target.result;
            preview.style.opacity = 1;
            placeholder.style.opacity = 0;
            actions.style.opacity = 1;
        };
        reader.readAsDataURL(file);
    });

    // Edit → re-sélectionner fichier
    editBtn.addEventListener('click', function () {
        input.click();
    });

    // Delete → réinitialiser
    deleteBtn.addEventListener('click', function () {
        input.value = '';
        preview.src = '';
        preview.style.opacity = 0;
        placeholder.style.opacity = 1;
        actions.style.opacity = 0;
    });

    // Hover pour afficher les actions si image présente
    container.addEventListener('mouseenter', () => {
        if (preview.src) actions.style.opacity = 1;
    });
    container.addEventListener('mouseleave', () => {
        if (preview.src) actions.style.opacity = 1;
    });
});
