document.addEventListener('DOMContentLoaded', () => {
    const videoWrapper = document.getElementById('video-wrapper');
    if (!videoWrapper) return;

    let videoIndex = videoWrapper.querySelectorAll('.media-element').length || 0;

    const extractYoutubeId = (url) => {
        try {
            const parsed = new URL(url);
            if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v');
            if (parsed.hostname === 'youtu.be') return parsed.pathname.substring(1);
        } catch (e) { }
        return null;
    };

    const initVideoElement = (element, isNew = false) => {
        const input = element.querySelector('.element-input');
        if (!input) return;

        const preview = element.querySelector('iframe');
        const placeholder = element.querySelector('.video-placeholder');
        const addBtn = element.querySelector('.element-add');
        const editBtn = element.querySelector('.element-edit');
        const closeBtn = element.querySelector('.element-close');
        const removeBtn = element.querySelector('.element-item');

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
            const removed = element.querySelector('.removed-video');
            if (removed) removed.value ||= 'new';
            element.remove();
        });

        updatePreview();
        if (isNew) openInput();
        else updateUI();
    };

    const addVideo = () => {
        const proto = document.getElementById('video-prototype');
        if (!proto) return;

        const div = document.createElement('div');
        div.className = 'media-element media-video flex-shrink-0 w-40 snap-start relative';
        div.innerHTML = proto.dataset.prototype.replace(/__name__/g, videoIndex++);
        videoWrapper.appendChild(div);
        initVideoElement(div, true);
        div.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    };

    document.getElementById('add-video')?.addEventListener('click', addVideo);
    videoWrapper.querySelectorAll('.media-element').forEach(element => initVideoElement(element));
});