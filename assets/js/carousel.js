const wrapper = document.getElementById('media-wrapper');
let offset = 0;

document.getElementById('next').addEventListener('click', () => {
  offset -= 300;
  wrapper.style.transform = `translateX(${offset}px)`;
});

document.getElementById('prev').addEventListener('click', () => {
  offset += 300;
  if (offset > 0) offset = 0;
  wrapper.style.transform = `translateX(${offset}px)`;
});
