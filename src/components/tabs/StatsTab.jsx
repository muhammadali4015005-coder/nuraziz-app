import { useState } from 'react'

export default function StatsTab({ userData }) {
  const [view, setView] = useState('weekly') // weekly, monthly, yearly

  // Get last 7 days from history
  const getWeeklyData = () => {
    const history = userData?.scheduleHistory || []
    return history.slice(-7).reverse()
  }

  // Calculate completion rate for a day
  const getDayCompletion = (schedule) => {
    if (!schedule || schedule.length === 0) return 0
    const completed = schedule.filter(t => t.completed === true).length
    return Math.round((completed / schedule.length) * 100)
  }

  // Donut chart component
  const DonutChart = ({ percentage, size = 120 }) => {
    const radius = (size - 20) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference
    
    const color = percentage >= 80 ? '#00ff88' : percentage >= 50 ? '#ffaa00' : '#ff0055'
    
    return (
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#16213e"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dy=".3em"
          fill={color}
          fontSize="24"
          fontWeight="bold"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
        >
          {percentage}%
        </text>
      </svg>
    )
  }

  const weeklyData = getWeeklyData()

  return (
    <div className="card">
      <h2>STATISTIKA</h2>

      {/* View selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setView('weekly')}
          style={{
            flex: 1,
            padding: '12px',
            background: view === 'weekly' ? '#00d4ff' : '#16213e',
            color: view === 'weekly' ? '#0a0e27' : '#00d4ff',
            border: '2px solid #00d4ff',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          HAFTALIK
        </button>
        <button
          onClick={() => setView('monthly')}
          style={{
            flex: 1,
            padding: '12px',
            background: view === 'monthly' ? '#00ff88' : '#16213e',
            color: view === 'monthly' ? '#0a0e27' : '#00ff88',
            border: '2px solid #00ff88',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          OYLIK
        </button>
        <button
          onClick={() => setView('yearly')}
          style={{
            flex: 1,
            padding: '12px',
            background: view === 'yearly' ? '#ffaa00' : '#16213e',
            color: view === 'yearly' ? '#0a0e27' : '#ffaa00',
            border: '2px solid #ffaa00',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          YILLIK
        </button>
      </div>

      {/* Weekly view */}
      {view === 'weekly' && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {weeklyData.map((day, index) => {
            const completion = getDayCompletion(day.schedule)
            const date = new Date(day.date)
            const dayName = date.toLocaleDateString('uz-UZ', { weekday: 'long' })
            const dateStr = date.toLocaleDateString('uz-UZ')
            
            return (
              <div key={index} style={{
                background: '#0a0e27',
                borderRadius: '12px',
                padding: '16px',
                border: '2px solid #0f3460'
              }}>
                <h3 style={{ color: '#00d4ff', margin: '0 0 8px 0', fontSize: '16px' }}>
                  {dayName}
                </h3>
                <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 16px 0' }}>
                  {dateStr}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <DonutChart percentage={completion} size={100} />
                </div>
                
                <div style={{ background: '#16213e', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ color: '#00ff88', fontSize: '12px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                    VAZIFALAR
                  </p>
                  {day.schedule && day.schedule.length > 0 ? day.schedule.slice(0, 5).map((task, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <span style={{ 
                        color: task.completed === true ? '#00ff88' : task.completed === false ? '#ff0055' : '#555',
                        fontSize: '16px'
                      }}>
                        {task.completed === true ? '✓' : task.completed === false ? '✗' : '○'}
                      </span>
                      <span style={{ 
                        color: '#aaa', 
                        fontSize: '11px',
                        textDecoration: task.completed === true ? 'line-through' : 'none'
                      }}>
                        {task.description && task.description.length > 20 ? task.description.substring(0, 20) + '...' : (task.description || '')}
                      </span>
                    </div>
                  )) : (
                    <p style={{ color: '#555', fontSize: '11px', margin: 0 }}>
                      Vazifalar yo'q
                    </p>
                  )}
                  {day.schedule && day.schedule.length > 5 && (
                    <p style={{ color: '#555', fontSize: '10px', margin: '4px 0 0 0' }}>
                      +{day.schedule.length - 5} ta yana...
                    </p>
                  )}
                </div>
              </div>
            )
          })}
          
          {weeklyData.length === 0 && (
            <p style={{ color: '#555', gridColumn: '1 / -1', textAlign: 'center' }}>
              Hali jildga saqlangan kunlar yo'q
            </p>
          )}
        </div>
      )}

      {/* Monthly view - Coming soon */}
      {view === 'monthly' && (
        <div style={{ 
          background: '#0a0e27', 
          borderRadius: '12px', 
          padding: '40px', 
          border: '2px solid #0f3460',
          textAlign: 'center'
        }}>
          <p style={{ color: '#00ff88', fontSize: '18px', fontWeight: 'bold' }}>
            OYLIK KO'RINISH
          </p>
          <p style={{ color: '#aaa', fontSize: '14px', marginTop: '8px' }}>
            Tez orada qo'shiladi...
          </p>
        </div>
      )}

      {/* Yearly view - Coming soon */}
      {view === 'yearly' && (
        <div style={{ 
          background: '#0a0e27', 
          borderRadius: '12px', 
          padding: '40px', 
          border: '2px solid #0f3460',
          textAlign: 'center'
        }}>
          <p style={{ color: '#ffaa00', fontSize: '18px', fontWeight: 'bold' }}>
            YILLIK KO'RINISH
          </p>
          <p style={{ color: '#aaa', fontSize: '14px', marginTop: '8px' }}>
            Tez orada qo'shiladi...
          </p>
        </div>
      )}
    </div>
  )
}
