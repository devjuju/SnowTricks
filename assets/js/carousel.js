document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('media-wrapper');
  if (!wrapper) return;

  const prev = document.querySelector('[data-carousel-prev]');
  const next = document.querySelector('[data-carousel-next]');

  const scrollAmount = wrapper.clientWidth * 0.8;

  next?.addEventListener('click', () => {
    wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  prev?.addEventListener('click', () => {
    wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
});
