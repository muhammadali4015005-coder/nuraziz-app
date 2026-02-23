import { useState, useEffect } from 'react'

export default function AdminSorovlarTab() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/chat-users')
      if (response.ok) {
        const result = await response.json()
        setUsers(result.users || [])
      }
    } catch (err) {
      console.error('Error loading users:', err)
    }
  }

  const loadMessages = async (phone) => {
    try {
      const response = await fetch(`/api/admin-chat/${phone}`)
      if (response.ok) {
        const result = await response.json()
        setMessages(result.messages || result.chatMessages || [])
      }
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }

  const handleSelectUser = async (user) => {
    setSelectedUser(user)
    await loadMessages(user.phone)
    
    // Mark messages as read when admin opens chat
    if (user.unreadCount > 0) {
      try {
        await fetch('/api/admin/mark-messages-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: user.phone })
        })
        // Reload users to update unread count
        await loadUsers()
        // Trigger sidebar refresh
        window.dispatchEvent(new Event('refreshChatCount'))
      } catch (err) {
        console.error('Error marking messages as read:', err)
      }
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser) return

    setLoading(true)
    try {
      const response = await fetch('/api/admin-chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: selectedUser.phone,
          name: selectedUser.name,
          message: newMessage,
          role: 'admin',
          timestamp: new Date()
        })
      })

      if (response.ok) {
        setNewMessage('')
        await loadMessages(selectedUser.phone)
      }
    } catch (err) {
      console.error('Error sending message:', err)
      alert('Xatolik yuz berdi!')
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
          phone: selectedUser.phone,
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
      alert('Xatolik yuz berdi!')
    }
  }

  const handleDeleteMessage = async (idx) => {
    if (!window.confirm('Xabarni o\'chirishni tasdiqlaysizmi?')) return

    try {
      const updatedMessages = messages.filter((_, i) => i !== idx)

      const response = await fetch('/api/admin-chat/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: selectedUser.phone,
          messages: updatedMessages
        })
      })

      if (response.ok) {
        setMessages(updatedMessages)
      }
    } catch (err) {
      console.error('Error deleting message:', err)
      alert('Xatolik yuz berdi!')
    }
  }

  return (
    <div style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 200px)' }}>
      {/* Users List */}
      <div style={{ flex: '0 0 300px', background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #0f3460', overflowY: 'auto' }}>
        <h3 style={{ color: '#00d4ff', marginTop: 0 }}>SOROVLAR</h3>
        {users.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center' }}>Sorov yo'q</p>
        ) : (
          users.map((user) => (
            <button
              key={user.phone}
              onClick={() => handleSelectUser(user)}
              style={{
                width: '100%',
                padding: '12px',
                background: selectedUser?.phone === user.phone ? '#00d4ff' : '#16213e',
                color: selectedUser?.phone === user.phone ? '#0a0e27' : '#fff',
                border: '1px solid #0f3460',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '8px',
                textAlign: 'left',
                fontWeight: 'bold',
                position: 'relative'
              }}
            >
              <div>{user.name}</div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>{user.phone}</div>
              {user.unreadCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#ff0000',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {user.unreadCount}
                </div>
              )}
            </button>
          ))
        )}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #0f3460' }}>
        {selectedUser ? (
          <>
            <h3 style={{ color: '#00d4ff', marginTop: 0 }}>
              {selectedUser.name} - {selectedUser.phone}
            </h3>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', background: '#16213e', borderRadius: '8px', padding: '12px' }}>
              {messages.length === 0 ? (
                <p style={{ color: '#aaa', textAlign: 'center' }}>Xabar yo'q</p>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} style={{ marginBottom: '12px', display: 'flex', justifyContent: msg.role === 'admin' ? 'flex-start' : 'flex-end' }}>
                    <div style={{ maxWidth: '70%' }}>
                      <div style={{ display: 'flex', justifyContent: msg.role === 'admin' ? 'flex-start' : 'flex-end', alignItems: 'center', marginBottom: '4px', gap: '8px' }}>
                        <p style={{ color: msg.role === 'admin' ? '#00ff88' : '#00d4ff', fontWeight: 'bold', fontSize: '12px', margin: 0 }}>
                          {msg.role === 'admin' ? 'ADMIN' : selectedUser.name} {msg.edited && <span style={{ color: '#ffaa00', fontSize: '10px' }}>(tahrirlangan)</span>}
                        </p>
                        <p style={{ color: '#aaa', fontSize: '11px', margin: 0 }}>
                          {new Date(msg.timestamp).toLocaleTimeString('uz-UZ')}
                        </p>
                      </div>
                      
                      {editingId === idx ? (
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            style={{
                              flex: 1,
                              padding: '8px',
                              background: '#0f3460',
                              border: '2px solid #00d4ff',
                              color: '#00d4ff',
                              borderRadius: '6px'
                            }}
                          />
                          <button
                            onClick={() => handleSaveEdit(idx)}
                            style={{
                              padding: '8px 12px',
                              background: '#00ff88',
                              color: '#0a0e27',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '12px'
                            }}
                          >
                            SAQLASH
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{
                              padding: '8px 12px',
                              background: '#ff0055',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '12px'
                            }}
                          >
                            BEKOR
                          </button>
                        </div>
                      ) : (
                        <>
                          <p style={{
                            color: '#fff',
                            fontSize: '13px',
                            background: msg.role === 'admin' ? '#1a3a1a' : '#0f3460',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            wordWrap: 'break-word'
                          }}>
                            {msg.message}
                          </p>
                          {msg.role === 'admin' && (
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
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Javob yozing..."
                className="input"
                style={{ flex: 1, marginBottom: 0 }}
                disabled={loading}
              />
              <button
                type="submit"
                style={{
                  padding: '12px 20px',
                  background: '#00ff88',
                  color: '#0a0e27',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
                disabled={loading}
              >
                {loading ? 'YUBORISH...' : 'YUBORISH'}
              </button>
            </form>
          </>
        ) : (
          <p style={{ color: '#aaa', textAlign: 'center', marginTop: '50px' }}>
            Foydalanuvchini tanlang
          </p>
        )}
      </div>
    </div>
  )
}
