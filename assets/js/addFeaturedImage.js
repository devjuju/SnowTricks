document.addEventListener('DOMContentLoaded', () => {

    const featuredContainer = document.getElementById('featured-image-container');
    const featuredInput = document.getElementById('featured-input');
    const featuredPreview = document.getElementById('featured-preview');
    const featuredPlaceholder = document.getElementById('featured-placeholder');
    const featuredActions = document.getElementById('image-actions');
    const editBtn = document.getElementById('edit-image');
    const deleteBtn = document.getElementById('delete-image');

    if (!featuredContainer || !featuredInput) return;

    const resetFeaturedImage = () => {
        featuredInput.value = '';
        featuredPreview.src = '';
        featuredPreview.classList.add('opacity-0');
        featuredPlaceholder.classList.remove('opacity-0');
        featuredActions.classList.remove('opacity-100');
    };

    // Click sur le container = ouvrir le file input
    featuredContainer.addEventListener('click', () => {
        featuredInput.click();
    });

    // Sélection d’un fichier
    featuredInput.addEventListener('change', () => {
        const file = featuredInput.files[0];

        if (!file) {
            resetFeaturedImage();
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner une image valide.');
            resetFeaturedImage();
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            featuredPreview.src = e.target.result;
            featuredPreview.classList.remove('opacity-0');
            featuredPlaceholder.classList.add('opacity-0');
            featuredActions.classList.add('opacity-100');
        };

        reader.readAsDataURL(file);
    });

    editBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        featuredInput.click();
    });

    deleteBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        resetFeaturedImage();
    });

});
