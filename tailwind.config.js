// tailwind.config.js
const {nextui} = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
].js",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  darkMode: "class",
 plugins: [nextui()],
};