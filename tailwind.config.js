/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0aea1',
          400: '#d38b7d',
          500: '#8b1e2a', // Royal Carmine / Deep Maroon
          600: '#751421',
          700: '#5e0d19',
          800: '#480812',
          900: '#32040b',
        },
        gold: {
          100: '#fbf7e8',
          200: '#f3e8be',
          300: '#e7d48d',
          400: '#d8bd5b',
          500: '#c59b27', // Muted Antique Gold
          600: '#a7811c',
        },
        ivory: '#FAF7F2',
        cream: '#F4EFE6',
        charcoal: '#1A1818'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
