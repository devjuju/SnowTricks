document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.getElementById('load-more');
    const container = document.getElementById('tricks-container');

    loadMoreBtn.addEventListener('click', () => {
        let page = parseInt(loadMoreBtn.dataset.page) + 1;

        fetch(`/?page=${page}`, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
            .then(response => response.text())
            .then(html => {
                if (html.trim().length > 0) {
                    container.insertAdjacentHTML('beforeend', html);
                    loadMoreBtn.dataset.page = page;
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            })
            .catch(err => console.error(err));
    });
});