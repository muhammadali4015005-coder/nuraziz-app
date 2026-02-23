import { useState, useEffect } from 'react'

function NurazizAiTab({ userData }) {
  const [chatHistory, setChatHistory] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (userData?.nurazizChat) {
      setChatHistory(userData.nurazizChat)
    }
  }, [userData?.phone])

  const sendMessage = async () => {
    if (!chatInput.trim()) return
    
    const userMsg = { role: 'user', content: chatInput }
    const newHistory = [...chatHistory, userMsg]
    setChatHistory(newHistory)
    setChatInput('')
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput,
          userAge: userData?.age || 25,
          userWeight: userData?.weight || 70,
          userHeight: userData?.height || 180,
          userGoal: userData?.goal || 'sog\'lom turmush tarzi'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const aiMsg = { role: 'ai', content: data.response }
        const updatedHistory = [...newHistory, aiMsg]
        setChatHistory(updatedHistory)
        
        // Save chat history
        try {
          await fetch('/api/save-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...userData,
              nurazizChat: updatedHistory
            })
          })
        } catch (err) {
          console.error('Error saving chat:', err)
        }
      } else {
        const errorMsg = { role: 'ai', content: `❌ Xato: ${data.error}` }
        setChatHistory([...newHistory, errorMsg])
      }
    } catch (err) {
      console.error('Error:', err)
      const errorMsg = { role: 'ai', content: '❌ Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring' }
      setChatHistory([...newHistory, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setChatHistory([])
    fetch('/api/save-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...userData,
        nurazizChat: []
      })
    })
  }

  return (
    <div className="card">
      <h2>🤖 NURAZIZ AI</h2>
      {userData?.name && (
        <p style={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
          {userData.name}
        </p>
      )}

      <div style={{ background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ color: '#00d4ff', margin: 0 }}>💬 SUHBAT</h3>
          {chatHistory.length > 0 && (
            <button
              onClick={clearChat}
              style={{
                padding: '6px 12px',
                background: '#ff0055',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              🗑️ TOZALASH
            </button>
          )}
        </div>

        <div style={{ 
          background: '#16213e', 
          borderRadius: '8px', 
          padding: '12px', 
          minHeight: '300px', 
          maxHeight: '400px', 
          overflowY: 'auto', 
          marginBottom: '12px',
          border: '2px solid #0f3460'
        }}>
          {chatHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: '#00ff88', fontSize: '48px', margin: '0 0 16px 0' }}>🤖</p>
              <p style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                NURAZIZ AI
              </p>
              <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>
                Har qanday savol bering!
              </p>
            </div>
          ) : (
            chatHistory.map((msg, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <p style={{ 
                  color: msg.role === 'user' ? '#00d4ff' : '#00ff88', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  margin: '0 0 4px 0' 
                }}>
                  {msg.role === 'user' ? '👤 SIZ:' : '🤖 NURAZIZ AI:'}
                </p>
                <p style={{ 
                  color: '#fff', 
                  fontSize: '13px', 
                  margin: 0, 
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  background: msg.role === 'user' ? '#0f3460' : '#1a4d2e',
                  padding: '12px',
                  borderRadius: '8px'
                }}>
                  {msg.content}
                </p>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)} 
            onKeyDown={(e) => !isLoading && e.key === 'Enter' && sendMessage()} 
            placeholder="Savolingizni yozing..." 
            disabled={isLoading}
            style={{ 
              flex: 1, 
              padding: '12px', 
              background: '#16213e', 
              border: '2px solid #0f3460', 
              color: '#00d4ff', 
              borderRadius: '8px', 
              fontSize: '13px', 
              opacity: isLoading ? 0.5 : 1 
            }} 
          />
          <button 
            onClick={sendMessage} 
            disabled={isLoading}
            style={{ 
              padding: '12px 20px', 
              background: isLoading ? '#555' : 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)', 
              color: '#0a0e27', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: isLoading ? 'not-allowed' : 'pointer', 
              fontSize: '14px',
              boxShadow: isLoading ? 'none' : '0 4px 15px rgba(0, 212, 255, 0.3)'
            }}
          >
            {isLoading ? '⏳' : '✈️'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NurazizAiTab
