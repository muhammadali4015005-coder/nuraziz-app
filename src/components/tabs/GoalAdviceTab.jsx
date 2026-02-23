import { useState, useEffect } from 'react'
import { Target, Plus, Trash2, Sparkles, Clock } from 'lucide-react'

export default function GoalAdviceTab({ userData, setUserData }) {
  const [goals, setGoals] = useState([])
  const [newGoal, setNewGoal] = useState('')
  const [loadingAdvice, setLoadingAdvice] = useState({})
  const [showAdvice, setShowAdvice] = useState({})

  useEffect(() => {
    if (userData?.personalGoals) {
      setGoals(userData.personalGoals)
    }
  }, [userData])

  const saveGoals = async (updatedGoals) => {
    const updatedUserData = { ...userData, personalGoals: updatedGoals }
    setUserData(updatedUserData)
    
    try {
      await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUserData)
      })
    } catch (err) {
      console.error('Save error:', err)
    }
  }

  const addGoal = () => {
    if (!newGoal.trim()) {
      alert('Maqsadni kiriting!')
      return
    }

    if (goals.length >= 3) {
      alert('Maksimal 3 ta maqsad qo\'shish mumkin!')
      return
    }

    const goal = {
      id: Date.now(),
      text: newGoal,
      createdAt: new Date().toISOString(),
      advice: null
    }

    const updatedGoals = [...goals, goal]
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
    setNewGoal('')
    
    // Avtomatik maslahat olish
    setTimeout(() => {
      generateAdvice(goal.id)
    }, 500)
  }

  const deleteGoal = (goalId) => {
    if (confirm('Bu maqsadni o\'chirmoqchimisiz?')) {
      const updatedGoals = goals.filter(g => g.id !== goalId)
      setGoals(updatedGoals)
      saveGoals(updatedGoals)
    }
  }

  const generateAdvice = async (goalId) => {
    setLoadingAdvice({ ...loadingAdvice, [goalId]: true })
    
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return

    try {
      // Foydalanuvchi ma'lumotlarini to'plash
      const userInfo = {
        goal: goal.text,
        name: userData.name || 'Foydalanuvchi',
        age: userData.age || 'Noma\'lum',
        gender: userData.gender || 'Noma\'lum',
        userType: userData.settings?.userType || 'Noma\'lum',
        schoolGrade: userData.settings?.schoolGrade || null,
        workType: userData.settings?.workType || null,
        doesSport: userData.settings?.doesSport || false,
        sportType: userData.settings?.sportType || null,
        sportFrequency: userData.settings?.sportFrequency || null,
        dailySchedule: userData.schedule || {},
        workSchedule: userData.workSchedule || {},
        schoolSchedule: userData.schoolSchedule || {},
        housework: userData.houseworkDaily || {}
      }

      const response = await fetch('/api/ai-goal-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInfo })
      })

      const data = await response.json()

      if (data.success) {
        const updatedGoals = goals.map(g => 
          g.id === goalId ? { ...g, advice: data.advice } : g
        )
        setGoals(updatedGoals)
        saveGoals(updatedGoals)
        setShowAdvice({ ...showAdvice, [goalId]: true })
      } else {
        alert('Maslahat olishda xatolik yuz berdi')
      }
    } catch (err) {
      console.error('AI advice error:', err)
      alert('Maslahat olishda xatolik yuz berdi')
    } finally {
      setLoadingAdvice({ ...loadingAdvice, [goalId]: false })
    }
  }

  return (
    <div className="card">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Target size={28} />
          MAQSADGA YETISH
        </h2>
        <p style={{ color: '#aaa', fontSize: '14px' }}>
          3 ta eng muhim maqsadingizni yozing va AI dan shaxsiy maslahat oling
        </p>
      </div>

      {/* Maqsad qo'shish */}
      {goals.length < 3 && (
        <div style={{
          background: 'linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%)',
          border: '2px solid #00d4ff',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{ color: '#00d4ff', marginTop: 0, marginBottom: '16px', fontSize: '16px' }}>
            <Plus size={20} style={{ display: 'inline', marginRight: '8px' }} />
            YANGI MAQSAD QO'SHISH ({goals.length}/3)
          </h3>
          <textarea
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Maqsadingizni batafsil yozing... Masalan: IELTS 7.5 ball olish, Biznesni 2 baravar oshirish, 10 kg yo'qotish va h.k."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '16px',
              background: '#0a0e27',
              border: '2px solid #0f3460',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '15px',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              marginBottom: '12px'
            }}
          />
          <button
            onClick={addGoal}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(0, 212, 255, 0.4)'
            }}
          >
            <Plus size={20} />
            MAQSAD QO'SHISH
          </button>
        </div>
      )}

      {/* Maqsadlar ro'yxati */}
      {goals.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#0a0e27',
          borderRadius: '12px',
          border: '2px dashed #0f3460'
        }}>
          <Target size={80} style={{ color: '#00d4ff', marginBottom: '20px' }} />
          <h3 style={{ color: '#00d4ff', marginBottom: '12px' }}>Hali maqsadlar yo'q</h3>
          <p style={{ color: '#aaa', fontSize: '14px' }}>
            Yuqorida birinchi maqsadingizni qo'shing va AI dan shaxsiy maslahat oling
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {goals.map((goal, index) => (
            <div
              key={goal.id}
              style={{
                background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 100%)',
                border: '3px solid #00d4ff',
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #00d4ff, #00ff88)',
                opacity: 0.8
              }} />

              {/* Maqsad raqami */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(0, 212, 255, 0.4)'
              }}>
                {index + 1}
              </div>

              {/* Maqsad matni */}
              <div style={{ marginBottom: '20px', paddingRight: '60px' }}>
                <h3 style={{ color: '#00d4ff', marginTop: 0, marginBottom: '12px', fontSize: '18px' }}>
                  🎯 MAQSAD:
                </h3>
                <p style={{ color: '#fff', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                  {goal.text}
                </p>
                <p style={{ color: '#aaa', fontSize: '12px', marginTop: '8px' }}>
                  <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {new Date(goal.createdAt).toLocaleDateString('uz-UZ')}
                </p>
              </div>

              {/* AI Maslahat */}
              {goal.advice ? (
                <div style={{
                  background: '#0a0e27',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px solid #00ff88',
                  marginBottom: '16px'
                }}>
                  <h4 style={{ 
                    color: '#00ff88', 
                    marginTop: 0, 
                    marginBottom: '16px', 
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Sparkles size={20} />
                    AI SHAXSIY MASLAHAT:
                  </h4>
                  <div style={{
                    color: '#fff',
                    fontSize: '14px',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {goal.advice}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => generateAdvice(goal.id)}
                  disabled={loadingAdvice[goal.id]}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: loadingAdvice[goal.id] 
                      ? '#555' 
                      : 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
                    color: loadingAdvice[goal.id] ? '#aaa' : '#0a0e27',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: loadingAdvice[goal.id] ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(0, 255, 136, 0.4)',
                    marginBottom: '16px'
                  }}
                >
                  {loadingAdvice[goal.id] ? (
                    <>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '3px solid #aaa',
                        borderTop: '3px solid #fff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      TAHLIL QILINMOQDA...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      AI MASLAHAT OLISH
                    </>
                  )}
                </button>
              )}

              {/* O'chirish tugmasi */}
              <button
                onClick={() => deleteGoal(goal.id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #ff0055 0%, #cc0044 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(255, 0, 85, 0.4)'
                }}
              >
                <Trash2 size={16} />
                MAQSADNI O'CHIRISH
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
