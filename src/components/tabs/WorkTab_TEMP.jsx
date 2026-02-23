import { useState, useEffect } from 'react'

export default function DailyScheduleTab({ userData, setUserData }) {
  const [schedule, setSchedule] = useState([])
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [newTime, setNewTime] = useState('')
  const [newTask, setNewTask] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [editTime, setEditTime] = useState('')
  const [editTaskText, setEditTaskText] = useState('')
  const [expandedDates, setExpandedDates] = useState([])

  useEffect(() => {
    if (userData?.dailySchedule) {
      setSchedule(userData.dailySchedule)
    }
    if (userData?.scheduleHistory) {
      setHistory(userData.scheduleHistory)
    }
    
    // Check if we need to save yesterday's schedule to history
    checkAndSaveYesterday()
  }, [userData])

  const checkAndSaveYesterday = async () => {
    if (!userData?.phone) return
    
    const today = new Date().toISOString().split('T')[0]
    const schedule = userData?.dailySchedule || []
    const history = userData?.scheduleHistory || []
    
    // Check if schedule has tasks and if they have a date
    if (schedule.length === 0) return
    
    const scheduleDate = schedule[0]?.date
    if (!scheduleDate) return
    
    // If schedule date is not today, save it to history
    if (scheduleDate !== today) {
      // Check if this date already exists in history
      const existsInHistory = history.some(h => h.date === scheduleDate)
      if (existsInHistory) return
      
      // Save to history
      const historyItem = {
        date: scheduleDate,
        schedule: [...schedule]
      }
      
      const updatedHistory = [historyItem, ...history]
      
      // Reset schedule for new day
      const newSchedule = schedule.map(item => ({ 
        ...item, 
        completed: null,
        date: today 
      }))
      
      try {
        await fetch('/api/save-schedule-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: userData.phone,
            scheduleHistory: updatedHistory,
            dailySchedule: newSchedule
          })
        })
        setHistory(updatedHistory)
        setSchedule(newSchedule)
        setUserData({ ...userData, scheduleHistory: updatedHistory, dailySchedule: newSchedule })
      } catch (err) {
        console.error('Error auto-saving history:', err)
      }
    }
  }

  const handleAddTask = async () => {
    if (!newTime || !newTask.trim()) {
      alert('Vaqt va vazifani kiriting!')
      return
    }

    const newItem = {
      id: Date.now(),
      time: newTime,
      task: newTask,
      completed: null,
      date: new Date().toISOString().split('T')[0]
    }

    const updatedSchedule = [...schedule, newItem].sort((a, b) => a.time.localeCompare(b.time))
    setSchedule(updatedSchedule)

    try {
      await fetch('/api/save-daily-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          dailySchedule: updatedSchedule
        })
      })
      setUserData({ ...userData, dailySchedule: updatedSchedule })
      setNewTime('')
      setNewTask('')
    } catch (err) {
      console.error('Error saving schedule:', err)
    }
  }

  const handleToggleTask = async (taskId, status) => {
    const updatedSchedule = schedule.map(item =>
      item.id === taskId ? { ...item, completed: status } : item
    )
    setSchedule(updatedSchedule)

    try {
      await fetch('/api/save-daily-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          dailySchedule: updatedSchedule
        })
      })
      setUserData({ ...userData, dailySchedule: updatedSchedule })
    } catch (err) {
      console.error('Error updating schedule:', err)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Vazifani o\'chirishni tasdiqlaysizmi?')) return

    const updatedSchedule = schedule.filter(item => item.id !== taskId)
    setSchedule(updatedSchedule)

    try {
      await fetch('/api/save-daily-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          dailySchedule: updatedSchedule
        })
      })
      setUserData({ ...userData, dailySchedule: updatedSchedule })
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task.id)
    setEditTime(task.time)
    setEditTaskText(task.task)
  }

  const handleSaveEdit = async () => {
    if (!editTime || !editTaskText.trim()) {
      alert('Vaqt va vazifani kiriting!')
      return
    }

    const updatedSchedule = schedule.map(item =>
      item.id === editingTask
        ? { ...item, time: editTime, task: editTaskText }
        : item
    ).sort((a, b) => a.time.localeCompare(b.time))

    setSchedule(updatedSchedule)
    setEditingTask(null)
    setEditTime('')
    setEditTaskText('')

    try {
      await fetch('/api/save-daily-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          dailySchedule: updatedSchedule
        })
      })
      setUserData({ ...userData, dailySchedule: updatedSchedule })
    } catch (err) {
      console.error('Error updating task:', err)
    }
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
    setEditTime('')
    setEditTaskText('')
  }

  const handleSaveToHistory = async () => {
    if (schedule.length === 0) {
      alert('Tartib bo\'sh!')
      return
    }

    const today = new Date().toISOString().split('T')[0]
    
    const existsInHistory = history.some(h => h.date === today)
    if (existsInHistory) {
      alert('Bugungi kun allaqachon jildga saqlangan!')
      return
    }
    
    const historyItem = {
      date: today,
      schedule: [...schedule]
    }

    const updatedHistory = [historyItem, ...history]
    setHistory(updatedHistory)

    try {
      await fetch('/api/save-schedule-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          scheduleHistory: updatedHistory,
          dailySchedule: schedule
        })
      })
      setUserData({ ...userData, scheduleHistory: updatedHistory })
      alert('Kunlik tartib jildga saqlandi!')
    } catch (err) {
      console.error('Error saving history:', err)
    }
  }

  const toggleDate = (date) => {
    if (expandedDates.includes(date)) {
      setExpandedDates(expandedDates.filter(d => d !== date))
    } else {
      setExpandedDates([...expandedDates, date])
    }
  }

  const formatDateUzbek = (dateStr) => {
    const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
    const date = new Date(dateStr)
    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${dayName}, ${day} ${month} ${year}`
  }

  const getTodayDate = () => {
    const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
    const today = new Date()
    const dayName = days[today.getDay()]
    const day = today.getDate()
    const month = months[today.getMonth()]
    const year = today.getFullYear()
    return `${dayName}, ${day} ${month} ${year}`
  }

  if (showHistory) {
    return (
      <div className="card">
        <h2>AVVALGI KUNLAR</h2>
        
        <button
          onClick={() => setShowHistory(false)}
          style={{
            width: '100%',
            padding: '12px',
            background: '#00d4ff',
            color: '#0a0e27',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          BUGUNGI KUNGA QAYTISH
        </button>

        {history.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center' }}>Avvalgi kunlar yo'q</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {history.map((item) => {
              const isExpanded = expandedDates.includes(item.date)
              const completedCount = item.schedule.filter(t => t.completed === true).length
              const totalCount = item.schedule.length
              
              return (
                <div key={item.date} style={{ background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '12px', overflow: 'hidden' }}>
                  <div 
                    onClick={() => toggleDate(item.date)}
                    style={{ 
                      padding: '16px',
                      cursor: 'pointer',
                      background: '#0f3460',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <h3 style={{ color: '#00d4ff', margin: 0, fontSize: '16px' }}>
                        {formatDateUzbek(item.date)}
                      </h3>
                      <p style={{ color: '#aaa', margin: '4px 0 0 0', fontSize: '12px' }}>
                        {completedCount}/{totalCount} vazifa bajarildi
                      </p>
                    </div>
                    <span style={{ color: '#00d4ff', fontSize: '20px' }}>
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </div>
                  
                  {isExpanded && (
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {item.schedule.map((task, idx) => (
                        <div key={idx}>
                          <div style={{ textAlign: 'center', color: '#555', fontSize: '12px', margin: '4px 0' }}>
                            --|--
                          </div>
                          <div style={{ 
                            background: task.completed === true ? '#001a0a' : 
                                        task.completed === false ? '#1a0000' : 
                                        '#16213e',
                            padding: '12px', 
                            borderRadius: '8px',
                            border: `2px solid ${
                              task.completed === true ? '#00ff88' : 
                              task.completed === false ? '#ff0055' : 
                              '#0f3460'
                            }`
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <span style={{ 
                                  color: task.completed === true ? '#00ff88' : 
                                         task.completed === false ? '#ff0055' : 
                                         '#00d4ff',
                                  fontWeight: 'bold', 
                                  marginRight: '12px',
                                  textDecoration: task.completed === true ? 'line-through' : 'none'
                                }}>
                                  {task.time}
                                </span>
                                <span style={{ 
                                  color: task.completed === true ? '#00ff88' : 
                                         task.completed === false ? '#ff0055' : 
                                         '#aaa',
                                  textDecoration: task.completed === true ? 'line-through' : 'none',
                                  fontWeight: task.completed === false ? 'bold' : 'normal'
                                }}>
                                  {task.task}
                                </span>
                              </div>
                              <span style={{ fontSize: '20px' }}>
                                {task.completed === true ? '✓' : task.completed === false ? '✗' : '○'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div style={{ textAlign: 'center', color: '#555', fontSize: '12px', margin: '4px 0' }}>
                        --|--
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="card">
      <h2>KUNLIK TARTIB</h2>
      
      <div style={{ 
        background: '#0f3460', 
        padding: '12px', 
        borderRadius: '8px', 
        marginBottom: '16px',
        textAlign: 'center',
        border: '2px solid #00d4ff'
      }}>
        <p style={{ margin: 0, color: '#00d4ff', fontWeight: 'bold', fontSize: '16px' }}>
          {getTodayDate()}
        </p>
      </div>

      <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #0f3460', minHeight: '300px', maxHeight: '400px', overflowY: 'auto' }}>
        {schedule.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', marginTop: '50px' }}>
            Tartib bo'sh
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {schedule.map((item) => (
              <div key={item.id}>
                <div style={{ textAlign: 'center', color: '#555', fontSize: '12px', margin: '4px 0' }}>
                  --|--
                </div>
                <div style={{ 
                  background: item.completed === true ? '#001a0a' : 
                              item.completed === false ? '#1a0000' : 
                              '#16213e',
                  padding: '12px', 
                  borderRadius: '8px',
                  border: `2px solid ${
                    item.completed === true ? '#00ff88' : 
                    item.completed === false ? '#ff0055' : 
                    '#0f3460'
                  }`
                }}>
                  {editingTask === item.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="input"
                        style={{ marginBottom: '8px' }}
                      />
                      <input
                        type="text"
                        value={editTaskText}
                        onChange={(e) => setEditTaskText(e.target.value)}
                        className="input"
                        style={{ marginBottom: '8px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={handleSaveEdit}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: '#00ff88',
                            color: '#0a0e27',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}
                        >
                          SAQLASH
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: '#555',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}
                        >
                          BEKOR
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ 
                          color: item.completed === true ? '#00ff88' : 
                                 item.completed === false ? '#ff0055' : 
                                 '#00d4ff',
                          fontWeight: 'bold', 
                          marginRight: '12px',
                          textDecoration: item.completed === true ? 'line-through' : 'none'
                        }}>
                          {item.time}
                        </span>
                        <span style={{ 
                          color: item.completed === true ? '#00ff88' : 
                                 item.completed === false ? '#ff0055' : 
                                 '#aaa',
                          textDecoration: item.completed === true ? 'line-through' : 'none',
                          fontWeight: item.completed === false ? 'bold' : 'normal'
                        }}>
                          {item.task}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleToggleTask(item.id, true)}
                          style={{
                            padding: '8px 12px',
                            background: item.completed === true ? '#00ff88' : '#16213e',
                            color: item.completed === true ? '#0a0e27' : '#00ff88',
                            border: `2px solid #00ff88`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}
                        >
                          BAJARILDI
                        </button>
                        <button
                          onClick={() => handleToggleTask(item.id, false)}
                          style={{
                            padding: '8px 12px',
                            background: item.completed === false ? '#ff0055' : '#16213e',
                            color: item.completed === false ? '#fff' : '#ff0055',
                            border: `2px solid #ff0055`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}
                        >
                          BAJARILMADI
                        </button>
                        <button
                          onClick={() => handleEditTask(item)}
                          style={{
                            padding: '8px 12px',
                            background: '#00d4ff',
                            color: '#0a0e27',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDeleteTask(item.id)}
                          style={{
                            padding: '8px 12px',
                            background: '#555',
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
                  )}
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', color: '#555', fontSize: '12px', margin: '4px 0' }}>
              --|--
            </div>
          </div>
        )}
      </div>

      <div style={{ background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #0f3460', marginBottom: '12px' }}>
        <h3 style={{ color: '#00d4ff', marginTop: 0, marginBottom: '16px' }}>YANGI VAZIFA</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="input"
          />
          <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Yangi vazifa..."
              style={{ 
                flex: 1, 
                padding: '14px 16px',
                background: '#16213e',
                border: '2px solid #0f3460',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '15px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
              onBlur={(e) => e.target.style.borderColor = '#0f3460'}
            />
            <button
              onClick={handleAddTask}
              style={{
                padding: '14px 24px',
                background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)'
              }}
            >
              ✓ QO'SHISH
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleSaveToHistory}
          style={{
            flex: 1,
            padding: '12px',
            background: '#00d4ff',
            color: '#0a0e27',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          BUGUNNI JILDGA SAQLASH
        </button>
        <button
          onClick={() => setShowHistory(true)}
          style={{
            flex: 1,
            padding: '12px',
            background: '#ffaa00',
            color: '#0a0e27',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          AVVALGI KUNLAR
        </button>
      </div>
    </div>
  )
}
