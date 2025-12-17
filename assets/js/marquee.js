const marquee = document.getElementById('marquee');
const container = document.getElementById('marquee-container');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

// Fonction pour obtenir la largeur d'un élément + gap
function getSlideWidth() {
    const slide = marquee.querySelector('div');
    if (!slide) return 0;
    const style = getComputedStyle(slide);
    const gap = parseInt(getComputedStyle(marquee).gap) || 0;
    return slide.offsetWidth + gap;
}

let scrollPosition = 0;

// Bouton suivant
nextBtn.addEventListener('click', () => {
    const slideWidth = getSlideWidth();
    scrollPosition += slideWidth;
    if (scrollPosition > marquee.scrollWidth - container.clientWidth) {
        scrollPosition = marquee.scrollWidth - container.clientWidth;
    }
    marquee.style.transform = `translateX(-${scrollPosition}px)`;
});

// Bouton précédent
prevBtn.addEventListener('click', () => {
    const slideWidth = getSlideWidth();
    scrollPosition -= slideWidth;
    if (scrollPosition < 0) scrollPosition = 0;
    marquee.style.transform = `translateX(-${scrollPosition}px)`;
});
