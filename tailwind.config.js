// tailwind.config.js
module.exports = {
    content: [
        "./assets/**/*.{js,css}",
        "./templates/**/*.html.twig",
        "./node_modules/flowbite/**/*.js",
    ],
    theme: {
        extend: {},
    },
    plugins: [require("flowbite/plugin")],
};
