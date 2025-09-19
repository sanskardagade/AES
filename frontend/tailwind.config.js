/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Metropolis','sans-serif'],
      },
      colors: {
        'white': '#ffffff',
        'jet-stream': '#b0cece',
        'blue-zodiac': '#0c2543',
        'oxley': '#6c9d87',
        'golden-grass': '#e1ab30',
        'blue-chill': '#0e6994',
        'tobacco-brown': '#6c5043',
        'electric-violet': '#7035fd',
        'petite-orchid': '#e18891',
        'orange-roughy': '#d44719',
      }
    },
  },
  plugins: [],
}
