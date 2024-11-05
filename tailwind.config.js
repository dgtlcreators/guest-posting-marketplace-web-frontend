/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a202c', 
        'dark-text': '#e2e8f0', 
        'light-bg': '#ffffff', 
        'light-text': '#1a202c', 
      },
    },
  },
  plugins: [],
};
