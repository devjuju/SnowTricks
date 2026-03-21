document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const errorBox = document.getElementById("media-error");

    const imageWrapper = document.getElementById("image-wrapper");
    const videoWrapper = document.getElementById("video-wrapper");

    function hasMedia() {
        const hasImages =
            imageWrapper.querySelectorAll(".media-image").length > 0;
        const hasVideos =
            videoWrapper.querySelectorAll(".media-video").length > 0;

        return hasImages || hasVideos;
    }

    form.addEventListener("submit", function (e) {
        if (!hasMedia()) {
            e.preventDefault();

            errorBox.textContent =
                "Vous devez ajouter au moins une image ou une vidéo.";

            // Option UX : scroll vers l'erreur
            errorBox.scrollIntoView({ behavior: "smooth", block: "center" });

            return false;
        }

        errorBox.textContent = "";
    });
});
