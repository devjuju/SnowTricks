document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('media-wrapper');
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');

  // 🔑 UN SEUL index Symfony
  let mediaIndex = wrapper.querySelectorAll('.media-item').length;

  /* ================= Utils ================= */

  const getItemWidth = () => {
    const item = wrapper.querySelector('.media-item');
    if (!item) return 300;
    const gap = parseInt(getComputedStyle(wrapper).gap) || 16;
    return item.offsetWidth + gap;
  };

  const updateButtons = () => {
    prevBtn.style.display = wrapper.scrollLeft <= 0 ? 'none' : 'block';
    nextBtn.style.display =
      wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth
        ? 'none'
        : 'block';
  };

  const extractYoutubeId = (url) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes('youtube.com')) {
        return parsed.searchParams.get('v');
      }
      if (parsed.hostname === 'youtu.be') {
        return parsed.pathname.substring(1);
      }
    } catch (e) { }
    return null;
  };

  /* ================= Init item ================= */

  const initItem = (item, type) => {
    const input = item.querySelector('.item-input');
    if (!input) return;

    const preview = type === 'image'
      ? item.querySelector('img')
      : item.querySelector('iframe');

    const placeholder = type === 'image'
      ? item.querySelector('.image-placeholder')
      : item.querySelector('.video-placeholder');

    const addBtn = item.querySelector('.item-add');
    const editBtn = item.querySelector('.item-edit');
    const closeBtn = item.querySelector('.item-close');
    const removeBtn = item.querySelector('.remove-item');

    /* ----- Preview ----- */

    const updatePreview = () => {
      if (type === 'image') {
        if (input.files && input.files[0]) {
          const reader = new FileReader();
          reader.onload = e => {
            preview.src = e.target.result;
            preview.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
          };
          reader.readAsDataURL(input.files[0]);
        }
      } else {
        const id = extractYoutubeId(input.value.trim());
        if (id) {
          preview.src = `https://www.youtube.com/embed/${id}`;
          preview.style.display = 'block';
          if (placeholder) placeholder.style.display = 'none';
        } else {
          preview.src = '';
          if (placeholder) placeholder.style.display = 'flex';
        }
      }
    };

    /* ----- UI ----- */

    const updateUI = () => {
      const hasValue = type === 'image'
        ? input.files.length > 0
        : input.value.trim() !== '';

      const isOpen = !input.classList.contains('w-0');

      addBtn?.classList.toggle('hidden', isOpen || hasValue);
      editBtn?.classList.toggle('hidden', !(hasValue && !isOpen));
      closeBtn?.classList.toggle('hidden', !isOpen);
      removeBtn?.classList.toggle('hidden', isOpen);
    };

    const openInput = () => {
      input.classList.remove('w-0', 'opacity-0');
      input.classList.add('w-full', 'opacity-100');
      updateUI();
    };

    const closeInput = () => {
      input.classList.add('w-0', 'opacity-0');
      input.classList.remove('w-full', 'opacity-100');
      updateUI();
    };

    /* ----- Events ----- */

    input.addEventListener(type === 'image' ? 'change' : 'input', () => {
      updatePreview();
      updateUI();
    });

    addBtn?.addEventListener('click', openInput);
    editBtn?.addEventListener('click', openInput);
    closeBtn?.addEventListener('click', closeInput);

    removeBtn?.addEventListener('click', () => {
      const removed = item.querySelector(
        type === 'image' ? '.removed-image' : '.removed-video'
      );
      if (removed) removed.value ||= 'new';
      item.remove();
      updateButtons();
    });

    updatePreview();
    updateUI();
  };

  /* ================= Add media ================= */

  const addMedia = (type) => {
    const proto = document.getElementById(`${type}-prototype`).dataset.prototype;

    const div = document.createElement('div');
    div.className = `media-item media-${type} flex-shrink-0 w-40 snap-start relative`;

    // 🔥 IMPORTANT : __name__
    div.innerHTML = proto.replace(/__name__/g, mediaIndex++);

    wrapper.appendChild(div);
    initItem(div, type);

    const input = div.querySelector('.item-input');
    input?.classList.remove('w-0', 'opacity-0');
    input?.classList.add('w-full', 'opacity-100');
    input?.focus();

    div.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    updateButtons();
  };

  document.getElementById('add-image')
    ?.addEventListener('click', () => addMedia('image'));

  document.getElementById('add-video')
    ?.addEventListener('click', () => addMedia('video'));

  /* ================= Init existing ================= */

  wrapper.querySelectorAll('.media-item').forEach(item => {
    initItem(item, item.classList.contains('media-image') ? 'image' : 'video');
  });

  /* ================= Carousel ================= */

  nextBtn.addEventListener('click', () =>
    wrapper.scrollBy({ left: getItemWidth(), behavior: 'smooth' })
  );

  prevBtn.addEventListener('click', () =>
    wrapper.scrollBy({ left: -getItemWidth(), behavior: 'smooth' })
  );

  wrapper.addEventListener('scroll', updateButtons);
  updateButtons();
});
