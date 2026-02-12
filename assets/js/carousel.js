document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('media-wrapper');
  if (!wrapper) return;

  let mediaIndex = wrapper.querySelectorAll('.media-item').length;

  /* ================= Utils ================= */

  const extractYoutubeId = (url) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes('youtube.com'))
        return parsed.searchParams.get('v');
      if (parsed.hostname === 'youtu.be')
        return parsed.pathname.substring(1);
    } catch (e) { }
    return null;
  };

  const getItem = (el) => el.closest('.media-item');

  const getType = (item) =>
    item.classList.contains('media-image') ? 'image' : 'video';

  /* ================= UI logic ================= */

  const openInput = (item) => {
    const input = item.querySelector('.item-input');
    input.classList.remove('w-0', 'opacity-0');
    input.classList.add('w-full', 'opacity-100');
  };

  const closeInput = (item) => {
    const input = item.querySelector('.item-input');
    input.classList.add('w-0', 'opacity-0');
    input.classList.remove('w-full', 'opacity-100');
  };

  const updatePreview = (item, type) => {
    const input = item.querySelector('.item-input');
    if (!input) return;

    const preview =
      type === 'image'
        ? item.querySelector('img')
        : item.querySelector('iframe');

    const placeholder =
      type === 'image'
        ? item.querySelector('.image-placeholder')
        : item.querySelector('.video-placeholder');

    if (type === 'image') {
      if (input.files?.[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.src = e.target.result;
          preview.classList.remove('hidden');
          placeholder?.classList.add('hidden');
        };
        reader.readAsDataURL(input.files[0]);
      }
    } else {
      const id = extractYoutubeId(input.value.trim());
      if (id) {
        preview.src = `https://www.youtube.com/embed/${id}`;
        preview.classList.remove('hidden');
        placeholder?.classList.add('hidden');
      } else {
        preview.src = '';
        placeholder?.classList.remove('hidden');
      }
    }
  };

  const updateUI = (item, type) => {
    const input = item.querySelector('.item-input');

    const addBtn = item.querySelector('.item-add');
    const editBtn = item.querySelector('.item-edit');
    const closeBtn = item.querySelector('.item-close');
    const removeBtn = item.querySelector('.remove-item');

    const hasValue =
      type === 'image'
        ? input.files.length > 0
        : input.value.trim() !== '';

    const isOpen = !input.classList.contains('w-0');

    addBtn?.classList.toggle('hidden', isOpen || hasValue);
    editBtn?.classList.toggle('hidden', !(hasValue && !isOpen));
    closeBtn?.classList.toggle('hidden', !isOpen);
    removeBtn?.classList.toggle('hidden', isOpen);
  };

  /* ================= Init item ================= */

  const initItem = (item, { openOnInit = false } = {}) => {
    const type = getType(item);
    const input = item.querySelector('.item-input');

    const hasValue =
      type === 'image'
        ? input.files.length > 0
        : input.value.trim() !== '';

    if (openOnInit && !hasValue) {
      openInput(item);
    } else {
      closeInput(item);
    }

    updatePreview(item, type);
    updateUI(item, type);
  };

  /* ================= Event delegation ================= */

  wrapper.addEventListener('click', (e) => {
    const item = getItem(e.target);
    if (!item) return;

    const type = getType(item);

    if (
      e.target.closest('.item-add') ||
      e.target.closest('.item-edit')
    ) {
      openInput(item);
    }

    if (e.target.closest('.item-close')) {
      closeInput(item);
    }

    if (e.target.closest('.remove-item')) {
      const removed = item.querySelector(
        type === 'image'
          ? '.removed-image'
          : '.removed-video'
      );
      if (removed) removed.value ||= 'new';
      item.remove();
      return;
    }

    updateUI(item, type);
  });

  wrapper.addEventListener('input', (e) => {
    if (!e.target.classList.contains('item-input')) return;

    const item = getItem(e.target);
    if (!item) return;

    const type = getType(item);
    updatePreview(item, type);
    updateUI(item, type);
  });

  wrapper.addEventListener('change', (e) => {
    if (!e.target.classList.contains('item-input')) return;

    const item = getItem(e.target);
    if (!item) return;

    const type = getType(item);
    updatePreview(item, type);
    updateUI(item, type);
  });

  /* ================= Add media ================= */

  const addMedia = (type) => {
    const proto = document.getElementById(`${type}-prototype`);
    if (!proto) return;

    const div = document.createElement('div');
    div.className = `media-item media-${type} flex-shrink-0 w-40 snap-start relative`;
    div.innerHTML = proto.dataset.prototype.replace(
      /__name__/g,
      mediaIndex++
    );

    wrapper.appendChild(div);
    initItem(div, { openOnInit: true });

    div.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  };

  document
    .getElementById('add-image')
    ?.addEventListener('click', () => addMedia('image'));

  document
    .getElementById('add-video')
    ?.addEventListener('click', () => addMedia('video'));

  /* ================= Init existing ================= */

  wrapper
    .querySelectorAll('.media-item')
    .forEach((item) => initItem(item));
});