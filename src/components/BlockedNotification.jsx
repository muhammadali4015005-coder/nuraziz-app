import { useEffect } from 'react'
import './BlockedNotification.css'

export default function BlockedNotification({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="blocked-notification-overlay">
      <div className="blocked-notification-box">
        <div style={{ fontSize: '70px', marginBottom: '20px' }}>⚠️</div>
        <h2 style={{ color: 'white', fontSize: '26px', marginBottom: '16px' }}>OBUNA MUDDATI TUGADI</h2>
        <p style={{ color: 'white', fontSize: '17px', marginBottom: '16px' }}>
          Sizning oylik tolovingizning muddati tugagan!
        </p>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginBottom: '16px' }}>
          Iltimos quyidagi raqamga telefon qilib oylik tolovni amalga oshiring:
        </p>
        <div style={{ 
          color: 'white', 
          fontSize: '24px', 
          fontWeight: 'bold',
          background: 'rgba(255,255,255,0.2)',
          padding: '14px 20px',
          borderRadius: '10px',
          border: '2px solid white',
          letterSpacing: '1px'
        }}>
          +998 91 833 5005
        </div>
      </div>
    </div>
  )
}
