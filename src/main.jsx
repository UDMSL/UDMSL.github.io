import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Tailwind가 적용되도록 이 줄을 반드시 포함하세요.
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
