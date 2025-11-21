/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', // Lab Navy
        secondary: '#3b82f6', // Lab Blue
        accent: '#f59e0b', // Amber
        dark: '#111827',
        light: '#f3f4f6'
      },
      fontFamily: {
        sans: ['"Roboto"', '"Noto Sans KR"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}