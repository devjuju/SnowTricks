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

    // Fonction pour mettre à jour l'état des actions
    const updateActions = () => {
        const hasImage = preview.src && preview.src.trim() !== '';
        if (hasImage) {
            container.classList.add('has-image');
            container.classList.remove('no-image');
            actions.style.opacity = 1; // toujours visibles
        } else {
            container.classList.remove('has-image');
            container.classList.add('no-image');
            actions.style.opacity = 0; // caché, visible seulement au hover via CSS
        }
    };

    // Initialisation avec image existante
    const existingImage = container.dataset.existingImage;
    if (existingImage) {
        preview.src = existingImage;
        preview.style.opacity = 1;
        placeholder.style.opacity = 0;
        deleteBtn.style.display = 'inline-flex'; // DELETE visible
        updateActions();
    } else {
        preview.style.opacity = 0;
        placeholder.style.opacity = 1;
        deleteBtn.style.display = 'none'; // DELETE caché
        updateActions();
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
            deleteBtn.style.display = 'inline-flex'; // DELETE visible
            deleteHidden.value = 0; // annule suppression si nouveau fichier
            updateActions();
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
        deleteBtn.style.display = 'none'; // DELETE caché
        container.dataset.existingImage = '';
        deleteHidden.value = 1; // signal backend suppression
        updateActions();
    });

    // Hover actions pour EDIT seul si pas d'image
    container.addEventListener('mouseenter', () => {
        if (!preview.src) editBtn.style.opacity = 1;
    });
    container.addEventListener('mouseleave', () => {
        if (!preview.src) editBtn.style.opacity = 0;
    });

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
