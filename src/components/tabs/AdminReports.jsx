import { useState, useEffect } from 'react'

export default function AdminReports() {
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
      <h2>OYLIK HISOBOT</h2>

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
