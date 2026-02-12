document.addEventListener('DOMContentLoaded', () => {
    /* ================= Featured Image ================= */
    const featuredContainer = document.getElementById('image-container');
    if (featuredContainer) {
        const input = featuredContainer.querySelector('input[type="file"]');
        const preview = document.getElementById('image-preview');
        const placeholder = document.getElementById('image-placeholder');
        const actions = document.getElementById('image-actions');
        const editBtn = document.getElementById('edit-image');
        const deleteBtn = document.getElementById('delete-image');
        const deleteHidden = document.getElementById('delete-featured-image');

        const updateActions = () => {
            const hasImage = preview.src && preview.src.trim() !== '';
            actions.style.opacity = hasImage ? 1 : 0;
        };

        // Initial preview depuis Twig (data-existing-image)
        const existing = featuredContainer.dataset.existingImage;
        if (existing) {
            preview.src = existing;
            preview.style.opacity = 1;
            placeholder.style.opacity = 0;
            deleteBtn.style.display = 'inline-flex';
            updateActions();
        }

        input?.addEventListener('change', () => {
            const file = input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                preview.src = e.target.result;
                preview.style.opacity = 1;
                placeholder.style.opacity = 0;
                deleteBtn.style.display = 'inline-flex';
                deleteHidden.value = 0;
                updateActions();
            };
            reader.readAsDataURL(file);
        });

        editBtn?.addEventListener('click', () => input.click());
        deleteBtn?.addEventListener('click', () => {
            input.value = '';
            preview.src = '';
            preview.style.opacity = 0;
            placeholder.style.opacity = 1;
            deleteBtn.style.display = 'none';
            deleteHidden.value = 1;
            updateActions();
        });
    }

    /* ================= Media Carousel ================= */
    const wrapper = document.getElementById('media-wrapper');
    if (!wrapper) return;
    let mediaIndex = wrapper.querySelectorAll('.media-item').length;

    const extractYoutubeId = url => {
        try {
            const u = new URL(url);
            if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
            if (u.hostname === 'youtu.be') return u.pathname.substring(1);
        } catch (e) { }
        return null;
    };

    const initItem = (item, type) => {
        const input = item.querySelector('.item-input');
        const preview = type === 'image' ? item.querySelector('img') : item.querySelector('iframe');
        const placeholder = type === 'image' ? item.querySelector('.image-placeholder') : item.querySelector('.video-placeholder');
        const addBtn = item.querySelector('.item-add');
        const editBtn = item.querySelector('.item-edit');
        const closeBtn = item.querySelector('.item-close');
        const removeBtn = item.querySelector('.remove-item');

        // Initial preview depuis Twig
        if (type === 'image' && item.dataset.existingImage) {
            preview.src = item.dataset.existingImage;
            preview.classList.remove('hidden');
            placeholder?.classList.add('hidden');
        }
        if (type === 'video' && item.dataset.existingUrl) {
            const id = extractYoutubeId(item.dataset.existingUrl);
            if (id) preview.src = `https://www.youtube.com/embed/${id}`;
            preview.classList.remove('hidden');
            placeholder?.classList.add('hidden');
        }

        const updatePreview = () => {
            if (type === 'image') {
                if (input.files?.[0]) {
                    const reader = new FileReader();
                    reader.onload = e => {
                        preview.src = e.target.result;
                        preview.classList.remove('hidden');
                        placeholder?.classList.add('hidden');
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            } else {
                const id = extractYoutubeId(input.value.trim());
                if (id) {
                    preview.src = `https://www.youtube.com/embed/${id}`;
                    preview.classList.remove('hidden');
                    placeholder?.classList.add('hidden');
                } else {
                    preview.src = '';
                    placeholder?.classList.remove('hidden');
                }
            }
        };

        const updateUI = () => {
            const hasValue = type === 'image' ? input.files.length > 0 : input.value.trim() !== '';
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
        };

        const closeInput = () => {
            input.classList.add('w-0', 'opacity-0');
            input.classList.remove('w-full', 'opacity-100');
            updateUI();
        };

        input.addEventListener(type === 'image' ? 'change' : 'input', () => {
            updatePreview();
            updateUI();
        });

        addBtn?.addEventListener('click', openInput);
        editBtn?.addEventListener('click', openInput);
        closeBtn?.addEventListener('click', closeInput);
        removeBtn?.addEventListener('click', () => {
            const removed = item.querySelector(type === 'image' ? '.removed-image' : '.removed-video');
            if (removed) removed.value ||= 'new';
            item.remove();
        });

        updatePreview();
        updateUI();
    };

    const addMedia = type => {
        const proto = document.getElementById(`${type}-prototype`);
        if (!proto) return;

        const div = document.createElement('div');
        div.className = `media-item media-${type} flex-shrink-0 w-40 snap-start relative`;
        div.innerHTML = proto.dataset.prototype.replace(/__name__/g, mediaIndex++);

        wrapper.appendChild(div);
        initItem(div, type);

        const input = div.querySelector('.item-input');
        input?.classList.remove('w-0', 'opacity-0');
        input?.classList.add('w-full', 'opacity-100');
        input?.focus();

        div.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    };

    document.getElementById('add-image')?.addEventListener('click', () => addMedia('image'));
    document.getElementById('add-video')?.addEventListener('click', () => addMedia('video'));

    wrapper.querySelectorAll('.media-item').forEach(item =>
        initItem(item, item.classList.contains('media-image') ? 'image' : 'video')
    );
});
