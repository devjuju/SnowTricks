document.addEventListener('DOMContentLoaded', () => {
    const videoWrapper = document.getElementById('video-wrapper');
    if (!videoWrapper) return;

    let videoIndex = videoWrapper.querySelectorAll('.media-item').length || 0;

    const extractYoutubeId = (url) => {
        try {
            const parsed = new URL(url);
            if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v');
            if (parsed.hostname === 'youtu.be') return parsed.pathname.substring(1);
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
            const removed = item.querySelector('.removed-video');
            if (removed) removed.value ||= 'new';
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
        div.className = 'media-item media-video flex-shrink-0 w-40 snap-start relative';
        div.innerHTML = proto.dataset.prototype.replace(/__name__/g, videoIndex++);
        videoWrapper.appendChild(div);
        initVideoItem(div, true);
        div.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    };

    document.getElementById('add-video')?.addEventListener('click', addVideo);
    videoWrapper.querySelectorAll('.media-item').forEach(item => initVideoItem(item));
});