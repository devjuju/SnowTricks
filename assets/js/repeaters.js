document.addEventListener('DOMContentLoaded', () => {

    // ===== COLLAPSE =====
    const collapseBtn = document.getElementById('collapseBtn');
    const collapseContent = document.getElementById('collapseContent');

    collapseBtn.addEventListener('click', () => {
        if (collapseContent.style.maxHeight && collapseContent.style.maxHeight !== '0px') {
            collapseContent.style.maxHeight = '0px';
        } else {
            collapseContent.style.maxHeight = collapseContent.scrollHeight + 'px';
        }
    });

    // ===== IMAGES REPEATER =====
    const addImageBtn = document.getElementById('add-image');
    const imagesWrapper = document.getElementById('images-wrapper');
    const imageTemplate = document.getElementById('image-template');

    addImageBtn.addEventListener('click', () => {
        const clone = imageTemplate.content.cloneNode(true);
        imagesWrapper.appendChild(clone);

        // Auto-scroll pour voir le nouvel élément
        imagesWrapper.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    });

    imagesWrapper.addEventListener('click', e => {
        if (e.target.closest('.remove-image')) {
            e.target.closest('.image-item').remove();
        }
    });

    // ===== VIDEOS REPEATER =====
    const addVideoBtn = document.getElementById('add-video');
    const videosWrapper = document.getElementById('videos-wrapper');
    const videoTemplate = document.getElementById('video-template');

    addVideoBtn.addEventListener('click', () => {
        const clone = videoTemplate.content.cloneNode(true);
        videosWrapper.appendChild(clone);

        // Auto-scroll pour voir le nouvel élément
        videosWrapper.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    });

    videosWrapper.addEventListener('click', e => {
        if (e.target.closest('.remove-video')) {
            e.target.closest('.video-item').remove();
        }
    });

});
