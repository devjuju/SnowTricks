/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './templates/**/*.html.twig', // pour scanner les templates Symfony
        './assets/**/*.js',
        "./node_modules/flowbite/**/*.js"         // pour scanner ton JS
    ],
    theme: {
        extend: {

            colors: {
                primary: '#2C76B1',
            },



        },
    },
    plugins: [
        require('flowbite/plugin')
    ],
};