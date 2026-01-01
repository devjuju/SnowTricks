// Elements
const marquee = document.getElementById('marquee');
const container = document.getElementById('marquee-container');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

// Calculer la largeur d'une slide (y compris gap)
function getSlideWidth() {
    const slide = marquee.querySelector('div');
    if (!slide) return 0;
    const style = getComputedStyle(slide);
    const gap = parseInt(style.marginRight) || 0;
    return slide.offsetWidth + gap;
}

let scrollPosition = 0;

// Fonction pour appliquer le scroll
function updateScroll() {
    marquee.style.transform = `translateX(-${scrollPosition}px)`;
}

// Flèche suivante
nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const slideWidth = getSlideWidth();
    scrollPosition += slideWidth;
    if (scrollPosition > marquee.scrollWidth - container.clientWidth) {
        scrollPosition = marquee.scrollWidth - container.clientWidth;
    }
    updateScroll();
});

// Flèche précédente
prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const slideWidth = getSlideWidth();
    scrollPosition -= slideWidth;
    if (scrollPosition < 0) scrollPosition = 0;
    updateScroll();
});

// Scroll horizontal avec molette
container.addEventListener('wheel', (e) => {
    e.preventDefault();
    container.scrollLeft += e.deltaY; // défilement horizontal
});

// Lecture des vidéos au clic
document.querySelectorAll('.video-container').forEach(videoContainer => {
    videoContainer.addEventListener('click', (e) => {
        e.preventDefault(); // empêche toute navigation ou soumission
        const youtubeId = videoContainer.dataset.youtubeId;
        if (!youtubeId) return;

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
        iframe.frameBorder = 0;
        iframe.allowFullscreen = true;
        iframe.className = 'w-full h-full rounded-lg';

        videoContainer.parentElement.replaceChild(iframe, videoContainer);
    });
});

// Optional : ajuster la taille si la fenêtre change
window.addEventListener('resize', () => {
    // recalculer la position si nécessaire
    if (scrollPosition > marquee.scrollWidth - container.clientWidth) {
        scrollPosition = Math.max(0, marquee.scrollWidth - container.clientWidth);
        updateScroll();
    }
});
