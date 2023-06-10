/** @type {import('tailwindcss').Config} */
//prettier-ignore
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1650px',
      '4xl': '1750px',
      '5xl': '1850px',
      '6xl': '2150px',
    },
  },
  plugins: [],
};
