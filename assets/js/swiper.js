document.addEventListener('DOMContentLoaded', () => {
    const carousel = new Swiper('.myCarousel', {
        slidesPerView: 1,       // une slide visible à la fois
        spaceBetween: 20,        // espace entre les slides
        loop: true,              // boucle infinie

        autoplay: {
            delay: 3000,           // 3 secondes par slide
            disableOnInteraction: false,
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });
});
