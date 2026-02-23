import { useState, useEffect } from 'react'
import { Target, Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import QuickNotification from '../QuickNotification'
import ConfirmDialog from '../ConfirmDialog'

export default function GoalsTab({ userData, setUserData }) {
  const [goals, setGoals] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [isLocked, setIsLocked] = useState(true)
  const [inputCode, setInputCode] = useState('')
  const [isSettingCode, setIsSettingCode] = useState(false)
  const [newCode, setNewCode] = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [notification, setNotification] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  
  // 1 ta maqsad uchun
  const [newGoal, setNewGoal] = useState({ title: '', category: '' })
  const [showAdviceModal, setShowAdviceModal] = useState(false)
  const [aiAdvice, setAiAdvice] = useState('')
  const [loadingAdvice, setLoadingAdvice] = useState(false)
  
  // Vazifalar uchun
  const [newTaskText, setNewTaskText] = useState({}) // { goalId: 'task text' }
  const [expandedGoal, setExpandedGoal] = useState(null) // Qaysi maqsad ochiq

  // Kategoriyalar
  const categories = [
    { value: 'education', label: '📚 Ta\'lim', emoji: '📚' },
    { value: 'work', label: '💼 Ish', emoji: '💼' },
    { value: 'sport', label: '💪 Sport', emoji: '💪' },
    { value: 'health', label: '🏥 Sog\'liq', emoji: '🏥' },
    { value: 'finance', label: '💰 Moliya', emoji: '💰' },
    { value: 'personal', label: '🎯 Shaxsiy', emoji: '🎯' },
    { value: 'other', label: '📌 Boshqa', emoji: '📌' }
  ]
  
  const showNotification = (message) => {
    setNotification(message)
  }

  useEffect(() => {
    if (userData?.futureGoals) {
      setGoals(userData.futureGoals)
    }
    
    // Agar kod mavjud bo'lmasa, kod o'rnatish rejimiga o'tish
    if (!userData?.goalsCode) {
      setIsSettingCode(true)
      setIsLocked(false)
    }
  }, [userData])

  const handleSetCode = () => {
    if (!newCode || newCode.length < 4) {
      showNotification('Kod kamida 4 ta belgidan iborat bo\'lishi kerak!')
      return
    }
    
    if (newCode !== confirmCode) {
      showNotification('Kodlar mos emas!')
      return
    }
    
    // Kodni saqlash
    const updatedUserData = { ...userData, goalsCode: newCode }
    setUserData(updatedUserData)
    
    fetch('/api/save-goals-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: userData.phone,
        goalsCode: newCode
      })
    }).then(() => {
      setIsSettingCode(false)
      setIsLocked(false)
      setNewCode('')
      setConfirmCode('')
      showNotification('Kod muvaffaqiyatli o\'rnatildi!')
    }).catch(err => {
      console.error('Code save error:', err)
      showNotification('Xatolik yuz berdi!')
    })
  }

  const handleUnlock = () => {
    if (inputCode === userData.goalsCode) {
      setIsLocked(false)
      setInputCode('')
    } else {
      showNotification('Kod noto\'g\'ri!')
      setInputCode('')
    }
  }

  const saveGoals = async (updatedGoals) => {
    const updatedUserData = { ...userData, futureGoals: updatedGoals }
    setUserData(updatedUserData)
    
    try {
      await fetch('/api/save-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData.phone,
          futureGoals: updatedGoals
        })
      })
    } catch (err) {
      console.error('Goals save error:', err)
    }
  }

  const generateAdvice = async (goal) => {
    setLoadingAdvice(true)
    setShowAdviceModal(true)
    
    try {
      // Foydalanuvchi ma'lumotlarini to'plash
      const userInfo = {
        goal: goal.title,
        gender: userData.gender || 'Noma\'lum',
        age: userData.age || 'Noma\'lum',
        weight: userData.weight || 'Noma\'lum',
        height: userData.height || 'Noma\'lum',
        userType: userData.userType || 'Noma\'lum',
        sportFrequency: userData.sportFrequency || 'Noma\'lum',
        sportType: userData.sportType || 'Noma\'lum',
        schedule: userData.schedule || {},
        nutrition: userData.nutrition || {},
        workSchedule: userData.workSchedule || {},
        schoolSchedule: userData.schoolSchedule || {}
      }
      
      // AI ga so'rov yuborish
      const response = await fetch('/api/ai-goal-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInfo })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAiAdvice(data.advice)
      } else {
        setAiAdvice('Maslahat olishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.')
      }
    } catch (err) {
      console.error('AI advice error:', err)
      setAiAdvice('Maslahat olishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.')
    } finally {
      setLoadingAdvice(false)
    }
  }

  const addGoal = () => {
    if (!newGoal.title) {
      showNotification('Maqsad nomini kiriting!')
      return
    }

    if (!newGoal.category) {
      showNotification('Kategoriyani tanlang!')
      return
    }

    // Maqsad nomidan raqamni ajratib olish
    const numberMatch = newGoal.title.match(/\d+/)
    const targetNumber = numberMatch ? parseInt(numberMatch[0]) : 100

    const goal = {
      id: Date.now(),
      title: newGoal.title,
      category: newGoal.category, // Kategoriya
      target: targetNumber,
      current: 0,
      unit: 'ta',
      tasks: [], // Vazifalar ro'yxati
      createdAt: new Date().toISOString()
    }

    const updatedGoals = [...goals, goal]
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
    
    setNewGoal({ title: '', category: '' })
    setShowAddModal(false)
    showNotification('Maqsad qo\'shildi!')
    
    // AI maslahat olish
    setTimeout(() => {
      generateAdvice(goal)
    }, 500)
  }

  const addTask = (goalId, taskText) => {
    if (!taskText.trim()) return
    
    const updatedGoals = goals.map(g => {
      if (g.id === goalId) {
        const newTask = {
          id: Date.now(),
          text: taskText,
          completed: false,
          createdAt: new Date().toISOString()
        }
        return { ...g, tasks: [...(g.tasks || []), newTask] }
      }
      return g
    })
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
  }

  const toggleTask = (goalId, taskId) => {
    const updatedGoals = goals.map(g => {
      if (g.id === goalId) {
        const updatedTasks = g.tasks.map(t =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
        return { ...g, tasks: updatedTasks }
      }
      return g
    })
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
  }

  const deleteTask = (goalId, taskId) => {
    const updatedGoals = goals.map(g => {
      if (g.id === goalId) {
        return { ...g, tasks: g.tasks.filter(t => t.id !== taskId) }
      }
      return g
    })
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
  }

  const updateGoalProgress = (goalId, newCurrent) => {
    const updatedGoals = goals.map(g => 
      g.id === goalId ? { ...g, current: parseFloat(newCurrent) || 0 } : g
    )
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
  }

  const deleteGoal = (goalId) => {
    setConfirmDelete(goalId)
  }
  
  const confirmDeleteGoal = () => {
    const updatedGoals = goals.filter(g => g.id !== confirmDelete)
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
    setConfirmDelete(null)
    showNotification('Maqsad o\'chirildi!')
  }

  const startEdit = (goal) => {
    setEditingGoal({ ...goal })
  }

  const saveEdit = () => {
    const updatedGoals = goals.map(g => 
      g.id === editingGoal.id ? editingGoal : g
    )
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
    setEditingGoal(null)
  }

  // Agar kod o'rnatish rejimida bo'lsa
  if (isSettingCode) {
    return (
      <>
        {notification && <QuickNotification message={notification} onClose={() => setNotification(null)} />}
        <div className="card">
          <h2 style={{ textAlign: 'center', color: '#00d4ff', marginBottom: '24px', fontSize: 'clamp(20px, 5vw, 28px)' }}>
            🔐 REJALAR
          </h2>
        
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '0 10px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: 'clamp(60px, 15vw, 80px)',
              height: 'clamp(60px, 15vw, 80px)',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(30px, 8vw, 40px)'
            }}>
              🔒
            </div>
            <h3 style={{ color: '#00d4ff', marginBottom: '12px', fontSize: 'clamp(16px, 4vw, 20px)' }}>
              Kodni kiriting
            </h3>
            <p style={{ color: '#aaa', fontSize: 'clamp(12px, 3vw, 14px)' }}>
              Rejalar bo'limiga kirish uchun kodni kiriting
            </p>
          </div>
          
          <input
            type="password"
            placeholder="Kod (4-6 raqam)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            style={{
              width: '100%',
              padding: 'clamp(12px, 3vw, 16px)',
              marginBottom: '12px',
              background: '#16213e',
              border: '2px solid #0f3460',
              borderRadius: '8px',
              color: '#fff',
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              boxSizing: 'border-box',
              textAlign: 'center',
              letterSpacing: '4px'
            }}
            autoFocus
          />
          
          <input
            type="password"
            placeholder="Kodni tasdiqlang"
            value={confirmCode}
            onChange={(e) => setConfirmCode(e.target.value)}
            style={{
              width: '100%',
              padding: 'clamp(12px, 3vw, 16px)',
              marginBottom: '24px',
              background: '#16213e',
              border: '2px solid #0f3460',
              borderRadius: '8px',
              color: '#fff',
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              boxSizing: 'border-box',
              textAlign: 'center',
              letterSpacing: '4px'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSetCode()
            }}
          />
          
          <button
            onClick={handleSetCode}
            style={{
              width: '100%',
              padding: 'clamp(12px, 3vw, 16px)',
              background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              boxShadow: '0 4px 15px rgba(0, 212, 255, 0.4)'
            }}
          >
            KIRISH
          </button>
        </div>
      </div>
      </>
    )
  }

  // Agar qulflangan bo'lsa
  if (isLocked) {
    return (
      <>
        {notification && <QuickNotification message={notification} onClose={() => setNotification(null)} />}
        <div className="card">
          <h2 style={{ textAlign: 'center', color: '#00d4ff', marginBottom: '24px', fontSize: 'clamp(18px, 5vw, 28px)' }}>
            🔒 MAQSADLAR QULFLANGAN
          </h2>
        
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '0 10px' }}>
          <p style={{ color: '#aaa', marginBottom: '20px', textAlign: 'center', fontSize: 'clamp(12px, 3vw, 14px)' }}>
            Maqsadlaringizni ko'rish uchun kodni kiriting
          </p>
          
          <input
            type="password"
            placeholder="Kodni kiriting"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            style={{
              width: '100%',
              padding: 'clamp(10px, 2.5vw, 12px)',
              marginBottom: '20px',
              background: '#16213e',
              border: '2px solid #0f3460',
              borderRadius: '8px',
              color: '#fff',
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              textAlign: 'center',
              letterSpacing: '4px',
              boxSizing: 'border-box'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleUnlock()
            }}
            autoFocus
          />
          
          <button
            onClick={handleUnlock}
            style={{
              width: '100%',
              padding: 'clamp(10px, 2.5vw, 12px)',
              background: '#00d4ff',
              color: '#0a0e27',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: 'clamp(14px, 3.5vw, 16px)'
            }}
          >
            OCHISH
          </button>
        </div>
      </div>
      </>
    )
  }

  return (
    <>
      {notification && <QuickNotification message={notification} onClose={() => setNotification(null)} />}
      {confirmDelete && (
        <ConfirmDialog
          message="Bu maqsadni o'chirmoqchimisiz?"
          onConfirm={confirmDeleteGoal}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'clamp(20px, 5vw, 28px)' }}>
            <Target size={window.innerWidth < 768 ? 20 : 28} />
            MAQSADLAR
        </h2>
      </div>

      {goals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'clamp(30px, 10vw, 60px) 20px' }}>
          <Target size={window.innerWidth < 768 ? 60 : 80} style={{ color: '#00d4ff', marginBottom: '20px' }} />
          <h3 style={{ color: '#00d4ff', marginBottom: '12px', fontSize: 'clamp(16px, 4vw, 20px)' }}>Hali maqsadlar yo'q</h3>
          <p style={{ color: '#aaa', marginBottom: '24px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
            Birinchi maqsadingizni qo'shing
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: 'clamp(12px, 3vw, 14px) clamp(20px, 5vw, 32px)',
              background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={window.innerWidth < 768 ? 16 : 20} />
            BIRINCHI MAQSADNI QO'SHISH
          </button>
        </div>
      ) : (
        <>
          {/* Yangi maqsad qo'shish tugmasi */}
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                width: '100%',
                padding: 'clamp(12px, 3vw, 14px)',
                background: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
                color: '#0a0e27',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Plus size={window.innerWidth < 768 ? 16 : 20} />
              YANGI MAQSAD QO'SHISH
            </button>
          </div>
          
          {/* Maqsadlar ro'yxati */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {goals.map((goal, idx) => {
            const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100)
            const isCompleted = goal.current >= goal.target
            const isEditing = editingGoal?.id === goal.id

            return (
              <div
                key={goal.id}
                style={{
                  background: '#0a0e27',
                  border: `2px solid ${isCompleted ? '#00ff88' : '#0f3460'}`,
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editingGoal.title}
                      onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#16213e',
                        border: '2px solid #0f3460',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '16px',
                        marginBottom: '12px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                      <input
                        type="number"
                        value={editingGoal.target}
                        onChange={(e) => setEditingGoal({ ...editingGoal, target: parseFloat(e.target.value) })}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: '#16213e',
                          border: '2px solid #0f3460',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                      <select
                        value={editingGoal.unit}
                        onChange={(e) => setEditingGoal({ ...editingGoal, unit: e.target.value })}
                        style={{
                          padding: '12px',
                          background: '#16213e',
                          border: '2px solid #0f3460',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '14px'
                        }}
                      >
                        <option value="kg">kg</option>
                        <option value="kun">kun</option>
                        <option value="marta">marta</option>
                        <option value="ta">ta</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={saveEdit}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: '#00ff88',
                          color: '#0a0e27',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Check size={16} />
                        SAQLASH
                      </button>
                      <button
                        onClick={() => setEditingGoal(null)}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: '#ff0055',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <X size={16} />
                        BEKOR QILISH
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ color: isCompleted ? '#00ff88' : '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'clamp(14px, 3.5vw, 16px)' }}>
                        {isCompleted && '✅ '}
                        {categories.find(c => c.value === goal.category)?.emoji || '🎯'} {idx + 1}. {goal.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => startEdit(goal)}
                          style={{
                            padding: '6px 12px',
                            background: '#00d4ff',
                            color: '#0a0e27',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#ff0055',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#aaa', fontSize: '14px' }}>Hozirgi holat:</span>
                        <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
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
                      <div style={{ textAlign: 'center', marginTop: '8px' }}>
                        <span style={{ color: isCompleted ? '#00ff88' : '#00d4ff', fontWeight: 'bold', fontSize: '18px' }}>
                          {progress}%
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                      <input
                        type="number"
                        value={goal.current}
                        onChange={(e) => updateGoalProgress(goal.id, e.target.value)}
                        placeholder="Hozirgi holat"
                        step="0.1"
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: '#16213e',
                          border: '2px solid #0f3460',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                      <span style={{ color: '#aaa' }}>/ {goal.target} {goal.unit}</span>
                    </div>

                    {/* Maqsadga mos maslahat */}
                    <div style={{
                      background: 'linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%)',
                      borderRadius: '10px',
                      padding: '16px',
                      border: '2px solid #00d4ff',
                      marginTop: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '20px' }}>💡</span>
                        <h4 style={{ color: '#00d4ff', margin: 0, fontSize: '15px' }}>
                          {goal.title}ga yetishingiz uchun:
                        </h4>
                      </div>
                      <button
                        onClick={() => generateAdvice(goal)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
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
                          boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
                          transition: 'all 0.3s ease'
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
                        🤖 AI MASLAHAT OLISH
                      </button>
                    </div>

                    {/* Vazifalar bo'limi */}
                    <div style={{
                      background: 'linear-gradient(135deg, #1a2a3a 0%, #0f1923 100%)',
                      borderRadius: '10px',
                      padding: '16px',
                      border: '2px solid #00ff88',
                      marginTop: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '20px' }}>📋</span>
                          <h4 style={{ color: '#00ff88', margin: 0, fontSize: '15px' }}>
                            Vazifalar ({goal.tasks?.filter(t => t.completed).length || 0}/{goal.tasks?.length || 0})
                          </h4>
                        </div>
                        <button
                          onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                          style={{
                            padding: '6px 12px',
                            background: expandedGoal === goal.id ? '#ff0055' : '#00ff88',
                            color: expandedGoal === goal.id ? '#fff' : '#0a0e27',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}
                        >
                          {expandedGoal === goal.id ? '▲ YOPISH' : '▼ OCHISH'}
                        </button>
                      </div>

                      {expandedGoal === goal.id && (
                        <>
                          {/* Yangi vazifa qo'shish */}
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                            <input
                              type="text"
                              value={newTaskText[goal.id] || ''}
                              onChange={(e) => setNewTaskText({ ...newTaskText, [goal.id]: e.target.value })}
                              placeholder="Yangi vazifa..."
                              style={{
                                flex: 1,
                                padding: '10px',
                                background: '#16213e',
                                border: '2px solid #0f3460',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '13px',
                                boxSizing: 'border-box'
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && newTaskText[goal.id]?.trim()) {
                                  addTask(goal.id, newTaskText[goal.id])
                                  setNewTaskText({ ...newTaskText, [goal.id]: '' })
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                if (newTaskText[goal.id]?.trim()) {
                                  addTask(goal.id, newTaskText[goal.id])
                                  setNewTaskText({ ...newTaskText, [goal.id]: '' })
                                }
                              }}
                              style={{
                                padding: '10px 16px',
                                background: '#00ff88',
                                color: '#0a0e27',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '13px'
                              }}
                            >
                              + QO'SHISH
                            </button>
                          </div>

                          {/* Vazifalar ro'yxati */}
                          {goal.tasks && goal.tasks.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {goal.tasks.map(task => (
                                <div
                                  key={task.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px',
                                    background: task.completed ? 'rgba(0, 255, 136, 0.1)' : '#16213e',
                                    border: `2px solid ${task.completed ? '#00ff88' : '#0f3460'}`,
                                    borderRadius: '6px'
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(goal.id, task.id)}
                                    style={{
                                      width: '18px',
                                      height: '18px',
                                      cursor: 'pointer'
                                    }}
                                  />
                                  <span style={{
                                    flex: 1,
                                    color: task.completed ? '#00ff88' : '#fff',
                                    fontSize: '13px',
                                    textDecoration: task.completed ? 'line-through' : 'none'
                                  }}>
                                    {task.text}
                                  </span>
                                  <button
                                    onClick={() => deleteTask(goal.id, task.id)}
                                    style={{
                                      padding: '4px 8px',
                                      background: '#ff0055',
                                      color: '#fff',
                                      border: 'none',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '11px'
                                    }}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p style={{ color: '#aaa', fontSize: '13px', textAlign: 'center', margin: 0 }}>
                              Hali vazifalar yo'q. Yuqorida yangi vazifa qo'shing!
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
            })}
          </div>
        </>
      )}

      {/* Yangi maqsad qo'shish modali */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)',
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a2332 0%, #0f1923 100%)',
            borderRadius: '16px',
            padding: 'clamp(20px, 5vw, 32px)',
            maxWidth: '550px',
            width: '100%',
            border: '3px solid #00d4ff',
            boxShadow: '0 20px 60px rgba(0, 212, 255, 0.3)',
            animation: 'modalSlideIn 0.3s ease-out'
          }}>
            <style>{`
              @keyframes modalSlideIn {
                from {
                  opacity: 0;
                  transform: translateY(-30px) scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
            `}</style>
            
            <h3 style={{ 
              color: '#00d4ff', 
              marginTop: 0, 
              marginBottom: 'clamp(20px, 5vw, 28px)', 
              textAlign: 'center',
              fontSize: 'clamp(16px, 4vw, 22px)',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              YANGI MAQSAD QO'SHISH
            </h3>

            <div style={{ marginBottom: 'clamp(16px, 4vw, 20px)' }}>
              <label style={{ 
                display: 'block', 
                color: '#00d4ff', 
                marginBottom: '10px', 
                fontSize: 'clamp(12px, 3vw, 14px)',
                fontWeight: 'bold'
              }}>
                📝 MAQSAD NOMI
              </label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="Maqsad nomi (masalan: 100 ta turnik)"
                style={{
                  width: '100%',
                  padding: 'clamp(12px, 3vw, 16px)',
                  background: '#0a0e27',
                  border: '2px solid #1e3a5f',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: 'clamp(13px, 3.5vw, 15px)',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
                onBlur={(e) => e.target.style.borderColor = '#1e3a5f'}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 'clamp(20px, 5vw, 28px)' }}>
              <label style={{ 
                display: 'block', 
                color: '#00d4ff', 
                marginBottom: '12px', 
                fontSize: 'clamp(12px, 3vw, 14px)',
                fontWeight: 'bold'
              }}>
                🏷️ KATEGORIYA TANLANG
              </label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '10px'
              }}>
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setNewGoal({ ...newGoal, category: cat.value })}
                    style={{
                      padding: 'clamp(10px, 2.5vw, 12px)',
                      background: newGoal.category === cat.value 
                        ? 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)' 
                        : '#0a0e27',
                      border: `2px solid ${newGoal.category === cat.value ? '#00d4ff' : '#1e3a5f'}`,
                      borderRadius: '8px',
                      color: newGoal.category === cat.value ? '#fff' : '#aaa',
                      cursor: 'pointer',
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      fontWeight: newGoal.category === cat.value ? 'bold' : 'normal',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: newGoal.category === cat.value 
                        ? '0 4px 15px rgba(0, 212, 255, 0.3)' 
                        : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (newGoal.category !== cat.value) {
                        e.target.style.borderColor = '#00d4ff'
                        e.target.style.color = '#fff'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (newGoal.category !== cat.value) {
                        e.target.style.borderColor = '#1e3a5f'
                        e.target.style.color = '#aaa'
                      }
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{cat.emoji}</span>
                    <span>{cat.label.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={addGoal}
                style={{
                  flex: '1 1 calc(50% - 6px)',
                  minWidth: '120px',
                  padding: 'clamp(12px, 3vw, 16px)',
                  background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: 'clamp(13px, 3.5vw, 16px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(0, 212, 255, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.4)'
                }}
              >
                ✅ SAQLASH
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewGoal({ title: '', category: '' })
                }}
                style={{
                  flex: '1 1 calc(50% - 6px)',
                  minWidth: '120px',
                  padding: 'clamp(12px, 3vw, 16px)',
                  background: 'linear-gradient(135deg, #ff0055 0%, #cc0044 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: 'clamp(13px, 3.5vw, 16px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(255, 0, 85, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 20px rgba(255, 0, 85, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 15px rgba(255, 0, 85, 0.4)'
                }}
              >
                ❌ BEKOR QILISH
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Maslahat Modal */}
      {showAdviceModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          backdropFilter: 'blur(5px)',
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a2332 0%, #0f1923 100%)',
            borderRadius: '16px',
            padding: 'clamp(20px, 5vw, 32px)',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '3px solid #00ff88',
            boxShadow: '0 20px 60px rgba(0, 255, 136, 0.3)',
            animation: 'modalSlideIn 0.3s ease-out'
          }}>
            <h3 style={{ 
              color: '#00ff88', 
              marginTop: 0, 
              marginBottom: 'clamp(16px, 4vw, 24px)', 
              textAlign: 'center',
              fontSize: 'clamp(16px, 4vw, 22px)',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              🎯 SHAXSIY MASLAHAT
            </h3>

            {loadingAdvice ? (
              <div style={{ textAlign: 'center', padding: 'clamp(30px, 8vw, 40px) 20px' }}>
                <div style={{
                  width: 'clamp(50px, 12vw, 60px)',
                  height: 'clamp(50px, 12vw, 60px)',
                  border: '4px solid #1e3a5f',
                  borderTop: '4px solid #00ff88',
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  animation: 'spin 1s linear infinite'
                }}>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
                <p style={{ color: '#00ff88', fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 'bold' }}>
                  AI tahlil qilmoqda...
                </p>
                <p style={{ color: '#aaa', fontSize: 'clamp(12px, 3vw, 14px)', marginTop: '8px' }}>
                  Sizning barcha ma'lumotlaringiz ko'rib chiqilmoqda
                </p>
              </div>
            ) : (
              <>
                <div style={{
                  background: '#0a0e27',
                  borderRadius: '12px',
                  padding: 'clamp(16px, 4vw, 20px)',
                  marginBottom: 'clamp(16px, 4vw, 24px)',
                  border: '2px solid #1e3a5f',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.8',
                  color: '#fff',
                  fontSize: 'clamp(13px, 3.5vw, 15px)'
                }}>
                  {aiAdvice}
                </div>
                
                <button
                  onClick={() => setShowAdviceModal(false)}
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 3vw, 16px)',
                    background: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
                    color: '#0a0e27',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: 'clamp(14px, 3.5vw, 16px)',
                    boxShadow: '0 4px 15px rgba(0, 255, 136, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 136, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 255, 136, 0.4)'
                  }}
                >
                  ✅ TUSHUNDIM
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  )
}
