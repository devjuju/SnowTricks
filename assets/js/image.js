document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('image-container');
    const preview = document.getElementById('featured-preview');
    const placeholder = document.getElementById('featured-placeholder');
    const fileInput = container.querySelector('input[type="file"]');
    const deleteBtn = document.getElementById('delete-featured');
    const editBtn = document.getElementById('edit-featured');
    const deleteInput = document.querySelector('[name$="[deleteFeaturedImage]"]');
    const errorDiv = document.getElementById('image-error');

    // Vérifie si une image existait au chargement
    const existingImage = preview.src && !preview.classList.contains('opacity-0');
    if (!existingImage) {
        preview.classList.add('opacity-0');
        placeholder.classList.remove('opacity-0');
        if (deleteBtn) deleteBtn.classList.add('hidden');
    } else {
        preview.classList.remove('opacity-0');
        placeholder.classList.add('opacity-0');
        if (deleteBtn) deleteBtn.classList.remove('hidden');
    }

    const showPreview = (url) => {
        preview.src = url;
        preview.classList.remove('opacity-0');
        placeholder.classList.add('opacity-0');
        if (deleteBtn) deleteBtn.classList.remove('hidden');
        deleteInput.value = 0;
        errorDiv.innerText = '';
    };

    const hidePreview = () => {
        preview.src = '';
        preview.classList.add('opacity-0');
        placeholder.classList.remove('opacity-0');
        if (deleteBtn) deleteBtn.classList.add('hidden');
        deleteInput.value = 1;
    };

    // Upload async vers temp
    fileInput.addEventListener('change', async () => {
        const file = fileInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('featuredImage', file);

        try {
            const response = await fetch('/profile/tricks/featured-image/temp', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();

            if (data.url) {
                showPreview(data.url);
            } else if (data.error) {
                errorDiv.innerText = data.error;
                fileInput.value = '';
                hidePreview();
            }
        } catch (err) {
            console.error(err);
            errorDiv.innerText = 'Erreur lors de l’upload de l’image.';
            fileInput.value = '';
            hidePreview();
        }
    });

    // Bouton delete
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            hidePreview();
            fileInput.value = '';
        });
    }

    // Bouton edit → clique sur input file
    if (editBtn) {
        editBtn.addEventListener('click', () => fileInput.click());
    }

    // Bloquer submit si pas d'image (UX instantanée)
    const form = container.closest('form');
    form.addEventListener('submit', (e) => {
        if (!preview.src || preview.classList.contains('opacity-0')) {
            e.preventDefault();
            errorDiv.innerText = 'Une image mise en avant est obligatoire.';
            fileInput.focus();
        }
    });
});
