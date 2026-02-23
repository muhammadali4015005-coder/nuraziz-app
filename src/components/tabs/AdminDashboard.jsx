import { useState, useEffect } from 'react'
import Notification from '../Notification'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    approvedUsers: 0,
    pendingUsers: 0,
    deletedUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState(null)
  
  // Oylik to'lov sozlamalari
  const [monthlyPrice, setMonthlyPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [finalPrice, setFinalPrice] = useState(0)
  const [savingPrice, setSavingPrice] = useState(false)

  const showNotification = (type, title, message, duration = 3000) => {
    setNotification({ type, title, message, duration })
  }

  const closeNotification = () => {
    setNotification(null)
  }

  useEffect(() => {
    loadUsers()
    loadPriceSettings()
  }, [])

  useEffect(() => {
    // Chegirma hisobini avtomatik hisoblash
    const price = parseFloat(monthlyPrice) || 0
    const disc = parseFloat(discount) || 0
    const final = price - (price * disc / 100)
    setFinalPrice(final)
  }, [monthlyPrice, discount])

  const loadPriceSettings = async () => {
    try {
      const response = await fetch('/api/admin/price-settings')
      const data = await response.json()
      if (data.success) {
        setMonthlyPrice(data.monthlyPrice || '')
        setDiscount(data.discount || '')
      }
    } catch (err) {
      console.error('Error loading price settings:', err)
    }
  }

  const savePriceSettings = async () => {
    setSavingPrice(true)
    try {
      const response = await fetch('/api/admin/save-price-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyPrice: parseFloat(monthlyPrice) || 0,
          discount: parseFloat(discount) || 0
        })
      })
      const data = await response.json()
      if (data.success) {
        showNotification('success', '✅ SAQLANDI', 'Narx sozlamalari muvaffaqiyatli saqlandi!')
      } else {
        showNotification('error', '❌ XATO', 'Narx sozlamalarini saqlashda xatolik!')
      }
    } catch (err) {
      console.error('Error saving price settings:', err)
      showNotification('error', '❌ XATO', 'Server bilan bog\'lanishda xatolik!')
    } finally {
      setSavingPrice(false)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      
      if (!response.ok) {
        console.error('Server error:', response.status)
        setLoading(false)
        return
      }
      
      const text = await response.text()
      if (!text) {
        console.error('Empty response from server')
        setLoading(false)
        return
      }
      
      const result = JSON.parse(text)
      if (result.success) {
        setUsers(result.users || [])
        calculateStats(result.users || [])
      }
    } catch (err) {
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (userList) => {
    const approved = userList.filter(u => u.approved).length
    const pending = userList.filter(u => !u.approved).length
    const deleted = userList.filter(u => u.deleted).length
    
    setStats({
      totalUsers: userList.length,
      approvedUsers: approved,
      pendingUsers: pending,
      deletedUsers: deleted
    })
  }

  return (
    <div className="card">
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}
      
      <h2>ADMIN BOSHI</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>Jami foydalanuvchilar</p>
          <p style={{ color: '#00d4ff', fontSize: '24px', fontWeight: 'bold' }}>{stats.totalUsers}</p>
        </div>
        <div style={{ background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>Tasdiqlangan</p>
          <p style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold' }}>{stats.approvedUsers}</p>
        </div>
        <div style={{ background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>Kutilmoqda</p>
          <p style={{ color: '#ffaa00', fontSize: '24px', fontWeight: 'bold' }}>{stats.pendingUsers}</p>
        </div>
        <div style={{ background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>O'chirilgan</p>
          <p style={{ color: '#ff0055', fontSize: '24px', fontWeight: 'bold' }}>{stats.deletedUsers}</p>
        </div>
      </div>

      <button
        onClick={loadUsers}
        style={{
          width: '100%',
          padding: '12px',
          background: '#00d4ff',
          color: '#0a0e27',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '24px'
        }}
      >
        YANGILASH
      </button>

      {/* Oylik to'lov sozlamalari */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%)',
        border: '3px solid #00d4ff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '16px', textAlign: 'center', fontSize: '18px' }}>
          💰 OYLIK TO'LOV SOZLAMALARI
        </h3>
        
        <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', marginBottom: '6px' }}>
              Oylik narx (so'm)
            </label>
            <input
              type="number"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(e.target.value)}
              placeholder="100000"
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0e27',
                border: '2px solid #0f3460',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '12px', marginBottom: '6px' }}>
              Chegirma (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="50"
              min="0"
              max="100"
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0e27',
                border: '2px solid #0f3460',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div style={{
            background: '#0a0e27',
            border: '2px solid #00ff88',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>Yakuniy narx</p>
            <p style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>
              {finalPrice.toLocaleString()} so'm
            </p>
            {discount > 0 && (
              <p style={{ color: '#ff0055', fontSize: '14px', textDecoration: 'line-through' }}>
                {parseFloat(monthlyPrice || 0).toLocaleString()} so'm
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={savePriceSettings}
          disabled={savingPrice}
          style={{
            width: '100%',
            padding: '14px',
            background: savingPrice ? '#555' : 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
            color: savingPrice ? '#aaa' : '#0a0e27',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: savingPrice ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)'
          }}
        >
          {savingPrice ? 'SAQLANMOQDA...' : '✅ SAQLASH'}
        </button>
      </div>

      {/* Azolar ro'yxati */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '12px' }}>SO'NGGI AZOLAR</h3>
        {loading ? (
          <p style={{ color: '#aaa' }}>Yuklanimoqda...</p>
        ) : users.filter(u => u.approved && !u.deleted).length === 0 ? (
          <p style={{ color: '#aaa' }}>Azolar yo'q</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {users.filter(u => u.approved && !u.deleted).slice(0, 5).map(user => {
              // To'lov ma'lumotlarini hisoblash
              const paymentDate = user.approvedAt ? new Date(user.approvedAt) : null
              const expiryDate = user.subscriptionExpiry ? new Date(user.subscriptionExpiry) : null
              const today = new Date()
              const daysLeft = expiryDate ? Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)) : null
              
              // Rang kodlari
              let daysColor = '#aaa'
              if (daysLeft !== null) {
                if (daysLeft < 0) daysColor = '#ff0055' // Tugagan
                else if (daysLeft <= 7) daysColor = '#ffaa00' // 7 kun yoki kamroq
                else daysColor = '#00ff88' // 7 kundan ko'p
              }
              
              return (
                <div key={user.phone} style={{ 
                  background: '#0a0e27', 
                  border: '2px solid #0f3460', 
                  borderRadius: '8px', 
                  padding: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <p style={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '4px' }}>{user.phone}</p>
                      <p style={{ color: '#aaa', fontSize: '12px' }}>{user.name || 'Noma\'lum'}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#00ff88', fontSize: '12px' }}>Rejalar: {user.plans?.length || 0}</p>
                    </div>
                  </div>
                  
                  {/* To'lov ma'lumotlari */}
                  {paymentDate && expiryDate && (
                    <div style={{ 
                      background: 'rgba(0, 212, 255, 0.05)',
                      border: '1px solid #0f3460',
                      borderRadius: '6px',
                      padding: '8px',
                      marginTop: '8px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      fontSize: '11px'
                    }}>
                      <div>
                        <p style={{ color: '#aaa', marginBottom: '2px' }}>📅 To'lagan</p>
                        <p style={{ color: '#00d4ff', fontWeight: 'bold' }}>
                          {paymentDate.toLocaleDateString('uz-UZ')}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: '#aaa', marginBottom: '2px' }}>⏰ Tugaydi</p>
                        <p style={{ color: '#00d4ff', fontWeight: 'bold' }}>
                          {expiryDate.toLocaleDateString('uz-UZ')}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: '#aaa', marginBottom: '2px' }}>
                          {daysLeft < 0 ? '❌ Tugagan' : daysLeft <= 7 ? '⚠️ Qoldi' : '✅ Qoldi'}
                        </p>
                        <p style={{ color: daysColor, fontWeight: 'bold' }}>
                          {daysLeft < 0 ? `${Math.abs(daysLeft)} kun oldin` : `${daysLeft} kun`}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Agar to'lov ma'lumotlari bo'lmasa */}
                  {(!paymentDate || !expiryDate) && (
                    <div style={{ 
                      background: 'rgba(255, 170, 0, 0.1)',
                      border: '1px solid #ffaa00',
                      borderRadius: '6px',
                      padding: '8px',
                      marginTop: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: '#ffaa00', fontSize: '11px', margin: 0 }}>
                        ⚠️ To'lov ma'lumotlari kiritilmagan
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
