import { useState, useEffect } from 'react'
import { Home, Clock, Lock, CheckSquare, TrendingUp } from 'lucide-react'

export default function HouseworkTab({ userData, setUserData }) {
  const [isLocked, setIsLocked] = useState(true)
  const [code, setCode] = useState('')
  const [savedCode, setSavedCode] = useState('')
  const [dailyTasks, setDailyTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [todayReport, setTodayReport] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
    cleaning: '',
    laundry: '',
    shopping: '',
    other: ''
  })

  useEffect(() => {
    if (userData?.houseworkCode) {
      setSavedCode(userData.houseworkCode)
    }
    if (userData?.houseworkDaily) {
      const today = new Date().toISOString().split('T')[0]
      const todayData = userData.houseworkDaily[today]
      if (todayData) {
        setDailyTasks(todayData.tasks || [])
        setTodayReport(todayData.report || {
          breakfast: '',
          lunch: '',
          dinner: '',
          cleaning: '',
          laundry: '',
          shopping: '',
          other: ''
        })
      }
    }
  }, [userData])

  const saveToMongoDB = async (data) => {
    try {
      await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, ...data })
      })
    } catch (err) {
      console.error('Save error:', err)
    }
  }

  const handleCodeSubmit = () => {
    if (!savedCode) {
      if (code.length >= 4 && code.length <= 6) {
        setSavedCode(code)
        setIsLocked(false)
        const updatedData = { ...userData, houseworkCode: code }
        setUserData(updatedData)
        saveToMongoDB({ houseworkCode: code })
        setCode('')
      } else {
        alert('Kod 4-6 raqam bo\'lishi kerak!')
      }
    } else {
      if (code === savedCode) {
        setIsLocked(false)
        setCode('')
      } else {
        alert('Kod noto\'g\'ri!')
        setCode('')
      }
    }
  }

  const addTask = () => {
    if (!newTask.trim()) return
    const today = new Date().toISOString().split('T')[0]
    const newTasks = [...dailyTasks, { id: Date.now(), text: newTask, completed: false, status: null }] // status: null, 'done', 'not-done'
    setDailyTasks(newTasks)
    setNewTask('')
    const houseworkDaily = { ...userData.houseworkDaily, [today]: { tasks: newTasks, report: todayReport } }
    const updatedData = { ...userData, houseworkDaily }
    setUserData(updatedData)
    saveToMongoDB({ houseworkDaily })
  }

  const setTaskStatus = (taskId, status) => {
    const today = new Date().toISOString().split('T')[0]
    const updatedTasks = dailyTasks.map(task => task.id === taskId ? { ...task, status, completed: status === 'done' } : task)
    setDailyTasks(updatedTasks)
    const houseworkDaily = { ...userData.houseworkDaily, [today]: { tasks: updatedTasks, report: todayReport } }
    const updatedData = { ...userData, houseworkDaily }
    setUserData(updatedData)
    saveToMongoDB({ houseworkDaily })
  }

  const toggleTask = (taskId) => {
    const today = new Date().toISOString().split('T')[0]
    const updatedTasks = dailyTasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task)
    setDailyTasks(updatedTasks)
    const houseworkDaily = { ...userData.houseworkDaily, [today]: { tasks: updatedTasks, report: todayReport } }
    const updatedData = { ...userData, houseworkDaily }
    setUserData(updatedData)
    saveToMongoDB({ houseworkDaily })
  }

  const deleteTask = (taskId) => {
    const today = new Date().toISOString().split('T')[0]
    const updatedTasks = dailyTasks.filter(task => task.id !== taskId)
    setDailyTasks(updatedTasks)
    const houseworkDaily = { ...userData.houseworkDaily, [today]: { tasks: updatedTasks, report: todayReport } }
    const updatedData = { ...userData, houseworkDaily }
    setUserData(updatedData)
    saveToMongoDB({ houseworkDaily })
  }

  const updateReport = (field, value) => {
    const today = new Date().toISOString().split('T')[0]
    const updatedReport = { ...todayReport, [field]: value }
    setTodayReport(updatedReport)
    const houseworkDaily = { ...userData.houseworkDaily, [today]: { tasks: dailyTasks, report: updatedReport } }
    const updatedData = { ...userData, houseworkDaily }
    setUserData(updatedData)
    saveToMongoDB({ houseworkDaily })
  }

  if (isLocked) {
    return (
      <div className="card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Home size={28} />
          UY ISHLARI
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', padding: '40px' }}>
          <Lock size={80} style={{ color: '#00d4ff', marginBottom: '20px' }} />
          <h3 style={{ color: '#00d4ff', marginBottom: '16px' }}>{savedCode ? 'Kodni kiriting' : 'Kod o\'rnating'}</h3>
          <p style={{ color: '#aaa', marginBottom: '24px', textAlign: 'center' }}>{savedCode ? 'Uy ishlari bo\'limiga kirish uchun kodni kiriting' : 'Uy ishlari bo\'limini himoya qilish uchun 4-6 raqamli kod o\'rnating'}</p>
          <input type="password" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Kod (4-6 raqam)" style={{ width: '200px', padding: '16px', background: '#0a0e27', border: '2px solid #00d4ff', borderRadius: '8px', color: '#fff', fontSize: '24px', textAlign: 'center', letterSpacing: '8px', marginBottom: '16px' }} onKeyDown={(e) => { if (e.key === 'Enter') handleCodeSubmit() }} />
          <button onClick={handleCodeSubmit} style={{ padding: '14px 32px', background: '#00d4ff', color: '#0a0e27', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>{savedCode ? 'KIRISH' : 'O\'RNATISH'}</button>
        </div>
      </div>
    )
  }

  const completedTasks = dailyTasks.filter(t => t.completed).length
  const totalTasks = dailyTasks.length

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Home size={28} />
          UY ISHLARI
        </h2>
        <button onClick={() => setIsLocked(true)} style={{ padding: '8px 16px', background: '#ff0055', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={14} />
          YOPISH
        </button>
      </div>

      <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '20px', border: '2px solid #00d4ff' }}>
        <h3 style={{ color: '#00d4ff', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckSquare size={20} />
          BUGUNGI VAZIFALAR ({completedTasks}/{totalTasks})
        </h3>
        {totalTasks > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ background: '#16213e', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${(completedTasks / totalTasks) * 100}%`, height: '100%', background: '#00ff88', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        )}
        {dailyTasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {dailyTasks.map(task => {
              const getBorderColor = () => {
                if (task.status === 'done') return '#00ff88'
                if (task.status === 'not-done') return '#ff0055'
                return '#0f3460'
              }
              
              const getBackgroundColor = () => {
                if (task.status === 'done') return 'rgba(0, 255, 136, 0.1)'
                if (task.status === 'not-done') return 'rgba(255, 0, 85, 0.1)'
                return '#16213e'
              }

              return (
                <div key={task.id} style={{ 
                  background: getBackgroundColor(), 
                  border: `2px solid ${getBorderColor()}`, 
                  borderRadius: '8px', 
                  padding: '16px',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ 
                      color: task.status === 'done' ? '#00ff88' : task.status === 'not-done' ? '#ff0055' : '#fff',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}>
                      {task.text}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => setTaskStatus(task.id, 'done')}
                      style={{ 
                        flex: 1,
                        minWidth: '120px',
                        padding: '10px 16px', 
                        background: task.status === 'done' ? '#00ff88' : '#16213e',
                        color: task.status === 'done' ? '#0a0e27' : '#00ff88',
                        border: `2px solid #00ff88`,
                        borderRadius: '6px', 
                        cursor: 'pointer', 
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      ✅ QILINDI
                    </button>
                    <button 
                      onClick={() => setTaskStatus(task.id, 'not-done')}
                      style={{ 
                        flex: 1,
                        minWidth: '120px',
                        padding: '10px 16px', 
                        background: task.status === 'not-done' ? '#ff0055' : '#16213e',
                        color: task.status === 'not-done' ? '#fff' : '#ff0055',
                        border: `2px solid #ff0055`,
                        borderRadius: '6px', 
                        cursor: 'pointer', 
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      ❌ QILINMADI
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)} 
                      style={{ 
                        padding: '10px 16px', 
                        background: '#0a0e27', 
                        color: '#aaa', 
                        border: '2px solid #0f3460', 
                        borderRadius: '6px', 
                        cursor: 'pointer', 
                        fontSize: '14px' 
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '20px' }}>Bugun uchun vazifalar yo'q</p>
        )}
        <div style={{ background: '#16213e', padding: '16px', borderRadius: '8px', border: '2px solid #0f3460' }}>
          <p style={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '12px' }}>YANGI VAZIFA QO'SHISH</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Vazifa nomini kiriting..." style={{ flex: 1, padding: '12px', background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', color: '#fff', fontSize: '14px' }} onKeyDown={(e) => { if (e.key === 'Enter') addTask() }} />
            <button onClick={addTask} style={{ padding: '12px 20px', background: '#00ff88', color: '#0a0e27', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>QO'SHISH</button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '20px', border: '2px solid #ffaa00' }}>
        <h3 style={{ color: '#ffaa00', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} />
          BUGUNGI HISOBOT
        </h3>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>🍳 Nonushta nima pishirdingiz?</label>
          <textarea value={todayReport.breakfast} onChange={(e) => updateReport('breakfast', e.target.value)} placeholder="Masalan: Tuxum, non, choy..." style={{ width: '100%', padding: '12px', background: '#16213e', border: '2px solid #0f3460', borderRadius: '8px', color: '#fff', fontSize: '14px', minHeight: '60px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>🍲 Tushlik nima pishirdingiz?</label>
          <textarea value={todayReport.lunch} onChange={(e) => updateReport('lunch', e.target.value)} placeholder="Masalan: Osh, salat, kompot..." style={{ width: '100%', padding: '12px', background: '#16213e', border: '2px solid #0f3460', borderRadius: '8px', color: '#fff', fontSize: '14px', minHeight: '60px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>🍽️ Kechki ovqat nima pishirdingiz?</label>
          <textarea value={todayReport.dinner} onChange={(e) => updateReport('dinner', e.target.value)} placeholder="Masalan: Sho'rva, non, choy..." style={{ width: '100%', padding: '12px', background: '#16213e', border: '2px solid #0f3460', borderRadius: '8px', color: '#fff', fontSize: '14px', minHeight: '60px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>🧹 Qayerlarni tozaladingiz?</label>
          <textarea value={todayReport.cleaning} onChange={(e) => updateReport('cleaning', e.target.value)} placeholder="Masalan: Oshxona, yotoqxona, hammom..." style={{ width: '100%', padding: '12px', background: '#16213e', border: '2px solid #0f3460', borderRadius: '8px', color: '#fff', fontSize: '14px', minHeight: '60px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>👕 Kir yuvdingizmi?</label>
          <textarea value={todayReport.laundry} onChange={(e) => updateReport('laundry', e.target.value)} placeholder="Masalan: Oilaviy kiyimlar, ko'rpa-to'shaklar..." style={{ width: '100%', padding: '12px', background: '#16213e', border: '2px solid #0f3460', borderRadius: '8px', color: '#fff', fontSize: '14px', minHeight: '60px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>🛒 Xarid qildingizmi?</label>
          <textarea value={todayReport.shopping} onChange={(e) => updateReport('shopping', e.target.value)} placeholder="Masalan: Sabzavot, meva, go'sht..." style={{ width: '100%', padding: '12px', background: '#16213e', border: '2px solid #0f3460', borderRadius: '8px', color: '#fff', fontSize: '14px', minHeight: '60px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>📝 Boshqa ishlar:</label>
          <textarea value={todayReport.other} onChange={(e) => updateReport('other', e.target.value)} placeholder="Yana qanday ishlar qildingiz?" style={{ width: '100%', padding: '12px', background: '#16213e', border: '2px solid #0f3460', borderRadius: '8px', color: '#fff', fontSize: '14px', minHeight: '60px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
      </div>
    </div>
  )
}
