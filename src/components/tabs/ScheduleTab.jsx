import { useState } from 'react'

export default function ScheduleTab({ userData, setUserData }) {
  const [time, setTime] = useState('')
  const [task, setTask] = useState('')

  const addSchedule = () => {
    if (!time || !task) {
      alert('Barcha maydonlarni to\'ldiring!')
      return
    }

    const today = new Date().toISOString().split('T')[0]
    if (!userData.schedule) userData.schedule = {}
    if (!userData.schedule[today]) userData.schedule[today] = []

    userData.schedule[today].push({
      id: Date.now(),
      time,
      name: task,
      completed: false
    })

    setUserData({ ...userData })
    setTime('')
    setTask('')
  }

  const today = new Date().toISOString().split('T')[0]
  const schedule = userData.schedule?.[today] || []

  return (
    <div className="card">
      <h2>📅 KUNLIK JADVAL</h2>
      
      <div className="grid-2" style={{ marginBottom: '18px' }}>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Vazifa nomi"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="input"
        />
      </div>
      
      <button onClick={addSchedule} className="btn">➕ QO'SHISH</button>
      
      <div style={{ marginTop: '24px' }}>
        {schedule.length === 0 ? (
          <div className="item"><span>Bugun uchun vazifalar yo\'q</span></div>
        ) : (
          schedule.map(s => (
            <div key={s.id} className={`item ${s.completed ? 'completed' : ''}`}>
              <div>
                <span style={{ fontWeight: 'bold', color: '#00d4ff' }}>{s.time}</span>
                <span style={{ marginLeft: '12px' }}>{s.name}</span>
              </div>
              <button
                onClick={() => {
                  s.completed = !s.completed
                  setUserData({ ...userData })
                }}
                style={{
                  background: s.completed ? '#00ff88' : '#ffaa00',
                  color: '#0a0e27',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {s.completed ? '✓' : '○'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
