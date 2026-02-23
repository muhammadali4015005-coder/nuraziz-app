import { useState, useEffect } from 'react'

function NutritionTab({ userData }) {
  const [nutrition, setNutrition] = useState({
    breakfast: { time: '08:00', water: 0, foods: '' },
    lunch: { time: '12:00', water: 0, foods: '' },
    dinner: { time: '18:00', water: 0, foods: '' }
  })
  const [chatHistory, setChatHistory] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  
  // Get API key from user settings
  const apiKey = userData?.settings?.geminiApiKey || ''

  useEffect(() => {
    if (userData?.nutrition) {
      setNutrition(userData.nutrition)
    }
    if (userData?.nutritionChat) {
      setChatHistory(userData.nutritionChat)
    }
  }, [userData?.phone])

  const saveNutrition = async () => {
    try {
      await fetch('/api/save-nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: userData.phone, nutrition })
      })
      alert('Saqlandi!')
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const analyzeFood = () => {
    const allFoods = `Nonushta: ${nutrition.breakfast.foods}\nTushlik: ${nutrition.lunch.foods}\nKechki: ${nutrition.dinner.foods}`
    if (!allFoods.trim()) {
      alert('Ovqat ma\'lumotini to\'ldiring!')
      return
    }
    
    let result = 'OVQAT TAHLILI\n\n'
    const harmful = ['tuxum', 'gazli', 'qand', 'fast food']
    const healthy = ['sabzi', 'meva', 'baliq', 'orin']
    
    let hasHarmful = false
    harmful.forEach(f => {
      if (allFoods.toLowerCase().includes(f)) {
        result += `ZARARLIY: ${f}\n`
        hasHarmful = true
      }
    })
    
    let hasHealthy = false
    healthy.forEach(f => {
      if (allFoods.toLowerCase().includes(f)) {
        result += `FOYDALI: ${f}\n`
        hasHealthy = true
      }
    })
    
    if (!hasHarmful && !hasHealthy) {
      result += 'Ovqat tahlili: Sabzi va mevalarni ko\'proq iching!\n'
    }
    
    result += '\nTAVSIYALAR:\n• Har kuni 2-3 litr suv iching\n• Gazli ichimlikdan saqlaning\n• Baliq va orin yiyin'
    setAnalysis(result)
  }

  const sendMessage = async () => {
    if (!chatInput.trim()) return
    if (!apiKey.trim()) {
      alert('🔑 Avval Nuraziz AI API key\'ni kiriting!')
      return
    }
    
    const userMsg = { role: 'user', content: chatInput }
    const newHistory = [...chatHistory, userMsg]
    setChatHistory(newHistory)
    setChatInput('')
    setIsLoadingChat(true)
    
    try {
      // Call Gemini API endpoint
      const response = await fetch('/api/nutrition-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput,
          userAge: userData?.age || 25,
          userWeight: userData?.weight || 70,
          userHeight: userData?.height || 180,
          userGoal: userData?.goal || 'maintain',
          apiKey: apiKey
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const aiMsg = { role: 'ai', content: data.response }
        const updatedHistory = [...newHistory, aiMsg]
        setChatHistory(updatedHistory)
        
        // Save chat history
        try {
          await fetch('/api/save-nutrition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: userData.phone,
              nutrition,
              nutritionChat: updatedHistory
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
      setIsLoadingChat(false)
    }
  }

  return (
    <div className="card">
      <h2>AI OVQATLANISH</h2>

      <div style={{ marginBottom: '16px', background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '12px' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '8px' }}>NONUSHTA</h3>
        <input type="time" value={nutrition.breakfast.time} onChange={(e) => setNutrition({...nutrition, breakfast: {...nutrition.breakfast, time: e.target.value}})} style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', marginBottom: '8px', boxSizing: 'border-box' }} />
        <input type="number" placeholder="Suv (stakan)" value={nutrition.breakfast.water} onChange={(e) => setNutrition({...nutrition, breakfast: {...nutrition.breakfast, water: parseInt(e.target.value) || 0}})} style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', marginBottom: '8px', boxSizing: 'border-box' }} />
        <textarea value={nutrition.breakfast.foods} onChange={(e) => setNutrition({...nutrition, breakfast: {...nutrition.breakfast, foods: e.target.value}})} placeholder="Ovqatlar" style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', minHeight: '50px', boxSizing: 'border-box' }} />
      </div>

      <div style={{ marginBottom: '16px', background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '12px' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '8px' }}>TUSHLIK</h3>
        <input type="time" value={nutrition.lunch.time} onChange={(e) => setNutrition({...nutrition, lunch: {...nutrition.lunch, time: e.target.value}})} style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', marginBottom: '8px', boxSizing: 'border-box' }} />
        <input type="number" placeholder="Suv (stakan)" value={nutrition.lunch.water} onChange={(e) => setNutrition({...nutrition, lunch: {...nutrition.lunch, water: parseInt(e.target.value) || 0}})} style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', marginBottom: '8px', boxSizing: 'border-box' }} />
        <textarea value={nutrition.lunch.foods} onChange={(e) => setNutrition({...nutrition, lunch: {...nutrition.lunch, foods: e.target.value}})} placeholder="Ovqatlar" style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', minHeight: '50px', boxSizing: 'border-box' }} />
      </div>

      <div style={{ marginBottom: '16px', background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '12px' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '8px' }}>KECHKI</h3>
        <input type="time" value={nutrition.dinner.time} onChange={(e) => setNutrition({...nutrition, dinner: {...nutrition.dinner, time: e.target.value}})} style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', marginBottom: '8px', boxSizing: 'border-box' }} />
        <input type="number" placeholder="Suv (stakan)" value={nutrition.dinner.water} onChange={(e) => setNutrition({...nutrition, dinner: {...nutrition.dinner, water: parseInt(e.target.value) || 0}})} style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', marginBottom: '8px', boxSizing: 'border-box' }} />
        <textarea value={nutrition.dinner.foods} onChange={(e) => setNutrition({...nutrition, dinner: {...nutrition.dinner, foods: e.target.value}})} placeholder="Ovqatlar" style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', minHeight: '50px', boxSizing: 'border-box' }} />
      </div>

      {analysis && (
        <div style={{ marginBottom: '16px', background: '#0a0e27', border: '2px solid #00ff88', borderRadius: '8px', padding: '12px' }}>
          <p style={{ color: '#aaa', whiteSpace: 'pre-wrap', fontSize: '12px' }}>{analysis}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={saveNutrition} style={{ flex: 1, padding: '10px', background: '#00d4ff', color: '#0a0e27', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>SAQLASH</button>
        <button onClick={analyzeFood} style={{ flex: 1, padding: '10px', background: '#00ff88', color: '#0a0e27', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>TAHLIL</button>
      </div>

      <div style={{ background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ color: '#00d4ff', margin: 0 }}>🤖 NURAZIZ AI</h3>
          {chatHistory.length > 0 && (
            <button
              onClick={() => {
                setChatHistory([])
                fetch('/api/save-nutrition', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    phone: userData.phone,
                    nutrition,
                    nutritionChat: []
                  })
                })
              }}
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

        {!apiKey && (
          <div style={{ background: '#16213e', border: '2px solid #ffa500', borderRadius: '6px', padding: '12px', marginBottom: '8px' }}>
            <p style={{ color: '#ffa500', fontSize: '12px', fontWeight: 'bold', margin: '0 0 8px 0' }}>🔑 API KEY KERAK:</p>
            <p style={{ color: '#aaa', fontSize: '11px', margin: '0 0 8px 0' }}>
              Nuraziz AI API key'ni SOZLAMALAR tabiga kiritishingiz kerak:
            </p>
            <ol style={{ color: '#aaa', fontSize: '11px', margin: '0 0 8px 16px', paddingLeft: 0 }}>
              <li style={{ marginBottom: '4px' }}>⚙️ <strong>SOZLAMALAR</strong> tabiga o'ting</li>
              <li style={{ marginBottom: '4px' }}>🔑 <strong>NURAZIZ AI API KEY</strong> qismiga scroll qiling</li>
              <li><a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff' }}>aistudio.google.com/apikey</a> dan key olib, kiriting</li>
            </ol>
            <p style={{ color: '#aaa', fontSize: '10px', margin: 0 }}>🔒 Xavfsiz: Key faqat suhbatlar ajribida saqlanadi</p>
          </div>
        )}

        {apiKey && (
          <p style={{ color: '#00ff88', fontSize: '11px', marginBottom: '8px', fontWeight: 'bold' }}>✅ Nuraziz AI faol</p>
        )}

        <div style={{ background: '#16213e', borderRadius: '6px', padding: '8px', minHeight: '150px', maxHeight: '250px', overflowY: 'auto', marginBottom: '8px' }}>
          {chatHistory.length === 0 ? (
            <p style={{ color: '#aaa', fontSize: '12px' }}>Ovqatlanish haqida savol bering...</p>
          ) : (
            chatHistory.map((msg, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <p style={{ color: msg.role === 'user' ? '#00d4ff' : '#00ff88', fontSize: '11px', fontWeight: 'bold', margin: '0 0 2px 0' }}>{msg.role === 'user' ? '👤 SIZ:' : '🤖 AI:'}</p>
                <p style={{ color: '#aaa', fontSize: '11px', margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              </div>
            ))
          )}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input 
            type="text" 
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)} 
            onKeyDown={(e) => !isLoadingChat && e.key === 'Enter' && sendMessage()} 
            placeholder="Ovqatlanish haqida savol..." 
            disabled={isLoadingChat}
            style={{ flex: 1, padding: '8px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', fontSize: '12px', opacity: isLoadingChat ? 0.5 : 1 }} 
          />
          <button 
            onClick={sendMessage} 
            disabled={isLoadingChat}
            style={{ padding: '8px 12px', background: isLoadingChat ? '#aaa' : '#00d4ff', color: '#0a0e27', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: isLoadingChat ? 'not-allowed' : 'pointer', fontSize: '12px' }}>
            {isLoadingChat ? '⏳' : '✈️'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NutritionTab
