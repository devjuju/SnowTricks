document.addEventListener('DOMContentLoaded', () => {
    const imageWrapper = document.getElementById('image-wrapper');
    const videoWrapper = document.getElementById('video-wrapper');

    if (!imageWrapper && !videoWrapper) return;

    let imageIndex = imageWrapper?.querySelectorAll('.media-item').length || 0;
    let videoIndex = videoWrapper?.querySelectorAll('.media-item').length || 0;

    const extractYoutubeId = (url) => {
        try {
            const parsed = new URL(url);
            if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v');
            if (parsed.hostname === 'youtu.be') return parsed.pathname.substring(1);
        } catch (e) { }
        return null;
    };

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
            input.focus();
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

        // Si c'est un nouvel élément, on l'ouvre automatiquement
        if (isNew) {
            openInput();
        } else {
            updateUI();
        }
    };

    const addMedia = (type) => {
        const proto = document.getElementById(`${type}-prototype`);
        const wrapper = type === 'image' ? imageWrapper : videoWrapper;
        if (!proto || !wrapper) return;

        const index = type === 'image' ? imageIndex++ : videoIndex++;
        const div = document.createElement('div');
        div.className = `media-item media-${type} flex-shrink-0 w-40 snap-start relative`;
        div.innerHTML = proto.dataset.prototype.replace(/__name__/g, index);

        wrapper.appendChild(div);
        initItem(div, type, true); // <-- nouvel élément ouvert automatiquement
        div.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    };

    document.getElementById('add-image')?.addEventListener('click', () => addMedia('image'));
    document.getElementById('add-video')?.addEventListener('click', () => addMedia('video'));

    imageWrapper?.querySelectorAll('.media-item').forEach(item => initItem(item, 'image'));
    videoWrapper?.querySelectorAll('.media-item').forEach(item => initItem(item, 'video'));
});