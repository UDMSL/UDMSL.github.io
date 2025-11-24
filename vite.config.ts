import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages에서 리포지토리 하위 경로로 정적 자산이 올바르게 제공되도록 설정
  base: '/'
})
