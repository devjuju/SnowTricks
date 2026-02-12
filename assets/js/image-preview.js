document.querySelector('#trick_form_featuredImage').addEventListener('change', e => {
    const file = e.target.files[0];
    const preview = document.getElementById('featured-preview');

    if (!file) {
        preview.style.display = 'none';
        preview.src = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = e => {
        preview.src = e.target.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
});
