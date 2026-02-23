import { useEffect } from 'react'
import './CustomAlert.css'

export default function CustomAlert({ message, onClose }) {
  useEffect(() => {
    console.log('CustomAlert MOUNTED')
    document.body.style.overflow = 'hidden'
    
    return () => {
      console.log('CustomAlert UNMOUNTED')
      document.body.style.overflow = 'auto'
    }
  }, [])

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2147483647
  }

  const boxStyle = {
    background: 'linear-gradient(135deg, #1a1f3a 0%, #0a0e27 100%)',
    border: '3px solid #ff0055',
    borderRadius: '20px',
    padding: '40px 50px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(255, 0, 85, 0.5)',
    textAlign: 'center'
  }

  const iconStyle = {
    fontSize: '60px',
    marginBottom: '20px'
  }

  const messageStyle = {
    color: '#fff',
    fontSize: '18px',
    lineHeight: '1.8',
    marginBottom: '30px',
    whiteSpace: 'pre-wrap',
    fontWeight: '500'
  }

  const buttonStyle = {
    background: 'linear-gradient(135deg, #ff0055 0%, #cc0044 100%)',
    color: '#fff',
    border: 'none',
    padding: '15px 40px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(255, 0, 85, 0.3)'
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
        <div style={iconStyle}>⚠️</div>
        <div style={messageStyle}>{message}</div>
        <button style={buttonStyle} onClick={onClose}>
          YOPISH
        </button>
      </div>
    </div>
  )
}
