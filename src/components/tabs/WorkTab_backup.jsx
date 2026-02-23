import { useState, useEffect } from 'react'
import { Briefcase, Lock, Unlock, Edit3, Save, X, Check, AlertCircle, Calendar, Target, Award, BarChart3, Bell, FileText } from 'lucide-react'

// Custom CSS for notification animation
const notificationStyles = `
  @keyframes slideIn {
    from {
      transform: translateY(-50%) translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateY(-50%) translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateY(-50%) translateX(0);
      opacity: 1;
    }
    to {
      transform: translateY(-50%) translateX(100%);
      opacity: 0;
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
    schedule: '',
    tasks: []
  })
  const [todayTasks, setTodayTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [editingWork, setEditingWork] = useState(false)
  const [tempWorkInfo, setTempWorkInfo] = useState({})
  const [showChangeCode, setShowChangeCode] = useState(false)
  const [oldCode, setOldCode] = useState('')
  const [newCode, setNewCode] = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Custom notification state
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (userData) {
      // Load saved work code
      if (userData.workCode) {
        setSavedCode(userData.workCode)
      }
      
      // Load work information
      if (userData.workInfo) {
        setWorkInfo(userData.workInfo)
      }
      
      // Load today's tasks
      if (userData.todayTasks) {
        setTodayTasks(userData.todayTasks)
      }
      
      // Har bir foydalanuvchi uchun avtomatik ochilish - kod so'ralmaydi
      setIsLocked(false)
    }
  }, [userData])

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (code.length < 4 || code.length > 6) {
      setError('Kod 4-6 raqamdan iborat bo\'lishi kerak')
      return
    }
    
    try {
      const response = await fetch('/api/set-work-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData.phone,
          code: code
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSavedCode(code)
        setCode('')
        setIsLocked(false)
        setSuccess('Kod muvaffaqiyatli o\'rnatildi!')
        setTimeout(() => setSuccess(''), 3000)
        
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

  const handleUnlock = async (e) => {
    e.preventDefault()
    setError('')
    
    if (code !== savedCode) {
      setError('Noto\'g\'ri kod')
      return
    }
    
    setIsLocked(false)
    setCode('')
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
        setSuccess('Ish ma\'lumotlari saqlandi!')
        setTimeout(() => setSuccess(''), 3000)
        
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

  // Custom notification functions
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() })
    setTimeout(() => setNotification(null), 1200) // 1.20 sekund
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
    
    // State ni darhol yangilaymiz
    setTodayTasks(updatedTasks)
    setNewTask('')
    
    // userData ni ham yangilaymiz
    if (setUserData) {
      setUserData(prev => ({ ...prev, todayTasks: updatedTasks }))
    }
    
    // Custom notification
    showNotification('Vazifa muvaffaqiyatli qo\'shildi!', 'success')
    
    // Keyin serverga saqlaymiz (notifikatsiyasiz)
    try {
      const response = await fetch('/api/save-today-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData.phone,
          tasks: updatedTasks
        })
      })
      
      const result = await response.json()
      
      if (!result.success) {
        // Agar serverda xatolik bo'lsa, holatni qaytarib olamiz
        setTodayTasks(todayTasks)
        if (setUserData) {
          setUserData(prev => ({ ...prev, todayTasks: todayTasks }))
        }
        showNotification('Server xatosi yuz berdi', 'error')
      }
    } catch (err) {
      // Agar tarmoq xatoligi bo'lsa, holatni qaytarib olamiz
      setTodayTasks(todayTasks)
      if (setUserData) {
        setUserData(prev => ({ ...prev, todayTasks: todayTasks }))
      }
      showNotification('Tarmoq xatosi', 'error')
    }
  }

  const toggleTask = async (taskId) => {
    // Avval holatni o'zgartiramiz
    const updatedTasks = todayTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    
    // State ni darhol yangilaymiz
    setTodayTasks(updatedTasks)
    
    // userData ni ham yangilaymiz
    if (setUserData) {
      setUserData(prev => ({ ...prev, todayTasks: updatedTasks }))
    }
    
    // Custom notification
    const task = todayTasks.find(t => t.id === taskId)
    if (task) {
      const message = task.completed ? 'Vazifa qayta tiklandi' : 'Vazifa bajarildi'
      showNotification(message, 'info')
    }
    
    // Keyin serverga saqlaymiz (notifikatsiyasiz)
    try {
      const response = await fetch('/api/save-today-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData.phone,
          tasks: updatedTasks
        })
      })
      
      const result = await response.json()
      
      if (!result.success) {
        // Agar serverda xatolik bo'lsa, holatni qaytarib olamiz
        setTodayTasks(todayTasks)
        if (setUserData) {
          setUserData(prev => ({ ...prev, todayTasks: todayTasks }))
        }
        showNotification('Server xatosi yuz berdi', 'error')
      }
    } catch (err) {
      // Agar tarmoq xatoligi bo'lsa, holatni qaytarib olamiz
      setTodayTasks(todayTasks)
      if (setUserData) {
        setUserData(prev => ({ ...prev, todayTasks: todayTasks }))
      }
      showNotification('Tarmoq xatosi', 'error')
    }
  }

  const deleteTask = async (taskId) => {
    // Avval vazifani o'chiramiz
    const updatedTasks = todayTasks.filter(task => task.id !== taskId)
    
    // State ni darhol yangilaymiz
    setTodayTasks(updatedTasks)
    
    // userData ni ham yangilaymiz
    if (setUserData) {
      setUserData(prev => ({ ...prev, todayTasks: updatedTasks }))
    }
    
    // Keyin serverga saqlaymiz (kod so'ramasdan)
    try {
      const response = await fetch('/api/save-today-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData.phone,
          tasks: updatedTasks
        })
      })
      
      const result = await response.json()
      
      if (!result.success) {
        // Agar serverda xatolik bo'lsa, vazifani qaytarib olamiz
        setTodayTasks(todayTasks)
        if (setUserData) {
          setUserData(prev => ({ ...prev, todayTasks: todayTasks }))
        }
      }
    } catch (err) {
      // Agar tarmoq xatoligi bo'lsa, vazifani qaytarib olamiz
      setTodayTasks(todayTasks)
      if (setUserData) {
        setUserData(prev => ({ ...prev, todayTasks: todayTasks }))
      }
    }
  }

  const handleChangeCode = async () => {
    setError('')
    
    if (oldCode !== savedCode) {
      setError('Eski kod noto\'g\'ri')
      return
    }
    
    if (newCode.length < 4 || newCode.length > 6) {
      setError('Yangi kod 4-6 raqamdan iborat bo\'lishi kerak')
      return
    }
    
    if (newCode !== confirmCode) {
      setError('Yangi kodlar mos kelmadi')
      return
    }
    
    try {
      const response = await fetch('/api/change-work-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData.phone,
          oldCode: oldCode,
          newCode: newCode
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSavedCode(newCode)
        setShowChangeCode(false)
        setOldCode('')
        setNewCode('')
        setConfirmCode('')
        setSuccess('Kod muvaffaqiyatli o\'zgartirildi!')
        setTimeout(() => setSuccess(''), 3000)
        
        if (setUserData) {
          setUserData(prev => ({ ...prev, workCode: newCode }))
        }
      } else {
        setError(result.message || 'Xatolik yuz berdi')
      }
    } catch (err) {
      setError('Server xatosi')
    }
  }

  if (isLocked) {
    return (
      <div className="card">
        <h2><Briefcase size={28} /> ISH TAB</h2>
        
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
        
        {savedCode ? (
          <div>
            <p style={{ marginBottom: '16px', color: '#00d4ff' }}>
              <Lock size={16} style={{ marginRight: '8px' }} />
              Ish tabga kirish uchun kodni kiriting
            </p>
            <form onSubmit={handleUnlock}>
              <input
                type="password"
                className="input"
                placeholder="4-6 raqamli kod"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
              />
              <button type="submit" className="btn">
                <Unlock size={20} style={{ marginRight: '8px' }} />
                KIRISH
              </button>
            </form>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '16px', color: '#00d4ff' }}>
              <Lock size={16} style={{ marginRight: '8px' }} />
              Ish tabni himoya qilish uchun kod o'rnating
            </p>
            <form onSubmit={handleCodeSubmit}>
              <input
                type="password"
                className="input"
                placeholder="4-6 raqamli kod"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
              />
              <button type="submit" className="btn">
                <Save size={20} style={{ marginRight: '8px' }} />
                KODNI O'RNATISH
              </button>
            </form>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2><Briefcase size={28} /> ISH TAB</h2>
        <button 
          className="btn-sec" 
          onClick={() => setShowChangeCode(true)}
          style={{ padding: '8px 16px', fontSize: '14px' }}
        >
          <Edit3 size={16} style={{ marginRight: '6px' }} />
          KOD O'ZGARTIRISH
        </button>
      </div>

      {/* Custom Notification Component */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          background: notification.type === 'success' ? '#10B981' : 
                     notification.type === 'error' ? '#EF4444' : '#3B82F6',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '15px',
          fontWeight: '600',
          minWidth: '300px',
          animation: 'slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${notification.type === 'success' ? '#059669' : 
                              notification.type === 'error' ? '#DC2626' : '#1E40AF'}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: notification.type === 'success' ? '#059669' : 
                           notification.type === 'error' ? '#DC2626' : '#1E40AF',
            flexShrink: 0
          }}>
            {notification.type === 'success' && <Check size={18} color="#fff" />}
            {notification.type === 'error' && <X size={18} color="#fff" />}
            {notification.type === 'info' && <Bell size={18} color="#fff" />}
          </div>
          <div style={{
            flex: 1,
            textAlign: 'left'
          }}>
            <div style={{ fontWeight: '700', marginBottom: '4px' }}>
              {notification.type === 'success' && 'Muvaffaqiyatli!'}
              {notification.type === 'error' && 'Xatolik!'}
              {notification.type === 'info' && 'Ma\'lumot'}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {notification.message}
            </div>
          </div>
        </div>
      )}

      {/* Ish ma'lumotlari */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
          <Target size={20} style={{ marginRight: '8px' }} />
          Ish ma'lumotlari
        </h3>
        
        {editingWork ? (
          <div>
            <input
              className="input"
              placeholder="Kompaniya"
              value={tempWorkInfo.company || ''}
              onChange={(e) => setTempWorkInfo(prev => ({ ...prev, company: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Lavozim"
              value={tempWorkInfo.position || ''}
              onChange={(e) => setTempWorkInfo(prev => ({ ...prev, position: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Ish grafigi"
              value={tempWorkInfo.schedule || ''}
              onChange={(e) => setTempWorkInfo(prev => ({ ...prev, schedule: e.target.value }))}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleSaveWorkInfo} className="btn">
                <Save size={20} style={{ marginRight: '8px' }} />
                SAQLASH
              </button>
              <button onClick={() => setEditingWork(false)} className="btn-sec">
                <X size={20} style={{ marginRight: '8px' }} />
                BEKOR QILISH
              </button>
            </div>
          </div>
        ) : (
          <div>
            {workInfo.company ? (
              <div>
                <div className="item">
                  <span><strong>Kompaniya:</strong> {workInfo.company}</span>
                </div>
                <div className="item">
                  <span><strong>Lavozim:</strong> {workInfo.position}</span>
                </div>
                <div className="item">
                  <span><strong>Ish grafigi:</strong> {workInfo.schedule}</span>
                </div>
                <button onClick={() => {
                  setEditingWork(true)
                  setTempWorkInfo(workInfo)
                }} className="btn-sec">
                  <Edit3 size={20} style={{ marginRight: '8px' }} />
                  TAHRIRLASH
                </button>
              </div>
            ) : (
              <div>
                <p style={{ color: '#888', marginBottom: '16px' }}>Ish ma'lumotlari kiritilmagan</p>
                <button onClick={() => {
                  setEditingWork(true)
                  setTempWorkInfo({})
                }} className="btn">
                  <Target size={20} style={{ marginRight: '8px' }} />
                  QO'SHISH
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bugungi vazifalar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#00d4ff', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
            <Calendar size={20} style={{ marginRight: '8px' }} />
            Bugungi vazifalar
          </h3>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="input"
                placeholder="Yangi vazifa..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                style={{ flex: 1, height: '50px', maxWidth: '600px', fontSize: '16px' }}
              />
              <button onClick={handleAddTask} className="btn" style={{ padding: '8px 16px', height: '40px' }}>
                <Check size={16} />
              </button>
            </div>
          </div>
        
          {todayTasks.length > 0 ? (
            <div style={{ width: '100%' }}>
              {todayTasks.map(task => (
                <div key={task.id} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px',
                  width: '100%'
                }}>
                  {/* X o'chirish tugmasi */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      const updatedTasks = todayTasks.map(t => 
                        t.id === task.id ? { ...t, completed: false } : t
                      )
                      setTodayTasks(updatedTasks)
                      if (setUserData) {
                        setUserData(prev => ({ ...prev, todayTasks: updatedTasks }))
                      }
                      showNotification('Vazifa qayta tiklandi', 'info')
                      fetch('/api/save-today-tasks', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          phone: userData.phone,
                          tasks: updatedTasks
                        })
                      }).catch(() => {})
                    }}
                    style={{
                      background: !task.completed ? '#ff4444' : 'transparent',
                      border: '1px solid #ff4444',
                      color: !task.completed ? '#fff' : '#ff4444',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      flexShrink: 0,
                      transition: 'all 0.3s ease',
                      marginRight: '6px',
                      minWidth: '25px',
                      height: '25px'
                    }}
                  >
                    X
                  </button>
                  
                  {/* Checkbox */}
                  <div 
                    onClick={() => toggleTask(task.id)}
                    style={{ 
                      width: '35px',
                      height: '35px',
                      border: `2px solid ${task.completed ? '#00ff00' : '#888'}`,
                      borderRadius: '6px',
                      backgroundColor: task.completed ? '#00ff00' : 'transparent',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    {task.completed && (
                      <span style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>?</span>
                    )}
                  </div>
                  
                  {/* Vazifa kartasi */}
                  <div style={{
                    flexGrow: 1,
                    backgroundColor: !task.completed ? '#ff4444' : '#0a0e27',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `2px solid ${!task.completed ? '#cc0000' : '#0f3460'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '35px',
                    opacity: !task.completed ? 0.9 : 1,
                    transition: 'all 0.3s ease'
                  }}>
                    <span style={{ 
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: '#fff',
                      fontSize: '14px'
                    }}>
                      {task.text}
                    </span>
                    
                    <button 
                      onClick={() => {
                        const newText = prompt('Vazifani o\'zgartiring:', task.text)
                        if (newText && newText.trim() !== task.text) {
                          const updatedTasks = todayTasks.map(t => 
                            t.id === task.id ? { ...t, text: newText.trim() } : t
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
            <p style={{ color: '#888' }}>Bugun vazifalar yo'q</p>
          )}
        </div>
        
        {/* Hujjat chirog'i - o'ng tomonda */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginLeft: '20px'
        }}>
          <FileText size={24} color="#00d4ff" />
          <span style={{ 
            color: '#00d4ff',
            marginLeft: '8px', 
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Hujjatlar
          </span>
        </div>
      </div>

      {/* Kod o'zgartirish modal */}
      {showChangeCode && (
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
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '90%' }}>
            <h3 style={{ marginBottom: '20px' }}>Kodni o'zgartirish</h3>
            
            <input
              className="input"
              type="password"
              placeholder="Eski kod"
              value={oldCode}
              onChange={(e) => setOldCode(e.target.value)}
              maxLength={6}
              style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '4px' }}
            />
            <input
              className="input"
              type="password"
              placeholder="Yangi kod"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              maxLength={6}
              style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '4px' }}
            />
            <input
              className="input"
              type="password"
              placeholder="Yangi kodni tasdiqlang"
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              maxLength={6}
              style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '4px' }}
            />
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={handleChangeCode} className="btn">
                <Save size={20} style={{ marginRight: '8px' }} />
                O'ZGARTIRISH
              </button>
              <button onClick={() => {
                setShowChangeCode(false)
                setOldCode('')
                setNewCode('')
                setConfirmCode('')
                setError('')
              }} className="btn-sec">
                <X size={20} style={{ marginRight: '8px' }} />
                BEKOR QILISH
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
