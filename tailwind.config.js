export default {
  darkMode: 'class', // Enable dark mode via class toggle
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A4D94", // Deeper "Logo Blue"
        dark: "#1D1E20",
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
        nav: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
