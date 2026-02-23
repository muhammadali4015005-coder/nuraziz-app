import { useState } from 'react'
import './LoginScreen.css'
import { NotificationManager } from './Notification'

export default function LoginScreen({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [phone, setPhone] = useState('+998')
  const [pass, setPass] = useState('')
  const [name, setName] = useState('')
  const [pass2, setPass2] = useState('')
  const [loading, setLoading] = useState(false)

  const formatPhone = (value) => {
    let val = value.replace(/\D/g, '')
    if (val.length > 12) val = val.slice(0, 12)
    
    let formatted = '+998'
    if (val.length > 3) formatted += ' ' + val.slice(3, 5)
    if (val.length > 5) formatted += ' ' + val.slice(5, 8)
    if (val.length > 8) formatted += ' ' + val.slice(8, 10)
    if (val.length > 10) formatted += ' ' + val.slice(10, 12)
    
    return formatted
  }

  const validatePhone = (phoneStr) => {
    const cleaned = phoneStr.replace(/\D/g, '')
    return cleaned.length >= 4
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    
    if (!pass) {
      NotificationManager.warning('XATO', 'Admin kodini to\'ldiring!', 2500)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pass })
      })
      
      const result = await response.json()
      if (result.success) {
        NotificationManager.success('KIRISH', 'Xush kelibsiz', 2000)
        setTimeout(() => onLogin('ADMIN', { isAdmin: true }), 400)
      } else {
        NotificationManager.error('KOD XATO', 'Admin kodi noto\'g\'ri!', 2500)
      }
    } catch (err) {
      console.error('Admin login error:', err)
      NotificationManager.error('SERVER XATOSI', 'Server bilan bog\'lanishda xato', 2500)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!validatePhone(phone)) {
      NotificationManager.warning('XATO', '+998 dan keyin kamida bitta raqam bo\'lishi kerak!', 2500)
      return
    }
    
    if (!pass) {
      NotificationManager.warning('XATO', 'Parolni to\'ldiring!', 2500)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, pass })
      })
      
      if (!response.ok) {
        console.error('Server error:', response.status)
        NotificationManager.error('SERVER XATOSI', 'Server xatosi: ' + response.status, 2500)
        setLoading(false)
        return
      }
      
      const text = await response.text()
      if (!text) {
        console.error('Empty response from server')
        NotificationManager.error('SERVER XATOSI', 'Server bo\'sh javob berdi', 2500)
        setLoading(false)
        return
      }
      
      const result = JSON.parse(text)
      if (result.success) {
        // ⚠️ FIRST: Check if user is blocked or subscription expired
        if (result.user && (result.user.blocked || result.user.blockStatus === 'blocked')) {
          NotificationManager.show({
            type: 'blocked',
            title: '⚠️ AKKAUNT TOXTATILGAN',
            message: 'Sizning akkauntingiz TOXTATILGAN. Iltimos +998 91 833 5005 raqamiga telefon qiling va buyurtmasini to\'lang!',
            duration: 0
          })
          setLoading(false)
          return
        }
        
        // ⚠️ SECOND: Check if subscription has expired
        if (result.user && result.user.subscriptionExpiry) {
          const expiryDate = new Date(result.user.subscriptionExpiry)
          const today = new Date()
          if (expiryDate < today) {
            NotificationManager.show({
              type: 'blocked',
              title: '⚠️ AKKAUNT TOXTATILGAN',
              message: 'Sizning akkauntingiz TOXTATILGAN. Iltimos +998 91 833 5005 raqamiga telefon qiling va buyurtmasini to\'lang!',
              duration: 0
            })
            setLoading(false)
            return
          }
        }

        // ⚠️ THIRD: Check if user status is TUGAGAN (blocked in Uzbek)
        if (result.user?.status === 'TUGAGAN' || result.user?.status === 'tugagan' || result.user?.blockStatus === 'tugagan') {
          NotificationManager.show({
            type: 'blocked',
            title: '⚠️ AKKAUNT TOXTATILGAN',
            message: 'Sizning akkauntingiz TOXTATILGAN. Iltimos +998 91 833 5005 raqamiga telefon qiling va buyurtmasini to\'lang!',
            duration: 0
          })
          setLoading(false)
          return
        }
        
        // ✅ FOURTH: User is not blocked, login successful
        const userName = result.user?.name || phone
        onLogin(phone, result.user)
      } else if (result.error === 'blocked') {
        // ⚠️ FIFTH: Server returned 'blocked' error code
        NotificationManager.show({
          type: 'blocked',
          title: '⚠️ AKKAUNT TOXTATILGAN',
          message: 'Sizning akkauntingiz TOXTATILGAN. Iltimos +998 91 833 5005 raqamiga telefon qiling va buyurtmasini to\'lang!',
          duration: 0
        })
      } else {
        NotificationManager.error('PARОЛ XATO', 'Telefon yoki parol noto\'g\'ri!', 2500)
      }
    } catch (err) {
      console.error('Login error:', err)
      NotificationManager.error('XATO', 'Xatolik: ' + err.message, 2500)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!validatePhone(phone)) {
      NotificationManager.warning('XATO', '+998 dan keyin kamida bitta raqam bo\'lishi kerak!', 2500)
      return
    }
    
    if (!name || !pass || !pass2) {
      NotificationManager.warning('XATO', 'Barcha maydonlarni to\'ldiring!', 2500)
      return
    }

    if (pass.length < 4 || pass.length > 6) {
      NotificationManager.warning('XATO', 'Parol 4-6 raqam bo\'lishi kerak!', 2500)
      return
    }

    if (pass !== pass2) {
      NotificationManager.error('PARОЛ XATO', 'Parollar mos emas!', 2500)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, pass, name })
      })
      
      const result = await response.json()
      if (result.success) {
        NotificationManager.success('AKKAUNT YARATILDI', 'Admin tasdiqlashini kuting...', 3000)
        setTimeout(() => {
          setIsRegister(false)
          setPhone('+998')
          setPass('')
          setName('')
          setPass2('')
        }, 500)
      } else if (result.error === 'exists') {
        NotificationManager.warning('TELEFON MAVJUD', 'Bu telefon allaqachon royxatdan otgan!', 2500)
      } else {
        NotificationManager.error('XATO', 'Xatolik yuz berdi, qayta urining!', 2500)
      }
    } catch (err) {
      console.error('Register error:', err)
      NotificationManager.error('SERVER XATOSI', 'Server bilan boglanishda xato', 2500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {isAdmin ? (
          <form onSubmit={handleAdminLogin}>
            <h1 className="login-title">ADMIN</h1>
            <p className="login-subtitle">PANEL KIRISH</p>
            
            <input
              type="password"
              placeholder="Admin kodi"
              className="login-input"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Yuklanimoqda...' : 'KIRISH'}
            </button>
            
            <button
              type="button"
              className="login-btn login-btn-sec"
              onClick={() => {
                setIsAdmin(false)
                setPass('')
              }}
              disabled={loading}
            >
              ORQAGA
            </button>
          </form>
        ) : !isRegister ? (
          <form onSubmit={handleLogin}>
            <h1 className="login-title">VAQTNI BOSH QARISH</h1>
            <p className="login-subtitle">KIRISH</p>
            
            <input
              type="text"
              placeholder="Telefon raqam"
              className="login-input"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              disabled={loading}
              autoComplete="tel"
            />
            
            <input
              type="password"
              placeholder="Parol"
              className="login-input"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Yuklanimoqda...' : 'KIRISH'}
            </button>
            
            <button
              type="button"
              className="login-btn login-btn-sec"
              onClick={() => {
                setIsRegister(true)
                setPhone('+998')
                setPass('')
              }}
              disabled={loading}
            >
              YANGI AKKAUNT
            </button>

            <button
              type="button"
              className="login-btn login-btn-sec"
              onClick={() => {
                setIsAdmin(true)
                setPhone('+998')
                setPass('')
              }}
              disabled={loading}
            >
              ADMIN KIRISHI
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h2 className="login-title">YANGI AKKAUNT</h2>
            
            <input
              type="text"
              placeholder="Ismingiz"
              className="login-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoComplete="name"
            />
            
            <input
              type="text"
              placeholder="Telefon raqam"
              className="login-input"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              disabled={loading}
              autoComplete="tel"
            />
            
            <input
              type="password"
              placeholder="Parol (4-6)"
              className="login-input"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
            
            <input
              type="password"
              placeholder="Parolni tasdiqlang"
              className="login-input"
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Yuklanimoqda...' : 'AKKAUNT YARATISH'}
            </button>
            
            <button
              type="button"
              className="login-btn login-btn-sec"
              onClick={() => {
                setIsRegister(false)
                setPhone('+998')
                setPass('')
                setPass2('')
                setName('')
              }}
              disabled={loading}
            >
              ORQAGA
            </button>
          </form>
        )}
      </div>
    </div>
  )
}





