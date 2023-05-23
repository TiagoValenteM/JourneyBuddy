/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0e1529",
        button: "#2565f5",
        blue: "#304FFE",
      },
    },
  },
  plugins: [],
};
