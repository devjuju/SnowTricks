document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('image-wrapper-mobile');
    if (!wrapper) return;

    let index = parseInt(wrapper.dataset.index || 0);

    const validateFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 2 * 1024 * 1024; // 2 Mo

        if (!allowedTypes.includes(file.type)) {
            alert('Type de fichier non autorisé');
            return false;
        }
        if (file.size > maxSize) {
            alert('Fichier trop lourd (max 2 Mo)');
            return false;
        }
        return true;
    };

    const initElement = (element, isNew = false) => {
        const input = element.querySelector('.element-input');
        const preview = element.querySelector('.element-image-preview');
        const placeholder = element.querySelector('.element-image-placeholder');
        const addBtn = element.querySelector('.element-add');
        const editBtn = element.querySelector('.element-edit');
        const closeBtn = element.querySelector('.element-close');
        const removeBtn = element.querySelector('.remove-element');
        const hiddenInput = element.querySelector('.uploaded-filename-element');

        if (!hiddenInput) return;

        const showPreview = (src) => {
            if (!preview) return;
            preview.src = src;
            preview.classList.remove('hidden');
            placeholder?.classList.add('hidden');
        };

        const hidePreview = () => {
            if (!preview) return;
            preview.removeAttribute('src');
            preview.classList.add('hidden');
            placeholder?.classList.remove('hidden');
        };

        const updateUI = () => {
            const hasImage = !!hiddenInput.value;
            const isOpen = input && !input.classList.contains('w-0');
            addBtn?.classList.toggle('hidden', isOpen || hasImage);
            editBtn?.classList.toggle('hidden', !(hasImage && !isOpen));
            closeBtn?.classList.toggle('hidden', !isOpen);
            removeBtn?.classList.toggle('hidden', isOpen);
        };

        const openInput = () => input?.click();
        const closeInput = () => {
            input?.classList.add('w-0', 'opacity-0');
            input?.classList.remove('w-full', 'opacity-100');
            updateUI();
        };

        const upload = async (file, replace = false) => {
            if (!validateFile(file)) return;

            const formData = new FormData();
            formData.append('images[]', file);

            try {
                const res = await fetch('/profile/images/temp', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();

                if (!res.ok || !data.images?.[0]) {
                    alert(data.error || 'Erreur upload');
                    return;
                }

                const image = data.images[0];
                const oldFilename = hiddenInput.value;

                if (replace && oldFilename) {
                    await fetch('/profile/images/temp/delete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ filename: oldFilename })
                    });
                }

                hiddenInput.value = image.filename;
                showPreview(image.url);
                element.dataset.isTemp = 'true';
                element.dataset.wasTemp = 'true';
                updateUI();
            } catch (e) {
                console.error(e);
                alert('Erreur serveur');
            }
        };

        addBtn?.addEventListener('click', openInput);
        editBtn?.addEventListener('click', openInput);
        closeBtn?.addEventListener('click', closeInput);

        input?.addEventListener('change', () => {
            if (input.files?.[0]) {
                const isReplacing = !!hiddenInput.value;
                upload(input.files[0], isReplacing);
            }
        });

        removeBtn?.addEventListener('click', async () => {
            const filename = hiddenInput.value;
            if (filename) {
                await fetch('/profile/images/temp/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ filename })
                });
            }
            element.remove();
        });

        const existingSrc = preview?.getAttribute('src');
        if (existingSrc) {
            preview.classList.remove('hidden');
            hiddenInput.value = preview.dataset.filename || existingSrc.split('/').pop();
            element.dataset.isTemp = existingSrc.includes('/images_tmp/') ? 'true' : 'false';
            element.dataset.wasTemp = element.dataset.isTemp;
        } else {
            hidePreview();
        }

        if (isNew) openInput();
        updateUI();
    };

    const addImage = () => {
        const proto = document.getElementById('image-prototype-element');
        if (!proto) return;

        const div = document.createElement('div');
        div.className = 'media-element relative border rounded overflow-hidden w-full'; // Bloc vertical
        div.innerHTML = proto.dataset.prototype.replace(/__name__/g, index);

        wrapper.appendChild(div);
        index++;
        wrapper.dataset.index = index;

        initElement(div, true);
        div.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    document.getElementById('add-image-element')?.addEventListener('click', addImage);
    wrapper.querySelectorAll('.media-element').forEach(element => initElement(element));
});