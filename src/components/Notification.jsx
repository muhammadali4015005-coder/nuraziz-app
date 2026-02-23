import { useState, useEffect } from 'react'
import React from 'react'
import { X, Check, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export default function Notification({ 
  type = 'info', 
  title = 'Ogohlantirish', 
  message = '', 
  duration = 2500,
  action = null,
  onClose = () => {},
  buttons = []
}) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 300)
  }

  if (!isVisible) return null

  // Rang va ikonkalar
  const typeConfig = {
    success: {
      bg: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
      icon: <Check size={28} />,
      border: '#00ff88'
    },
    error: {
      bg: 'linear-gradient(135deg, #ff0055 0%, #cc0044 100%)',
      icon: <X size={28} />,
      border: '#ff0055'
    },
    warning: {
      bg: 'linear-gradient(135deg, #ffaa00 0%, #ff8800 100%)',
      icon: <AlertTriangle size={28} />,
      border: '#ffaa00'
    },
    info: {
      bg: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
      icon: <Info size={28} />,
      border: '#00d4ff'
    },
    blocked: {
      bg: 'linear-gradient(135deg, #ff0055 0%, #990033 100%)',
      icon: <AlertCircle size={80} />,
      border: '#ff0055'
    }
  }

  const config = typeConfig[type] || typeConfig.info
  const isBlocked = type === 'blocked'
  const isCentered = isBlocked
  const isSmall = type === 'success' && title === '✓'
  const isWarningOrError = type === 'warning' || type === 'error'
  const isLargeWarningError = isWarningOrError && message

  return (
    <div
      style={{
        position: 'fixed',
        top: isCentered ? '50%' : (isSmall ? '80px' : '20px'),
        left: '50%',
        transform: isCentered ? 'translate(-50%, -50%)' : 'translateX(-50%)',
        width: isCentered ? 'min(600px, 92vw)' : (isSmall ? 'min(200px, 92vw)' : (isLargeWarningError ? 'min(450px, 92vw)' : 'min(380px, 92vw)')),
        maxWidth: isCentered ? '92vw' : (isSmall ? '92vw' : (isLargeWarningError ? '92vw' : '92vw')),
        minHeight: isBlocked ? 'auto' : (isCentered ? 'auto' : (isLargeWarningError ? 'auto' : 'auto')),
        background: config.bg,
        border: `${isCentered ? '5px' : (isSmall ? '2px' : (isLargeWarningError ? '4px' : '3px'))} solid ${config.border}`,
        borderRadius: isCentered ? '28px' : (isSmall ? '12px' : (isLargeWarningError ? '20px' : '16px')),
        padding: isCentered ? 'min(40px, 6vw) min(30px, 5vw)' : (isSmall ? '10px 14px' : (isLargeWarningError ? 'min(20px, 4vw) min(24px, 4vw)' : 'min(16px, 3vw) min(18px, 3vw)')),
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isCentered 
          ? `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 60px ${config.border}99, inset 0 1px 0 rgba(255,255,255,0.3)`
          : (isSmall ? `0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px ${config.border}40` : (isLargeWarningError ? `0 16px 50px rgba(0, 0, 0, 0.6), 0 0 40px ${config.border}70` : `0 12px 40px rgba(0, 0, 0, 0.5), 0 0 30px ${config.border}60`)),
        zIndex: 10000,
        animation: isExiting 
          ? (isCentered ? 'centeredSlideOut 0.3s ease forwards' : 'notifSlideOut 0.3s ease forwards')
          : (isCentered ? 'centeredSlideIn 0.4s ease forwards' : 'notifSlideIn 0.4s ease forwards'),
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box'
      }}
    >
      <style>{`
        @keyframes notifSlideIn {
          from {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes notifSlideOut {
          from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          to {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
          }
        }

        @keyframes blockedSlideIn {
          from {
            transform: translate(-50%, calc(-50% - 100px));
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }
        
        @keyframes blockedSlideOut {
          from {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
          to {
            transform: translate(-50%, calc(-50% - 100px));
            opacity: 0;
          }
        }

        @keyframes centeredSlideIn {
          from {
            transform: translate(-50%, calc(-50% - 100px));
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
        }
        
        @keyframes centeredSlideOut {
          from {
            transform: translate(-50%, -50%);
            opacity: 1;
          }
          to {
            transform: translate(-50%, calc(-50% - 100px));
            opacity: 0;
          }
        }
      `}</style>

      <div style={{ 
        display: 'flex', 
        gap: isCentered ? '0' : (isSmall ? '8px' : (isLargeWarningError ? '16px' : '12px')), 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%',
        flexDirection: isCentered ? 'column' : 'row',
        flexWrap: 'nowrap'
      }}>
        {/* Ikonka */}
        <div style={{ 
          flexShrink: 0, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: isCentered ? (isBlocked ? '20px' : '16px') : '0',
          color: '#fff'
        }}>
          {isSmall ? <Check size={18} /> : (isLargeWarningError ? React.cloneElement(config.icon, { size: 36 }) : config.icon)}
        </div>

        {/* Matn va tugmalar */}
        <div style={{ flex: 1, textAlign: isCentered ? 'center' : 'left', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ 
            fontSize: isBlocked ? 'min(48px, 10vw)' : (isCentered ? 'min(32px, 7vw)' : (isSmall ? '14px' : (isLargeWarningError ? 'min(22px, 5vw)' : 'min(18px, 4.5vw)'))), 
            fontWeight: isBlocked ? '900' : (isCentered ? '800' : (isSmall ? '600' : (isLargeWarningError ? '800' : '700'))),
            marginBottom: isBlocked ? '20px' : (isCentered ? '10px' : (isSmall ? '0' : (isLargeWarningError ? '10px' : '6px'))),
            textTransform: 'uppercase',
            letterSpacing: isBlocked ? '2px' : (isCentered ? '1.5px' : (isSmall ? '0.5px' : (isLargeWarningError ? '1px' : '0.8px'))),
            wordBreak: 'break-word',
            lineHeight: '1.2'
          }}>
            {title}
          </div>
          
          {message && !isSmall && (
            <div style={{ 
              fontSize: isBlocked ? 'min(26px, 5.5vw)' : (isCentered ? 'min(18px, 4vw)' : (isLargeWarningError ? 'min(17px, 4vw)' : 'min(15px, 3.8vw)')),
              opacity: '0.95',
              marginBottom: buttons.length > 0 ? '20px' : '0',
              lineHeight: isBlocked ? '1.8' : (isCentered ? '1.6' : (isLargeWarningError ? '1.5' : '1.4')),
              fontWeight: isBlocked ? '600' : (isCentered ? '500' : (isLargeWarningError ? '600' : '400')),
              wordBreak: 'break-word'
            }}>
              {message}
            </div>
          )}

          {/* Tugmalar */}
          {buttons.length > 0 && !isSmall && (
            <div style={{ 
              display: 'flex', 
              gap: '8px',
              flexWrap: 'wrap',
              marginTop: '10px',
              justifyContent: isCentered ? 'center' : 'flex-start'
            }}>
              {buttons.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    btn.onClick?.()
                    handleClose()
                  }}
                  style={{
                    padding: '10px 14px',
                    background: btn.color || 'rgba(255,255,255,0.25)',
                    border: `2px solid rgba(255,255,255,0.5)`,
                    color: '#fff',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: 'min(13px, 3.5vw)',
                    fontWeight: '700',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    minWidth: '44px',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = btn.color || 'rgba(255,255,255,0.35)'
                    e.target.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = btn.color || 'rgba(255,255,255,0.25)'
                    e.target.style.transform = 'translateY(0)'
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Yopish tugmasi */}
        {!isSmall && (
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.25)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: isLargeWarningError ? '8px' : '6px',
              borderRadius: isLargeWarningError ? '8px' : '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              minWidth: '44px',
              minHeight: '44px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)'
            }}
          >
            <X size={isLargeWarningError ? 24 : 20} />
          </button>
        )}
      </div>
    </div>
  )
}

// Notifikatsiya boshqaruvchisi
export class NotificationManager {
  static instance = null
  static notifications = []
  static setNotifications = null

  static init(setNotifications) {
    this.setNotifications = setNotifications
  }

  static show(config) {
    if (!this.setNotifications) {
      console.warn('Notifikatsiya boshqaruvchisi initsializatsiya qilinmagan')
      return
    }

    const id = Date.now()
    const notification = { id, ...config }
    
    this.notifications.push(notification)
    this.setNotifications([...this.notifications])

    if (config.duration !== 0) {
      setTimeout(() => {
        this.close(id)
      }, config.duration || 2500)
    }

    return id
  }

  static close(id) {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.setNotifications([...this.notifications])
  }

  static success(title, message = '', duration = 1000, buttons = []) {
    return this.show({ type: 'success', title, message, duration, buttons })
  }

  static error(title, message = '', duration = 2500, buttons = []) {
    return this.show({ type: 'error', title, message, duration, buttons })
  }

  static warning(title, message = '', duration = 2500, buttons = []) {
    return this.show({ type: 'warning', title, message, duration, buttons })
  }

  static info(title, message = '', duration = 2500, buttons = []) {
    return this.show({ type: 'info', title, message, duration, buttons })
  }
}
