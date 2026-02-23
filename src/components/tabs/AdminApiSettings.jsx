import { useState, useEffect } from 'react'
import { NotificationManager } from '../Notification'

export default function AdminApiSettings() {
  const [apiKey, setApiKey] = useState('')
  const [monthlyPrice, setMonthlyPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState('')

  useEffect(() => {
    loadApiKey()
    loadMonthlyPrice()
  }, [])

  const loadApiKey = async () => {
    try {
      const response = await fetch('/api/admin/get-api-key')
      const result = await response.json()
      if (result.success && result.apiKey) {
        setApiKey(result.apiKey)
      }
    } catch (err) {
      console.error('Error loading API key:', err)
    }
  }

  const loadMonthlyPrice = async () => {
    try {
      const response = await fetch('/api/admin/get-monthly-price')
      const result = await response.json()
      if (result.success && result.price) {
        setMonthlyPrice(result.price)
      }
    } catch (err) {
      console.error('Error loading monthly price:', err)
    }
  }

  const saveMonthlyPrice = async () => {
    if (!monthlyPrice || monthlyPrice <= 0) {
      NotificationManager.error('XATO', 'To\'g\'ri narx kiriting!', 2500)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/save-monthly-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseFloat(monthlyPrice) })
      })
      const result = await response.json()
      if (result.success) {
        NotificationManager.success('SAQLANDI', 'Oylik narx muvaffaqiyatli saqlandi!', 2500)
      } else {
        NotificationManager.error('XATO', 'Narx saqlanmadi!', 2500)
      }
    } catch (err) {
      console.error('Error saving monthly price:', err)
      NotificationManager.error('XATO', 'Server xatosi!', 2500)
    } finally {
      setLoading(false)
    }
  }

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      NotificationManager.error('XATO', 'API key ni kiriting!', 2500)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/save-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      })
      const result = await response.json()
      if (result.success) {
        NotificationManager.success('SAQLANDI', 'API key muvaffaqiyatli saqlandi!', 2500)
      } else {
        NotificationManager.error('XATO', 'API key saqlanmadi!', 2500)
      }
    } catch (err) {
      console.error('Error saving API key:', err)
      NotificationManager.error('XATO', 'Server xatosi!', 2500)
    } finally {
      setLoading(false)
    }
  }

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      NotificationManager.error('XATO', 'API key ni kiriting!', 2500)
      return
    }

    setLoading(true)
    setTestResult('Tekshirilmoqda...')
    try {
      const response = await fetch('/api/admin/test-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      })
      const result = await response.json()
      if (result.success) {
        setTestResult('✅ API key ishlayapti!')
        NotificationManager.success('ISHLAYAPTI', 'API key to\'g\'ri!', 2500)
      } else {
        setTestResult('❌ API key ishlamayapti: ' + result.error)
        NotificationManager.error('XATO', 'API key noto\'g\'ri!', 2500)
      }
    } catch (err) {
      console.error('Error testing API key:', err)
      setTestResult('❌ Xato: ' + err.message)
      NotificationManager.error('XATO', 'Test xatosi!', 2500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>API SOZLAMALARI</h2>
      
      {/* OYLIK TO'LOV NARXI */}
      <div style={{
        background: '#0a0e27',
        border: '2px solid #00ff88',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#00ff88', marginBottom: '16px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          💰 OYLIK TO'LOV NARXI
        </h3>
        <p style={{ color: '#aaa', marginBottom: '16px', fontSize: '14px' }}>
          Foydalanuvchilar uchun oylik obuna narxini belgilang
        </p>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#00d4ff', fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            💵 NARX (SO'M)
          </label>
          <input
            type="number"
            value={monthlyPrice}
            onChange={(e) => setMonthlyPrice(e.target.value)}
            placeholder="100000"
            style={{
              width: '100%',
              padding: '12px',
              background: '#16213e',
              border: '2px solid #0f3460',
              borderRadius: '8px',
              color: '#00ff88',
              fontSize: '18px',
              fontWeight: 'bold',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <button
          onClick={saveMonthlyPrice}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#555' : 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
            color: '#0a0e27',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? 'YUKLANMOQDA...' : '💾 NARXNI SAQLASH'}
        </button>
      </div>

      {/* API KEY */}
      <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '14px' }}>
        Google Gemini API key ni kiriting. Bu key barcha foydalanuvchilar uchun ishlaydi.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: '#00d4ff', fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          🔑 GOOGLE GEMINI API KEY
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIza..."
          style={{
            width: '100%',
            padding: '12px',
            background: '#16213e',
            border: '2px solid #0f3460',
            borderRadius: '8px',
            color: '#00d4ff',
            fontSize: '14px',
            boxSizing: 'border-box',
            fontFamily: 'monospace'
          }}
        />
        <p style={{ color: '#aaa', fontSize: '12px', marginTop: '8px' }}>
          Google Gemini API key ni <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff' }}>aistudio.google.com/apikey</a> dan oling
        </p>
      </div>

      {testResult && (
        <div style={{
          background: testResult.includes('✅') ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 85, 0.1)',
          border: `2px solid ${testResult.includes('✅') ? '#00ff88' : '#ff0055'}`,
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px'
        }}>
          <p style={{ color: testResult.includes('✅') ? '#00ff88' : '#ff0055', margin: 0, fontSize: '14px' }}>
            {testResult}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={saveApiKey}
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px',
            background: loading ? '#555' : 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
            color: '#0a0e27',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? 'YUKLANMOQDA...' : '💾 SAQLASH'}
        </button>
        <button
          onClick={testApiKey}
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px',
            background: loading ? '#555' : 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
            color: '#0a0e27',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? 'TEKSHIRILMOQDA...' : '🧪 TEST'}
        </button>
      </div>

      <div style={{
        marginTop: '30px',
        background: '#0a0e27',
        border: '2px solid #0f3460',
        borderRadius: '8px',
        padding: '16px'
      }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '12px', fontSize: '16px' }}>📖 QANDAY ISHLAYDI?</h3>
        <ul style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Admin Google Gemini API key ni kiritadi</li>
          <li>Bu key barcha foydalanuvchilar uchun ishlaydi</li>
          <li>Foydalanuvchilar AI Ovqatlanish tabida savol berishadi</li>
          <li>AI haqiqiy Google Gemini dan javob oladi</li>
          <li>API key xavfsiz serverda saqlanadi</li>
          <li><strong style={{ color: '#00ff88' }}>✅ BUTUNLAY BEPUL!</strong> Hech qanday to'lov yo'q</li>
        </ul>
      </div>
    </div>
  )
}
