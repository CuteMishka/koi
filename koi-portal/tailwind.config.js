/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'], // Обновили здесь
      },
      colors: {
        koi: {
          900: '#021024',
          800: '#0f4c81',
          100: '#e0f2fe',
          orange: '#f06439',
        }
      },
      boxShadow: {
        'card': '0 20px 40px -5px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}