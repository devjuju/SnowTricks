document.addEventListener("DOMContentLoaded", () => {
    const addVideoBtn = document.getElementById("add-video");
    const wrapper = document.getElementById("videos-wrapper");
    const template = document.getElementById("video-template");

    addVideoBtn.addEventListener("click", () => {
        const clone = template.content.cloneNode(true);
        const item = clone.querySelector(".video-item");
        const input = clone.querySelector(".video-input");
        const preview = clone.querySelector(".video-preview");
        const iframe = clone.querySelector("iframe");

        input.addEventListener("input", () => {
            const url = input.value.trim();

            let embed = "";

            if (url.includes("youtu.be")) {
                embed = "https://www.youtube.com/embed/" + url.split("/").pop();
            } else if (url.includes("youtube.com/watch?v=")) {
                embed = "https://www.youtube.com/embed/" + url.split("v=")[1];
            }

            if (embed) {
                iframe.src = embed;
                preview.classList.remove("hidden");
            } else {
                preview.classList.add("hidden");
            }
        });

        clone.querySelector(".remove-video").addEventListener("click", e => {
            e.stopPropagation();
            item.remove();
        });

        wrapper.appendChild(clone);
    });
});
