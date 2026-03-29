export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        primary: {
          light: "#A07CFE",
          main: "#8A2BE2",
          dark: "#4B0082"
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'sans-serif'],
      },
      spacing: {
        '8px': '8px',
      }
    },
  },
  plugins: [],
}
