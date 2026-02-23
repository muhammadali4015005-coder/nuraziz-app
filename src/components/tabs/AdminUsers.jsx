  import { useState, useEffect } from 'react'
import { NotificationManager } from '../Notification'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [editData, setEditData] = useState({})
  const [editPassword, setEditPassword] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleteCode, setDeleteCode] = useState('')
  const [chatUser, setChatUser] = useState(null)
  const [chatMessage, setChatMessage] = useState('')
  const [changingCode, setChangingCode] = useState(null) // { phone, type: 'work' | 'school' | 'plan' }
  const [newCode, setNewCode] = useState('')
  const [masterCode, setMasterCode] = useState('')
  
  // To'lov boshqaruvi
  const [paymentModal, setPaymentModal] = useState(null) // { phone, user data }
  const [paymentData, setPaymentData] = useState({
    subscriptionDays: 30,
    subscriptionExpiry: '',
    paidAmount: 0,
    debtAmount: 0
  })
  const [paymentCode, setPaymentCode] = useState('')
  
  // Toxtatish/Faollashtirish
  const [blockConfirm, setBlockConfirm] = useState(null) // { phone, name, action: 'block' | 'unblock' }
  const [blockCode, setBlockCode] = useState('')

  const DELETE_CONFIRMATION_CODE = '2.3.N.A'
  const EDIT_CONFIRMATION_CODE = '2.3.N.A'
  const PAYMENT_CODE = '2.3.N.A'
  const BLOCK_CODE = '2.3.N.A'
  const WORK_SCHOOL_CODE = '2.3.n.a'

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const result = await response.json()
      if (result.success) {
        setUsers(result.users || [])
      }
    } catch (err) {
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (phone) => {
    // Kod tekshirish
    if (!deleteCode || deleteCode !== DELETE_CONFIRMATION_CODE) {
      NotificationManager.error('KOD XATO', `Kod noto'g'ri! Tog'ri kodni kiriting`, 2500)
      return
    }

    console.log('🗑️ Marking user as deleted:', phone)
    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const result = await response.json()
      console.log('📥 Delete response:', result)
      if (result.success) {
        loadUsers()
        setDeleteConfirm(null)
        setDeleteCode('')
        NotificationManager.success('O\'CHIRILDI', 'Foydalanuvchi o\'chirildi', 1000)
      }
    } catch (err) {
      console.error('❌ Error deleting user:', err)
      NotificationManager.error('XATO', 'Xato: Foydalanuvchi o\'chirilmadi!', 2500)
    }
  }

  const blockSubscription = async () => {
    // Kod tekshirish
    if (!blockCode || blockCode !== BLOCK_CODE) {
      NotificationManager.error('KOD XATO', `Kod noto'g'ri! Tog'ri kodni kiriting`, 2500)
      return
    }

    try {
      const response = await fetch('/api/admin/block-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: blockConfirm.phone })
      })
      const result = await response.json()
      if (result.success) {
        loadUsers()
        setBlockConfirm(null)
        setBlockCode('')
        NotificationManager.success('TOXTATILDI', 'Obuna toxtatildi', 1000)
      }
    } catch (err) {
      console.error('Error blocking subscription:', err)
      NotificationManager.error('XATO', 'Obuna toxtatilmadi!', 2500)
    }
  }

  const unblockSubscription = async () => {
    // Kod tekshirish
    if (!blockCode || blockCode !== BLOCK_CODE) {
      NotificationManager.error('KOD XATO', `Kod noto'g'ri! Tog'ri kodni kiriting`, 2500)
      return
    }

    try {
      const response = await fetch('/api/admin/unblock-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: blockConfirm.phone })
      })
      const result = await response.json()
      if (result.success) {
        loadUsers()
        setBlockConfirm(null)
        setBlockCode('')
        NotificationManager.success('FAOLLASHTIRILDI', 'Obuna faollashtirildi', 1000)
      }
    } catch (err) {
      console.error('Error unblocking subscription:', err)
      NotificationManager.error('XATO', 'Obuna faollashtrilmadi!', 2500)
    }
  }

  const changeUserCode = async () => {
    // Avval master kod tekshirish
    if (!masterCode || masterCode !== WORK_SCHOOL_CODE) {
      NotificationManager.error('MASTER KOD XATO', 'Master kod noto\'g\'ri!', 2500)
      return
    }

    if (!newCode || newCode.length < 4 || newCode.length > 6) {
      NotificationManager.warning('KOD XATO', 'Kod 4-6 raqam bo\'lishi kerak!', 2500)
      return
    }

    try {
      const response = await fetch('/api/admin/change-user-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: changingCode.phone,
          codeType: changingCode.type,
          newCode: newCode
        })
      })
      const result = await response.json()
      if (result.success) {
        loadUsers()
        setChangingCode(null)
        setNewCode('')
        setMasterCode('')
        NotificationManager.success('TAHRIRLANDI', 'Kod muvaffaqiyatli o\'zgartirildi ✓', 1000)
      }
    } catch (err) {
      console.error('Error changing code:', err)
      NotificationManager.error('XATO', 'Kod o\'zgartirilmadi!', 2500)
    }
  }

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) {
      NotificationManager.warning('XATO', 'Xabar yozing!', 2500)
      return
    }

    try {
      const response = await fetch('/api/admin/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: chatUser.phone, 
          message: chatMessage,
          from: 'ADMIN'
        })
      })
      const result = await response.json()
      if (result.success) {
        NotificationManager.success('YUBORILDI', 'Xabar muvaffaqiyatli yuborildi ✓', 1000)
        setChatMessage('')
        setChatUser(null)
        loadUsers() // Reload to update message list
      }
    } catch (err) {
      console.error('Error sending message:', err)
      NotificationManager.error('XATO', 'Xabar yuborilmadi!', 2500)
    }
  }

  const markMessagesAsRead = async (phone) => {
    try {
      const response = await fetch('/api/admin/mark-messages-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const result = await response.json()
      if (result.success) {
        loadUsers() // Reload to update badge
      }
    } catch (err) {
      console.error('Error marking messages as read:', err)
    }
  }

  const openChatModal = (user) => {
    setChatUser(user)
    // Mark all user messages as read when admin opens chat
    if (user.adminMessages?.some(m => m.role === 'user' && !m.read)) {
      markMessagesAsRead(user.phone)
    }
  }

  const openPaymentModal = (user) => {
    setPaymentModal(user)
    setPaymentData({
      subscriptionDays: 30,
      subscriptionExpiry: user.subscriptionExpiry || '',
      paidAmount: user.paidAmount || 0,
      debtAmount: user.debtAmount || 0
    })
  }

  const savePaymentData = async () => {
    // Kod tekshirish
    if (!paymentCode || paymentCode !== PAYMENT_CODE) {
      NotificationManager.error('KOD XATO', `O'zgartirish kodi noto'g'ri!`, 2500)
      return
    }

    try {
      const response = await fetch('/api/admin/update-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: paymentModal.phone,
          ...paymentData
        })
      })
      const result = await response.json()
      if (result.success) {
        loadUsers()
        setPaymentModal(null)
        setPaymentCode('')
        NotificationManager.success('SAQLANDI', 'To\'lov ma\'lumotlari yangilandi ✓', 1000)
      }
    } catch (err) {
      console.error('Error updating payment:', err)
      NotificationManager.error('XATO', 'Ma\'lumotlar saqlanmadi!', 2500)
    }
  }

  const calculateExpiryDate = () => {
    const today = new Date()
    const expiry = new Date(today.getTime() + paymentData.subscriptionDays * 24 * 60 * 60 * 1000)
    setPaymentData({ ...paymentData, subscriptionExpiry: expiry.toISOString() })
  }

  const startEdit = (user) => {
    setEditingUser(user.phone)
    setEditData({
      name: user.name || '',
      monthlyPrice: user.monthlyPrice || 0,
      paidAmount: user.paidAmount || 0,
      debtAmount: user.debtAmount || 0,
      subscriptionExpiry: user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toISOString().split('T')[0] : ''
    })
  }

  const saveEdit = async () => {
    // Check for master code "2.3.N.A"
    if (!editPassword || editPassword !== EDIT_CONFIRMATION_CODE) {
      NotificationManager.error('KOD XATO', 'Tahrirlash kodi noto\'g\'ri!', 2500)
      return
    }

    try {
      const user = users.find(u => u.phone === editingUser)
      const updatedUser = {
        ...user,
        name: editData.name,
        monthlyPrice: parseInt(editData.monthlyPrice) || 0,
        paidAmount: parseInt(editData.paidAmount) || 0,
        debtAmount: parseInt(editData.debtAmount) || 0,
        subscriptionExpiry: editData.subscriptionExpiry ? new Date(editData.subscriptionExpiry) : user.subscriptionExpiry
      }

      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      })
      const result = await response.json()
      if (result.success) {
        loadUsers()
        setEditingUser(null)
        setEditPassword('')
        NotificationManager.success('TAHRIRLANDI', 'Foydalanuvchi tahrirlandi!', 1000)
      }
    } catch (err) {
      console.error('Error saving user:', err)
      NotificationManager.error('XATO', 'Foydalanuvchini saqlashda xato!', 2500)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString('uz-UZ')
  }

  const getDaysLeft = (expiry) => {
    if (!expiry) return -1
    const now = new Date()
    const expiryDate = new Date(expiry)
    const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))
    return daysLeft
  }

  const getStatusColor = (daysLeft) => {
    if (daysLeft < 0) return '#ff0055'
    if (daysLeft <= 1) return '#ff0055'
    if (daysLeft <= 6) return '#ffaa00'
    return '#00ff88'
  }

  const getStatusText = (daysLeft) => {
    if (daysLeft < 0) return 'TUGAGAN'
    if (daysLeft === 0) return 'BUGUN TUGADI'
    if (daysLeft === 1) return '1 KUN QOLDI'
    return `${daysLeft} KUN QOLDI`
  }

  return (
    <div className="card">
      <h2>AZOLAR</h2>

      {/* Kod o'zgartirish Modal */}
      {changingCode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            background: '#0a0e27',
            border: '3px solid #00d4ff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ color: '#00d4ff', marginTop: 0 }}>
              🔑 KODNI O'ZGARTIRISH
            </h3>
            <p style={{ color: '#aaa', marginBottom: '16px' }}>
              Foydalanuvchi: <strong style={{ color: '#fff' }}>{changingCode.phone}</strong><br/>
              Kod turi: <strong style={{ color: '#fff' }}>
                {changingCode.type === 'work' && 'Ish kodi'}
                {changingCode.type === 'school' && 'Maktab kodi'}
                {changingCode.type === 'plan' && 'Reja kodi'}
              </strong>
            </p>
            
            <label style={{ color: '#00d4ff', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
              🔐 MASTER KOD
            </label>
            <input
              type="password"
              value={masterCode}
              onChange={(e) => setMasterCode(e.target.value)}
              placeholder="Kodni kiriting"
              maxLength={7}
              style={{
                width: '100%',
                padding: '12px',
                background: '#16213e',
                border: '2px solid #ff0055',
                borderRadius: '8px',
                color: '#ff0055',
                fontSize: '18px',
                textAlign: 'center',
                letterSpacing: '4px',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
            />
            
            <label style={{ color: '#00d4ff', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
              📝 YANGI KOD
            </label>
            <input
              type="password"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Yangi kod (4-6 raqam)"
              style={{
                width: '100%',
                padding: '12px',
                background: '#16213e',
                border: '2px solid #0f3460',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '18px',
                textAlign: 'center',
                letterSpacing: '4px',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={changeUserCode}
                className="admin-btn-success"
              >
                ✅ O'ZGARTIRISH
              </button>
              <button
                onClick={() => {
                  setChangingCode(null)
                  setNewCode('')
                  setMasterCode('')
                }}
                className="admin-btn-danger"
              >
                ❌ BEKOR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a0a0f 0%, #0a0e27 100%)',
            border: '3px solid #ff0055',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(255, 0, 85, 0.4)',
            animation: 'modalSlideIn 0.3s ease-out'
          }}>
            <style>{`
              @keyframes modalSlideIn {
                from {
                  opacity: 0;
                  transform: translateY(-30px) scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
            `}</style>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #ff0055 0%, #cc0044 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                boxShadow: '0 8px 24px rgba(255, 0, 85, 0.4)'
              }}>
                ⚠️
              </div>
              <h3 style={{ color: '#ff0055', margin: 0, fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                O'CHIRISH TASDIQLASH
              </h3>
            </div>
            
            <p style={{ color: '#aaa', fontSize: '15px', marginBottom: '20px', textAlign: 'center', lineHeight: '1.6' }}>
              Ushbu foydalanuvchini o'chirishni tasdiqlaysizmi?
            </p>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #16213e 0%, #0f1923 100%)', 
              padding: '16px', 
              borderRadius: '12px',
              marginBottom: '24px',
              border: '2px solid #00d4ff',
              boxShadow: '0 4px 15px rgba(0, 212, 255, 0.2)'
            }}>
              <p style={{ color: '#00d4ff', fontWeight: 'bold', margin: '0 0 8px 0', fontSize: '18px' }}>
                📱 {deleteConfirm.phone}
              </p>
              <p style={{ color: '#fff', fontSize: '14px', margin: 0 }}>
                👤 {deleteConfirm.name}
              </p>
            </div>

            <label style={{ color: '#ff0055', fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              🔐 O'CHIRISH KODI
            </label>
            <input
              type="text"
              value={deleteCode}
              onChange={(e) => setDeleteCode(e.target.value.toUpperCase())}
              placeholder="Kodni kiriting"
              maxLength={7}
              style={{
                width: '100%',
                padding: '16px',
                background: '#16213e',
                border: '2px solid #ff0055',
                borderRadius: '10px',
                color: '#ff0055',
                fontSize: '18px',
                textAlign: 'center',
                letterSpacing: '4px',
                marginBottom: '24px',
                boxSizing: 'border-box',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff0055'}
              onBlur={(e) => e.target.style.borderColor = '#ff0055'}
              onKeyPress={(e) => {
                if (e.key === 'Enter') deleteUser(deleteConfirm.phone)
              }}
              autoFocus
            />

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => deleteUser(deleteConfirm.phone)}
                style={{
                  flex: '1 1 calc(50% - 6px)',
                  minWidth: '140px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #ff0055 0%, #cc0044 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '15px',
                  boxShadow: '0 4px 15px rgba(255, 0, 85, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 20px rgba(255, 0, 85, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 15px rgba(255, 0, 85, 0.4)'
                }}
              >
                ✅ HA, O'CHIRISH
              </button>
              <button
                onClick={() => {
                  setDeleteConfirm(null)
                  setDeleteCode('')
                }}
                style={{
                  flex: '1 1 calc(50% - 6px)',
                  minWidth: '140px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #555 0%, #333 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '15px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.background = 'linear-gradient(135deg, #666 0%, #444 100%)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.background = 'linear-gradient(135deg, #555 0%, #333 100%)'
                }}
              >
                ❌ BEKOR QILISH
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#0a0e27',
            border: '3px solid #00d4ff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ color: '#00d4ff', marginTop: 0, marginBottom: '16px', fontSize: '20px' }}>
              XABAR YOZISH
            </h3>
            
            <div style={{ 
              background: '#16213e', 
              padding: '12px', 
              borderRadius: '8px',
              marginBottom: '16px',
              border: '2px solid #0f3460'
            }}>
              <p style={{ color: '#00d4ff', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                {chatUser.name}
              </p>
              <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>
                {chatUser.phone}
              </p>
            </div>

            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Xabaringizni yozing..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                background: '#16213e',
                border: '2px solid #0f3460',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                marginBottom: '16px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={sendChatMessage}
                className="admin-btn-edit"
              >
                ✉️ YUBORISH
              </button>
              <button
                onClick={() => {
                  setChatUser(null)
                  setChatMessage('')
                }}
                className="admin-btn-danger"
              >
                ❌ BEKOR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block/Unblock Confirmation Modal */}
      {blockConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            background: '#0a0e27',
            border: `3px solid ${blockConfirm.action === 'block' ? '#ffaa00' : '#00ff88'}`,
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ color: blockConfirm.action === 'block' ? '#ffaa00' : '#00ff88', marginTop: 0 }}>
              {blockConfirm.action === 'block' ? '⏸️ OBUNANI TOXTATISH' : '✅ OBUNANI FAOLLASHTIRISH'}
            </h3>
            <p style={{ color: '#aaa', marginBottom: '16px' }}>
              Foydalanuvchi: <strong style={{ color: '#fff' }}>{blockConfirm.name}</strong><br/>
              Telefon: <strong style={{ color: '#fff' }}>{blockConfirm.phone}</strong>
            </p>
            
            <label style={{ color: '#ff0055', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
              🔐 TASDIQLASH KODI
            </label>
            <input
              type="password"
              value={blockCode}
              onChange={(e) => setBlockCode(e.target.value.toUpperCase())}
              placeholder="Kodni kiriting"
              maxLength={7}
              style={{
                width: '100%',
                padding: '12px',
                background: '#16213e',
                border: '2px solid #ff0055',
                borderRadius: '8px',
                color: '#ff0055',
                fontSize: '18px',
                textAlign: 'center',
                letterSpacing: '4px',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
            />
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => blockConfirm.action === 'block' ? blockSubscription() : unblockSubscription()}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: blockConfirm.action === 'block' 
                    ? 'linear-gradient(135deg, #ffaa00 0%, #ff8800 100%)'
                    : 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
                  color: '#0a0e27',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ✅ TASDIQLASH
              </button>
              <button
                onClick={() => {
                  setBlockConfirm(null)
                  setBlockCode('')
                }}
                className="admin-btn-danger"
              >
                ❌ BEKOR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <div style={{
            background: '#0a0e27',
            border: '2px solid #00d4ff',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '400px',
            width: '90%',
            margin: '20px auto'
          }}>
            <h3 style={{ color: '#00d4ff', marginBottom: '16px' }}>TAHRIRLASH</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: '#aaa', fontSize: '12px' }}>Ism:</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#16213e',
                  border: '2px solid #0f3460',
                  color: '#00d4ff',
                  borderRadius: '6px',
                  marginTop: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: '#aaa', fontSize: '12px' }}>Oylik tolov (so'm):</label>
              <input
                type="number"
                value={editData.monthlyPrice}
                onChange={(e) => setEditData({...editData, monthlyPrice: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#16213e',
                  border: '2px solid #0f3460',
                  color: '#00d4ff',
                  borderRadius: '6px',
                  marginTop: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: '#aaa', fontSize: '12px' }}>To'langan pul (so'm):</label>
              <input
                type="number"
                value={editData.paidAmount}
                onChange={(e) => setEditData({...editData, paidAmount: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#16213e',
                  border: '2px solid #0f3460',
                  color: '#00d4ff',
                  borderRadius: '6px',
                  marginTop: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: '#aaa', fontSize: '12px' }}>Qarz (so'm):</label>
              <input
                type="number"
                value={editData.debtAmount}
                onChange={(e) => setEditData({...editData, debtAmount: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#16213e',
                  border: '2px solid #0f3460',
                  color: '#00d4ff',
                  borderRadius: '6px',
                  marginTop: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ color: '#aaa', fontSize: '12px' }}>Tugashi sanasi:</label>
              <input
                type="date"
                value={editData.subscriptionExpiry}
                onChange={(e) => setEditData({...editData, subscriptionExpiry: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#16213e',
                  border: '2px solid #0f3460',
                  color: '#00d4ff',
                  borderRadius: '6px',
                  marginTop: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#ff0055', fontSize: '12px', fontWeight: 'bold' }}>🔐 TAHRIRLASH KODI:</label>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Kodni kiriting"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#16213e',
                  border: '2px solid #ff0055',
                  color: '#ff0055',
                  borderRadius: '6px',
                  marginTop: '4px',
                  boxSizing: 'border-box',
                  letterSpacing: '4px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={saveEdit}
                className="admin-btn-success"
              >
                ✅ SAQLASH
              </button>
              <button
                onClick={() => {
                  setEditingUser(null)
                  setEditPassword('')
                }}
                className="admin-btn-danger"
              >
                ❌ BEKOR
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#aaa' }}>Yuklanimoqda...</p>
      ) : users.length === 0 ? (
        <p style={{ color: '#aaa' }}>Foydalanuvchilar topilmadi</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {users
            .filter(u => u.approved && u.deleted !== true)
            .map(user => {
            const daysLeft = getDaysLeft(user.subscriptionExpiry)
            const statusColor = getStatusColor(daysLeft)
            const statusText = getStatusText(daysLeft)
            
            // Agar subscription blocked bo'lsa, sariq rang
            const borderColor = user.subscriptionActive === false ? '#ffaa00' : statusColor

            return (
              <div key={user.phone} style={{ 
                background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 100%)', 
                border: `3px solid ${borderColor}`, 
                borderRadius: '16px', 
                padding: '20px',
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${borderColor}40`,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${borderColor}, transparent)`,
                  opacity: 0.6
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px', gap: '16px' }}>
                  {/* Ma'lumotlar qismi */}
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      color: '#fff', 
                      fontSize: '14px', 
                      marginBottom: '12px',
                      fontWeight: '600'
                    }}>
                      👤 {user.name || 'Noma\'lum'}
                    </p>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '8px',
                      marginBottom: '12px'
                    }}>
                      <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>
                        📋 Rejalar: <span style={{ color: '#ffaa00', fontWeight: 'bold' }}>{user.plans?.length || 0}</span>
                      </p>
                      <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>
                        📅 Kelgan: <span style={{ color: '#00d4ff' }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('uz-UZ') : 'N/A'}</span>
                      </p>
                      <p style={{ 
                        color: user.subscriptionActive === false ? '#ffaa00' : statusColor, 
                        fontSize: '13px', 
                        fontWeight: 'bold', 
                        margin: 0,
                        gridColumn: '1 / -1'
                      }}>
                        ⏰ {user.subscriptionActive === false ? 'TOXTATILGAN' : statusText}
                      </p>
                      <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>
                        📆 Tugashi: <span style={{ color: '#fff' }}>{formatDate(user.subscriptionExpiry)}</span>
                      </p>
                      <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>
                        💰 Oylik: <span style={{ color: '#00ff88' }}>{user.monthlyPrice || 0} so'm</span>
                      </p>
                      <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>
                        ✅ To'langan: <span style={{ color: '#00ff88' }}>{user.paidAmount || 0} so'm</span>
                      </p>
                      <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>
                        ❌ Qarz: <span style={{ color: '#ff0055', fontWeight: 'bold' }}>{user.debtAmount || 0} so'm</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Tugmalar qismi */}
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', minWidth: '160px' }}>
                    <button
                      onClick={() => startEdit(user)}
                      className="admin-btn-edit"
                      style={{
                        background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        color: '#0a0e27',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)'
                      }}
                    >
                      ✏️ TAHRIRLASH
                    </button>
                    <button
                      onClick={() => {
                        if (user.subscriptionActive === false) {
                          setBlockConfirm({ phone: user.phone, name: user.name, action: 'unblock' })
                        } else {
                          setBlockConfirm({ phone: user.phone, name: user.name, action: 'block' })
                        }
                      }}
                      className={user.subscriptionActive === false ? 'admin-btn-success' : 'admin-btn-warning'}
                      style={{
                        background: user.subscriptionActive === false 
                          ? 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)'
                          : 'linear-gradient(135deg, #ffaa00 0%, #ff8800 100%)',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        color: '#0a0e27',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.2s ease',
                        boxShadow: user.subscriptionActive === false
                          ? '0 4px 12px rgba(0, 255, 136, 0.3)'
                          : '0 4px 12px rgba(255, 170, 0, 0.3)'
                      }}
                    >
                      {user.subscriptionActive === false ? '✅ FAOLLASH' : '⏸️ TOXTATISH'}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ phone: user.phone, name: user.name })}
                      className="admin-btn-danger"
                      style={{
                        background: 'linear-gradient(135deg, #ff0055 0%, #cc0044 100%)',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(255, 0, 85, 0.3)'
                      }}
                    >
                      🗑️ O'CHIRISH
                    </button>
                    <button
                      onClick={() => openChatModal(user)}
                      className="admin-btn-edit"
                      style={{
                        background: 'linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%)',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(157, 78, 221, 0.3)',
                        position: 'relative'
                      }}
                    >
                      💬 XABAR
                      {user.adminMessages?.filter(m => m.role === 'user' && !m.read).length > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          background: '#ff0055',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          border: '2px solid #0a0e27'
                        }}>
                          {user.adminMessages.filter(m => m.role === 'user' && !m.read).length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => openPaymentModal(user)}
                      className="admin-btn-payment"
                      style={{
                        background: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        color: '#0a0e27',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)'
                      }}
                    >
                      💰 TO'LOV
                    </button>
                  </div>
                </div>
                  
                {/* Kod o'zgartirish tugmalari */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  flexWrap: 'wrap',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(0, 212, 255, 0.2)'
                }}>
                  <button
                    onClick={() => setChangingCode({ phone: user.phone, type: 'work' })}
                    className="admin-btn-code"
                    style={{
                      background: 'rgba(0, 212, 255, 0.15)',
                      border: '2px solid #00d4ff',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      color: '#00d4ff',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🔑 ISH KODI
                  </button>
                  <button
                    onClick={() => setChangingCode({ phone: user.phone, type: 'school' })}
                    className="admin-btn-code"
                    style={{
                      background: 'rgba(255, 170, 0, 0.15)',
                      border: '2px solid #ffaa00',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      color: '#ffaa00',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🔑 MAKTAB KODI
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button
        onClick={loadUsers}
        style={{
          width: '100%',
          marginTop: '20px',
          padding: '12px',
          background: '#00d4ff',
          color: '#0a0e27',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        YANGILASH
      </button>

      {/* To'lov boshqaruvi modali */}
      {paymentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)',
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a2332 0%, #0f1923 100%)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            border: '3px solid #00ff88',
            boxShadow: '0 20px 60px rgba(0, 255, 136, 0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ 
              color: '#00ff88', 
              marginTop: 0, 
              marginBottom: '24px', 
              textAlign: 'center',
              fontSize: '22px',
              fontWeight: 'bold'
            }}>
              💰 TO'LOV BOSHQARUVI
            </h3>

            <div style={{ 
              background: 'rgba(0, 212, 255, 0.1)',
              border: '2px solid #00d4ff',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px'
            }}>
              <p style={{ color: '#00d4ff', margin: 0, fontSize: '14px' }}>
                📱 {paymentModal.phone} - {paymentModal.name}
              </p>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              {/* Muddat (kunlar) */}
              <div>
                <label style={{ display: 'block', color: '#aaa', fontSize: '12px', marginBottom: '6px' }}>
                  📅 Obuna muddati (kunlar)
                </label>
                <input
                  type="number"
                  value={paymentData.subscriptionDays}
                  onChange={(e) => setPaymentData({ ...paymentData, subscriptionDays: parseInt(e.target.value) || 0 })}
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
                <button
                  onClick={calculateExpiryDate}
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    padding: '10px',
                    background: '#00d4ff',
                    color: '#0a0e27',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  ⏰ TUGASH SANASINI HISOBLASH
                </button>
              </div>

              {/* Tugash sanasi */}
              <div>
                <label style={{ display: 'block', color: '#aaa', fontSize: '12px', marginBottom: '6px' }}>
                  ⏰ Tugash sanasi
                </label>
                <input
                  type="datetime-local"
                  value={paymentData.subscriptionExpiry ? new Date(paymentData.subscriptionExpiry).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setPaymentData({ ...paymentData, subscriptionExpiry: new Date(e.target.value).toISOString() })}
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

              {/* To'langan summa */}
              <div>
                <label style={{ display: 'block', color: '#aaa', fontSize: '12px', marginBottom: '6px' }}>
                  ✅ To'langan summa (so'm)
                </label>
                <input
                  type="number"
                  value={paymentData.paidAmount}
                  onChange={(e) => setPaymentData({ ...paymentData, paidAmount: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0e27',
                    border: '2px solid #00ff88',
                    borderRadius: '8px',
                    color: '#00ff88',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    fontWeight: 'bold'
                  }}
                />
              </div>

              {/* Qarz */}
              <div>
                <label style={{ display: 'block', color: '#aaa', fontSize: '12px', marginBottom: '6px' }}>
                  ❌ Qarz (so'm)
                </label>
                <input
                  type="number"
                  value={paymentData.debtAmount}
                  onChange={(e) => setPaymentData({ ...paymentData, debtAmount: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0a0e27',
                    border: '2px solid #ff0055',
                    borderRadius: '8px',
                    color: '#ff0055',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    fontWeight: 'bold'
                  }}
                />
              </div>
            </div>

            <div style={{ 
              background: 'rgba(255, 0, 85, 0.1)',
              border: '2px solid #ff0055',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '20px'
            }}>
              <label style={{ display: 'block', color: '#ff0055', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                🔐 O'ZGARTIRISH KODI
              </label>
              <input
                type="password"
                value={paymentCode}
                onChange={(e) => setPaymentCode(e.target.value.toUpperCase())}
                placeholder="Kodni kiriting"
                maxLength={7}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0a0e27',
                  border: '2px solid #ff0055',
                  borderRadius: '8px',
                  color: '#ff0055',
                  fontSize: '18px',
                  textAlign: 'center',
                  letterSpacing: '4px',
                  boxSizing: 'border-box',
                  fontWeight: 'bold'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={savePaymentData}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
                  color: '#0a0e27',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px',
                  boxShadow: '0 4px 15px rgba(0, 255, 136, 0.4)'
                }}
              >
                ✅ SAQLASH
              </button>
              <button
                onClick={() => {
                  setPaymentModal(null)
                  setPaymentCode('')
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'linear-gradient(135deg, #ff0055 0%, #cc0044 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px',
                  boxShadow: '0 4px 15px rgba(255, 0, 85, 0.4)'
                }}
              >
                ❌ BEKOR QILISH
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
