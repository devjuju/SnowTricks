document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('image-wrapper');
    if (!wrapper) return;

    let index = wrapper.querySelectorAll('.media-item').length;

    /* =========================================================
       INITIALISATION D’UN ITEM
    ========================================================= */
    const initItem = (item, isNew = false) => {

        const input = item.querySelector('.item-input');
        const preview = item.querySelector('.image-preview');
        const placeholder = item.querySelector('.image-placeholder');
        const addBtn = item.querySelector('.item-add');
        const editBtn = item.querySelector('.item-edit');
        const closeBtn = item.querySelector('.item-close');
        const removeBtn = item.querySelector('.remove-item');
        const hiddenInput = item.querySelector('.uploaded-filename');

        if (!input || !preview) return;

        /* ---------------- PREVIEW ---------------- */

        const showPreview = (src) => {
            preview.src = src;
            preview.classList.remove('hidden');
            placeholder?.classList.add('hidden');
        };

        const hidePreview = () => {
            preview.removeAttribute('src');
            preview.classList.add('hidden');
            placeholder?.classList.remove('hidden');
        };

        /* ---------------- UI STATE ---------------- */

        const updateUI = () => {
            const hasImage = !!hiddenInput?.value;
            const isOpen = !input.classList.contains('w-0');

            addBtn?.classList.toggle('hidden', isOpen || hasImage);
            editBtn?.classList.toggle('hidden', !(hasImage && !isOpen));
            closeBtn?.classList.toggle('hidden', !isOpen);
            removeBtn?.classList.toggle('hidden', isOpen);
        };

        const openInput = () => {
            input.classList.remove('w-0', 'opacity-0');
            input.classList.add('w-full', 'opacity-100');
            input.focus();
            updateUI();
        };

        const closeInput = () => {
            input.classList.add('w-0', 'opacity-0');
            input.classList.remove('w-full', 'opacity-100');
            updateUI();
        };

        /* ---------------- UPLOAD AJAX ---------------- */

        const upload = async (file) => {

            const formData = new FormData();
            formData.append('images[]', file);

            try {
                const res = await fetch(IMAGE_ROUTES.upload, {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();

                if (res.ok && data.images?.[0]) {

                    const image = data.images[0];

                    hiddenInput.value = image.filename;
                    showPreview(image.url);
                    closeInput();

                } else {
                    alert(data.error || 'Erreur upload');
                }

            } catch (e) {
                console.error(e);
                alert('Erreur serveur');
            }

            updateUI();
        };

        input.addEventListener('change', () => {
            if (input.files?.[0]) {
                upload(input.files[0]);
            }
        });

        /* ---------------- DELETE ---------------- */

        removeBtn?.addEventListener('click', async () => {

            const filename = hiddenInput?.value;

            if (filename) {
                try {
                    await fetch(IMAGE_ROUTES.delete, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ filename })
                    });
                } catch (e) {
                    console.error(e);
                }
            }

            item.remove();
        });

        /* ---------------- BUTTONS ---------------- */

        addBtn?.addEventListener('click', openInput);
        editBtn?.addEventListener('click', openInput);
        closeBtn?.addEventListener('click', closeInput);

        /* ---------------- INITIAL STATE ---------------- */

        const existingSrc = preview.getAttribute('src');

        if (existingSrc) {
            preview.classList.remove('hidden');

            const filename =
                preview.dataset.filename ||
                existingSrc.split('/').pop();

            if (hiddenInput) {
                hiddenInput.value = filename;
            }
        } else {
            hidePreview();
        }

        if (isNew) openInput();
        updateUI();
    };

    /* =========================================================
       AJOUT D’UNE IMAGE
    ========================================================= */

    const addImage = () => {

        const proto = document.getElementById('image-prototype');
        if (!proto) return;

        const div = document.createElement('div');
        div.className = 'media-item media-image flex-shrink-0 w-40 snap-start relative';
        div.innerHTML = proto.dataset.prototype.replace(/__name__/g, index++);

        wrapper.appendChild(div);

        initItem(div, true);

        div.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    };

    document.getElementById('add-image')?.addEventListener('click', addImage);

    /* =========================================================
       INIT EXISTING
    ========================================================= */

    wrapper.querySelectorAll('.media-item').forEach(item => {
        initItem(item);
    });
});