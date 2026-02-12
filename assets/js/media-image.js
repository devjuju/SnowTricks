document.addEventListener('DOMContentLoaded', () => {
    const imageWrapper = document.getElementById('image-wrapper');
    if (!imageWrapper) return;

    let imageIndex = imageWrapper.querySelectorAll('.media-item').length || 0;

    const initImageItem = (item, isNew = false) => {
        const input = item.querySelector('.item-input');
        if (!input) return;

        const preview = item.querySelector('img');
        const placeholder = item.querySelector('.image-placeholder');
        const addBtn = item.querySelector('.item-add');
        const editBtn = item.querySelector('.item-edit');
        const closeBtn = item.querySelector('.item-close');
        const removeBtn = item.querySelector('.remove-item');

        const updatePreview = () => {
            if (input.files?.[0]) {
                const reader = new FileReader();
                reader.onload = e => {
                    preview.src = e.target.result;
                    preview.classList.remove('hidden');
                    placeholder?.classList.add('hidden');
                };
                reader.readAsDataURL(input.files[0]);
            }
        };

        const updateUI = () => {
            const hasValue = input.files.length > 0;
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

        input.addEventListener('change', () => {
            updatePreview();
            updateUI();
        });

        addBtn?.addEventListener('click', openInput);
        editBtn?.addEventListener('click', openInput);
        closeBtn?.addEventListener('click', closeInput);

        removeBtn?.addEventListener('click', () => {
            const removed = item.querySelector('.removed-image');
            if (removed) removed.value ||= 'new';
            item.remove();
        });

        updatePreview();
        if (isNew) openInput();
        else updateUI();
    };

    const addImage = () => {
        const proto = document.getElementById('image-prototype');
        if (!proto) return;

        const div = document.createElement('div');
        div.className = 'media-item media-image flex-shrink-0 w-40 snap-start relative';
        div.innerHTML = proto.dataset.prototype.replace(/__name__/g, imageIndex++);
        imageWrapper.appendChild(div);
        initImageItem(div, true);
        div.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    };

    document.getElementById('add-image')?.addEventListener('click', addImage);
    imageWrapper.querySelectorAll('.media-item').forEach(item => initImageItem(item));
});