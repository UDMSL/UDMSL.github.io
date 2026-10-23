import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ExamClock from './components/ExamClock'

createRoot(document.getElementById('root')!).render(
  <StrictMode><main><ExamClock preview /></main></StrictMode>,
)
