document.addEventListener('DOMContentLoaded', () => {

    const collapseBtn = document.getElementById('collapseBtn');
    const collapseContent = document.getElementById('collapseContent');
    let isOpen = false;

    collapseBtn.addEventListener('click', () => {
        if (!isOpen) {
            openCollapse();
        } else {
            closeCollapse();
        }
    });

    function openCollapse() {
        collapseContent.style.height = collapseContent.scrollHeight + "px";
        isOpen = true;
    }

    function closeCollapse() {
        collapseContent.style.height = collapseContent.scrollHeight + "px";
        requestAnimationFrame(() => {
            collapseContent.style.height = "0px";
        });
        isOpen = false;
    }

    // Gère les changements internes (images qui se rajoutent, etc.)
    const observer = new MutationObserver(() => {
        if (isOpen) {
            collapseContent.style.height = collapseContent.scrollHeight + "px";
        }
    });
    observer.observe(collapseContent, { childList: true, subtree: true });

});
