document.addEventListener('DOMContentLoaded', () => {
    const imageWrapper = document.getElementById('image-wrapper');
    if (!imageWrapper) return;

    imageWrapper.querySelectorAll('.media-image .item-input').forEach(input => {
        input.addEventListener('change', () => {
            if (!input.files?.[0]) return;

            const file = input.files[0];
            const formData = new FormData();
            formData.append('images[]', file);

            fetch('/profile/images/temp', {
                method: 'POST',
                body: formData,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.images?.[0]) {
                        input.dataset.filename = data.images[0].filename;
                        const preview = input.closest('.media-item').querySelector('img');
                        if (preview) preview.src = data.images[0].url;
                    }
                })
                .catch(console.error);
        });
    });

    imageWrapper.querySelectorAll('.media-image .remove-item').forEach(btn => {
        btn.addEventListener('click', e => {
            const input = btn.closest('.media-item').querySelector('.item-input');
            if (input?.dataset.filename) {
                fetch('/profile/images/temp/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `filename=${encodeURIComponent(input.dataset.filename)}`
                });
            }
        });
    });
});