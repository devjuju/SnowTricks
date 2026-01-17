document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('image-container');
    const input = container.querySelector('input[type="file"]');
    const preview = document.getElementById('image-preview');
    const placeholder = document.getElementById('image-placeholder');
    const actions = document.getElementById('image-actions');
    const editBtn = document.getElementById('edit-image');
    const deleteBtn = document.getElementById('delete-image');
    const form = document.querySelector('form');
    const errorDiv = document.getElementById('image-error');

    const deleteHidden = document.getElementById('delete-featured-image');

    // Affiche image existante ou placeholder
    const existingImage = container.dataset.existingImage;
    if (existingImage) {
        preview.src = existingImage;
        preview.style.opacity = 1;
        placeholder.style.opacity = 0;
        actions.style.opacity = 1;
    } else {
        preview.style.opacity = 0;
        placeholder.style.opacity = 1;
        actions.style.opacity = 0;
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
            actions.style.opacity = 1;

            deleteHidden.value = 0; // annule suppression si nouveau fichier
        };
        reader.readAsDataURL(file);
    });

    // Edit → re-sélection
    editBtn.addEventListener('click', () => input.click());

    // Delete → réinitialiser
    deleteBtn.addEventListener('click', function () {
        input.value = '';
        preview.src = '';
        preview.style.opacity = 0;
        placeholder.style.opacity = 1;
        actions.style.opacity = 0;

        container.dataset.existingImage = '';
        deleteHidden.value = 1; // signal backend suppression
    });

    // Hover actions
    container.addEventListener('mouseenter', () => { if (preview.src) actions.style.opacity = 1; });
    container.addEventListener('mouseleave', () => { if (preview.src) actions.style.opacity = 1; });

    // Validation frontend : image obligatoire
    form.addEventListener('submit', function (e) {
        const hasExisting = container.dataset.existingImage;
        const hasNewFile = input.files.length > 0;

        if (!hasExisting && !hasNewFile) {
            e.preventDefault();
            errorDiv.textContent = 'L’image principale est obligatoire.';
        } else {
            errorDiv.textContent = '';
        }
    });
});
