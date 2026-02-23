import { useState, useEffect } from 'react'
import { Briefcase, Lock, Unlock, Edit3, Save, X, Check, AlertCircle, Calendar, Target, Award, BarChart3, Bell, Dumbbell } from 'lucide-react'

// Custom CSS for notification animation
const notificationStyles = `
  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-100px);
      opacity: 0;
      filter: blur(10px);
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
      filter: blur(0);
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
      filter: blur(0);
    }
    to {
      transform: translateX(-50%) translateY(-100px);
      opacity: 0;
      filter: blur(10px);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
    }
    50% {
      box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.3);
    }
  }
`

export default function WorkTab({ userData, setUserData }) {
  const [isLocked, setIsLocked] = useState(true)
  const [code, setCode] = useState('')
  const [savedCode, setSavedCode] = useState('')
  const [workInfo, setWorkInfo] = useState({
    company: '',
    position: '',
    schedule: ''
  })
  const [tempWorkInfo, setTempWorkInfo] = useState({
    company: '',
    position: '',
    schedule: ''
  })
  const [editingWork, setEditingWork] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Custom notification state
  const [notification, setNotification] = useState(null)
  
  // Mobile qurilma aniqlash
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (userData?.workCode) {
      setSavedCode(userData.workCode)
    }
    if (userData?.workInfo) {
      setWorkInfo(userData.workInfo)
      setTempWorkInfo(userData.workInfo)
    }
  }, [userData])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleLogin = async () => {
    if (code.length < 4 || code.length > 6) {
      setError('Kod 4-6 raqamdan iborat bo\'lishi kerak')
      return
    }
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData.phone,
          pass: code
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setIsLocked(false)
        setSavedCode(code)
        showNotification('Muvaffaqiyatli kirdingiz!', 'success')
        
        // Update userData
        if (setUserData) {
          setUserData(prev => ({ ...prev, workCode: code }))
        }
      } else {
        setError(result.message || 'Xatolik yuz berdi')
      }
    } catch (err) {
      setError('Server xatosi')
    }
  }

  const handleAddTask = async () => {
    if (!newTask.trim()) return
    
    const task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }
    
    const updatedTasks = [...todayTasks, task]
    setTodayTasks(updatedTasks)
    setNewTask('')
    
    if (setUserData) {
      setUserData(prev => ({ ...prev, todayTasks: updatedTasks }))
    }
    
    showNotification('Vazifa muvaffaqiyatli qo\'shildi', 'success')
    
    try {
      await fetch('/api/save-today-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData.phone,
          tasks: updatedTasks
        })
      })
    } catch (err) {
      console.error('Error saving task:', err)
    }
  }

  const handleSaveWorkInfo = async () => {
    try {
      const response = await fetch('/api/save-work-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData.phone,
          workInfo: tempWorkInfo
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setWorkInfo(tempWorkInfo)
        setEditingWork(false)
        showNotification('Ish ma\'lumotlari saqlandi', 'success')
        
        if (setUserData) {
          setUserData(prev => ({ ...prev, workInfo: tempWorkInfo }))
        }
      } else {
        setError(result.message || 'Xatolik yuz berdi')
      }
    } catch (err) {
      setError('Server xatosi')
    }
  }

  const toggleTask = (taskId) => {
    const updatedTasks = todayTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    setTodayTasks(updatedTasks)
    
    if (setUserData) {
      setUserData(prev => ({ ...prev, todayTasks: updatedTasks }))
    }
    
    const task = updatedTasks.find(t => t.id === taskId)
    showNotification(
      task.completed ? 'Vazifa bajarildi' : 'Vazifa bekor qilindi',
      'success'
    )
    
    try {
      fetch('/api/save-today-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData.phone,
          tasks: updatedTasks
        })
      }).catch(() => {})
    } catch (err) {
      console.error('Error saving task:', err)
    }
  }

  if (isLocked) {
    return (
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', color: '#ff6b6b' }}>
          <Dumbbell size={28} style={{ marginRight: '8px', color: '#4ecdc4' }} />
          <span style={{ 
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            SPORT TAB
          </span>
        </h2>
        
        {error && (
          <div style={{ 
            background: '#ff4444', 
            color: 'white', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px' 
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ 
            background: '#44ff44', 
            color: 'white', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px' 
          }}>
            {success}
          </div>
        )}
        
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <input
            className="input"
            type="password"
            placeholder="Kodni kiriting (4-6 raqam)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            style={{ marginBottom: '16px', height: '50px', fontSize: '16px' }}
          />
          <button type="submit" className="btn" style={{ width: '100%', height: '50px', fontSize: '16px' }}>
            <Lock size={20} style={{ marginRight: '8px' }} />
            KIRISH
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="card" style={{
      backgroundImage: 'linear-gradient(135deg, rgba(255, 0, 0, 0.1), rgba(0, 255, 0, 0.1)), url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23grid)" /%3E%3C/svg%3E")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlend: 'overlay'
    }}>
      <style>{notificationStyles}</style>
      
      {/* Custom Mobile Notification System */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: isMobile ? '10px' : '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: notification.type === 'success' ? 
            'linear-gradient(135deg, #10B981, #059669)' : 
            notification.type === 'error' ? 
            'linear-gradient(135deg, #EF4444, #DC2626)' : 
            'linear-gradient(135deg, #3B82F6, #1E40AF)',
          color: '#fff',
          padding: isMobile ? '12px 16px' : '16px 24px',
          borderRadius: isMobile ? '12px' : '16px',
          boxShadow: isMobile ? 
            '0 10px 25px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)' :
            '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '12px' : '16px',
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: '600',
          minWidth: isMobile ? '280px' : '350px',
          maxWidth: isMobile ? '90vw' : '500px',
          width: isMobile ? 'auto' : 'auto',
          animation: 'slideDown 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          backdropFilter: 'blur(20px)',
          border: `2px solid ${notification.type === 'success' ? '#059669' : 
                              notification.type === 'error' ? '#DC2626' : '#1E40AF'}`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          boxSizing: 'border-box'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            flexShrink: 0,
            fontSize: isMobile ? '16px' : '20px'
          }}>
            {notification.type === 'success' ? '✓' : 
             notification.type === 'error' ? '✕' : 'ℹ'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: isMobile ? '12px' : '14px', 
              opacity: 0.9, 
              marginBottom: '2px',
              fontWeight: '500'
            }}>
              {notification.type === 'success' ? 'Muvaffaqiyat' : 
               notification.type === 'error' ? 'Xatolik' : 'Ma\'lumot'}
            </div>
            <div style={{ 
              fontSize: isMobile ? '14px' : '16px', 
              fontWeight: '700',
              lineHeight: '1.3',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}>
              {notification.message}
            </div>
          </div>
          <button
            onClick={() => setNotification(null)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#fff',
              width: isMobile ? '28px' : '32px',
              height: isMobile ? '28px' : '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)'
              e.target.style.transform = 'scale(1.1)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              e.target.style.transform = 'scale(1)'
            }}
          >
            ×
          </button>
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', color: '#ff6b6b' }}>
          <Dumbbell size={isMobile ? 24 : 28} style={{ marginRight: '8px', color: '#4ecdc4' }} />
          <span style={{ 
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            fontSize: isMobile ? '18px' : '20px'
          }}>
            SPORT TAB
          </span>
        </h2>
        <button 
          className="btn-sec" 
          onClick={() => setShowChangeCode(true)}
          style={{ padding: isMobile ? '6px 12px' : '8px 16px', fontSize: isMobile ? '12px' : '14px' }}
        >
          <Edit3 size={isMobile ? 14 : 16} style={{ marginRight: '6px' }} />
          KOD O'ZGARTIRISH
        </button>
      </div>

      {/* Ish ma'lumotlari */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '16px', display: 'flex', alignItems: 'center', fontSize: isMobile ? '16px' : '18px' }}>
          <Target size={isMobile ? 18 : 20} style={{ marginRight: '8px' }} />
          Ish ma'lumotlari
        </h3>
        
        {editingWork ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              className="input"
              placeholder="Kompaniya"
              value={tempWorkInfo.company || ''}
              onChange={(e) => setTempWorkInfo(prev => ({ ...prev, company: e.target.value }))}
              style={{ height: isMobile ? '40px' : '45px', fontSize: isMobile ? '14px' : '16px' }}
            />
            <input
              className="input"
              placeholder="Lavozim"
              value={tempWorkInfo.position || ''}
              onChange={(e) => setTempWorkInfo(prev => ({ ...prev, position: e.target.value }))}
              style={{ height: isMobile ? '40px' : '45px', fontSize: isMobile ? '14px' : '16px' }}
            />
            <input
              className="input"
              placeholder="Ish grafigi"
              value={tempWorkInfo.schedule || ''}
              onChange={(e) => setTempWorkInfo(prev => ({ ...prev, schedule: e.target.value }))}
              style={{ height: isMobile ? '40px' : '45px', fontSize: isMobile ? '14px' : '16px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleSaveWorkInfo} className="btn" style={{ height: isMobile ? '40px' : '45px', fontSize: isMobile ? '14px' : '16px' }}>
                <Save size={isMobile ? 16 : 20} style={{ marginRight: '8px' }} />
                SAQLASH
              </button>
              <button onClick={() => setEditingWork(false)} className="btn-sec" style={{ height: isMobile ? '40px' : '45px', fontSize: isMobile ? '14px' : '16px' }}>
                <X size={isMobile ? 16 : 20} style={{ marginRight: '8px' }} />
                BEKOR QILISH
              </button>
            </div>
          </div>
        ) : workInfo.company ? (
          <div style={{ 
            padding: '16px', 
            backgroundColor: 'rgba(0, 212, 255, 0.1)', 
            borderRadius: '8px',
            border: '1px solid rgba(0, 212, 255, 0.3)'
          }}>
            <div style={{ marginBottom: '8px' }}><strong>Kompaniya:</strong> {workInfo.company}</div>
            <div style={{ marginBottom: '8px' }}><strong>Lavozim:</strong> {workInfo.position}</div>
            <div><strong>Grafik:</strong> {workInfo.schedule}</div>
            <button 
              onClick={() => setEditingWork(true)} 
              className="btn-sec" 
              style={{ marginTop: '12px', padding: isMobile ? '6px 12px' : '8px 16px', fontSize: isMobile ? '12px' : '14px' }}
            >
              <Edit3 size={isMobile ? 14 : 16} style={{ marginRight: '6px' }} />
              TAHRIRLASH
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px', backgroundColor: 'rgba(0, 212, 255, 0.05)', borderRadius: '8px' }}>
            <Target size={48} color="#00d4ff" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#888', marginBottom: '16px' }}>Ish ma\'lumotlari mavjud emas</p>
            <button onClick={() => setEditingWork(true)} className="btn" style={{ padding: isMobile ? '10px 20px' : '12px 24px', fontSize: isMobile ? '14px' : '16px' }}>
              <Plus size={isMobile ? 16 : 20} style={{ marginRight: '8px' }} />
              QO'SHISH
            </button>
          </div>
        )}
      </div>

      {/* Bugungi vazifalar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '24px',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <div style={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
          <h3 style={{ 
            color: '#00d4ff', 
            marginBottom: '16px', 
            display: 'flex', 
            alignItems: 'center',
            fontSize: isMobile ? '16px' : '18px'
          }}>
            <Calendar size={isMobile ? 18 : 20} style={{ marginRight: '8px' }} />
            Bugungi vazifalar
          </h3>
          
          {/* Progress Bar va Statistika */}
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(0, 212, 255, 0.1)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#00d4ff', fontSize: isMobile ? '10px' : '12px', fontWeight: 'bold' }}>
                Progress: {todayTasks.filter(t => t.completed).length}/{todayTasks.length}
              </span>
              <span style={{ color: '#00ff00', fontSize: isMobile ? '10px' : '12px', fontWeight: 'bold' }}>
                {todayTasks.length > 0 ? Math.round((todayTasks.filter(t => t.completed).length / todayTasks.length) * 100) : 0}%
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: isMobile ? '4px' : '6px', 
              backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${todayTasks.length > 0 ? (todayTasks.filter(t => t.completed).length / todayTasks.length) * 100 : 0}%`,
                height: '100%',
                backgroundColor: '#00ff00',
                transition: 'width 0.3s ease',
                borderRadius: '3px'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ color: '#ff4444', fontSize: isMobile ? '8px' : '10px' }}>
                Bajarilmagan: {todayTasks.filter(t => !t.completed).length}
              </span>
              <span style={{ color: '#00ff00', fontSize: isMobile ? '8px' : '10px' }}>
                Bajarilgan: {todayTasks.filter(t => t.completed).length}
              </span>
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex', 
              gap: '8px',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <input
                className="input"
                placeholder="Yangi vazifa..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                style={{ 
                  flex: 1, 
                  height: isMobile ? '40px' : '45px', 
                  maxWidth: isMobile ? '100%' : '600px', 
                  fontSize: isMobile ? '14px' : '16px',
                  marginBottom: isMobile ? '8px' : '0'
                }}
              />
              <button
                onClick={handleAddTask}
                className="btn btn-success"
                style={{
                  height: isMobile ? '40px' : '45px',
                  padding: isMobile ? '0 16px' : '0 24px',
                  fontSize: isMobile ? '14px' : '16px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Check size={isMobile ? 16 : 18} style={{ marginRight: '6px' }} />
                QO'SHISH
              </button>
            </div>
          </div>
        
          {todayTasks.length > 0 ? (
            <div style={{ width: '100%' }}>
              {todayTasks.map(task => (
                <div key={task.id} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  padding: isMobile ? '8px' : '12px',
                  backgroundColor: task.completed ? '#0a0e27' : '#1a1f3a',
                  borderRadius: '8px',
                  border: `2px solid ${task.completed ? '#0f3460' : '#cc0000'}`,
                  transition: 'all 0.3s ease'
                }}>
                  {/* X tugmasi - bajarilgan vazifalar uchun */}
                  {task.completed && (
                    <button 
                      onClick={() => toggleTask(task.id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #ff4444',
                        color: '#ff4444',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        transition: 'all 0.3s ease',
                        marginRight: '6px',
                        minWidth: '25px',
                        height: '25px'
                      }}
                    >
                      X
                    </button>
                  )}
                  
                  {/* Checkbox */}
                  <div 
                    onClick={() => toggleTask(task.id)}
                    style={{ 
                      width: isMobile ? '30px' : '35px',
                      height: isMobile ? '30px' : '35px',
                      border: `2px solid ${task.completed ? '#00ff00' : '#888'}`,
                      borderRadius: '6px',
                      backgroundColor: task.completed ? '#00ff00' : 'transparent',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      marginRight: '12px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {task.completed && (
                      <Check size={isMobile ? 18 : 24} color="#fff" />
                    )}
                  </div>
                  
                  {/* Vazifa kartasi */}
                  <div style={{
                    flexGrow: 1,
                    backgroundColor: !task.completed ? '#ff4444' : '#0a0e27',
                    padding: isMobile ? '6px 10px' : '8px 12px',
                    borderRadius: '6px',
                    border: `2px solid ${!task.completed ? '#cc0000' : '#0f3460'}`,
                    minHeight: isMobile ? '24px' : '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ 
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: '#fff',
                      fontSize: isMobile ? '12px' : '14px'
                    }}>
                      {task.text}
                    </span>
                    
                    <button 
                      onClick={() => {
                        const action = prompt('Vazifani o\'zgartiring (yoki "ochirish" deb yozing):', task.text)
                        if (action) {
                          if (action.toLowerCase() === 'ochirish') {
                            const updatedTasks = todayTasks.filter(t => t.id !== task.id)
                            setTodayTasks(updatedTasks)
                            if (setUserData) {
                              setUserData(prev => ({ ...prev, todayTasks: updatedTasks }))
                            }
                            showNotification('Vazifa o\'chirildi', 'success')
                            fetch('/api/save-today-tasks', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                phone: userData.phone,
                                tasks: updatedTasks
                              })
                            }).catch(() => {})
                          } else if (action.trim() !== task.text) {
                            const updatedTasks = todayTasks.map(t => 
                              t.id === task.id ? { ...t, text: action.trim() } : t
                            )
                            setTodayTasks(updatedTasks)
                            if (setUserData) {
                              setUserData(prev => ({ ...prev, todayTasks: updatedTasks }))
                            }
                            showNotification('Vazifa muvaffaqiyatli o\'zgartirildi', 'success')
                            fetch('/api/save-today-tasks', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                phone: userData.phone,
                                tasks: updatedTasks
                              })
                            }).catch(() => {})
                          }
                        }
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid #00ff00',
                        color: '#00ff00',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#00ff00'
                        e.target.style.color = '#fff'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent'
                        e.target.style.color = '#00ff00'
                      }}
                    >
                      Ozgartirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Bugun vazifalar yo'q</p>
          )}
        </div>
      </div>
    </div>
  )
}
