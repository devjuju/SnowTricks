document.addEventListener('DOMContentLoaded', () => {

    /**
     * Initialise une collection dynamique (images ou vidéos)
     * @param {string} collectionId - ID de la collection HTML
     * @param {string} addBtnId - ID du bouton "Ajouter"
     * @param {string} type - 'image' ou 'video'
     */
    const initCollection = (collectionId, addBtnId, type = 'image') => {
        const collection = document.getElementById(collectionId);
        const addButton = document.getElementById(addBtnId);
        let index = collection.children.length;

        const initItem = (item) => {
            const input = item.querySelector('.item-input');
            const addBtn = item.querySelector('.item-add');
            const editBtn = item.querySelector('.item-edit');
            const closeBtn = item.querySelector('.item-close');
            const preview = item.querySelector('.item-preview');
            const removeBtn = item.querySelector('.remove-item');
            const removedInput = item.querySelector(type === 'image' ? '.removed-image' : '.removed-video');

            if (!input || !addBtn || !editBtn || !closeBtn) return;

            const updateUI = () => {
                const hasValue = type === 'image' ? input.files.length > 0 : input.value.trim() !== '';
                const isOpen = !input.classList.contains('w-0');
                addBtn.classList.toggle('hidden', isOpen || hasValue);
                editBtn.classList.toggle('hidden', !(hasValue && !isOpen));
                closeBtn.classList.toggle('hidden', !isOpen);
            };
            updateUI();

            // --- Preview ---
            const updatePreview = () => {
                if (type === 'image') {
                    if (input.files && input.files[0]) {
                        const reader = new FileReader();
                        reader.onload = e => {
                            preview.src = e.target.result;
                            preview.style.display = 'block';
                        };
                        reader.readAsDataURL(input.files[0]);
                    }
                } else {
                    const url = input.value.trim();
                    let videoId = null;
                    try {
                        if (url.includes('youtube.com')) videoId = new URL(url).searchParams.get('v');
                        else if (url.includes('youtu.be')) videoId = url.split('/').pop();
                    } catch (e) { videoId = null; }

                    if (videoId) {
                        preview.src = `https://www.youtube.com/embed/${videoId}`;
                        preview.style.display = 'block';
                    } else {
                        preview.src = '';
                        preview.style.display = 'none';
                    }
                }
            };

            if (type === 'image') {
                input.addEventListener('change', () => {
                    updatePreview();
                    updateUI();
                });
            } else {
                input.addEventListener('input', () => {
                    updatePreview();
                    updateUI();
                });
            }

            // --- Open / Close input ---
            const openInput = () => {
                input.classList.remove('w-0', 'opacity-0');
                input.classList.add('w-full', 'opacity-100');
                closeBtn.classList.remove('hidden');
                addBtn.classList.add('hidden');
                editBtn.classList.add('hidden');
            };
            const closeInput = () => {
                input.classList.add('w-0', 'opacity-0');
                input.classList.remove('w-full', 'opacity-100');
                updateUI();
            };

            addBtn.addEventListener('click', openInput);
            editBtn.addEventListener('click', openInput);
            closeBtn.addEventListener('click', closeInput);

            // --- Remove item ---
            if (removeBtn) removeBtn.addEventListener('click', () => {
                if (type === 'image' && preview.dataset.filename) removedInput.value = preview.dataset.filename;
                if (type === 'video' && preview.dataset.id) removedInput.value = preview.dataset.id;
                item.remove();
            });

            // --- Initial preview pour items existants ---
            updatePreview();
        };

        // Initialiser les items existants
        collection.querySelectorAll('.item').forEach(initItem);

        // Ajouter dynamiquement
        addButton.addEventListener('click', () => {
            const prototypeHTML = collection.dataset.prototype.replace(/__name__/g, index);
            const div = document.createElement('div');
            div.innerHTML = prototypeHTML;
            div.classList.add('item', 'relative', 'border', 'rounded-lg', 'overflow-hidden', 'shadow', 'p-2', 'mb-2');
            collection.appendChild(div);
            initItem(div);
            index++;
        });

        // Observer pour les ajouts dynamiques
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('item')) initItem(node);
                });
            });
        });
        observer.observe(collection, { childList: true });
    };

    // --- Initialisation des collections ---
    initCollection('images-collection', 'add-image', 'image');
    initCollection('videos-collection', 'add-video', 'video');
});
