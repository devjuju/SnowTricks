document.addEventListener('DOMContentLoaded', () => {
    const imageWrapper = document.getElementById('image-wrapper');
    if (!imageWrapper) return;

    // --- Fonctions utilitaires ---
    const createHiddenInput = (div, name, value, className) => {
        let input = div.querySelector(`.${className}`);
        if (!input) {
            input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.className = className;
            div.appendChild(input);
        }
        input.value = value;
        return input;
    };

    const initImageItem = (div) => {
        const inputFile = div.querySelector('input[type="file"]');
        const preview = div.querySelector('img');
        const placeholder = div.querySelector('.image-placeholder');
        const removeBtn = div.querySelector('.remove-item');

        // --- Prévisualisation & upload TEMP ---
        inputFile?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('images[]', file);

            try {
                const res = await fetch('/profile/images/temp', { method: 'POST', body: formData });
                const data = await res.json();

                if (data.images?.[0]) {
                    const filename = data.images[0].filename;
                    const url = data.images[0].url;

                    preview.src = url;
                    preview.classList.remove('hidden');
                    placeholder?.classList.add('hidden');

                    // Stocker le nom temporaire
                    createHiddenInput(div, 'temp_images[]', filename, 'temp-filename');
                }
            } catch (err) {
                console.error('Erreur upload image temporaire', err);
            }
        });

        // --- Suppression ---
        removeBtn?.addEventListener('click', async () => {
            const hidden = div.querySelector('.temp-filename');
            if (hidden?.value) {
                try {
                    await fetch('/profile/images/temp/remove', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ filename: hidden.value })
                    });
                } catch (err) {
                    console.error('Erreur suppression image temporaire', err);
                }
            }

            // Marquer comme removed pour Symfony si nécessaire
            const removed = div.querySelector('.removed-image');
            if (removed) removed.value ||= 'new';

            div.remove();
        });
    };

    // --- Initialisation des items existants TEMP + base ---
    imageWrapper.querySelectorAll('.media-item').forEach(initImageItem);

    // --- Ajouter une nouvelle image via prototype ---
    const addBtn = document.getElementById('add-image');
    addBtn?.addEventListener('click', () => {
        const proto = document.getElementById('image-prototype');
        if (!proto) return;

        const index = imageWrapper.querySelectorAll('.media-item').length;
        const div = document.createElement('div');
        div.className = 'media-item media-image flex-shrink-0 w-40 snap-start relative';
        div.innerHTML = proto.dataset.prototype.replace(/__name__/g, index);

        imageWrapper.appendChild(div);
        initImageItem(div);

        // Ouvre automatiquement le fichier
        const input = div.querySelector('input[type="file"]');
        input?.click();

        // Scroll vers la nouvelle image
        div.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    });
});