import { useEffect } from 'react'

export default function Toast({ message, type = 'success', duration = 2000, onClose }) {
  console.log('🔔 Toast component rendered:', { message, type })

  useEffect(() => {
    console.log('🔔 Toast useEffect started')
    const timer = setTimeout(() => {
      console.log('🔔 Toast closing after', duration, 'ms')
      if (onClose) onClose()
    }, duration)

    return () => {
      console.log('🔔 Toast cleanup')
      clearTimeout(timer)
    }
  }, [duration, onClose])

  const bgColor = type === 'error' ? '#ff0055' : '#00d4ff'
  const textColor = type === 'error' ? '#ffffff' : '#0a0e27'
  const borderColor = type === 'error' ? '#ff3377' : '#0099cc'

  return (
    <div
      id="custom-toast"
      style={{
        position: 'fixed',
        top: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: bgColor,
        color: textColor,
        padding: '20px 40px',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '18px',
        zIndex: 999999999,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
        minWidth: '350px',
        maxWidth: '90%',
        textAlign: 'center',
        border: `4px solid ${borderColor}`,
        animation: 'toastSlideDown 0.3s ease-out',
        pointerEvents: 'auto'
      }}
    >
      {message}
      <style>{`
        @keyframes toastSlideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
