import './Header.css'
import { Menu, LogOut, User } from 'lucide-react'

export default function Header({ user, userData, onLogout, onMenuClick, isAdmin }) {
  // Get display name - always show user name or FOYDALANUVCHI
  const displayName = userData?.name || 'FOYDALANUVCHI'
  
  console.log('📋 Header Debug:', {
    user,
    userName: userData?.name,
    displayName,
    isAdmin
  })
  
  // Check if subscription is blocked
  const isBlocked = !isAdmin && userData?.subscriptionActive === false
  
  // Format dates for subscription info
  const formatDate = (dateString) => {
    if (!dateString) return 'Noma\'lum'
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }
  
  // Calculate days remaining
  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  const daysRemaining = userData?.subscriptionExpiry ? getDaysRemaining(userData.subscriptionExpiry) : null
  
  return (
    <div className="header">
      <button className="burger" onClick={onMenuClick}>
        <Menu size={24} />
      </button>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={20} />
          <h1 style={{ margin: 0 }}>{displayName.toUpperCase()}</h1>
          {isBlocked && <span style={{ fontSize: '24px', color: '#ff0055' }}>🔒</span>}
        </div>
        
        {/* Subscription info for regular users */}
        {!isAdmin && userData?.createdAt && (
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            fontSize: '10px', 
            color: '#aaa',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '100%'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
              📅 <strong style={{ color: '#00d4ff' }}>{formatDate(userData.createdAt)}</strong>
            </span>
            {userData.subscriptionExpiry && (
              <>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
                  ⏰ <strong style={{ color: daysRemaining > 7 ? '#00ff88' : daysRemaining > 0 ? '#ffaa00' : '#ff0055' }}>
                    {formatDate(userData.subscriptionExpiry)}
                  </strong>
                </span>
                {daysRemaining !== null && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
                    {daysRemaining > 0 ? '✅' : '❌'} 
                    <strong style={{ color: daysRemaining > 7 ? '#00ff88' : daysRemaining > 0 ? '#ffaa00' : '#ff0055' }}>
                      {daysRemaining > 0 ? `${daysRemaining} kun` : 'Tugagan'}
                    </strong>
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <button className="logout-btn" onClick={onLogout}>
        <LogOut size={18} style={{ marginRight: '6px' }} />
        CHIQISH
      </button>
    </div>
  )
}
