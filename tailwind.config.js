/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-primary', 'text-primary', 'border-primary',
    'bg-secondary', 'text-secondary', 'border-secondary',
    'hover:bg-secondary'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#102a43',
          50: '#e7edf2',
          100: '#cfdbe5',
          200: '#a0b7cb',
          300: '#7093b0',
          400: '#406f96',
          500: '#102a43',
          600: '#0e253c',
          700: '#0c2034',
          800: '#091a2c',
          900: '#071524',
        },
        secondary: {
          DEFAULT: '#123b54',
          50: '#e8eef2',
          100: '#d1dde5',
          200: '#a4bacb',
          300: '#7697b1',
          400: '#497497',
          500: '#123b54',
          600: '#10354c',
          700: '#0e2f43',
          800: '#0b283a',
          900: '#092232',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}