/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        '3B2415': '#3B2415',
        '392614': '#392614',
      },
      textColor: {
        'FFE3B8': '#FFE3B8',
        '3B2415': '#3B2415',
      },
    },
  },
  plugins: [],
}

