import { useEffect } from 'react'

export default function QuickNotification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed',
      top: '-100px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
      color: '#fff',
      padding: 'clamp(12px, 3vw, 16px) clamp(20px, 5vw, 32px)',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 212, 255, 0.4)',
      zIndex: 10000,
      fontWeight: 'bold',
      fontSize: 'clamp(13px, 3.5vw, 16px)',
      animation: 'slideDown 1s ease-out',
      minWidth: 'clamp(250px, 60vw, 300px)',
      maxWidth: '90vw',
      textAlign: 'center'
    }}>
      <style>{`
        @keyframes slideDown {
          0% {
            top: -100px;
            opacity: 0;
          }
          20% {
            top: 20px;
            opacity: 1;
          }
          80% {
            top: 20px;
            opacity: 1;
          }
          100% {
            top: -100px;
            opacity: 0;
          }
        }
      `}</style>
      {message}
    </div>
  )
}
