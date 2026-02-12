document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('featured-container');
    const preview = document.getElementById('featured-preview');
    const placeholder = document.getElementById('featured-placeholder');
    const fileInput = container.querySelector('input[type="file"]');
    const deleteInput = document.querySelector('[name$="[deleteFeaturedImage]"]');
    const deleteBtn = document.getElementById('delete-featured');
    const editBtn = document.getElementById('edit-featured');

    // Vérifie s'il y a déjà une image au chargement
    const existingImage = container.dataset.existingImage;
    if (!existingImage) {
        hideFeaturedImage();
    } else {
        showFeaturedImage();
    }

    function showFeaturedImage() {
        preview.classList.remove('opacity-0');
        placeholder.classList.add('opacity-0');
        deleteBtn.classList.remove('hidden');
    }

    function hideFeaturedImage() {
        preview.src = '';
        preview.classList.add('opacity-0');
        placeholder.classList.remove('opacity-0');
        deleteBtn.classList.add('hidden');
    }

    // Upload temporaire
    fileInput.addEventListener('change', async () => {
        const file = fileInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('featuredImage', file);

        const response = await fetch('/profile/featured-image/temp', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.url) {
            preview.src = data.url;
            showFeaturedImage();
            deleteInput.value = 0; // indique que l'image n'est pas supprimée
        }
    });

    // Supprimer l'image temporaire
    deleteBtn.addEventListener('click', () => {
        hideFeaturedImage();
        fileInput.value = '';
        deleteInput.value = 1; // Symfony saura qu'il faut supprimer l'image
    });

    // Editer / re-choisir une image
    editBtn.addEventListener('click', () => fileInput.click());


});
