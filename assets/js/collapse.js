document.querySelectorAll('[data-collapse]').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.dataset.collapse;
        const target = document.getElementById(targetId);
        const arrow = button.querySelector('[data-arrow]');

        target.classList.toggle('hidden');

        if (arrow) {
            arrow.classList.toggle('rotate-180');
        }
    });
});

