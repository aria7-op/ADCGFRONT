/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0c415c',
          600: '#0a3651',
          700: '#082c46',
        },
        secondary: {
          50: '#fff7ed',
          500: '#ff7a22',
          600: '#e6691f',
          700: '#cc5d1c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}