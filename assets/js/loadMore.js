document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.getElementById('load-more');
    const container = document.getElementById('tricks-container');

    // Créer le spinner si pas déjà présent
    let spinner = loadMoreBtn.querySelector('.load-spinner');
    if (!spinner) {
        spinner = document.createElement('svg');
        spinner.classList.add('load-spinner', 'absolute', 'w-5', 'h-5', 'text-white', 'animate-spin', 'hidden');
        spinner.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        spinner.setAttribute('fill', 'none');
        spinner.setAttribute('viewBox', '0 0 24 24');
        spinner.innerHTML = `
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        `;
        loadMoreBtn.appendChild(spinner);
    }

    const loadText = loadMoreBtn.querySelector('.load-text') || loadMoreBtn;

    loadMoreBtn.addEventListener('click', () => {
        let page = parseInt(loadMoreBtn.dataset.page) + 1;

        // Afficher le spinner et cacher le texte
        loadText.classList.add('opacity-0');
        spinner.classList.remove('hidden');
        loadMoreBtn.disabled = true;

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
            .catch(err => console.error(err))
            .finally(() => {
                // Remet le bouton en état normal
                loadText.classList.remove('opacity-0');
                spinner.classList.add('hidden');
                loadMoreBtn.disabled = false;
            });
    });
});