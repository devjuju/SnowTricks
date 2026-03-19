module.exports = {
    content: [
        "./templates/**/*.twig",
        "./assets/**/*.js",
        "./assets/**/*.ts",
        "./assets/**/*.vue",
        "./node_modules/flowbite/**/*.js",
    ],

    safelist: [
        "grid-cols-5",
        "lg:grid-cols-5",
        "grid-cols-2",
        "sm:grid-cols-2",
    ],

    theme: {
        extend: {
            fontFamily: {
                montserrat: ["Montserrat", "sans-serif"],
                raleway: ["Raleway", "sans-serif"],
            },
            colors: {
                primary: {
                    DEFAULT: "#2563eb",
                    dark: "#1e40af",
                },
            },
        },
    },

    plugins: [require("flowbite/plugin")],
};
