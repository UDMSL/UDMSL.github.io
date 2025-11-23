/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 공통 톤앤매너를 여기서 정의하고 필요 시만 확장
      colors: {
        primary: '#1e3a8a', // 연구실 네이비 톤
        secondary: '#3b82f6', // 연구실 블루 포인트
        accent: '#f59e0b', // 강조용 앰버
        dark: '#111827',
        light: '#f3f4f6'
      },
      // 폰트 스택: 국문/영문 혼용을 고려해 Roboto + Noto Sans KR
      fontFamily: {
        sans: ['"Roboto"', '"Noto Sans KR"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
