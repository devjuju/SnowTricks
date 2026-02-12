document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.media-item.media-featured');
    if (!wrapper) return;

    const input = wrapper.querySelector('.item-input');
    const preview = wrapper.querySelector('.image-preview');
    const placeholder = wrapper.querySelector('.image-placeholder');
    const editBtn = wrapper.querySelector('.item-edit');
    const removeBtn = wrapper.querySelector('.remove-item');

    const updatePreview = () => {
        if (input.files?.[0]) {
            const reader = new FileReader();
            reader.onload = e => {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                placeholder?.classList.add('hidden');
            };
            reader.readAsDataURL(input.files[0]);
        } else {
            preview.src = '';
            preview.classList.add('hidden');
            placeholder?.classList.remove('hidden');
        }
    };

    editBtn.addEventListener('click', () => input.click());
    input.addEventListener('change', updatePreview);
    removeBtn.addEventListener('click', () => {
        input.value = '';
        updatePreview();
    });

    // Initialisation si déjà une image existante
    updatePreview();




});
