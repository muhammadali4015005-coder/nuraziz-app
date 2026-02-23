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
      // By default require code when opening the ISH tab.
      // To auto-unlock for specific users, set `userData.settings.autoOpenWork`.
    }
  }, [userData])

  const handleCodeSubmit = async (e) => {
    e?.preventDefault()
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
    e?.preventDefault()
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

  const toggleTask = async (taskId, forceStatus) => {
    // Avval holatni o'zgartiramiz (forceStatus bool bo'lsa o'sha qiymatga o'rnatamiz)
    const updatedTasks = todayTasks.map(task =>
      task.id === taskId ? { ...task, completed: typeof forceStatus === 'boolean' ? forceStatus : !task.completed } : task
    )

    // State ni darhol yangilaymiz
    setTodayTasks(updatedTasks)

    // userData ni ham yangilaymiz
    if (setUserData) {
      setUserData(prev => ({ ...prev, todayTasks: updatedTasks }))
    }

    // Custom notification - asosiy yangi holatga qarab matn
    const updated = updatedTasks.find(t => t.id === taskId)
    if (updated) {
      const message = updated.completed ? 'Vazifa bajarildi' : 'Vazifa bajarilmadi'
      showNotification(message, updated.completed ? 'success' : 'error')
    }

    // Keyin serverga saqlaymiz
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
        showNotification('Server xatosi yuz berdi', 'error')
      }
    } catch (err) {
      // Agar tarmoq xatoligi bo'lsa, vazifani qaytarib olamiz
      setTodayTasks(todayTasks)
      if (setUserData) {
        setUserData(prev => ({ ...prev, todayTasks: todayTasks }))
      }
      showNotification('Tarmoq xatosi', 'error')
    }
  }

  // Simple UI - keep inline styles consistent with rest of app
  return (
    <div className="card" style={{ padding: '28px', borderRadius: '12px', background: 'linear-gradient(180deg,#071026 0%, #08112a 100%)' }}>
      <style>{notificationStyles}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <h2 style={{ color: '#00d4ff', fontSize: '22px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Briefcase size={22} /> ISH
        </h2>
        <button
          onClick={() => setIsLocked(true)}
          style={{
            padding: '10px 16px',
            background: 'linear-gradient(90deg,#ff6b9a,#ff0055)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '13px',
            boxShadow: '0 6px 18px rgba(255,0,85,0.12)'
          }}
        >
          🔒 YOPISH
        </button>
      </div>

      {isLocked ? (
        <div style={{ textAlign: 'center', padding: '36px', background: 'rgba(4,8,20,0.4)', borderRadius: '10px', border: '1px solid rgba(0,212,255,0.06)' }}>
          <div style={{ fontSize: '56px', marginBottom: '10px' }}>🔒</div>
          <h3 style={{ color: '#00d4ff', margin: 0 }}>{savedCode ? 'Kodni kiriting' : 'Kod o\'rnating'}</h3>
          <p style={{ color: '#9fb6c9', marginBottom: '18px' }}>{savedCode ? 'ISH bo\'limiga kirish uchun kodni kiriting' : 'Ish bo\'limini himoya qilish uchun kod o\'rnating'}</p>
          <form onSubmit={savedCode ? handleUnlock : handleCodeSubmit} style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Kod (4-6 raqam)"
              style={{ padding: '12px 14px', fontSize: '16px', width: '220px', borderRadius: '12px', background: '#061022', color: '#e6f7ff', border: '1px solid rgba(0,212,255,0.14)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }}
            />
            <button type="submit" style={{ padding: '12px 18px', background: 'linear-gradient(90deg,#00e1ff,#00b8ff)', color: '#04102a', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>{savedCode ? 'KIRISH' : 'O\'RNATISH'}</button>
          </form>
          {error && <p style={{ color: '#ff7b8a', marginTop: '12px' }}>{error}</p>}
          {success && <p style={{ color: '#9effc8', marginTop: '12px' }}>{success}</p>}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '16px', background: 'linear-gradient(180deg,#07112a,#071428)', borderRadius: '10px', padding: '14px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }}>
            <h3 style={{ color: '#00d4ff', marginTop: 0 }}>Ish ma'lumotlari</h3>
            {!editingWork ? (
              <div>
                <p style={{ color: '#fff', margin: 0 }}><strong>Korxona:</strong> {workInfo.company || '—'}</p>
                <p style={{ color: '#fff', margin: 0 }}><strong>Lavozim:</strong> {workInfo.position || '—'}</p>
                <p style={{ color: '#fff', margin: 0 }}><strong>Ish vaqti:</strong> {workInfo.schedule || '—'}</p>
                <div style={{ marginTop: '8px' }}>
                  <button onClick={() => { setEditingWork(true); setTempWorkInfo(workInfo) }} style={{ padding: '8px 12px', background: '#00d4ff', color: '#0a0e27', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '8px' }}>✏️ Tahrirlash</button>
                </div>
              </div>
            ) : (
              <div>
                <input value={tempWorkInfo.company || ''} onChange={(e) => setTempWorkInfo(prev => ({ ...prev, company: e.target.value }))} placeholder="Korxona" style={{ width: '100%', padding: '10px', marginBottom: '8px', borderRadius: '6px', background: '#081029', color: '#fff', border: '2px solid #0f3460' }} />
                <input value={tempWorkInfo.position || ''} onChange={(e) => setTempWorkInfo(prev => ({ ...prev, position: e.target.value }))} placeholder="Lavozim" style={{ width: '100%', padding: '10px', marginBottom: '8px', borderRadius: '6px', background: '#081029', color: '#fff', border: '2px solid #0f3460' }} />
                <input value={tempWorkInfo.schedule || ''} onChange={(e) => setTempWorkInfo(prev => ({ ...prev, schedule: e.target.value }))} placeholder="08:00 - 17:00" style={{ width: '100%', padding: '10px', marginBottom: '8px', borderRadius: '6px', background: '#081029', color: '#fff', border: '2px solid #0f3460' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleSaveWorkInfo} style={{ padding: '8px 12px', background: '#00ff88', color: '#0a0e27', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Saqlash</button>
                  <button onClick={() => setEditingWork(false)} style={{ padding: '8px 12px', background: '#ff0055', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Bekor</button>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px', background: 'linear-gradient(180deg,#08132a,#071025)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(0,212,255,0.14)' }}>
            <h3 style={{ color: '#00d4ff', marginTop: 0 }}>Bugungi vazifalar</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Yangi vazifa..." style={{ flex: 1, padding: '10px', borderRadius: '6px', background: '#081029', color: '#fff', border: '2px solid #0f3460' }} />
              <button onClick={handleAddTask} style={{ padding: '10px 12px', background: '#00d4ff', color: '#0a0e27', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Qo'shish</button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {todayTasks.map(task => (
                <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: task.completed ? 'linear-gradient(90deg, rgba(0,255,136,0.03), rgba(0,255,136,0.01))' : 'linear-gradient(90deg, rgba(255,59,106,0.03), rgba(255,59,106,0.01))', borderRadius: '8px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div>
                    <div style={{ color: task.completed ? '#888' : '#fff', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</div>
                    <div style={{ color: '#aaa', fontSize: '12px' }}>{new Date(task.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => toggleTask(task.id, true)} style={{ padding: '6px 8px', background: task.completed ? '#00d67a' : '#153e2f', color: '#04102a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }} title="Qilindi">✓</button>
                    <button onClick={() => toggleTask(task.id, false)} style={{ padding: '6px 8px', background: !task.completed ? '#ff4b7a' : '#3a1820', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }} title="Qilinmadi">✗</button>
                    <button onClick={() => deleteTask(task.id)} style={{ padding: '6px 8px', background: '#ff0055', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginLeft: '4px' }} title="O'chirish">🗑</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {/* Floating notification */}
      {notification && (
        <div style={{ position: 'fixed', right: '22px', top: '82px', background: notification.type === 'success' ? '#00ff88' : '#ff6b85', color: '#04102a', padding: '12px 16px', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', animation: 'slideIn 260ms ease-out' }}>
          {notification.message}
        </div>
      )}
    </div>
  )
}


