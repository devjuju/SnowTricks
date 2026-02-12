document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('media-wrapper');
    const addBtn = document.getElementById('add-video');
    const proto = document.getElementById('video-prototype');

    if (!wrapper || !addBtn || !proto) return;

    let index = wrapper.querySelectorAll('.media-video').length;

    const extractYoutubeId = (url) => {
        try {
            const u = new URL(url);
            if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
            if (u.hostname === 'youtu.be') return u.pathname.substring(1);
        } catch { }
        return null;
    };

    const initItem = (item) => {
        const input = item.querySelector('.item-input');
        const iframe = item.querySelector('iframe');
        const placeholder = item.querySelector('.video-placeholder');

        const add = item.querySelector('.item-add');
        const edit = item.querySelector('.item-edit');
        const close = item.querySelector('.item-close');
        const remove = item.querySelector('.remove-item');

        const updatePreview = () => {
            const id = extractYoutubeId(input.value.trim());
            if (!id) {
                iframe.src = '';
                placeholder?.classList.remove('hidden');
                return;
            }
            iframe.src = `https://www.youtube.com/embed/${id}`;
            iframe.classList.remove('hidden');
            placeholder?.classList.add('hidden');
        };

        const updateUI = () => {
            const hasValue = input.value.trim() !== '';
            const isOpen = !input.classList.contains('w-0');

            add?.classList.toggle('hidden', isOpen || hasValue);
            edit?.classList.toggle('hidden', !(hasValue && !isOpen));
            close?.classList.toggle('hidden', !isOpen);
            remove?.classList.toggle('hidden', isOpen);
        };

        const open = () => {
            input.classList.remove('w-0', 'opacity-0');
            input.classList.add('w-full', 'opacity-100');
            updateUI();
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

        add?.addEventListener('click', open);
        edit?.addEventListener('click', open);
        close?.addEventListener('click', closeInput);

        remove?.addEventListener('click', () => {
            item.querySelector('.removed-video')?.value ||= 'new';
            item.remove();
        });

        updatePreview();
        updateUI();
    };

    addBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.innerHTML = proto.dataset.prototype.replace(/__name__/g, index++);
        wrapper.appendChild(div.firstElementChild);
        initItem(wrapper.lastElementChild);
        wrapper.lastElementChild.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    });

    wrapper.querySelectorAll('.media-video').forEach(initItem);
});