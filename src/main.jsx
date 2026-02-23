import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Version for cache busting - No more browser alerts/notifications
console.log('🚀 APP VERSION: 4.2.27 - Custom Notifications Only')
console.log('📅 Build Time:', new Date().toLocaleString())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
