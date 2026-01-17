document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('media-wrapper');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');

    let imageIndex = wrapper.querySelectorAll('.media-image').length;
    let videoIndex = wrapper.querySelectorAll('.media-video').length;

    // ---------- Utils ----------
    const getItemWidth = () => {
        const item = wrapper.querySelector('.media-item');
        if (!item) return 300;
        const gap = parseInt(getComputedStyle(wrapper).gap) || 16;
        return item.offsetWidth + gap;
    };

    const updateButtons = () => {
        if (!prevBtn || !nextBtn) return;
        prevBtn.style.display = wrapper.scrollLeft <= 0 ? 'none' : 'block';
        nextBtn.style.display =
            wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth
                ? 'none'
                : 'block';
    };

    const extractYoutubeId = (url) => {
        try {
            const parsed = new URL(url);
            if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v');
            if (parsed.hostname === 'youtu.be') return parsed.pathname.substring(1);
        } catch (e) { return null; }
        return null;
    };

    // ---------- Carousel scroll ----------
    nextBtn?.addEventListener('click', () => wrapper.scrollBy({ left: getItemWidth(), behavior: 'smooth' }));
    prevBtn?.addEventListener('click', () => wrapper.scrollBy({ left: -getItemWidth(), behavior: 'smooth' }));
    wrapper.addEventListener('scroll', updateButtons);
    updateButtons();

    // ---------- Init media item ----------
    const initItem = (item, type) => {
        const input = item.querySelector('.item-input');
        if (!input) return;

        const preview = type === 'image'
            ? item.querySelector('.image-preview') || item.querySelector('img')
            : item.querySelector('iframe');

        const placeholder = type === 'image'
            ? item.querySelector('.image-placeholder')
            : item.querySelector('.video-placeholder');

        const addBtn = item.querySelector('.item-add');
        const editBtn = item.querySelector('.item-edit');
        const closeBtn = item.querySelector('.item-close');
        const removeBtn = item.querySelector('.remove-item');

        // ---------- Preview ----------
        const updatePreview = () => {
            if (type === 'image') {
                if (input.files && input.files[0]) {
                    const reader = new FileReader();
                    reader.onload = e => {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                        if (placeholder) placeholder.style.display = 'none';
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            } else {
                const videoId = extractYoutubeId(input.value.trim());
                if (videoId) {
                    preview.src = `https://www.youtube.com/embed/${videoId}`;
                    preview.style.display = 'block';
                    if (placeholder) placeholder.style.display = 'none';
                } else {
                    preview.src = '';
                    if (placeholder) placeholder.style.display = 'flex';
                }
            }
        };

        // ---------- UI ----------
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
            addBtn?.classList.add('hidden');
            editBtn?.classList.add('hidden');
            closeBtn?.classList.remove('hidden');
            removeBtn?.classList.add('hidden');
        };

        const closeInput = () => {
            input.classList.add('w-0', 'opacity-0');
            input.classList.remove('w-full', 'opacity-100');
            updateUI();
        };

        if (type === 'image') input.addEventListener('change', () => { updatePreview(); updateUI(); });
        else input.addEventListener('input', () => { updatePreview(); updateUI(); });

        addBtn?.addEventListener('click', openInput);
        editBtn?.addEventListener('click', openInput);
        closeBtn?.addEventListener('click', closeInput);

        removeBtn?.addEventListener('click', () => {
            const removedInput = item.querySelector(type === 'image' ? '.removed-image' : '.removed-video');
            if (removedInput) removedInput.value = type === 'image'
                ? item.querySelector('img[data-filename]')?.dataset.filename || 'new'
                : removedInput.value || 'new';
            item.style.display = 'none';
            updateButtons();
        });

        updatePreview();
        updateUI();
    };

    // ---------- Add new media ----------
    const addMedia = (type) => {
        const hasOpenInput = wrapper.querySelector(`.media-${type} .item-input:not(.w-0)`);
        if (hasOpenInput) { hasOpenInput.focus(); return; }

        const proto = document.getElementById(`${type}-prototype`).dataset.prototype;
        const div = document.createElement('div');
        div.className = `media-item media-${type} flex-shrink-0 w-40 snap-start relative`;

        const index = type === 'image' ? imageIndex++ : videoIndex++;
        div.innerHTML = proto.replace(new RegExp(`__${type}__`, 'g'), index);

        if (type === 'image') {
            const firstVideo = wrapper.querySelector('.media-video');
            wrapper.insertBefore(div, firstVideo);
        } else wrapper.appendChild(div);

        initItem(div, type);

        const input = div.querySelector('.item-input');
        if (input) { input.classList.remove('w-0', 'opacity-0'); input.classList.add('w-full', 'opacity-100'); input.focus(); }

        div.scrollIntoView({ behavior: 'smooth', inline: 'start' });
        updateButtons();
    };

    document.getElementById('add-image')?.addEventListener('click', () => addMedia('image'));
    document.getElementById('add-video')?.addEventListener('click', () => addMedia('video'));

    // ---------- Init existing items ----------
    wrapper.querySelectorAll('.media-item').forEach(item => {
        const type = item.classList.contains('media-image') ? 'image' : 'video';
        initItem(item, type);
    });
});
