/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // usar classe para dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // adicione onde estiver seu código
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
