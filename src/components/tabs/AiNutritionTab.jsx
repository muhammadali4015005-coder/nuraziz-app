import { useState, useEffect } from 'react'

function AiNutritionTab({ userData }) {
  const [nutrition, setNutrition] = useState({
    breakfast: { time: '08:00', water: 0, foods: '' },
    lunch: { time: '12:00', water: 0, foods: '' },
    dinner: { time: '18:00', water: 0, foods: '' }
  })
  const [analysis, setAnalysis] = useState('')

  useEffect(() => {
    // Check if we need to reset nutrition for new day
    checkAndResetNutrition()
  }, [userData?.phone])

  const checkAndResetNutrition = async () => {
    if (!userData?.phone) return
    
    const today = new Date().toISOString().split('T')[0]
    const nutritionDate = userData?.nutrition?.date
    
    // If nutrition date is not today, reset it
    if (!nutritionDate || nutritionDate !== today) {
      const emptyNutrition = {
        date: today,
        breakfast: { time: '08:00', water: '', foods: '' },
        lunch: { time: '12:00', water: '', foods: '' },
        dinner: { time: '18:00', water: '', foods: '' }
      }
      
      setNutrition(emptyNutrition)
      
      try {
        await fetch('/api/save-nutrition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: userData.phone,
            nutrition: emptyNutrition
          })
        })
        console.log('✅ Ovqatlanish ma\'lumotlari yangilandi:', today)
      } catch (err) {
        console.error('Error resetting nutrition:', err)
      }
    } else {
      // Load today's nutrition data
      if (userData?.nutrition) {
        setNutrition(userData.nutrition)
      }
    }
  }

  const saveNutrition = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const nutritionWithDate = { ...nutrition, date: today }
      
      await fetch('/api/save-nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: userData.phone, nutrition: nutritionWithDate })
      })
      alert('Saqlandi!')
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const analyzeFood = () => {
    const allFoods = `Nonushta: ${nutrition.breakfast.foods}\nTushlik: ${nutrition.lunch.foods}\nKechki: ${nutrition.dinner.foods}`
    if (!allFoods.trim()) {
      alert('Ovqat ma\'lumotini to\'ldiring!')
      return
    }
    
    // Get daily schedule info
    const schedule = userData?.dailySchedule || []
    const completedTasks = schedule.filter(t => t.completed === true).length
    const totalTasks = schedule.length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    let result = '📊 OVQAT TAHLILI\n\n'
    
    // Daily schedule analysis
    if (totalTasks > 0) {
      result += `📅 KUNLIK TARTIB: ${completedTasks}/${totalTasks} vazifa bajarildi (${completionRate}%)\n\n`
      
      if (completionRate >= 70) {
        result += '✅ AJOYIB! Faol kunlaringizda ko\'proq energiya kerak:\n'
        result += '• Orin va baliq yiyin (protein)\n'
        result += '• Meva va sabzi ko\'proq iching (vitamin)\n'
        result += '• 3 litr suv iching\n\n'
      } else if (completionRate >= 40) {
        result += '👍 YAXSHI! Energiya uchun:\n'
        result += '• Orin va tuxum yiyin\n'
        result += '• Sabzi va meva iching\n'
        result += '• 2.5 litr suv iching\n\n'
      } else {
        result += '⚠️ KAM FAOLLIK! Energiya oshirish uchun:\n'
        result += '• Nonushta qoldirmang!\n'
        result += '• Meva va sabzi ko\'proq iching\n'
        result += '• 2 litr suv iching\n\n'
      }
    }
    
    const harmful = ['tuxum', 'gazli', 'qand', 'fast food', 'chipsi', 'shokolad']
    const healthy = ['sabzi', 'meva', 'baliq', 'orin', 'yong\'oq', 'sut']
    
    let hasHarmful = false
    harmful.forEach(f => {
      if (allFoods.toLowerCase().includes(f)) {
        result += `❌ ZARARLIY: ${f}\n`
        hasHarmful = true
      }
    })
    
    let hasHealthy = false
    healthy.forEach(f => {
      if (allFoods.toLowerCase().includes(f)) {
        result += `✅ FOYDALI: ${f}\n`
        hasHealthy = true
      }
    })
    
    if (!hasHarmful && !hasHealthy) {
      result += '💡 Ovqat tahlili: Sabzi va mevalarni ko\'proq iching!\n'
    }
    
    result += '\n💪 TAVSIYALAR:\n'
    result += '• Har kuni 2-3 litr suv iching\n'
    result += '• Gazli ichimlikdan saqlaning\n'
    result += '• Baliq va orin yiyin\n'
    result += '• Meva va sabzavot ko\'proq iste\'mol qiling'
    
    setAnalysis(result)
  }



  return (
    <div className="card">
      <h2>AI OVQATLANISH</h2>
      {userData?.name && (
        <p style={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
          {userData.name}
        </p>
      )}

      <div style={{ marginBottom: '16px', background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '12px' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '8px' }}>NONUSHTA</h3>
        <input type="time" value={nutrition.breakfast.time} onChange={(e) => setNutrition({...nutrition, breakfast: {...nutrition.breakfast, time: e.target.value}})} style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', marginBottom: '8px', boxSizing: 'border-box' }} />
        <input type="text" placeholder="Nima ichdingizni yozing" value={nutrition.breakfast.water || ''} onChange={(e) => setNutrition({...nutrition, breakfast: {...nutrition.breakfast, water: e.target.value}})} style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', marginBottom: '8px', boxSizing: 'border-box' }} />
        <textarea value={nutrition.breakfast.foods} onChange={(e) => setNutrition({...nutrition, breakfast: {...nutrition.breakfast, foods: e.target.value}})} placeholder="Ovqatlar" style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', minHeight: '50px', boxSizing: 'border-box' }} />
      </div>

      <div style={{ marginBottom: '16px', background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '12px' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '8px' }}>TUSHLIK</h3>
        <input type="time" value={nutrition.lunch.time} onChange={(e) => setNutrition({...nutrition, lunch: {...nutrition.lunch, time: e.target.value}})} style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', marginBottom: '8px', boxSizing: 'border-box' }} />
        <input type="text" placeholder="Nima ichdingizni yozing" value={nutrition.lunch.water || ''} onChange={(e) => setNutrition({...nutrition, lunch: {...nutrition.lunch, water: e.target.value}})} style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', marginBottom: '8px', boxSizing: 'border-box' }} />
        <textarea value={nutrition.lunch.foods} onChange={(e) => setNutrition({...nutrition, lunch: {...nutrition.lunch, foods: e.target.value}})} placeholder="Ovqatlar" style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', minHeight: '50px', boxSizing: 'border-box' }} />
      </div>

      <div style={{ marginBottom: '16px', background: '#0a0e27', border: '2px solid #0f3460', borderRadius: '8px', padding: '12px' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '8px' }}>KECHKI</h3>
        <input type="time" value={nutrition.dinner.time} onChange={(e) => setNutrition({...nutrition, dinner: {...nutrition.dinner, time: e.target.value}})} style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', marginBottom: '8px', boxSizing: 'border-box' }} />
        <input type="text" placeholder="Nima ichdingizni yozing" value={nutrition.dinner.water || ''} onChange={(e) => setNutrition({...nutrition, dinner: {...nutrition.dinner, water: e.target.value}})} style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', marginBottom: '8px', boxSizing: 'border-box' }} />
        <textarea value={nutrition.dinner.foods} onChange={(e) => setNutrition({...nutrition, dinner: {...nutrition.dinner, foods: e.target.value}})} placeholder="Ovqatlar" style={{ width: '100%', padding: '6px', background: '#16213e', border: '2px solid #0f3460', color: '#00d4ff', borderRadius: '4px', minHeight: '50px', boxSizing: 'border-box' }} />
      </div>

      {analysis && (
        <div style={{ marginBottom: '16px', background: '#0a0e27', border: '2px solid #00ff88', borderRadius: '8px', padding: '12px' }}>
          <p style={{ color: '#aaa', whiteSpace: 'pre-wrap', fontSize: '12px' }}>{analysis}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={saveNutrition} style={{ flex: 1, padding: '10px', background: '#00d4ff', color: '#0a0e27', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>💾 SAQLASH</button>
        <button onClick={analyzeFood} style={{ flex: 1, padding: '10px', background: '#00ff88', color: '#0a0e27', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>📊 TAHLIL</button>
      </div>
    </div>
  )
}

export default AiNutritionTab
