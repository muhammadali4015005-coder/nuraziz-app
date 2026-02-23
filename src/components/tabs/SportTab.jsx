import { useState, useEffect } from 'react'
import { NotificationManager } from '../Notification'

export default function SportTab({ userData, setUserData }) {
  const [goal, setGoal] = useState('')
  const [morningGoal, setMorningGoal] = useState('')
  const [eveningGoal, setEveningGoal] = useState('')
  const [currentLevel, setCurrentLevel] = useState('')
  const [morningExercises, setMorningExercises] = useState([])
  const [eveningExercises, setEveningExercises] = useState([])
  const [newTime, setNewTime] = useState('')
  const [newExercise, setNewExercise] = useState('')
  const [newDuration, setNewDuration] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('morning')
  const [timeOfDaySelected, setTimeOfDaySelected] = useState(false)
  const [sportType, setSportType] = useState('')
  const [weeklySchedule, setWeeklySchedule] = useState({
    Monday: { morning: '', evening: '' },
    Tuesday: { morning: '', evening: '' },
    Wednesday: { morning: '', evening: '' },
    Thursday: { morning: '', evening: '' },
    Friday: { morning: '', evening: '' },
    Saturday: { morning: '', evening: '' },
    Sunday: { morning: '', evening: '' }
  })
  const [editingSchedule, setEditingSchedule] = useState(false)

  useEffect(() => {
    if (userData?.sportGoal) setGoal(userData.sportGoal)
    if (userData?.currentLevel) setCurrentLevel(userData.currentLevel)
    if (userData?.morningExercises) setMorningExercises(userData.morningExercises)
    if (userData?.eveningExercises) setEveningExercises(userData.eveningExercises)
    if (userData?.weeklySchedule) setWeeklySchedule(userData.weeklySchedule)
    if (userData?.sportType) setSportType(userData.sportType)
  }, [userData])

  const handleSaveGoal = async () => {
    if (!goal.trim()) {
      NotificationManager.warning('XATO', 'Maqsadni kiriting!', 3000)
      return
    }
    if (!currentLevel.trim()) {
      NotificationManager.warning('XATO', 'Hozirgi darajangizni kiriting!', 3000)
      return
    }

    try {
      await fetch('/api/save-sport-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          sportGoal: goal,
          currentLevel: currentLevel
        })
      })
      setUserData({ ...userData, sportGoal: goal, currentLevel: currentLevel })
      NotificationManager.success('✓', 'Sport maqsadi saqlandi', 1500)
    } catch (err) {
      console.error('Error saving goal:', err)
      NotificationManager.error('XATO', 'Maqsad saqlanishda xato', 3000)
    }
  }

  const handleAddExercise = async () => {
    if (!newTime || !newExercise.trim() || !newDuration) {
      NotificationManager.warning('XATO', 'Barcha maydonlarni to\'ldiring!', 3000)
      return
    }

    const newItem = {
      id: Date.now(),
      time: newTime,
      exercise: newExercise,
      duration: newDuration,
      completed: false
    }

    if (selectedPeriod === 'morning') {
      const updated = [...morningExercises, newItem].sort((a, b) => a.time.localeCompare(b.time))
      setMorningExercises(updated)
      
      try {
        await fetch('/api/save-morning-exercises', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: userData?.phone,
            morningExercises: updated
          })
        })
        setUserData({ ...userData, morningExercises: updated })
        NotificationManager.success('✓', 'Mashq qo\'shildi', 1500)
      } catch (err) {
        console.error('Error:', err)
        NotificationManager.error('XATO', 'Mashq qo\'shishda xato', 3000)
      }
    } else {
      const updated = [...eveningExercises, newItem].sort((a, b) => a.time.localeCompare(b.time))
      setEveningExercises(updated)
      
      try {
        await fetch('/api/save-evening-exercises', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: userData?.phone,
            eveningExercises: updated
          })
        })
        setUserData({ ...userData, eveningExercises: updated })
        NotificationManager.success('✓', 'Mashq qo\'shildi', 1500)
      } catch (err) {
        console.error('Error:', err)
        NotificationManager.error('XATO', 'Mashq qo\'shishda xato', 3000)
      }
    }

    setNewTime('')
    setNewExercise('')
    setNewDuration('')
  }

  const handleToggleExercise = async (id, period) => {
    if (period === 'morning') {
      const updated = morningExercises.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
      setMorningExercises(updated)
      
      try {
        await fetch('/api/save-morning-exercises', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: userData?.phone,
            morningExercises: updated
          })
        })
        setUserData({ ...userData, morningExercises: updated })
      } catch (err) {
        console.error('Error:', err)
      }
    } else {
      const updated = eveningExercises.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
      setEveningExercises(updated)
      
      try {
        await fetch('/api/save-evening-exercises', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: userData?.phone,
            eveningExercises: updated
          })
        })
        setUserData({ ...userData, eveningExercises: updated })
      } catch (err) {
        console.error('Error:', err)
      }
    }
  }

  const handleDeleteExercise = async (id, period) => {
    if (!window.confirm('Mashqni o\'chirishni tasdiqlaysizmi?')) return

    if (period === 'morning') {
      const updated = morningExercises.filter(item => item.id !== id)
      setMorningExercises(updated)
      
      try {
        await fetch('/api/save-morning-exercises', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: userData?.phone,
            morningExercises: updated
          })
        })
        setUserData({ ...userData, morningExercises: updated })
      } catch (err) {
        console.error('Error:', err)
      }
    } else {
      const updated = eveningExercises.filter(item => item.id !== id)
      setEveningExercises(updated)
      
      try {
        await fetch('/api/save-evening-exercises', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: userData?.phone,
            eveningExercises: updated
          })
        })
        setUserData({ ...userData, eveningExercises: updated })
      } catch (err) {
        console.error('Error:', err)
      }
    }
  }

  const handleSaveSchedule = async () => {
    try {
      const updatedUserData = { ...userData, weeklySchedule }
      
      await fetch('/api/save-weekly-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          weeklySchedule
        })
      })
      
      setUserData(updatedUserData)
      setEditingSchedule(false)
      NotificationManager.success('✓', 'Jadval saqlandi', 1500)
    } catch (err) {
      console.error('Error saving schedule:', err)
    }
  }

  const handleScheduleChange = (day, period, value) => {
    setWeeklySchedule(prevSchedule => ({
      ...prevSchedule,
      [day]: {
        ...(prevSchedule[day] || { morning: '', evening: '' }),
        [period]: value
      }
    }))
  }

  const handleTimeOfDaySelection = (period) => {
    setSelectedPeriod(period)
    setTimeOfDaySelected(true)
  }

  const handleSaveSportType = async () => {
    if (!sportType.trim()) {
      NotificationManager.warning('XATO', 'Sport turini kiriting!')
      return
    }

    try {
      await fetch('/api/save-sport-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          sportType,
          period: selectedPeriod
        })
      })
      setUserData({ ...userData, sportType })
      NotificationManager.success('✓', 'Sport turi saqlandi', 1500)
    } catch (err) {
      console.error('Error saving sport type:', err)
    }
  }

  // Progress calculation
  const calculateProgress = () => {
    if (!goal || !currentLevel) return 0
    
    const goalMatch = goal.match(/\d+/)
    const currentMatch = currentLevel.match(/\d+/)
    
    if (goalMatch && currentMatch) {
      const goalNum = parseInt(goalMatch[0])
      const currentNum = parseInt(currentMatch[0])
      return Math.min(Math.round((currentNum / goalNum) * 100), 100)
    }
    return 0
  }

  const progress = calculateProgress()

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const dayNames = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba']

  const sportFrequency = userData?.settings?.sportFrequency || 2
  const needsTimeSelection = sportFrequency === 1 && !timeOfDaySelected

  // Get sport name from settings
  const sport1Name = userData?.settings?.sport1Name || ''
  const sport2Name = userData?.settings?.sport2Name || ''

  return (
    <div className="card">
      <h2>SPORT MASHQLARI</h2>

      {needsTimeSelection && (
        <div style={{ 
          background: '#0a0e27', 
          borderRadius: '12px', 
          padding: '24px', 
          border: '3px solid #00d4ff', 
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#00d4ff', marginTop: 0, fontSize: '18px' }}>
            QAYSI VAQTDA SPORT QILASIZ?
          </h3>
          <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '20px' }}>
            Siz kuniga 1 mahal sport qilishni belgilagansiz
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => handleTimeOfDaySelection('morning')}
              style={{
                flex: 1,
                maxWidth: '200px',
                padding: '16px',
                background: '#00d4ff',
                color: '#0a0e27',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ERTALAB
            </button>
            <button
              onClick={() => handleTimeOfDaySelection('evening')}
              style={{
                flex: 1,
                maxWidth: '200px',
                padding: '16px',
                background: '#ffaa00',
                color: '#0a0e27',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              KECHQURUN
            </button>
          </div>
        </div>
      )}

      {!needsTimeSelection && (
        <>

      {/* 1. MAQSAD */}
      <div style={{ background: '#0a0e27', borderRadius: '12px', padding: '20px', border: '2px solid #00d4ff', marginBottom: '16px' }}>
        <h3 style={{ color: '#00d4ff', marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>
          🎯 MAQSAD
        </h3>
        
        {sport1Name && (
          <div style={{ background: '#16213e', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '2px solid #0f3460' }}>
            <p style={{ color: '#00ff88', fontSize: '14px', margin: 0 }}>
              Sport turi: <span style={{ fontWeight: 'bold' }}>{sport1Name}</span>
              {sport2Name && <span> va {sport2Name}</span>}
            </p>
          </div>
        )}

        {sportFrequency === 2 ? (
          <>
            {/* Ertalabki maqsad */}
            <div style={{ marginBottom: '16px', padding: '12px', background: '#16213e', borderRadius: '8px', border: '2px solid #00d4ff' }}>
              <label style={{ color: '#00d4ff', fontSize: '14px', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                ☀️ ERTALABKI MAQSAD:
              </label>
              <input
                type="text"
                value={morningGoal}
                onChange={(e) => setMorningGoal(e.target.value)}
                placeholder="Masalan: 50 ta turnik, 3 km yugurish..."
                className="input"
              />
            </div>

            {/* Kechki maqsad */}
            <div style={{ marginBottom: '16px', padding: '12px', background: '#16213e', borderRadius: '8px', border: '2px solid #ffaa00' }}>
              <label style={{ color: '#ffaa00', fontSize: '14px', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                🌙 KECHKI MAQSAD:
              </label>
              <input
                type="text"
                value={eveningGoal}
                onChange={(e) => setEveningGoal(e.target.value)}
                placeholder="Masalan: 50 ta turnik, 2 km yugurish..."
                className="input"
              />
            </div>
          </>
        ) : (
          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
              Maqsadingiz (masalan: 100 ta turnik):
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Masalan: 100 ta turnik, 5 km yugurish..."
              className="input"
              style={{ marginBottom: '12px' }}
            />
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            Hozir qancha chiqadi?
          </label>
          <input
            type="text"
            value={currentLevel}
            onChange={(e) => setCurrentLevel(e.target.value)}
            placeholder="Masalan: 10 ta turnik, 1 km yugurish..."
            className="input"
          />
        </div>

        {goal && currentLevel && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#aaa', fontSize: '13px' }}>Jarayon:</span>
              <span style={{ color: '#00ff88', fontSize: '13px', fontWeight: 'bold' }}>{progress}%</span>
            </div>
            <div style={{ 
              width: '100%', 
              height: '24px', 
              background: '#16213e', 
              borderRadius: '12px', 
              overflow: 'hidden',
              border: '2px solid #0f3460'
            }}>
              <div style={{ 
                width: `${progress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #00d4ff, #00ff88)',
                transition: 'width 0.5s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {progress > 10 && (
                  <span style={{ color: '#0a0e27', fontSize: '11px', fontWeight: 'bold' }}>
                    {progress}%
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ color: '#555', fontSize: '12px' }}>{currentLevel}</span>
              <span style={{ color: '#00ff88', fontSize: '12px', fontWeight: 'bold' }}>{goal}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleSaveGoal}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
            color: '#0a0e27',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          MAQSADNI SAQLASH
        </button>
      </div>

      {/* 2. MASHQ QO'SHISH */}
      <div style={{ background: '#0a0e27', borderRadius: '12px', padding: '20px', border: '2px solid #00ff88', marginBottom: '16px' }}>
        <h3 style={{ color: '#00ff88', marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>
          💪 MASHQ QO'SHISH
        </h3>
        
        {sportFrequency === 2 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button
              onClick={() => setSelectedPeriod('morning')}
              style={{
                flex: 1,
                padding: '10px',
                background: selectedPeriod === 'morning' ? '#00d4ff' : '#16213e',
                color: selectedPeriod === 'morning' ? '#0a0e27' : '#00d4ff',
                border: '2px solid #00d4ff',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ERTALAB
            </button>
            <button
              onClick={() => setSelectedPeriod('evening')}
              style={{
                flex: 1,
                padding: '10px',
                background: selectedPeriod === 'evening' ? '#ffaa00' : '#16213e',
                color: selectedPeriod === 'evening' ? '#0a0e27' : '#ffaa00',
                border: '2px solid #ffaa00',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              KECHQURUN
            </button>
          </div>
        )}

        {sportFrequency === 1 && (
          <div style={{ 
            background: '#16213e', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '12px',
            border: `2px solid ${selectedPeriod === 'morning' ? '#00d4ff' : '#ffaa00'}`
          }}>
            <p style={{ 
              color: selectedPeriod === 'morning' ? '#00d4ff' : '#ffaa00', 
              fontWeight: 'bold', 
              margin: 0,
              textAlign: 'center',
              fontSize: '13px'
            }}>
              {selectedPeriod === 'morning' ? 'ERTALABKI MASHQLAR' : 'KECHKI MASHQLAR'}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="input"
            placeholder="Vaqt"
          />
          <input
            type="text"
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            placeholder="Mashq nomi (Masalan: Yugurish, Turnik)"
            className="input"
          />
          <input
            type="text"
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
            placeholder="Davomiyligi (Masalan: 10 daqiqa, 100 ta)"
            className="input"
          />
          <button
            onClick={handleAddExercise}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
              color: '#0a0e27',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            MASHQ QO'SHISH
          </button>
        </div>
      </div>

      {/* Ertalabki mashqlar */}
      {(sportFrequency === 2 || (sportFrequency === 1 && selectedPeriod === 'morning')) && morningExercises.length > 0 && (
        <div style={{ background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #00d4ff', marginBottom: '16px' }}>
          <h3 style={{ color: '#00d4ff', marginTop: 0, fontSize: '16px' }}>ERTALABKI MASHQLAR</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {morningExercises.map((item) => (
              <div key={item.id} style={{ 
                background: '#16213e', 
                padding: '12px', 
                borderRadius: '8px',
                border: `2px solid ${item.completed ? '#00ff88' : '#0f3460'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: '#00d4ff', fontWeight: 'bold', marginRight: '8px', fontSize: '13px' }}>
                      {item.time}
                    </span>
                    <span style={{ 
                      color: item.completed ? '#00ff88' : '#aaa',
                      textDecoration: item.completed ? 'line-through' : 'none',
                      fontSize: '13px'
                    }}>
                      {item.exercise}
                    </span>
                    <span style={{ color: '#555', fontSize: '11px', marginLeft: '8px' }}>
                      ({item.duration})
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleExercise(item.id, 'morning')}
                      style={{
                        padding: '6px 10px',
                        background: item.completed ? '#00ff88' : '#ffaa00',
                        color: '#0a0e27',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '11px'
                      }}
                    >
                      {item.completed ? '✓' : '○'}
                    </button>
                    <button
                      onClick={() => handleDeleteExercise(item.id, 'morning')}
                      style={{
                        padding: '6px 10px',
                        background: '#ff0055',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '11px'
                      }}
                    >
                      ✗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kechki mashqlar */}
      {(sportFrequency === 2 || (sportFrequency === 1 && selectedPeriod === 'evening')) && eveningExercises.length > 0 && (
        <div style={{ background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #ffaa00', marginBottom: '16px' }}>
          <h3 style={{ color: '#ffaa00', marginTop: 0, fontSize: '16px' }}>KECHKI MASHQLAR</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {eveningExercises.map((item) => (
              <div key={item.id} style={{ 
                background: '#16213e', 
                padding: '12px', 
                borderRadius: '8px',
                border: `2px solid ${item.completed ? '#00ff88' : '#0f3460'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: '#ffaa00', fontWeight: 'bold', marginRight: '8px', fontSize: '13px' }}>
                      {item.time}
                    </span>
                    <span style={{ 
                      color: item.completed ? '#00ff88' : '#aaa',
                      textDecoration: item.completed ? 'line-through' : 'none',
                      fontSize: '13px'
                    }}>
                      {item.exercise}
                    </span>
                    <span style={{ color: '#555', fontSize: '11px', marginLeft: '8px' }}>
                      ({item.duration})
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleExercise(item.id, 'evening')}
                      style={{
                        padding: '6px 10px',
                        background: item.completed ? '#00ff88' : '#ffaa00',
                        color: '#0a0e27',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '11px'
                      }}
                    >
                      {item.completed ? '✓' : '○'}
                    </button>
                    <button
                      onClick={() => handleDeleteExercise(item.id, 'evening')}
                      style={{
                        padding: '6px 10px',
                        background: '#ff0055',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '11px'
                      }}
                    >
                      ✗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Haftalik Jadval */}
      <div style={{ background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #ffaa00' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ color: '#ffaa00', margin: 0, fontSize: '16px' }}>HAFTALIK JADVAL</h3>
          <button
            onClick={() => setEditingSchedule(!editingSchedule)}
            style={{
              padding: '10px 20px',
              background: editingSchedule 
                ? 'linear-gradient(135deg, #ff0055 0%, #cc0044 100%)' 
                : 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '12px',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              boxShadow: editingSchedule
                ? '0 4px 15px rgba(255, 0, 85, 0.4)'
                : '0 4px 15px rgba(0, 212, 255, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = editingSchedule
                ? '0 6px 20px rgba(255, 0, 85, 0.6)'
                : '0 6px 20px rgba(0, 212, 255, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = editingSchedule
                ? '0 4px 15px rgba(255, 0, 85, 0.4)'
                : '0 4px 15px rgba(0, 212, 255, 0.4)'
            }}
          >
            {editingSchedule ? '✕ BEKOR' : '✏️ O\'ZGARTIRISH'}
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {days.map((day, index) => {
            const schedule = weeklySchedule[day] || { morning: '', evening: '' }
            return (
              <div key={day} style={{ background: '#16213e', padding: '12px', borderRadius: '8px', border: '2px solid #0f3460' }}>
                <p style={{ color: '#00d4ff', fontWeight: 'bold', margin: '0 0 8px 0', fontSize: '13px' }}>
                  {dayNames[index]}
                </p>
                {editingSchedule ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ 
                        color: '#00d4ff', 
                        fontSize: '12px', 
                        display: 'block', 
                        marginBottom: '6px',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px'
                      }}>
                        ☀️ ERTALAB
                      </label>
                      <input
                        type="text"
                        value={schedule.morning || ''}
                        onChange={(e) => handleScheduleChange(day, 'morning', e.target.value)}
                        placeholder="Mashq nomi yoki dam olish..."
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 100%)',
                          border: '2px solid #00d4ff',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '13px',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(0, 212, 255, 0.2)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#00ff88'
                          e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 136, 0.3)'
                          e.target.style.transform = 'translateY(-2px)'
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#00d4ff'
                          e.target.style.boxShadow = '0 4px 12px rgba(0, 212, 255, 0.2)'
                          e.target.style.transform = 'translateY(0)'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ 
                        color: '#ffaa00', 
                        fontSize: '12px', 
                        display: 'block', 
                        marginBottom: '6px',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px'
                      }}>
                        🌙 KECHQURUN
                      </label>
                      <input
                        type="text"
                        value={schedule.evening || ''}
                        onChange={(e) => handleScheduleChange(day, 'evening', e.target.value)}
                        placeholder="Mashq nomi yoki dam olish..."
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 100%)',
                          border: '2px solid #ffaa00',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '13px',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(255, 170, 0, 0.2)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#00ff88'
                          e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 136, 0.3)'
                          e.target.style.transform = 'translateY(-2px)'
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#ffaa00'
                          e.target.style.boxShadow = '0 4px 12px rgba(255, 170, 0, 0.2)'
                          e.target.style.transform = 'translateY(0)'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#aaa', fontSize: '11px', margin: '0 0 4px 0' }}>ERTALAB:</p>
                      <p style={{ color: schedule.morning ? '#00ff88' : '#555', fontSize: '12px', margin: 0 }}>
                        {schedule.morning || 'Dam olish'}
                      </p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#aaa', fontSize: '11px', margin: '0 0 4px 0' }}>KECHQURUN:</p>
                      <p style={{ color: schedule.evening ? '#00ff88' : '#555', fontSize: '12px', margin: 0 }}>
                        {schedule.evening || 'Dam olish'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {editingSchedule && (
          <button
            onClick={handleSaveSchedule}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
              color: '#0a0e27',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '16px',
              fontSize: '15px',
              letterSpacing: '1px',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 20px rgba(0, 255, 136, 0.4)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)'
              e.target.style.boxShadow = '0 8px 25px rgba(0, 255, 136, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 136, 0.4)'
            }}
          >
            ✓ JADVALNI SAQLASH
          </button>
        )}
      </div>
      </>
      )}
    </div>
  )
}
