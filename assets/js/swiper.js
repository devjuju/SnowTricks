document.addEventListener("DOMContentLoaded", () => {

    // ======= Variables =======
    const form = document.querySelector('form');
    const hiddenContainer = document.querySelector('.hidden'); // conteneur pour inputs Symfony cachés

    const imageContainer = document.getElementById('repeater-image-container');
    const imageTemplate = document.getElementById('media-template');
    const addImageButton = document.getElementById('add-image');

    const videoContainer = document.getElementById('repeater-video-container');
    const videoTemplate = document.getElementById('video-template');
    const addVideoButton = document.getElementById('add-video');

    const editImageModal = document.getElementById('editImageModal');
    const closeEditImageModal = document.getElementById('closeEditImageModal');
    const editImageContent = editImageModal.firstElementChild;
    const modalImageInput = document.getElementById('modalImageInput');
    const modalImageSaveBtn = document.getElementById('modalImageSaveBtn');
    const modalImagePreview = document.getElementById('modalImagePreview');
    const modalImageIcon = document.querySelector('#modalImagePreviewWrapper i');
    let currentImagePreview = null;

    const editVideoModal = document.getElementById('editVideoModal');
    const closeEditVideoModal = document.getElementById('closeEditVideoModal');
    const editVideoContent = editVideoModal.firstElementChild;
    const modalVideoInput = document.getElementById('modalVideoInput');
    const modalVideoSaveBtn = document.getElementById('modalVideoSaveBtn');
    const modalVideoPreview = document.getElementById('modalVideoPreview');
    const modalVideoIcon = document.querySelector('#modalVideoPreviewWrapper i');
    let currentVideoIframe = null;

    const mediaWrapper = document.getElementById('media-wrapper');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const pagination = document.getElementById('carousel-pagination');

    // ======= Utils =======
    function getYoutubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    function openModal(modal, content) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }

    function closeModal(modal, content) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
    }

    // ======= Carousel helpers =======
    function getItemWidth() {
        const first = mediaWrapper.querySelector('.media-item:not(.hidden)');
        if (!first) return 0;
        const style = getComputedStyle(first);
        const gap = parseInt(style.marginRight || 16);
        return first.offsetWidth + gap;
    }

    function updateArrowState() {
        const maxScroll = mediaWrapper.scrollWidth - mediaWrapper.clientWidth;
        prevBtn.style.opacity = mediaWrapper.scrollLeft <= 0 ? 0 : 1;
        nextBtn.style.opacity = mediaWrapper.scrollLeft >= maxScroll ? 0 : 1;
    }

    function createPagination() {
        pagination.innerHTML = '';
        const items = mediaWrapper.querySelectorAll('.media-item:not(.hidden)');
        items.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', () => {
                mediaWrapper.scrollTo({ left: i * getItemWidth(), behavior: 'smooth' });
            });
            pagination.appendChild(dot);
        });
        updatePagination();
        updateArrowState();
    }

    function updatePagination() {
        const width = getItemWidth();
        const index = Math.round(mediaWrapper.scrollLeft / width);
        const dots = pagination.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    mediaWrapper.addEventListener('scroll', () => {
        updateArrowState();
        updatePagination();
    });

    prevBtn.addEventListener('click', () => {
        const width = getItemWidth();
        const target = Math.max(mediaWrapper.scrollLeft - width, 0);
        mediaWrapper.scrollTo({ left: target, behavior: 'smooth' });
        setTimeout(updatePagination, 100);
    });

    nextBtn.addEventListener('click', () => {
        const width = getItemWidth();
        const maxScroll = mediaWrapper.scrollWidth - mediaWrapper.clientWidth;
        const target = Math.min(mediaWrapper.scrollLeft + width, maxScroll);
        mediaWrapper.scrollTo({ left: target, behavior: 'smooth' });
        setTimeout(updatePagination, 100);
    });

    const observer = new MutationObserver(createPagination);
    observer.observe(mediaWrapper, { childList: true, subtree: true });

    // ======= Add items =======
    function addItem(template, container, type) {
        const clone = template.cloneNode(true);
        clone.classList.remove('hidden');
        clone.id = '';
        container.appendChild(clone);

        // Remove
        clone.querySelector('.remove-media, .remove-video')?.addEventListener('click', () => {
            // Supprime le input Symfony correspondant
            const hiddenInput = clone.querySelector('input[type="hidden"]');
            hiddenInput?.remove();
            clone.remove();
            createPagination();
        });

        // Edit
        const editBtn = type === 'image' ? clone.querySelector('.edit-image-btn') : clone.querySelector('.edit-video-btn');
        editBtn?.addEventListener('click', () => {
            if (type === 'image') {
                currentImagePreview = clone.querySelector('.image-preview');
                if (currentImagePreview && currentImagePreview.src) {
                    modalImagePreview.src = currentImagePreview.src;
                    modalImagePreview.classList.remove('hidden');
                    modalImageIcon.classList.add('hidden');
                } else {
                    modalImagePreview.classList.add('hidden');
                    modalImageIcon.classList.remove('hidden');
                }
                modalImageInput.value = '';
                openModal(editImageModal, editImageContent);
            } else {
                currentVideoIframe = clone.querySelector('.video-preview iframe');
                const src = currentVideoIframe?.src || '';
                const id = getYoutubeId(src);
                if (currentVideoIframe && id) {
                    modalVideoPreview.src = `https://www.youtube.com/embed/${id}?enablejsapi=1`;
                    modalVideoPreview.classList.remove('hidden');
                    modalVideoIcon.classList.add('hidden');
                    modalVideoInput.value = src;
                } else {
                    modalVideoPreview.src = '';
                    modalVideoPreview.classList.add('hidden');
                    modalVideoIcon.classList.remove('hidden');
                    modalVideoInput.value = '';
                }
                openModal(editVideoModal, editVideoContent);
            }
        });

        createPagination();
    }

    addImageButton?.addEventListener('click', () => addItem(imageTemplate, imageContainer, 'image'));
    addVideoButton?.addEventListener('click', () => addItem(videoTemplate, videoContainer, 'video'));

    // ======= Modal Image =======
    modalImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => {
                modalImagePreview.src = ev.target.result;
                modalImagePreview.classList.remove('hidden');
                modalImageIcon.classList.add('hidden');
            }
            reader.readAsDataURL(file);
        }
    });

    modalImageSaveBtn.addEventListener('click', () => {
        if (currentImagePreview && modalImageInput.files[0]) {
            const file = modalImageInput.files[0];

            // Ajout input caché pour Symfony
            const input = document.createElement('input');
            input.type = 'file';
            input.name = 'images[]';
            input.files = modalImageInput.files;
            input.classList.add('hidden');
            hiddenContainer.appendChild(input);

            // Mise à jour preview
            const reader = new FileReader();
            reader.onload = ev => {
                currentImagePreview.src = ev.target.result;
                currentImagePreview.classList.remove('hidden');
                currentImagePreview.closest('.media-item').querySelector('.image-placeholder').classList.add('hidden');
            }
            reader.readAsDataURL(file);
        }
        resetImageModal();
    });

    function resetImageModal() {
        modalImagePreview.src = '';
        modalImagePreview.classList.add('hidden');
        modalImageIcon.classList.remove('hidden');
        modalImageInput.value = '';
        closeModal(editImageModal, editImageContent);
    }

    closeEditImageModal?.addEventListener('click', resetImageModal);
    window.addEventListener('click', e => { if (e.target === editImageModal) resetImageModal(); });

    // ======= Modal Video =======
    modalVideoInput.addEventListener('input', (e) => {
        const id = getYoutubeId(e.target.value);
        if (id) {
            modalVideoPreview.src = `https://www.youtube.com/embed/${id}?enablejsapi=1`;
            modalVideoPreview.classList.remove('hidden');
            modalVideoIcon.classList.add('hidden');
        } else {
            modalVideoPreview.src = '';
            modalVideoPreview.classList.add('hidden');
            modalVideoIcon.classList.remove('hidden');
        }
    });

    modalVideoSaveBtn.addEventListener('click', () => {
        if (currentVideoIframe) {
            const id = getYoutubeId(modalVideoInput.value);
            if (id) {
                currentVideoIframe.src = `https://www.youtube.com/embed/${id}?enablejsapi=1`;
                currentVideoIframe.parentElement.classList.remove('hidden');
                currentVideoIframe.closest('.media-item').querySelector('.video-placeholder').classList.add('hidden');

                // Ajout input caché pour Symfony
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'videos[]';
                input.value = modalVideoInput.value;
                input.classList.add('hidden');
                hiddenContainer.appendChild(input);
            }
        }
        resetVideoModal();
    });

    function resetVideoModal() {
        modalVideoPreview.src = '';
        modalVideoPreview.classList.add('hidden');
        modalVideoIcon.classList.remove('hidden');
        modalVideoInput.value = '';
        closeModal(editVideoModal, editVideoContent);
    }

    closeEditVideoModal?.addEventListener('click', resetVideoModal);
    window.addEventListener('click', e => { if (e.target === editVideoModal) resetVideoModal(); });

    // ======= Initial carousel setup =======
    updateArrowState();
    createPagination();
});
