document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.getElementById('load-more-comments');
    const container = document.getElementById('comments-container');

    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', () => {
        let offset = parseInt(loadMoreBtn.dataset.offset) + 5;

        fetch(`${loadMoreBtn.dataset.url}?offset=${offset}`, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
            .then(response => response.text())
            .then(html => {
                if (html.trim().length > 0) {
                    container.insertAdjacentHTML('beforeend', html);
                    loadMoreBtn.dataset.offset = offset;
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            })
            .catch(err => console.error(err));
    });
});
