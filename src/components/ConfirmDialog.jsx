import { useState } from 'react'
import { X, AlertTriangle, Trash2 } from 'lucide-react'

export default function ConfirmDialog({ 
  isOpen,
  onClose,
  onConfirm,
  title = "TASDIQLASH",
  message = "Davom etmoqchimisiz?",
  confirmText = "HA",
  cancelText = "YO'Q",
  type = "warning", // warning, danger, info
  requireCode = false,
  requiredCode = "DELETE",
  codePlaceholder = "Kodni kiriting"
}) {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (requireCode) {
      if (inputValue !== requiredCode) {
        setError(`Noto'g'ri kod! "${requiredCode}" ni kiriting`)
        return
      }
    }
    onConfirm()
    setInputValue('')
    setError('')
  }

  const handleCancel = () => {
    setInputValue('')
    setError('')
    onClose()
  }

  // Rang sozlamalari
  const colors = {
    warning: {
      bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      border: '#ffaa00',
      icon: '#ffaa00',
      title: '#ffaa00',
      confirmBg: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
      confirmColor: '#0a0e27'
    },
    danger: {
      bg: 'linear-gradient(135deg, #2d0a1f 0%, #1a0a14 100%)',
      border: '#ff0055',
      icon: '#ff0055',
      title: '#ff0055',
      confirmBg: 'linear-gradient(135deg, #ff0055 0%, #cc0044 100%)',
      confirmColor: '#fff'
    },
    info: {
      bg: 'linear-gradient(135deg, #0a1a2e 0%, #0a1420 100%)',
      border: '#00d4ff',
      icon: '#00d4ff',
      title: '#00d4ff',
      confirmBg: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
      confirmColor: '#0a0e27'
    }
  }

  const color = colors[type] || colors.warning

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleCancel}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease'
        }}
      />

      {/* Dialog */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(92vw, 600px)',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: color.bg,
          border: `4px solid ${color.border}`,
          borderRadius: '24px',
          padding: 'min(40px, 6vw)',
          zIndex: 10000,
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 60px ${color.border}99, inset 0 1px 0 rgba(255,255,255,0.1)`,
          animation: 'slideIn 0.4s ease',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from {
              transform: translate(-50%, calc(-50% - 100px));
              opacity: 0;
            }
            to {
              transform: translate(-50%, -50%);
              opacity: 1;
            }
          }
        `}</style>

        {/* Icon */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 'min(24px, 4vw)',
          color: color.icon
        }}>
          {type === 'danger' ? (
            <Trash2 size={Math.min(80, window.innerWidth * 0.15)} strokeWidth={2.5} />
          ) : (
            <AlertTriangle size={Math.min(80, window.innerWidth * 0.15)} strokeWidth={2.5} />
          )}
        </div>

        {/* Title */}
        <h2 style={{
          color: color.title,
          fontSize: 'min(32px, 6vw)',
          fontWeight: '900',
          textAlign: 'center',
          marginBottom: 'min(16px, 3vw)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          wordBreak: 'break-word'
        }}>
          {title}
        </h2>

        {/* Message */}
        <p style={{
          color: '#ccc',
          fontSize: 'min(16px, 3.5vw)',
          textAlign: 'center',
          marginBottom: requireCode ? 'min(24px, 4vw)' : 'min(32px, 5vw)',
          lineHeight: '1.6',
          fontWeight: '500',
          wordBreak: 'break-word'
        }}>
          {message}
        </p>

        {/* Code Input */}
        {requireCode && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: color.icon,
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              🔒 O'CHIRISH KODI
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setError('')
              }}
              placeholder={codePlaceholder}
              autoFocus
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: `2px solid ${error ? '#ff0055' : color.border}`,
                borderRadius: '12px',
                color: '#fff',
                fontSize: '18px',
                textAlign: 'center',
                fontWeight: 'bold',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = color.border}
              onBlur={(e) => e.target.style.borderColor = error ? '#ff0055' : color.border}
            />
            {error && (
              <p style={{
                color: '#ff0055',
                fontSize: '13px',
                marginTop: '8px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                ❌ {error}
              </p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '32px'
        }}>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: '16px',
              background: color.confirmBg,
              color: color.confirmColor,
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: `0 4px 20px ${color.border}60`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)'
              e.target.style.boxShadow = `0 6px 30px ${color.border}80`
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = `0 4px 20px ${color.border}60`
            }}
          >
            ✅ {confirmText}
          </button>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              e.target.style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            ❌ {cancelText}
          </button>
        </div>
      </div>
    </>
  )
}
