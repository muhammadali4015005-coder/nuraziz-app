import { useState, useEffect } from 'react'
import { NotificationManager } from '../Notification'

export default function VideoMaslahatTab({ userData }) {
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null)
  
  // Yangi state'lar
  const [goalType, setGoalType] = useState('') // 'english', 'fitness', 'other'
  const [goalDetails, setGoalDetails] = useState({
    currentLevel: '', // Hozirgi daraja
    targetLevel: '', // Maqsad daraja
    hoursPerDay: '', // Kuniga necha soat
    daysPerWeek: '', // Haftada necha kun
    deadline: '' // Qachongacha
  })
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  })
  const [aiPlan, setAiPlan] = useState(null)
  const [showDetailForm, setShowDetailForm] = useState(false)

  useEffect(() => {
    // Agar foydalanuvchida maqsadlar bo'lsa, barcha maqsadlar uchun tavsiyalar
    if (userData?.futureGoals && userData.futureGoals.length > 0) {
      // Birinchi maqsadni tanlash
      if (!selectedGoal) {
        setSelectedGoal(userData.futureGoals[0])
        detectGoalType(userData.futureGoals[0])
      }
      // Barcha maqsadlar uchun tavsiyalar generatsiya qilish
      generateAllRecommendations(userData.futureGoals)
    }
  }, [userData])

  // Maqsad turini aniqlash
  const detectGoalType = (goal) => {
    if (!goal) return
    
    const titleLower = goal.title.toLowerCase()
    
    // Ingliz tili
    if (titleLower.includes('english') || titleLower.includes('ingliz') || 
        titleLower.includes('ielts') || titleLower.includes('toefl')) {
      setGoalType('english')
      setShowDetailForm(true)
    }
    // Fitness
    else if (titleLower.includes('kg') || titleLower.includes('vazn') || 
             titleLower.includes('turnik') || titleLower.includes('yugur') ||
             titleLower.includes('pull') || titleLower.includes('run')) {
      setGoalType('fitness')
      setShowDetailForm(true)
    }
    // Boshqa
    else {
      setGoalType('other')
      setShowDetailForm(true)
    }
  }

  // Haftalik reja generatsiya qilish
  const generateWeeklyPlan = () => {
    if (!goalDetails.hoursPerDay || !goalDetails.deadline) {
      NotificationManager.warning('XATO', 'Iltimos, barcha ma\'lumotlarni kiriting!')
      return
    }

    // Tanlangan kunlarni hisoblash
    const selectedDays = Object.keys(weeklySchedule).filter(day => weeklySchedule[day])
    
    if (selectedDays.length === 0) {
      NotificationManager.warning('XATO', 'Iltimos, kamida bitta kunni tanlang!')
      return
    }

    // Deadline gacha qancha kun qolganini hisoblash
    const today = new Date()
    const deadlineDate = new Date(goalDetails.deadline)
    const daysUntilDeadline = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
    
    if (daysUntilDeadline <= 0) {
      NotificationManager.warning('XATO', 'Deadline o\'tib ketgan! Yangi sana tanlang.')
      return
    }

    // Haftalik rejani hisoblash
    const weeksUntilDeadline = Math.ceil(daysUntilDeadline / 7)
    const totalHours = parseFloat(goalDetails.hoursPerDay) * selectedDays.length * weeksUntilDeadline
    
    // Maqsad turiga qarab reja
    let plan = {
      totalDays: daysUntilDeadline,
      totalWeeks: weeksUntilDeadline,
      totalHours: totalHours,
      hoursPerDay: goalDetails.hoursPerDay,
      daysPerWeek: selectedDays.length,
      selectedDays: selectedDays,
      schedule: []
    }

    // Ingliz tili uchun
    if (goalType === 'english') {
      plan.schedule = [
        { week: 1, focus: 'Grammar basics, Simple tenses', hours: parseFloat(goalDetails.hoursPerDay) * selectedDays.length },
        { week: 2, focus: 'Vocabulary building, Reading practice', hours: parseFloat(goalDetails.hoursPerDay) * selectedDays.length },
        { week: 3, focus: 'Listening practice, Pronunciation', hours: parseFloat(goalDetails.hoursPerDay) * selectedDays.length },
        { week: 4, focus: 'Speaking practice, Conversation', hours: parseFloat(goalDetails.hoursPerDay) * selectedDays.length }
      ]
      
      // Agar ko'proq hafta bo'lsa, takrorlash
      for (let i = 5; i <= weeksUntilDeadline; i++) {
        const focusIndex = (i - 1) % 4
        plan.schedule.push({
          week: i,
          focus: plan.schedule[focusIndex].focus,
          hours: parseFloat(goalDetails.hoursPerDay) * selectedDays.length
        })
      }
    }
    // Fitness uchun
    else if (goalType === 'fitness') {
      plan.schedule = [
        { week: 1, focus: 'Warm-up, Basic exercises, Stretching', hours: parseFloat(goalDetails.hoursPerDay) * selectedDays.length },
        { week: 2, focus: 'Strength training, Core exercises', hours: parseFloat(goalDetails.hoursPerDay) * selectedDays.length },
        { week: 3, focus: 'Cardio, Endurance training', hours: parseFloat(goalDetails.hoursPerDay) * selectedDays.length },
        { week: 4, focus: 'Advanced exercises, High intensity', hours: parseFloat(goalDetails.hoursPerDay) * selectedDays.length }
      ]
      
      for (let i = 5; i <= weeksUntilDeadline; i++) {
        const focusIndex = (i - 1) % 4
        plan.schedule.push({
          week: i,
          focus: plan.schedule[focusIndex].focus,
          hours: parseFloat(goalDetails.hoursPerDay) * selectedDays.length
        })
      }
    }
    // Boshqa maqsadlar uchun
    else {
      for (let i = 1; i <= weeksUntilDeadline; i++) {
        plan.schedule.push({
          week: i,
          focus: `Week ${i} - Practice and improve`,
          hours: parseFloat(goalDetails.hoursPerDay) * selectedDays.length
        })
      }
    }

    setAiPlan(plan)
  }

  const generateAllRecommendations = (goals) => {
    const allRecs = {
      videos: [],
      podcasts: [],
      books: []
    }

    goals.forEach(goal => {
      const recs = generateRecommendationsForGoal(goal)
      allRecs.videos.push(...recs.videos)
      allRecs.podcasts.push(...recs.podcasts)
      allRecs.books.push(...recs.books)
    })

    // Remove duplicates
    allRecs.videos = Array.from(new Set(allRecs.videos.map(v => v.title)))
      .map(title => allRecs.videos.find(v => v.title === title))
    allRecs.podcasts = Array.from(new Set(allRecs.podcasts.map(p => p.title)))
      .map(title => allRecs.podcasts.find(p => p.title === title))
    allRecs.books = Array.from(new Set(allRecs.books.map(b => b.title)))
      .map(title => allRecs.books.find(b => b.title === title))

    setAiRecommendations(allRecs)
  }

  const generateRecommendations = (goal) => {
    const recs = generateRecommendationsForGoal(goal)
    setAiRecommendations(recs)
  }

  const generateRecommendationsForGoal = (goal) => {
    if (!goal) return {
      videos: [],
      podcasts: [],
      books: []
    }

    // Maqsadga qarab tavsiyalar generatsiya qilish
    const recommendations = {
      videos: [],
      podcasts: [],
      books: []
    }

    const goalLower = goal.title.toLowerCase()

    // Turnik/Pull-up tavsiyalari
    if (goalLower.includes('turnik') || goalLower.includes('pull') || goalLower.includes('tortish')) {
      recommendations.videos = [
        { title: 'Pull-up progression for beginners', query: 'pull up progression tutorial' },
        { title: 'How to do your first pull-up', query: 'first pull up tutorial' },
        { title: 'Pull-up workout routine', query: 'pull up workout routine' },
        { title: 'Turnik mashqlari boshlang\'ichlar uchun', query: 'turnik mashqlari uzbek' }
      ]
      recommendations.podcasts = [
        { title: 'Calisthenics training tips', query: 'calisthenics podcast' },
        { title: 'Strength training podcast', query: 'strength training podcast' }
      ]
      recommendations.books = [
        { title: 'Overcoming Gravity - Steven Low', query: 'overcoming gravity book' },
        { title: 'Convict Conditioning - Paul Wade', query: 'convict conditioning book' }
      ]
    }
    // Yugurish/Running tavsiyalari
    else if (goalLower.includes('yugur') || goalLower.includes('run') || goalLower.includes('km')) {
      recommendations.videos = [
        { title: 'Running for beginners', query: 'running for beginners' },
        { title: 'How to run faster', query: 'how to run faster' },
        { title: 'Marathon training plan', query: 'marathon training plan' }
      ]
      recommendations.podcasts = [
        { title: 'Running podcast', query: 'running podcast' },
        { title: 'Marathon training podcast', query: 'marathon podcast' }
      ]
      recommendations.books = [
        { title: 'Born to Run - Christopher McDougall', query: 'born to run book' },
        { title: 'Running Formula - Jack Daniels', query: 'running formula book' }
      ]
    }
    // Og'irlik/Weight tavsiyalari
    else if (goalLower.includes('kg') || goalLower.includes('vazn') || goalLower.includes('weight')) {
      recommendations.videos = [
        { title: 'Weight loss tips', query: 'weight loss tips' },
        { title: 'Fat burning workout', query: 'fat burning workout' },
        { title: 'Healthy eating habits', query: 'healthy eating habits' }
      ]
      recommendations.podcasts = [
        { title: 'Weight loss podcast', query: 'weight loss podcast' },
        { title: 'Nutrition podcast', query: 'nutrition podcast' }
      ]
      recommendations.books = [
        { title: 'Atomic Habits - James Clear', query: 'atomic habits book' },
        { title: 'The Obesity Code - Jason Fung', query: 'obesity code book' }
      ]
    }
    // Umumiy fitness tavsiyalari
    else {
      recommendations.videos = [
        { title: 'Fitness motivation', query: 'fitness motivation' },
        { title: 'Workout routine', query: 'workout routine' },
        { title: 'Goal setting tips', query: 'goal setting fitness' }
      ]
      recommendations.podcasts = [
        { title: 'Fitness podcast', query: 'fitness podcast' },
        { title: 'Motivation podcast', query: 'motivation podcast' }
      ]
      recommendations.books = [
        { title: 'Atomic Habits - James Clear', query: 'atomic habits book' },
        { title: 'Can\'t Hurt Me - David Goggins', query: 'cant hurt me book' }
      ]
    }

    return recommendations
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!userInput.trim()) {
      NotificationManager.warning('XATO', 'Qidirish so\'zini kiriting!')
      return
    }

    setLoading(true)
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`
    window.open(searchUrl, '_blank')
    setLoading(false)
  }

  return (
    <div className="card">
      <h2>VIDEO MASLAHAT</h2>

      {/* Maqsad tanlash va batafsil ma'lumot */}
      {userData?.futureGoals && userData.futureGoals.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#00d4ff', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              MAQSADINGIZNI TANLANG:
            </label>
            <select
              value={selectedGoal?.id || ''}
              onChange={(e) => {
                const goal = userData.futureGoals.find(g => g.id === parseInt(e.target.value))
                setSelectedGoal(goal)
                detectGoalType(goal)
                if (e.target.value === 'all') {
                  generateAllRecommendations(userData.futureGoals)
                  setShowDetailForm(false)
                } else {
                  generateRecommendations(goal)
                }
              }}
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
            >
              <option value="all">BARCHA MAQSADLAR</option>
              {userData.futureGoals.map(goal => (
                <option key={goal.id} value={goal.id}>
                  {goal.title} ({goal.current}/{goal.target} {goal.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Batafsil ma'lumot formasi */}
          {showDetailForm && selectedGoal && (
            <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '20px', border: '2px solid #ffaa00' }}>
              <h3 style={{ color: '#ffaa00', marginTop: 0, marginBottom: '16px' }}>
                📋 BATAFSIL MA'LUMOT
              </h3>
              
              <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '16px' }}>
                Maqsad: <span style={{ color: '#fff', fontWeight: 'bold' }}>{selectedGoal.title}</span>
                {goalType === 'english' && ' (Ingliz tili)'}
                {goalType === 'fitness' && ' (Fitness)'}
              </p>

              {/* Hozirgi daraja */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Hozirgi darajangiz:
                </label>
                <input
                  type="text"
                  value={goalDetails.currentLevel}
                  onChange={(e) => setGoalDetails({ ...goalDetails, currentLevel: e.target.value })}
                  placeholder={goalType === 'english' ? 'Masalan: A1, A2, B1...' : 'Masalan: Boshlang\'ich, O\'rta...'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#16213e',
                    border: '2px solid #0f3460',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Maqsad daraja */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Maqsad darajangiz:
                </label>
                <input
                  type="text"
                  value={goalDetails.targetLevel}
                  onChange={(e) => setGoalDetails({ ...goalDetails, targetLevel: e.target.value })}
                  placeholder={goalType === 'english' ? 'Masalan: B2, C1, IELTS 7.0...' : 'Masalan: Yuqori, Professional...'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#16213e',
                    border: '2px solid #0f3460',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Kuniga necha soat */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Kuniga necha soat o'rganasiz/mashq qilasiz?
                </label>
                <input
                  type="number"
                  value={goalDetails.hoursPerDay}
                  onChange={(e) => setGoalDetails({ ...goalDetails, hoursPerDay: e.target.value })}
                  placeholder="Masalan: 2"
                  min="0.5"
                  step="0.5"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#16213e',
                    border: '2px solid #0f3460',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Haftalik kunlar */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Qaysi kunlarda o'rganasiz/mashq qilasiz?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    { key: 'monday', label: 'Dushanba' },
                    { key: 'tuesday', label: 'Seshanba' },
                    { key: 'wednesday', label: 'Chorshanba' },
                    { key: 'thursday', label: 'Payshanba' },
                    { key: 'friday', label: 'Juma' },
                    { key: 'saturday', label: 'Shanba' },
                    { key: 'sunday', label: 'Yakshanba' }
                  ].map(day => (
                    <button
                      key={day.key}
                      onClick={() => setWeeklySchedule({ ...weeklySchedule, [day.key]: !weeklySchedule[day.key] })}
                      style={{
                        padding: '10px',
                        background: weeklySchedule[day.key] ? '#00ff88' : '#16213e',
                        color: weeklySchedule[day.key] ? '#0a0e27' : '#fff',
                        border: `2px solid ${weeklySchedule[day.key] ? '#00ff88' : '#0f3460'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      {weeklySchedule[day.key] && '✓ '}{day.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                  Qachongacha erishmoqchisiz?
                </label>
                <input
                  type="date"
                  value={goalDetails.deadline}
                  onChange={(e) => setGoalDetails({ ...goalDetails, deadline: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#16213e',
                    border: '2px solid #0f3460',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Reja generatsiya qilish */}
              <button
                onClick={generateWeeklyPlan}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#00ff88',
                  color: '#0a0e27',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                HAFTALIK REJA YARATISH
              </button>
            </div>
          )}

          {/* AI Reja */}
          {aiPlan && (
            <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '20px', border: '2px solid #00ff88' }}>
              <h3 style={{ color: '#00ff88', marginTop: 0, marginBottom: '16px' }}>
                📅 SIZNING HAFTALIK REJANGIZ
              </h3>
              
              <div style={{ marginBottom: '16px', padding: '16px', background: '#16213e', borderRadius: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>Jami kunlar:</p>
                    <p style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px', margin: 0 }}>{aiPlan.totalDays} kun</p>
                  </div>
                  <div>
                    <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>Jami haftalar:</p>
                    <p style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px', margin: 0 }}>{aiPlan.totalWeeks} hafta</p>
                  </div>
                  <div>
                    <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>Jami soatlar:</p>
                    <p style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px', margin: 0 }}>{aiPlan.totalHours} soat</p>
                  </div>
                  <div>
                    <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>Kuniga:</p>
                    <p style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px', margin: 0 }}>{aiPlan.hoursPerDay} soat</p>
                  </div>
                </div>
                
                <div style={{ marginTop: '12px' }}>
                  <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>Tanlangan kunlar:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {aiPlan.selectedDays.map(day => (
                      <span
                        key={day}
                        style={{
                          padding: '6px 12px',
                          background: '#00ff88',
                          color: '#0a0e27',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        {day === 'monday' && 'Dushanba'}
                        {day === 'tuesday' && 'Seshanba'}
                        {day === 'wednesday' && 'Chorshanba'}
                        {day === 'thursday' && 'Payshanba'}
                        {day === 'friday' && 'Juma'}
                        {day === 'saturday' && 'Shanba'}
                        {day === 'sunday' && 'Yakshanba'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Haftalik jadval */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {aiPlan.schedule.slice(0, 8).map((week, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#16213e',
                      border: '2px solid #0f3460',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                        {week.week}-hafta
                      </span>
                      <span style={{ color: '#aaa', fontSize: '12px' }}>
                        {week.hours} soat
                      </span>
                    </div>
                    <p style={{ color: '#fff', fontSize: '14px', margin: 0 }}>
                      {week.focus}
                    </p>
                  </div>
                ))}
                
                {aiPlan.schedule.length > 8 && (
                  <p style={{ color: '#aaa', fontSize: '12px', textAlign: 'center', marginTop: '8px' }}>
                    ... va yana {aiPlan.schedule.length - 8} hafta
                  </p>
                )}
              </div>
            </div>
          )}

          {aiRecommendations && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Video Tavsiyalar */}
              <div style={{ background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #ff0000' }}>
                <h3 style={{ color: '#ff0000', marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📺 VIDEO TAVSIYALAR
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {aiRecommendations.videos.map((video, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(video.query)}`
                        window.open(searchUrl, '_blank')
                      }}
                      style={{
                        padding: '12px',
                        background: '#16213e',
                        border: '2px solid #0f3460',
                        borderRadius: '8px',
                        color: '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#ff0000'
                        e.target.style.background = '#1a0000'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#0f3460'
                        e.target.style.background = '#16213e'
                      }}
                    >
                      {video.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Podcast Tavsiyalar */}
              <div style={{ background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #9b59b6' }}>
                <h3 style={{ color: '#9b59b6', marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🎙️ PODCAST TAVSIYALAR
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {aiRecommendations.podcasts.map((podcast, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(podcast.query)}`
                        window.open(searchUrl, '_blank')
                      }}
                      style={{
                        padding: '12px',
                        background: '#16213e',
                        border: '2px solid #0f3460',
                        borderRadius: '8px',
                        color: '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#9b59b6'
                        e.target.style.background = '#1a001a'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#0f3460'
                        e.target.style.background = '#16213e'
                      }}
                    >
                      {podcast.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kitob Tavsiyalar */}
              <div style={{ background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #f39c12' }}>
                <h3 style={{ color: '#f39c12', marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📚 KITOB TAVSIYALAR
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {aiRecommendations.books.map((book, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(book.query)}`
                        window.open(searchUrl, '_blank')
                      }}
                      style={{
                        padding: '12px',
                        background: '#16213e',
                        border: '2px solid #0f3460',
                        borderRadius: '8px',
                        color: '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#f39c12'
                        e.target.style.background = '#1a1000'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#0f3460'
                        e.target.style.background = '#16213e'
                      }}
                    >
                      {book.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Qo'lda qidirish */}
      <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #0f3460' }}>
        <p style={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '12px' }}>YOUTUBE DA VIDEO QIDIRISH</p>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Masalan: bodi bilding, yoga, english, futbol..."
            className="input"
            style={{ flex: 1, marginBottom: 0 }}
            disabled={loading}
            autoComplete="off"
          />
          <button
            type="submit"
            style={{
              padding: '12px 20px',
              background: '#ff0000',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}
            disabled={loading}
          >
            {loading ? 'YUKLANIMOQDA...' : 'QIDIRISH'}
          </button>
        </form>

        <p style={{ color: '#aaa', fontSize: '12px', textAlign: 'center' }}>
          Qidirish so'zini kiriting va QIDIRISH tugmasini bosing. YouTube da to'liq qidirish natijalarini ko'rasiz.
        </p>
      </div>

      <div style={{ marginTop: '24px', padding: '16px', background: '#0a0e27', borderRadius: '8px', borderLeft: '4px solid #00d4ff' }}>
        <p style={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '8px' }}>QANDAY ISHLAYDI:</p>
        <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>
          - Qidirish so'zini kiriting (masalan: bodi bilding, yoga, english, futbol, nutrition)
        </p>
        <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '4px' }}>
          - QIDIRISH tugmasini bosing
        </p>
        <p style={{ color: '#aaa', fontSize: '12px' }}>
          - YouTube da to'liq qidirish natijalarini ko'rasiz va istalgan videoni tanlaysiz
        </p>
      </div>
    </div>
  )
}
