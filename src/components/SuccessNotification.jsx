import { useEffect } from 'react'

export default function SuccessNotification({ message, onClose }) {
  useEffect(() => {
    // Auto close after 1.2 seconds
    const timer = setTimeout(() => {
      onClose()
    }, 1200)
    
    return () => clearTimeout(timer)
  }, [onClose])

  useEffect(() => {
    // Prevent body scroll when notification is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 100%)',
        border: '3px solid #00ff88',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 255, 136, 0.4)',
        animation: 'slideDown 0.3s ease',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px',
          animation: 'bounce 0.5s ease'
        }}>
          ✓
        </div>
        
        <h3 style={{
          color: '#00ff88',
          margin: '0 0 12px 0',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          MUVAFFAQIYATLI!
        </h3>
        
        <p style={{
          color: '#fff',
          margin: 0,
          fontSize: '16px',
          lineHeight: '1.6'
        }}>
          {message}
        </p>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
