import { useState, useEffect } from 'react'

export default function FutureTab({ user, onSave }) {
  const [goals, setGoals] = useState([])
  const [newGoal, setNewGoal] = useState({
    title: '',
    current: 0,
    target: 0,
    unit: 'marta'
  })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    if (user?.futureGoals) {
      setGoals(user.futureGoals)
    }
  }, [user])

  const calculateProgress = (current, target) => {
    if (target === 0) return 0
    return Math.min(Math.round((current / target) * 100), 100)
  }

  const calculateDaysToGoal = (goal) => {
    // Sport mashqlaridan ma'lumot olish
    const morningExercises = user?.morningExercises || []
    const eveningExercises = user?.eveningExercises || []
    
    // Oxirgi 7 kunning sport natijalarini hisoblash
    // Hozirgi holatda: bajarilgan mashqlar sonini sanash
    const completedMorning = morningExercises.filter(e => e.completed).length
    const completedEvening = eveningExercises.filter(e => e.completed).length
    const totalCompleted = completedMorning + completedEvening
    
    // Agar hech qanday mashq bajarilmagan bo'lsa
    if (totalCompleted === 0) return null
    
    const remaining = goal.target - goal.current
    if (remaining <= 0) return 0
    
    // Haftalik o'rtacha progress (oxirgi 7 kun deb hisoblaymiz)
    // Bu yerda biz hozirgi progressni 7 kunga bo'lamiz
    const activeDays = Math.max(1, totalCompleted) // Kamida 1 kun faol deb hisoblaymiz
    const weeklyProgress = goal.current / 7 // Haftalik o'rtacha
    
    if (weeklyProgress === 0) return null
    
    // Haftalik natijaga qarab prognoz
    const weeksNeeded = Math.ceil(remaining / weeklyProgress)
    const daysNeeded = weeksNeeded * 7
    
    return {
      days: daysNeeded,
      weeks: weeksNeeded,
      activeDays: totalCompleted, // Bajarilgan mashqlar soni
      weeklyProgress: Math.round(weeklyProgress),
      dailyAverage: Math.round((weeklyProgress / 7) * 10) / 10,
      completedExercises: totalCompleted // Qo'shimcha ma'lumot
    }
  }

  const getTargetDate = (prediction) => {
    if (!prediction || !prediction.days) return null
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + prediction.days)
    return targetDate.toLocaleDateString('uz-UZ', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const addGoal = () => {
    if (!newGoal.title || newGoal.target <= 0) {
      alert('Maqsad nomi va raqamni kiriting!')
      return
    }

    const goal = {
      id: Date.now(),
      ...newGoal,
      createdAt: new Date().toISOString()
    }

    const updatedGoals = [...goals, goal]
    setGoals(updatedGoals)
    
    if (onSave) {
      onSave({ ...user, futureGoals: updatedGoals })
    }

    setNewGoal({ title: '', current: 0, target: 0, unit: 'marta' })
    setShowAddForm(false)
  }

  const updateProgress = (goalId, newCurrent) => {
    const updatedGoals = goals.map(g => 
      g.id === goalId ? { ...g, current: parseInt(newCurrent) || 0 } : g
    )
    setGoals(updatedGoals)
    
    if (onSave) {
      onSave({ ...user, futureGoals: updatedGoals })
    }
  }

  const deleteGoal = (goalId) => {
    if (!confirm('Bu maqsadni o\'chirmoqchimisiz?')) return
    
    const updatedGoals = goals.filter(g => g.id !== goalId)
    setGoals(updatedGoals)
    
    if (onSave) {
      onSave({ ...user, futureGoals: updatedGoals })
    }
  }

  return (
    <div className="card">
      <h2>KELAJAK MAQSADLARI</h2>
      <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px' }}>
        Maqsadlaringizni belgilang va ularga qachon erishishingizni bilib oling
      </p>

      {goals.length === 0 && !showAddForm && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎯</div>
          <p style={{ color: '#aaa', marginBottom: '20px' }}>
            Hali maqsadlar yo'q
          </p>
        </div>
      )}

      {goals.map(goal => {
        const progress = calculateProgress(goal.current, goal.target)
        const prediction = calculateDaysToGoal(goal)
        const targetDate = getTargetDate(prediction)
        const isCompleted = goal.current >= goal.target

        return (
          <div 
            key={goal.id} 
            style={{ 
              background: isCompleted ? '#001a0d' : '#0a0e27',
              border: `2px solid ${isCompleted ? '#00ff88' : '#00d4ff'}`,
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: isCompleted ? '#00ff88' : '#00d4ff', margin: '0 0 8px 0' }}>
                  {isCompleted && '✅ '}{goal.title}
                </h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="number"
                    value={goal.current}
                    onChange={(e) => updateProgress(goal.id, e.target.value)}
                    style={{
                      width: '80px',
                      padding: '6px',
                      background: '#16213e',
                      border: '2px solid #0f3460',
                      borderRadius: '6px',
                      color: '#00d4ff',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ color: '#aaa' }}>/</span>
                  <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
                    {goal.target} {goal.unit}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteGoal(goal.id)}
                style={{
                  padding: '8px 12px',
                  background: '#ff0055',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                O'CHIRISH
              </button>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ 
                background: '#16213e', 
                height: '12px', 
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: isCompleted ? '#00ff88' : '#00d4ff',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <p style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>
                {progress}% bajarildi
              </p>
            </div>

            {/* Prediction */}
            {!isCompleted && !prediction && (
              <div style={{ 
                background: '#16213e', 
                padding: '16px', 
                borderRadius: '8px',
                border: '2px solid #ffaa00'
              }}>
                <p style={{ color: '#ffaa00', fontSize: '14px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
                  ⚠️ PROGNOZ MAVJUD EMAS
                </p>
                <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>
                  Sport mashqlarini bajaring va natijalarni belgilang. Shunda maqsadga erishish muddatini ko'rsatamiz!
                </p>
              </div>
            )}
            
            {!isCompleted && prediction && (
              <div style={{ 
                background: '#16213e', 
                padding: '16px', 
                borderRadius: '8px',
                border: '2px solid #0f3460'
              }}>
                <p style={{ color: '#ffaa00', fontSize: '14px', margin: '0 0 12px 0', fontWeight: 'bold' }}>
                  📊 SPORT NATIJALARIGA ASOSLANGAN TAHLIL:
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' }}>
                      Bajarilgan mashqlar:
                    </p>
                    <p style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                      {prediction.completedExercises} ta
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' }}>
                      Haftalik progress:
                    </p>
                    <p style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                      {prediction.weeklyProgress} {goal.unit}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' }}>
                      Kunlik o'rtacha:
                    </p>
                    <p style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                      {prediction.dailyAverage} {goal.unit}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px 0' }}>
                      Kerakli haftalar:
                    </p>
                    <p style={{ color: '#00d4ff', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                      {prediction.weeks} hafta
                    </p>
                  </div>
                </div>

                <div style={{ 
                  background: '#0a0e27', 
                  padding: '12px', 
                  borderRadius: '6px',
                  marginTop: '12px'
                }}>
                  <p style={{ color: '#00ff88', fontSize: '14px', margin: '0 0 4px 0', fontWeight: 'bold' }}>
                    📅 Taxminiy muddat:
                  </p>
                  <p style={{ color: '#fff', fontSize: '18px', margin: '0 0 4px 0', fontWeight: 'bold' }}>
                    {prediction.days} kun ichida
                  </p>
                  {targetDate && (
                    <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>
                      {targetDate} gacha
                    </p>
                  )}
                </div>
                
                <div style={{ 
                  background: '#0a0e27', 
                  padding: '12px', 
                  borderRadius: '6px',
                  marginTop: '8px',
                  border: '1px solid #0f3460'
                }}>
                  <p style={{ color: '#aaa', fontSize: '11px', margin: 0, fontStyle: 'italic' }}>
                    💡 Prognoz sport mashqlaringiz natijalariga asoslangan. Muntazam mashq qilsangiz, maqsadga tezroq erishasiz!
                  </p>
                </div>
              </div>
            )}

            {isCompleted && (
              <div style={{ 
                background: '#001a0d', 
                padding: '12px', 
                borderRadius: '8px',
                border: '2px solid #00ff88'
              }}>
                <p style={{ color: '#00ff88', fontSize: '14px', margin: 0, fontWeight: 'bold' }}>
                  🎉 Maqsadga erishildi!
                </p>
              </div>
            )}
          </div>
        )
      })}

      {showAddForm ? (
        <div style={{ 
          background: '#16213e', 
          padding: '20px', 
          borderRadius: '12px',
          border: '2px solid #0f3460',
          marginTop: '16px'
        }}>
          <h3 style={{ color: '#00d4ff', marginTop: 0 }}>YANGI MAQSAD</h3>
          
          <input
            type="text"
            placeholder="Maqsad nomi (masalan: Turnik tortish)"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              background: '#0a0e27',
              border: '2px solid #0f3460',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              marginBottom: '12px',
              boxSizing: 'border-box'
            }}
          />

          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                Hozirgi holat
              </label>
              <input
                type="number"
                value={newGoal.current}
                onChange={(e) => setNewGoal({ ...newGoal, current: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0a0e27',
                  border: '2px solid #0f3460',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                Maqsad
              </label>
              <input
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0a0e27',
                  border: '2px solid #0f3460',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <select
            value={newGoal.unit}
            onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              background: '#0a0e27',
              border: '2px solid #0f3460',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              marginBottom: '16px',
              boxSizing: 'border-box'
            }}
          >
            <option value="marta">marta</option>
            <option value="kg">kg</option>
            <option value="daqiqa">daqiqa</option>
            <option value="km">km</option>
          </select>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={addGoal}
              style={{
                flex: 1,
                padding: '12px',
                background: '#00ff88',
                color: '#0a0e27',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              QO'SHISH
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setNewGoal({ title: '', current: 0, target: 0, unit: 'marta' })
              }}
              style={{
                flex: 1,
                padding: '12px',
                background: '#ff0055',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              BEKOR
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            width: '100%',
            padding: '14px',
            background: '#00d4ff',
            color: '#0a0e27',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            marginTop: '16px'
          }}
        >
          + YANGI MAQSAD QO'SHISH
        </button>
      )}
    </div>
  )
}
