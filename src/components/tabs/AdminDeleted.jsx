import { useState, useEffect } from 'react'
import ConfirmDialog from '../ConfirmDialog'

export default function AdminDeleted() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null
  })

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

  const restoreUser = async (phone) => {
    setConfirmDialog({
      isOpen: true,
      type: 'info',
      title: 'QAYTA TIKLASH',
      message: `Ushbu foydalanuvchini qayta tiklamoqchimisiz?\n\n📱 ${phone}\n\nDavom etish uchun kodni kiriting:`,
      confirmText: 'HA, TIKLASH',
      cancelText: 'BEKOR QILISH',
      requireCode: true,
      requiredCode: '2.3.N.A',
      codePlaceholder: 'Kodni kiriting',
      onConfirm: async () => {
        try {
          const response = await fetch('/api/admin/restore-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
          })
          const result = await response.json()
          if (result.success) {
            if (window.showToast) {
              window.showToast('✅ Foydalanuvchi qayta tiklandi!', 'success')
            }
            loadUsers()
          }
        } catch (err) {
          console.error('Error restoring user:', err)
          if (window.showToast) {
            window.showToast('❌ Xato: Foydalanuvchi tiklanmadi!', 'error')
          }
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false })
      }
    })
  }

  const permanentDelete = async (phone, name) => {
    setConfirmDialog({
      isOpen: true,
      type: 'danger',
      title: 'BUTUNLAY O\'CHIRISH',
      message: `DIQQAT! Bu foydalanuvchi BUTUNLAY o'chiriladi va qayta tiklab bo'lmaydi!\n\n📱 ${phone}\n👤 ${name || 'Noma\'lum'}\n\nDavom etish uchun kodni kiriting:`,
      confirmText: 'HA, O\'CHIRISH',
      cancelText: 'BEKOR QILISH',
      requireCode: true,
      requiredCode: '2.3.N.A',
      codePlaceholder: 'Kodni kiriting',
      onConfirm: async () => {
        try {
          const response = await fetch('/api/admin/permanent-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
          })
          const result = await response.json()
          if (result.success) {
            if (window.showToast) {
              window.showToast('✅ Foydalanuvchi BUTUNLAY o\'chirildi!', 'success')
            }
            loadUsers()
          }
        } catch (err) {
          console.error('Error permanently deleting user:', err)
          if (window.showToast) {
            window.showToast('❌ Xato: Foydalanuvchi o\'chirilmadi!', 'error')
          }
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false })
      }
    })
  }

  const deletedUsers = users.filter(u => u.deleted)

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString('uz-UZ') + ' ' + d.toLocaleTimeString('uz-UZ')
  }

  return (
    <div className="card">
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        type={confirmDialog.type}
        requireCode={confirmDialog.requireCode}
        requiredCode={confirmDialog.requiredCode}
        codePlaceholder={confirmDialog.codePlaceholder}
      />
      
      <h2>OCHIRILGAN AZOLAR</h2>

      {loading ? (
        <p style={{ color: '#aaa' }}>Yuklanimoqda...</p>
      ) : deletedUsers.length === 0 ? (
        <p style={{ color: '#aaa' }}>Ochirilgan foydalanuvchilar yo\'q</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {deletedUsers.map(user => (
            <div key={user.phone} style={{ background: '#330000', border: '2px solid #ff0055', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <p style={{ color: '#ff0055', fontWeight: 'bold', marginBottom: '4px', fontSize: '16px' }}>{user.phone}</p>
                  <p style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>{user.name || 'Noma\'lum'}</p>
                  <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>
                    📅 Ro'yxatdan o'tgan: {formatDate(user.createdAt)}
                  </p>
                  <p style={{ color: '#ff0055', fontSize: '12px', fontWeight: 'bold' }}>
                    🗑️ O'chirilgan: {formatDate(user.deletedAt)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', minWidth: '150px' }}>
                  <button
                    onClick={() => restoreUser(user.phone)}
                    style={{
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
                      color: '#0a0e27',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    ♻️ QAYTA TIKLASH
                  </button>
                  <button
                    onClick={() => permanentDelete(user.phone, user.name)}
                    style={{
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, #ff0055 0%, #cc0044 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 15px rgba(255, 0, 85, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    💀 BUTUNLAY O'CHIRISH
                  </button>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  )
}
