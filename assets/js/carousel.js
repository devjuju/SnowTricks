const carousel = document.getElementById('carousel');
let index = 0;

setInterval(() => {
  index = (index + 1) % carousel.children.length;
  carousel.style.transform = `translateX(-${index * 100}%)`;
}, 2500);
