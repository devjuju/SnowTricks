document.addEventListener('DOMContentLoaded', () => {
    const imageWrapper = document.getElementById('image-wrapper');
    const videoWrapper = document.getElementById('video-wrapper');

    if (!imageWrapper && !videoWrapper) return;

    let imageIndex = imageWrapper?.querySelectorAll('.media-item').length || 0;
    let videoIndex = videoWrapper?.querySelectorAll('.media-item').length || 0;

    // --- Helper pour YouTube ---
    const extractYoutubeId = (url) => {
        try {
            const parsed = new URL(url);
            if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v');
            if (parsed.hostname === 'youtu.be') return parsed.pathname.substring(1);
        } catch (e) { }
        return null;
    };

    // --- Initialisation d'un item (image ou vidéo) ---
    const initItem = (item, type, isNew = false) => {
        const input = item.querySelector('.item-input');
        if (!input) return;

        const preview = type === 'image' ? item.querySelector('img') : item.querySelector('iframe');
        const placeholder = type === 'image' ? item.querySelector('.image-placeholder') : item.querySelector('.video-placeholder');
        const addBtn = item.querySelector('.item-add');
        const editBtn = item.querySelector('.item-edit');
        const closeBtn = item.querySelector('.item-close');
        const removeBtn = item.querySelector('.remove-item');

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
            } else { // vidéo
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
            const hasValue = type === 'image' ? input.files.length > 0 || input.dataset.filename : input.value.trim() !== '';
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

        // --- Upload AJAX pour les images ---
        input.addEventListener(type === 'image' ? 'change' : 'input', async () => {
            updatePreview();
            updateUI();

            if (type === 'image' && input.files?.[0]) {
                const formData = new FormData();
                formData.append('images[]', input.files[0]);

                try {
                    const res = await fetch('/profile/images/temp', { method: 'POST', body: formData });
                    const data = await res.json();
                    if (data.images?.[0]) {
                        // Stocker le filename temporaire côté JS
                        input.dataset.filename = data.images[0].filename;
                    }
                } catch (err) {
                    console.error('Upload échoué', err);
                }
            }
        });

        addBtn?.addEventListener('click', openInput);
        editBtn?.addEventListener('click', openInput);
        closeBtn?.addEventListener('click', closeInput);

        removeBtn?.addEventListener('click', async () => {
            const filename = input.dataset.filename;
            if (filename) {
                try {
                    await fetch('/profile/images/temp/delete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ filename })
                    });
                } catch (err) {
                    console.error('Suppression échouée', err);
                }
            }
            item.remove();
        });

        updatePreview();
        if (isNew) openInput(); else updateUI();
    };

    // --- Ajouter un nouvel item ---
    const addMedia = (type) => {
        const proto = document.getElementById(`${type}-prototype`);
        const wrapper = type === 'image' ? imageWrapper : videoWrapper;
        if (!proto || !wrapper) return;

        const index = type === 'image' ? imageIndex++ : videoIndex++;
        const div = document.createElement('div');
        div.className = `media-item media-${type} flex-shrink-0 w-40 snap-start relative`;
        div.innerHTML = proto.dataset.prototype.replace(/__name__/g, index);

        wrapper.appendChild(div);
        initItem(div, type, true);
        div.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    };

    document.getElementById('add-image')?.addEventListener('click', () => addMedia('image'));
    document.getElementById('add-video')?.addEventListener('click', () => addMedia('video'));

    // --- Initialisation des items existants ---
    imageWrapper?.querySelectorAll('.media-item').forEach(item => initItem(item, 'image'));
    videoWrapper?.querySelectorAll('.media-item').forEach(item => initItem(item, 'video'));
});