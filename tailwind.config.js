/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        secondary: '#34d399',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // MD3 sans-serif
      },
      borderRadius: {
        md: '0.375rem', // rounded-md
      },
      boxShadow: {
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
      },
    },
  },
  plugins: [],
};
