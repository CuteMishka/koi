import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext' // Импорт провайдера
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider> {/* Оборачиваем здесь */}
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)