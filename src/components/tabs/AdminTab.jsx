import { useState, useEffect } from 'react'

export default function AdminTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('users')
  const [stats, setStats] = useState({
    totalUsers: 0,
    approvedUsers: 0,
    pendingUsers: 0,
    deletedUsers: 0
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

  const approveUser = async (phone) => {
    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, approved: true })
      })
      const result = await response.json()
      if (result.success) {
        loadUsers()
        alert('Foydalanuvchi tasdiqlandi!')
      }
    } catch (err) {
      console.error('Error approving user:', err)
    }
  }

  const rejectUser = async (phone) => {
    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, approved: false })
      })
      const result = await response.json()
      if (result.success) {
        loadUsers()
        alert('Foydalanuvchi rad etildi!')
      }
    } catch (err) {
      console.error('Error rejecting user:', err)
    }
  }

  const deleteUser = async (phone) => {
    if (!window.confirm(`${phone} ni o'chirishni tasdiqlaysizmi?`)) return
    
    try {
      const response = await fetch('/api/admin/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const result = await response.json()
      if (result.success) {
        loadUsers()
        alert('Foydalanuvchi o\'chirildi!')
      }
    } catch (err) {
      console.error('Error deleting user:', err)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString('uz-UZ') + ' ' + d.toLocaleTimeString('uz-UZ')
  }

  const getSubscriptionStatus = (user) => {
    if (!user.subscriptionExpiry) return 'Faol emas'
    const expiry = new Date(user.subscriptionExpiry)
    const now = new Date()
    if (expiry < now) return '❌ Tugagan'
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
    return `✅ ${daysLeft} kun qoldi`
  }

  return (
    <div className="card">
      <h2>ADMIN PANEL</h2>

      {/* Stats */}
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

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSection('users')}
          style={{
            padding: '10px 16px',
            background: activeSection === 'users' ? '#00d4ff' : '#16213e',
            color: activeSection === 'users' ? '#0a0e27' : '#00d4ff',
            border: `2px solid ${activeSection === 'users' ? '#00d4ff' : '#0f3460'}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Barcha foydalanuvchilar
        </button>
        <button
          onClick={() => setActiveSection('pending')}
          style={{
            padding: '10px 16px',
            background: activeSection === 'pending' ? '#ffaa00' : '#16213e',
            color: activeSection === 'pending' ? '#0a0e27' : '#ffaa00',
            border: `2px solid ${activeSection === 'pending' ? '#ffaa00' : '#0f3460'}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Sorovlar ({stats.pendingUsers})
        </button>
        <button
          onClick={() => setActiveSection('reports')}
          style={{
            padding: '10px 16px',
            background: activeSection === 'reports' ? '#00ff88' : '#16213e',
            color: activeSection === 'reports' ? '#0a0e27' : '#00ff88',
            border: `2px solid ${activeSection === 'reports' ? '#00ff88' : '#0f3460'}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Hisobot
        </button>
      </div>

      {/* Users Section */}
      {activeSection === 'users' && (
        <div>
          <h3 style={{ color: '#00d4ff', marginBottom: '16px' }}>Barcha foydalanuvchilar</h3>
          {loading ? (
            <p style={{ color: '#aaa' }}>Yuklanimoqda...</p>
          ) : users.length === 0 ? (
            <p style={{ color: '#aaa' }}>Foydalanuvchilar topilmadi</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {users.map(user => (
                <div key={user.phone} style={{ background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <p style={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '4px' }}>{user.phone}</p>
                      <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>{user.name || 'Noma\'lum'}</p>
                      <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>Kelgan: {formatDate(user.createdAt)}</p>
                      <p style={{ color: '#aaa', fontSize: '12px' }}>{getSubscriptionStatus(user)}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                      {!user.approved && (
                        <>
                          <button
                            onClick={() => approveUser(user.phone)}
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
                            TASDIQLASH
                          </button>
                          <button
                            onClick={() => rejectUser(user.phone)}
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
                            RAD ETISH
                          </button>
                        </>
                      )}
                      {user.approved && (
                        <p style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '12px' }}>Tasdiqlangan</p>
                      )}
                      <button
                        onClick={() => deleteUser(user.phone)}
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
                        O'CHIRISH
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pending Requests Section */}
      {activeSection === 'pending' && (
        <div>
          <h3 style={{ color: '#ffaa00', marginBottom: '16px' }}>Tasdiqlash sorovlari</h3>
          {loading ? (
            <p style={{ color: '#aaa' }}>Yuklanimoqda...</p>
          ) : users.filter(u => !u.approved).length === 0 ? (
            <p style={{ color: '#aaa' }}>Sorovlar yo\'q</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {users.filter(u => !u.approved).map(user => (
                <div key={user.phone} style={{ background: '#1a0033', border: '2px solid #ffaa00', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ color: '#ffaa00', fontWeight: 'bold', marginBottom: '4px' }}>{user.phone}</p>
                      <p style={{ color: '#aaa', fontSize: '12px' }}>{user.name || 'Noma\'lum'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => approveUser(user.phone)}
                        style={{
                          padding: '10px 16px',
                          background: '#00ff88',
                          color: '#0a0e27',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
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
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reports Section */}
      {activeSection === 'reports' && (
        <div>
          <h3 style={{ color: '#00ff88', marginBottom: '16px' }}>Oylik Hisobot</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#0a0e27', border: '2px solid #00ff88', borderRadius: '8px', padding: '16px' }}>
              <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>Yangi foydalanuvchilar</p>
              <p style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>{stats.approvedUsers}</p>
            </div>
            <div style={{ background: '#0a0e27', border: '2px solid #00ff88', borderRadius: '8px', padding: '16px' }}>
              <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>Faol foydalanuvchilar</p>
              <p style={{ color: '#00ff88', fontSize: '28px', fontWeight: 'bold' }}>{stats.approvedUsers}</p>
            </div>
            <div style={{ background: '#0a0e27', border: '2px solid #00ff88', borderRadius: '8px', padding: '16px' }}>
              <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>O'chirilgan</p>
              <p style={{ color: '#ff0055', fontSize: '28px', fontWeight: 'bold' }}>{stats.deletedUsers}</p>
            </div>
            <div style={{ background: '#0a0e27', border: '2px solid #00ff88', borderRadius: '8px', padding: '16px' }}>
              <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>Jami</p>
              <p style={{ color: '#00d4ff', fontSize: '28px', fontWeight: 'bold' }}>{stats.totalUsers}</p>
            </div>
          </div>
          <div style={{ background: '#0a0e27', border: '2px solid #00ff88', borderRadius: '8px', padding: '16px' }}>
            <p style={{ color: '#00ff88', fontWeight: 'bold', marginBottom: '12px' }}>Statistika:</p>
            <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>Tasdiqlangan: {stats.approvedUsers} ({Math.round(stats.approvedUsers / stats.totalUsers * 100) || 0}%)</p>
            <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>Kutilmoqda: {stats.pendingUsers} ({Math.round(stats.pendingUsers / stats.totalUsers * 100) || 0}%)</p>
            <p style={{ color: '#aaa', fontSize: '12px' }}>O'chirilgan: {stats.deletedUsers} ({Math.round(stats.deletedUsers / stats.totalUsers * 100) || 0}%)</p>
          </div>
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
