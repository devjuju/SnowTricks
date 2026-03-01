document.addEventListener('DOMContentLoaded', () => {

    const scrollTopBtn = document.getElementById('scroll-top');
    const scrollDownBtn = document.getElementById('scroll-down');
    const tricksSection = document.getElementById('tricks-container');

    const loadMoreBtn = document.getElementById('load-more');
    const loadText = loadMoreBtn.querySelector('.load-text');
    const spinner = loadMoreBtn.querySelector('.load-spinner');

    // DESCENDRE vers la grille
    scrollDownBtn.addEventListener('click', () => {
        tricksSection.scrollIntoView({ behavior: 'smooth' });
    });

    // REMONTER en haut
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Fonction toggle fade + slide
    function toggleButton(btn, show) {
        if (show) {
            btn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
            btn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        } else {
            btn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            btn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
        }
    }

    // Scroll event pour ↓ et ↑
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        toggleButton(scrollDownBtn, scrollY < 200); // ↓ visible en haut
        toggleButton(scrollTopBtn, scrollY > 300); // ↑ visible après scroll
    });

    // LOAD MORE AJAX
    loadMoreBtn.addEventListener('click', () => {
        let page = parseInt(loadMoreBtn.dataset.page) + 1;

        // Afficher spinner, cacher texte, désactiver bouton
        loadText.classList.add('opacity-0');
        spinner.classList.remove('hidden');
        loadMoreBtn.disabled = true;

        fetch(`/?page=${page}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(response => response.text()).then(html => {
            if (html.trim().length > 0) {
                tricksSection.insertAdjacentHTML('beforeend', html);
                loadMoreBtn.dataset.page = page;
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }).catch(err => console.error(err)).finally(() => {
            loadText.classList.remove('opacity-0');
            spinner.classList.add('hidden');
            loadMoreBtn.disabled = false;
        });
    });

});