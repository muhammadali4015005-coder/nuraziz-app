export default function InsightsTab({ userData }) {
  // Analyze daily schedule
  const analyzeDailySchedule = () => {
    const schedule = userData?.dailySchedule || []
    const history = userData?.scheduleHistory || []
    
    if (schedule.length === 0 && history.length === 0) {
      return null
    }
    
    const totalTasks = schedule.length
    const completedTasks = schedule.filter(t => t.completed === true).length
    const incompleteTasks = schedule.filter(t => t.completed === false).length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    // Analyze history
    let totalHistoryDays = history.length
    let totalHistoryTasks = 0
    let totalHistoryCompleted = 0
    
    history.forEach(day => {
      totalHistoryTasks += day.schedule.length
      totalHistoryCompleted += day.schedule.filter(t => t.completed === true).length
    })
    
    const avgCompletionRate = totalHistoryTasks > 0 
      ? Math.round((totalHistoryCompleted / totalHistoryTasks) * 100) 
      : 0
    
    return {
      totalTasks,
      completedTasks,
      incompleteTasks,
      completionRate,
      totalHistoryDays,
      avgCompletionRate
    }
  }
  
  const scheduleStats = analyzeDailySchedule()
  
  return (
    <div className="card">
      <h2>AI MASLAHATLAR</h2>
      
      {scheduleStats && (
        <div style={{ 
          background: '#0a0e27', 
          borderRadius: '12px', 
          padding: '16px', 
          border: '2px solid #0f3460',
          marginBottom: '16px'
        }}>
          <h3 style={{ color: '#00d4ff', marginTop: 0 }}>KUNLIK TARTIB TAHLILI</h3>
          
          {/* Bugungi kun tahlili */}
          {scheduleStats.totalTasks > 0 && (
            <div style={{ 
              background: '#16213e', 
              padding: '12px', 
              borderRadius: '8px',
              border: `2px solid ${scheduleStats.completionRate >= 70 ? '#00ff88' : scheduleStats.completionRate >= 40 ? '#ffaa00' : '#ff0055'}`,
              marginBottom: '12px'
            }}>
              <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 8px 0' }}>BUGUNGI KUN:</p>
              <p style={{ 
                color: scheduleStats.completionRate >= 70 ? '#00ff88' : scheduleStats.completionRate >= 40 ? '#ffaa00' : '#ff0055',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: '0 0 8px 0'
              }}>
                {scheduleStats.completedTasks}/{scheduleStats.totalTasks} vazifa bajarildi ({scheduleStats.completionRate}%)
              </p>
              
              {scheduleStats.completionRate >= 80 && (
                <p style={{ color: '#00ff88', fontSize: '14px', margin: 0 }}>
                  ✓ Ajoyib! Siz juda faolsiz! Shunday davom eting!
                </p>
              )}
              
              {scheduleStats.completionRate >= 50 && scheduleStats.completionRate < 80 && (
                <p style={{ color: '#ffaa00', fontSize: '14px', margin: 0 }}>
                  ⚠ Yaxshi! Yana {scheduleStats.incompleteTasks} ta vazifa qoldi. Ularni ham bajaring!
                </p>
              )}
              
              {scheduleStats.completionRate < 50 && scheduleStats.completionRate > 0 && (
                <p style={{ color: '#ff0055', fontSize: '14px', margin: 0 }}>
                  ✗ Diqqat! {scheduleStats.incompleteTasks} ta vazifa bajarilmagan. Vaqtingizni yaxshiroq rejalashtiring!
                </p>
              )}
              
              {scheduleStats.completionRate === 0 && (
                <p style={{ color: '#ff0055', fontSize: '14px', margin: 0 }}>
                  ✗ Hech qanday vazifa bajarilmagan! Kunlik tartibga qaytib, vazifalarni bajaring!
                </p>
              )}
            </div>
          )}
          
          {/* Umumiy tahlil */}
          {scheduleStats.totalHistoryDays > 0 && (
            <div style={{ 
              background: '#16213e', 
              padding: '12px', 
              borderRadius: '8px',
              border: '2px solid #00d4ff',
              marginBottom: '12px'
            }}>
              <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 8px 0' }}>UMUMIY TAHLIL:</p>
              <p style={{ color: '#00d4ff', fontSize: '14px', margin: '0 0 4px 0' }}>
                • {scheduleStats.totalHistoryDays} kun tartib saqlandi
              </p>
              <p style={{ color: '#00d4ff', fontSize: '14px', margin: '0 0 4px 0' }}>
                • O'rtacha bajarish: {scheduleStats.avgCompletionRate}%
              </p>
              
              {scheduleStats.avgCompletionRate >= 70 && (
                <p style={{ color: '#00ff88', fontSize: '14px', margin: '8px 0 0 0' }}>
                  ✓ Siz juda tartibli va faol odamsiz! Davom eting!
                </p>
              )}
              
              {scheduleStats.avgCompletionRate >= 40 && scheduleStats.avgCompletionRate < 70 && (
                <p style={{ color: '#ffaa00', fontSize: '14px', margin: '8px 0 0 0' }}>
                  ⚠ Yaxshi natija! Yana bir oz harakat qiling!
                </p>
              )}
              
              {scheduleStats.avgCompletionRate < 40 && (
                <p style={{ color: '#ff0055', fontSize: '14px', margin: '8px 0 0 0' }}>
                  ✗ Tartibni yaxshilash kerak! Kunlik tartibga ko'proq e'tibor bering!
                </p>
              )}
            </div>
          )}
          
          {/* AI Tavsiyalar */}
          <div style={{ 
            background: '#16213e', 
            padding: '12px', 
            borderRadius: '8px',
            border: '2px solid #00ff88'
          }}>
            <p style={{ color: '#00ff88', fontSize: '12px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              AI TAVSIYALAR:
            </p>
            
            {scheduleStats.completionRate < 50 && (
              <>
                <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px 0' }}>
                  • Kunlik tartibni ertalab rejalashtiring
                </p>
                <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px 0' }}>
                  • Kichik vazifalardan boshlang
                </p>
                <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px 0' }}>
                  • Har bir vazifaga vaqt belgilang
                </p>
              </>
            )}
            
            {scheduleStats.completionRate >= 50 && scheduleStats.completionRate < 80 && (
              <>
                <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px 0' }}>
                  • Qolgan vazifalarni birinchi bajaring
                </p>
                <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px 0' }}>
                  • Vaqtni yaxshiroq taqsimlang
                </p>
                <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px 0' }}>
                  • Muhim vazifalarni birinchi qo'ying
                </p>
              </>
            )}
            
            {scheduleStats.completionRate >= 80 && (
              <>
                <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px 0' }}>
                  • Ajoyib! Shunday davom eting!
                </p>
                <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px 0' }}>
                  • Yangi maqsadlar qo'ying
                </p>
                <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 6px 0' }}>
                  • Boshqalarga o'rnak bo'ling
                </p>
              </>
            )}
            
            <p style={{ color: '#aaa', fontSize: '13px', margin: '6px 0 0 0' }}>
              • Har kuni jildga saqlashni unutmang!
            </p>
          </div>
        </div>
      )}
      
      {!scheduleStats && (
        <div style={{ 
          background: '#0a0e27', 
          borderRadius: '12px', 
          padding: '16px', 
          border: '2px solid #0f3460'
        }}>
          <p style={{ color: '#aaa', textAlign: 'center' }}>
            Kunlik tartibda vazifalar yo'q. Kunlik Tartib bo'limiga o'ting va vazifalar qo'shing!
          </p>
        </div>
      )}
    </div>
  )
}
