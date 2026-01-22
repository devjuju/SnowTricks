/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './templates/**/*.html.twig', // pour scanner les templates Symfony
        './assets/**/*.js',
        "./node_modules/flowbite/**/*.js"         // pour scanner ton JS
    ],
    plugins: [
        require('flowbite/plugin')
    ],
};