import { useState, useEffect } from 'react'
import './App.css'
import LoginScreen from './components/LoginScreen'
import MainScreen from './components/MainScreen'
import Notification, { NotificationManager } from './components/Notification'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const initializeApp = async () => {
      // Don't check localStorage - always require login
      NotificationManager.init(setNotifications)
      setLoading(false)
    }
    
    initializeApp()
  }, [])

  const loadUserData = async (phone) => {
    try {
      const response = await fetch('/api/get-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      
      if (!response.ok) {
        console.error('Server error:', response.status)
        return
      }
      
      const text = await response.text()
      if (!text) {
        console.error('Empty response from server')
        return
      }
      
      const result = JSON.parse(text)
      if (result.success && result.user) {
        setUserData(result.user)
      }
    } catch (err) {
      console.error('Load user error:', err)
    }
  }

  const handleLogin = (user, data) => {
    // Check if user is approved (for regular users, not admin)
    if (user !== 'ADMIN' && data && !data.approved) {
      // Show toast in MainScreen instead of alert
      setCurrentUser(user)
      setUserData(data)
      return
    }
    
    setCurrentUser(user)
    setUserData(data)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setUserData(null)
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 100%)'
      }}>
        <div style={{
          fontSize: '32px',
          color: '#00d4ff',
          fontWeight: 'bold'
        }}>
          ⏳ Yuklanimoqda...
        </div>
      </div>
    )
  }

  return (
    <>
      {!currentUser ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <MainScreen 
          user={currentUser} 
          userData={userData}
          setUserData={setUserData}
          onLogout={handleLogout}
        />
      )}
      
      {/* Notifikatsiyalar */}
      {notifications.map(notif => (
        <Notification
          key={notif.id}
          type={notif.type}
          title={notif.title}
          message={notif.message}
          duration={notif.duration}
          buttons={notif.buttons}
          onClose={() => NotificationManager.close(notif.id)}
        />
      ))}
    </>
  )
}

export default App
