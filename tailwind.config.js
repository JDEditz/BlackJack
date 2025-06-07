/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'table-green': '#154734',
        'table-accent': '#a67c52',
        'card-white': '#f7f7f7',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.25)',
        'chip': '0 2px 4px rgba(0, 0, 0, 0.4), inset 0 -2px 0 rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};