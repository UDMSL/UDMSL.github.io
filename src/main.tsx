import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Tailwind가 적용되도록 이 줄을 반드시 포함하세요.
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element with id "root" not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
