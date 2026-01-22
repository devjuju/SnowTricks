document.addEventListener('DOMContentLoaded', () => {
    const box = document.getElementById('featured-image-box');
    const input = box.querySelector('.item-input');
    const preview = document.getElementById('featured-image-preview');
    const placeholder = document.getElementById('featured-image-placeholder');
    const removeBtn = document.getElementById('featured-image-remove');

    const updatePreview = () => {
        if (input.files?.[0]) {
            const reader = new FileReader();
            reader.onload = e => {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
                placeholder.classList.add('hidden');
            };
            reader.readAsDataURL(input.files[0]);
        } else {
            preview.src = '';
            preview.classList.add('hidden');
            placeholder.classList.remove('hidden');
        }
    };

    // Open file selector when clicking on the box
    box.addEventListener('click', () => input.click());

    // Update preview on file selection
    input.addEventListener('change', updatePreview);

    // Remove image
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the box click
        input.value = '';
        updatePreview();
    });

    // Initialize preview if already has a value
    updatePreview();
});
