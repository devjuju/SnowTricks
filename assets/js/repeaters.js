document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       UTILITAIRE : détection mode desktop (carousel actif)
    ========================================================== */

    const isDesktopLayout = (wrapper) => {
        return window.getComputedStyle(wrapper).flexDirection === 'row';
    };

    const smartScroll = (wrapper, element) => {
        const desktop = isDesktopLayout(wrapper);

        element.scrollIntoView({
            behavior: 'smooth',
            inline: desktop ? 'start' : 'nearest',
            block: desktop ? 'nearest' : 'start'
        });
    };


    /* =========================================================
       ====================== IMAGES ===========================
    ========================================================== */

    const imageWrapper = document.getElementById('image-wrapper');

    if (imageWrapper) {

        let index = parseInt(imageWrapper.dataset.index || 0);

        const validateFile = (file) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            const maxSize = 2 * 1024 * 1024;

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

        const initImageItem = (item, isNew = false) => {

            const input = item.querySelector('.item-input');
            const preview = item.querySelector('.image-preview');
            const placeholder = item.querySelector('.image-placeholder');
            const addBtn = item.querySelector('.item-add');
            const editBtn = item.querySelector('.item-edit');
            const closeBtn = item.querySelector('.item-close');
            const removeBtn = item.querySelector('.remove-item');
            const hiddenInput = item.querySelector('.uploaded-filename');

            if (!hiddenInput) return;

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

            const updateUI = () => {
                const hasImage = !!hiddenInput.value;
                const isOpen = input && !input.classList.contains('w-0');

                addBtn?.classList.toggle('hidden', isOpen || hasImage);
                editBtn?.classList.toggle('hidden', !(hasImage && !isOpen));
                closeBtn?.classList.toggle('hidden', !isOpen);
                removeBtn?.classList.toggle('hidden', isOpen);
            };

            const openInput = () => {
                input?.click();
            };

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
                    updateUI();

                } catch (e) {
                    console.error(e);
                    alert('Erreur serveur');
                }
            };

            input?.addEventListener('change', () => {
                if (input.files?.[0]) {
                    upload(input.files[0], !!hiddenInput.value);
                }
            });

            addBtn?.addEventListener('click', openInput);
            editBtn?.addEventListener('click', openInput);
            closeBtn?.addEventListener('click', closeInput);

            removeBtn?.addEventListener('click', async () => {

                const filename = hiddenInput.value;

                if (filename) {
                    await fetch('/profile/images/temp/delete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ filename })
                    });
                }

                item.remove();
            });

            if (preview?.getAttribute('src')) {
                hiddenInput.value = preview.dataset.filename || '';
            } else {
                hidePreview();
            }

            if (isNew) openInput();
            updateUI();
        };

        const addImage = () => {

            const proto = document.getElementById('image-prototype');
            if (!proto) return;

            const div = document.createElement('div');

            div.className = `
                media-item media-image relative
                w-full
                md:w-40
                md:flex-shrink-0
                md:snap-start
            `;

            div.innerHTML = proto.dataset.prototype.replace(/__name__/g, index++);
            imageWrapper.appendChild(div);

            initImageItem(div, true);
            smartScroll(imageWrapper, div);
        };

        document.getElementById('add-image')?.addEventListener('click', addImage);

        imageWrapper.querySelectorAll('.media-item')
            .forEach(item => initImageItem(item));
    }



    /* =========================================================
       ====================== VIDEOS ===========================
    ========================================================== */

    const videoWrapper = document.getElementById('video-wrapper');

    if (videoWrapper) {

        let videoIndex = videoWrapper.querySelectorAll('.media-item').length;

        const extractYoutubeId = (url) => {
            try {
                const parsed = new URL(url);
                if (parsed.hostname.includes('youtube.com')) {
                    return parsed.searchParams.get('v');
                }
                if (parsed.hostname === 'youtu.be') {
                    return parsed.pathname.substring(1);
                }
            } catch (e) { }
            return null;
        };

        const initVideoItem = (item, isNew = false) => {

            const input = item.querySelector('.item-input');
            if (!input) return;

            const preview = item.querySelector('iframe');
            const placeholder = item.querySelector('.video-placeholder');
            const addBtn = item.querySelector('.item-add');
            const editBtn = item.querySelector('.item-edit');
            const closeBtn = item.querySelector('.item-close');
            const removeBtn = item.querySelector('.remove-item');

            const updatePreview = () => {
                const id = extractYoutubeId(input.value.trim());

                if (id) {
                    preview.src = `https://www.youtube.com/embed/${id}`;
                    preview.classList.remove('hidden');
                    placeholder?.classList.add('hidden');
                } else {
                    preview.src = '';
                    placeholder?.classList.remove('hidden');
                }
            };

            const updateUI = () => {
                const hasValue = input.value.trim() !== '';
                const isOpen = !input.classList.contains('w-0');

                addBtn?.classList.toggle('hidden', isOpen || hasValue);
                editBtn?.classList.toggle('hidden', !(hasValue && !isOpen));
                closeBtn?.classList.toggle('hidden', !isOpen);
                removeBtn?.classList.toggle('hidden', isOpen);
            };

            const openInput = () => {
                input.classList.remove('w-0', 'opacity-0');
                input.classList.add('w-full', 'opacity-100');
                updateUI();
                input.focus();
            };

            const closeInput = () => {
                input.classList.add('w-0', 'opacity-0');
                input.classList.remove('w-full', 'opacity-100');
                updateUI();
            };

            input.addEventListener('input', () => {
                updatePreview();
                updateUI();
            });

            addBtn?.addEventListener('click', openInput);
            editBtn?.addEventListener('click', openInput);
            closeBtn?.addEventListener('click', closeInput);

            removeBtn?.addEventListener('click', () => {
                item.remove();
            });

            updatePreview();

            if (isNew) openInput();
            else updateUI();
        };

        const addVideo = () => {

            const proto = document.getElementById('video-prototype');
            if (!proto) return;

            const div = document.createElement('div');

            div.className = `
                media-item media-video relative
                w-full
                md:w-40
                md:flex-shrink-0
                md:snap-start
            `;

            div.innerHTML = proto.dataset.prototype.replace(/__name__/g, videoIndex++);
            videoWrapper.appendChild(div);

            initVideoItem(div, true);
            smartScroll(videoWrapper, div);
        };

        document.getElementById('add-video')?.addEventListener('click', addVideo);

        videoWrapper.querySelectorAll('.media-item')
            .forEach(item => initVideoItem(item));
    }

});