/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'syyclops-primary': '#ffffff',
        'syyclops-secondary': '#090f2d',
        'syyclops-accent': '#ea6020',
      }
    },
  },
  plugins: [],
}

