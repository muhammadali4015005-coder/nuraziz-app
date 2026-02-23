import { useState, useEffect } from 'react'
import { NotificationManager } from '../Notification'

export default function AdminChatTab({ userData }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    loadMessages()
  }, [userData?.phone])

  const loadMessages = async () => {
    try {
      // Load from user.adminMessages
      const response = await fetch('/api/get-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: userData?.phone })
      })
      if (response.ok) {
        const result = await response.json()
        setMessages(result.user?.adminMessages || [])
      }
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/admin-chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          name: userData?.name,
          message: newMessage,
          role: 'user',
          read: false,
          timestamp: new Date()
        })
      })

      if (response.ok) {
        setNewMessage('')
        await loadMessages()
      }
    } catch (err) {
      console.error('Error sending message:', err)
      NotificationManager.error('XATO', 'Xatolik yuz berdi!', 2500)
    } finally {
      setLoading(false)
    }
  }

  const handleEditMessage = (idx, msg) => {
    setEditingId(idx)
    setEditText(msg)
  }

  const handleSaveEdit = async (idx) => {
    if (!editText.trim()) return

    try {
      const updatedMessages = [...messages]
      updatedMessages[idx].message = editText
      updatedMessages[idx].edited = true
      updatedMessages[idx].editedAt = new Date()

      const response = await fetch('/api/admin-chat/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          messages: updatedMessages
        })
      })

      if (response.ok) {
        setMessages(updatedMessages)
        setEditingId(null)
        setEditText('')
      }
    } catch (err) {
      console.error('Error updating message:', err)
      NotificationManager.error('XATO', 'Xatolik yuz berdi!', 2500)
    }
  }

  const handleDeleteMessage = async (idx) => {
    try {
      const updatedMessages = messages.filter((_, i) => i !== idx)

      const response = await fetch('/api/admin-chat/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          messages: updatedMessages
        })
      })

      if (response.ok) {
        setMessages(updatedMessages)
        NotificationManager.success('O\'CHIRILDI', 'Xabar o\'chirildi', 1000)
      }
    } catch (err) {
      console.error('Error deleting message:', err)
      NotificationManager.error('XATO', 'Xatolik yuz berdi!', 2500)
    }
  }

  return (
    <div className="card">
      <h2>ADMIN BILAN GAPLASHISH</h2>

      <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #0f3460', minHeight: '400px', maxHeight: '500px', overflowY: 'auto' }}>
        {messages.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', marginTop: '50px' }}>
            Hali sorov yo'q
          </p>
        ) : (
          messages.map((msg, idx) => {
            const isAdmin = msg.from === 'ADMIN' || msg.role === 'admin'
            const isUser = msg.role === 'user' || !msg.from
            
            return (
            <div key={idx} style={{ marginBottom: '16px', display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '70%' }}>
                <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'center', marginBottom: '4px', gap: '8px' }}>
                  <p style={{ color: isUser ? '#00d4ff' : '#00ff88', fontWeight: 'bold', fontSize: '12px', margin: 0 }}>
                    {isUser ? 'SIZ' : 'ADMIN'} {msg.edited && <span style={{ color: '#ffaa00', fontSize: '10px' }}>(tahrirlangan)</span>}
                  </p>
                  <p style={{ color: '#aaa', fontSize: '11px', margin: 0 }}>
                    {new Date(msg.timestamp).toLocaleTimeString('uz-UZ')}
                  </p>
                </div>
                
                {editingId === idx ? (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '10px 14px',
                        background: '#16213e',
                        border: '2px solid #00d4ff',
                        color: '#00d4ff',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    />
                    <button
                      onClick={() => handleSaveEdit(idx)}
                      style={{
                        padding: '10px 18px',
                        background: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
                        color: '#0a0e27',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 6px 16px rgba(0, 255, 136, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = '0 4px 12px rgba(0, 255, 136, 0.3)'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>✅</span>
                      SAQLASH
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        padding: '10px 18px',
                        background: 'linear-gradient(135deg, #ff0055 0%, #cc0044 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        boxShadow: '0 4px 12px rgba(255, 0, 85, 0.3)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 6px 16px rgba(255, 0, 85, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = '0 4px 12px rgba(255, 0, 85, 0.3)'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>❌</span>
                      BEKOR
                    </button>
                  </div>
                ) : (
                  <>
                    <p style={{
                      color: '#fff',
                      fontSize: '13px',
                      background: isUser ? '#0f3460' : '#1a3a1a',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      wordWrap: 'break-word'
                    }}>
                      {msg.message}
                    </p>
                    {isUser && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditMessage(idx, msg.message)}
                          style={{
                            padding: '6px 10px',
                            background: '#00d4ff',
                            color: '#0a0e27',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '11px'
                          }}
                        >
                          O'ZGARTIRISH
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(idx)}
                          style={{
                            padding: '6px 10px',
                            background: '#ff0055',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '11px'
                          }}
                        >
                          O'CHIRISH
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            )
          })
        )}
      </div>

      <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Xabar yozing..."
          style={{
            width: '100%',
            padding: '16px',
            background: '#0a0e27',
            border: '2px solid #0f3460',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            marginBottom: 0,
            transition: 'all 0.3s ease',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
          onBlur={(e) => e.target.style.borderColor = '#0f3460'}
          disabled={loading}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '16px 32px',
            background: loading ? '#555' : 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
            color: loading ? '#aaa' : '#0a0e27',
            border: 'none',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '15px',
            boxShadow: loading ? 'none' : '0 4px 15px rgba(0, 212, 255, 0.4)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          disabled={loading}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.5)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.4)'
            }
          }}
        >
          {loading ? (
            <>
              <span style={{ 
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid #aaa',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              YUBORILMOQDA...
            </>
          ) : (
            <>
              <span style={{ fontSize: '18px' }}>✉️</span>
              YUBORISH
            </>
          )}
        </button>
      </form>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
