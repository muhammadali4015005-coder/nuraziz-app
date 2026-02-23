import { useState, useEffect } from 'react'
import { NotificationManager } from '../Notification'

export default function AdminPending({ onToast }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleted, setShowDeleted] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

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

  const approveUser = async (phone) => {
    try {
      // Set subscription expiry to 30 days from now
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 30)
      
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone, 
          approved: true,
          subscriptionExpiry: expiryDate.toISOString()
        })
      })
      const result = await response.json()
      if (result.success) {
        loadUsers()
        if (onToast) onToast({ message: 'Foydalanuvchi tasdiqlandi!', type: 'success' })
      }
    } catch (err) {
      console.error('Error approving user:', err)
      if (onToast) onToast({ message: 'Xatolik yuz berdi!', type: 'error' })
    }
  }

  const rejectUser = async (phone) => {
    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, approved: false, rejected: true })
      })
      const result = await response.json()
      if (result.success) {
        loadUsers()
        if (onToast) onToast({ message: 'Foydalanuvchi rad etildi!', type: 'error' })
      }
    } catch (err) {
      console.error('Error rejecting user:', err)
      if (onToast) onToast({ message: 'Xatolik yuz berdi!', type: 'error' })
    }
  }

  const permanentDeleteUser = async (phone) => {
    try {
      const response = await fetch('/api/admin/permanent-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const result = await response.json()
      if (result.success) {
        loadUsers()
        setConfirmDelete(null)
        NotificationManager.success('O\'CHIRILDI', 'Foydalanuvchi butunlay o\'chirildi!', 1000)
      }
    } catch (err) {
      console.error('Error permanently deleting user:', err)
      NotificationManager.error('XATO', 'Xatolik yuz berdi!', 2500)
    }
  }

  const restoreUser = async (phone) => {
    try {
      const response = await fetch('/api/admin/restore-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const result = await response.json()
      if (result.success) {
        loadUsers()
        if (onToast) onToast({ message: 'Foydalanuvchi qayta tiklandi!', type: 'success' })
      }
    } catch (err) {
      console.error('Error restoring user:', err)
      if (onToast) onToast({ message: 'Xatolik yuz berdi!', type: 'error' })
    }
  }

  const isPhoneComplete = (phone) => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 12
  }

  const pendingUsers = users.filter(u => !u.approved && !u.deleted && !u.rejected)
  const rejectedUsers = users.filter(u => u.rejected === true && !u.deleted)
  const deletedUsers = users.filter(u => u.deleted === true)
  const approvedUsers = users.filter(u => u.approved === true && !u.deleted)

  return (
    <div className="card">
      {/* Confirmation Dialog */}
      {confirmDelete && (
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
          zIndex: 10000
        }}>
          <div style={{
            background: '#0a0e27',
            border: '3px solid #ff0055',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '90vw',
            width: '400px',
            boxShadow: '0 20px 60px rgba(255, 0, 85, 0.5)'
          }}>
            <h3 style={{ color: '#ff0055', marginTop: 0, marginBottom: '16px', fontSize: '20px', textAlign: 'center' }}>
              ⚠️ OGOHLANTIRISH
            </h3>
            <p style={{ color: '#fff', marginBottom: '20px', textAlign: 'center', fontSize: '15px' }}>
              Bu foydalanuvchini butunlay o'chirmoqchimisiz?
            </p>
            <p style={{ color: '#ffaa00', marginBottom: '24px', textAlign: 'center', fontSize: '13px', fontWeight: 'bold' }}>
              Bu amalni qaytarib bo'lmaydi!
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#555',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                BEKOR QILISH
              </button>
              <button
                onClick={() => permanentDeleteUser(confirmDelete.phone)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#ff0055',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                O'CHIRISH
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{showDeleted ? 'O\'CHIRILGAN AZOLAR' : 'TASDIQLASH SOROVLARI'}</h2>
        <button
          onClick={() => setShowDeleted(!showDeleted)}
          style={{
            padding: '10px 20px',
            background: showDeleted ? '#ff0055' : '#00d4ff',
            color: showDeleted ? '#fff' : '#0a0e27',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          {showDeleted ? 'SOROVLAR' : 'O\'CHIRILGANLAR'}
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#aaa' }}>Yuklanimoqda...</p>
      ) : showDeleted ? (
        deletedUsers.length === 0 ? (
          <p style={{ color: '#aaa' }}>O'chirilgan azolar yo'q</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {deletedUsers.map(user => (
              <div key={user.phone} style={{ background: '#0a0e27', border: '2px solid #ff0055', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: '#ff0055', fontWeight: 'bold', marginBottom: '4px' }}>{user.phone}</p>
                    <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>{user.name || 'Noma\'lum'}</p>
                    <p style={{ color: '#666', fontSize: '11px' }}>
                      O'chirilgan: {user.deletedAt ? new Date(user.deletedAt).toLocaleDateString('uz-UZ') : 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => restoreUser(user.phone)}
                    style={{
                      padding: '10px 16px',
                      background: '#00ff88',
                      color: '#0a0e27',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  >
                    QAYTA TIKLASH
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <>
          {/* TASDIQLANGAN FOYDALANUVCHILAR */}
          {approvedUsers.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#00ff88', marginBottom: '12px' }}>TASDIQLANGAN AZOLAR</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {approvedUsers.map(user => {
                  const approvedDate = user.approvedAt ? new Date(user.approvedAt) : null
                  const expiryDate = user.subscriptionExpiry ? new Date(user.subscriptionExpiry) : null
                  
                  return (
                    <div key={user.phone} style={{ background: '#001a0d', border: '2px solid #00ff88', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ color: '#00ff88', fontWeight: 'bold', marginBottom: '4px' }}>{user.phone}</p>
                          <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>{user.name || 'Noma\'lum'}</p>
                          {approvedDate && (
                            <p style={{ color: '#00ff88', fontSize: '11px', marginTop: '4px' }}>
                              ✓ Kelgan: {approvedDate.toLocaleDateString('uz-UZ')}
                            </p>
                          )}
                          {expiryDate && (
                            <p style={{ color: '#ffaa00', fontSize: '11px' }}>
                              ⏰ Tugash: {expiryDate.toLocaleDateString('uz-UZ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* RAD ETILGAN FOYDALANUVCHILAR */}
          {rejectedUsers.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#ff0055', marginBottom: '12px' }}>RAD ETILGANLAR</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rejectedUsers.map(user => (
                  <div key={user.phone} style={{ background: '#330011', border: '2px solid #ff0055', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ color: '#ff0055', fontWeight: 'bold', marginBottom: '4px' }}>{user.phone}</p>
                        <p style={{ color: '#aaa', fontSize: '12px' }}>{user.name || 'Noma\'lum'}</p>
                        <p style={{ color: '#ff0055', fontSize: '11px', marginTop: '4px' }}>
                          ❌ Admin tomonidan rad etilgan
                        </p>
                      </div>
                      <button
                        onClick={() => setConfirmDelete({ phone: user.phone, name: user.name })}
                        style={{
                          padding: '10px 16px',
                          background: '#990033',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '12px'
                        }}
                      >
                        BUTUNLAY O'CHIRISH
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KUTAYOTGAN FOYDALANUVCHILAR */}
          {pendingUsers.length === 0 ? (
            <p style={{ color: '#aaa' }}>Sorovlar yo\'q</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingUsers.map(user => {
                const phoneComplete = isPhoneComplete(user.phone)
                const borderColor = phoneComplete ? '#ffaa00' : '#ff0055'
                const bgColor = phoneComplete ? '#1a0033' : '#330011'
                
                return (
                  <div key={user.phone} style={{ background: bgColor, border: `2px solid ${borderColor}`, borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ color: borderColor, fontWeight: 'bold', marginBottom: '4px' }}>{user.phone}</p>
                        <p style={{ color: '#aaa', fontSize: '12px' }}>{user.name || 'Noma\'lum'}</p>
                        {!phoneComplete && (
                          <p style={{ color: '#ff0055', fontSize: '11px', marginTop: '4px' }}>
                            Telefon raqami to'liq emas!
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => approveUser(user.phone)}
                          disabled={!phoneComplete}
                          style={{
                            padding: '10px 16px',
                            background: phoneComplete ? '#00ff88' : '#555',
                            color: phoneComplete ? '#0a0e27' : '#999',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: phoneComplete ? 'pointer' : 'not-allowed',
                            fontWeight: 'bold',
                            opacity: phoneComplete ? 1 : 0.5
                          }}
                        >
                          TASDIQLASH
                        </button>
                        <button
                          onClick={() => rejectUser(user.phone)}
                          style={{
                            padding: '10px 16px',
                            background: '#ff0055',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          RAD ETISH
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
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
