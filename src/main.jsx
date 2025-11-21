import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 👇 이 줄이 꼭 있어야 합니다! (없으면 추가하세요)
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)