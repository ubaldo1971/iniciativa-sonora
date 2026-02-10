export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#176BE0",
        dark: "#1D1E20",
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
