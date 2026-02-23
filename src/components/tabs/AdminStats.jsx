import { useState, useEffect } from 'react'

export default function AdminStats() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    approvedUsers: 0,
    pendingUsers: 0,
    deletedUsers: 0
  })
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="card">
      <h2>STATISTIKA</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>Jami foydalanuvchilar</p>
          <p style={{ color: '#00d4ff', fontSize: '32px', fontWeight: 'bold' }}>{stats.totalUsers}</p>
        </div>
        <div style={{ background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>Tasdiqlangan</p>
          <p style={{ color: '#00ff88', fontSize: '32px', fontWeight: 'bold' }}>{stats.approvedUsers}</p>
        </div>
        <div style={{ background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>Kutilmoqda</p>
          <p style={{ color: '#ffaa00', fontSize: '32px', fontWeight: 'bold' }}>{stats.pendingUsers}</p>
        </div>
        <div style={{ background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>O'chirilgan</p>
          <p style={{ color: '#ff0055', fontSize: '32px', fontWeight: 'bold' }}>{stats.deletedUsers}</p>
        </div>
      </div>

      <div style={{ background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '20px' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '16px' }}>Foizli Statistika</h3>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <p style={{ color: '#00ff88' }}>Tasdiqlangan</p>
            <p style={{ color: '#00ff88', fontWeight: 'bold' }}>{Math.round(stats.approvedUsers / stats.totalUsers * 100) || 0}%</p>
          </div>
          <div style={{ background: '#0f3460', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#00ff88', height: '100%', width: `${Math.round(stats.approvedUsers / stats.totalUsers * 100) || 0}%` }}></div>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <p style={{ color: '#ffaa00' }}>Kutilmoqda</p>
            <p style={{ color: '#ffaa00', fontWeight: 'bold' }}>{Math.round(stats.pendingUsers / stats.totalUsers * 100) || 0}%</p>
          </div>
          <div style={{ background: '#0f3460', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#ffaa00', height: '100%', width: `${Math.round(stats.pendingUsers / stats.totalUsers * 100) || 0}%` }}></div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <p style={{ color: '#ff0055' }}>O'chirilgan</p>
            <p style={{ color: '#ff0055', fontWeight: 'bold' }}>{Math.round(stats.deletedUsers / stats.totalUsers * 100) || 0}%</p>
          </div>
          <div style={{ background: '#0f3460', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
            <div style={{ background: '#ff0055', height: '100%', width: `${Math.round(stats.deletedUsers / stats.totalUsers * 100) || 0}%` }}></div>
          </div>
        </div>
      </div>

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
