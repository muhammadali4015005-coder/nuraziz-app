import { useState, useEffect } from 'react'
import { NotificationManager } from '../Notification'

export default function SettingsTab({ userData, setUserData }) {
  // 1. ISM / YOSH
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  
  // 2. JINS
  const [gender, setGender] = useState('') // 'male' yoki 'female'
  const [isHousewife, setIsHousewife] = useState(false) // uy bekasi
  
  // 3. IZOH
  const [notes, setNotes] = useState('')
  
  // 4. SPORT QILASIZMI?
  const [doesSport, setDoesSport] = useState(false)
  const [sportFrequency, setSportFrequency] = useState('') // '1' yoki '2'
  const [sport1Name, setSport1Name] = useState('')
  const [sport2Name, setSport2Name] = useState('')
  
  // 5. MAKTAB YOKI ISH (agar uy bekasi bo'lmasa)
  const [userType, setUserType] = useState('') // 'school', 'work', 'both'
  const [schoolGrade, setSchoolGrade] = useState('')
  const [workType, setWorkType] = useState('')
  const [workPosition, setWorkPosition] = useState('')
  const [workYears, setWorkYears] = useState('')
  const [workStartTime, setWorkStartTime] = useState('')
  const [workEndTime, setWorkEndTime] = useState('')

  // Eski state (backward compatibility)
  const [days, setDays] = useState('')
  const [morningType, setMorningType] = useState('')
  const [eveningType, setEveningType] = useState('')
  const [sportTypes, setSportTypes] = useState([])
  const [sportName, setSportName] = useState('Sport')

  const isDemo = userData?.phone === '+998901234567'

  // Initialize
  useEffect(() => {
    if (userData?.settings) {
      setName(userData.name || '')
      setAge(userData.settings.age || '')
      setGender(userData.settings.gender || '')
      setIsHousewife(userData.settings.isHousewife || false)
      setNotes(userData.settings.notes || '')
      setDoesSport(userData.settings.doesSport || false)
      setSportFrequency(userData.settings.sportFrequency || '')
      setSport1Name(userData.settings.sport1Name || '')
      setSport2Name(userData.settings.sport2Name || '')
      setUserType(userData.settings.userType || '')
      setSchoolGrade(userData.settings.schoolGrade || '')
      setWorkType(userData.settings.workType || '')
      setWorkPosition(userData.settings.workPosition || '')
      setWorkYears(userData.settings.workYears || '')
      setWorkStartTime(userData.settings.workStartTime || '')
      setWorkEndTime(userData.settings.workEndTime || '')
      
      // Eski
      setDays(userData.settings.sportDays || '')
      setMorningType(userData.settings.morningType || '')
      setEveningType(userData.settings.eveningType || '')
      setSportTypes(userData.settings.sportTypes || [])
      setSportName(userData.settings.sportName || 'Sport')
    }
  }, [userData?.phone])

  // Auto-save
  useEffect(() => {
    if (!userData?.phone) return

    const saveSettings = async () => {
      const updatedSettings = {
        age,
        gender,
        isHousewife,
        notes,
        doesSport,
        sportFrequency,
        sport1Name,
        sport2Name,
        userType,
        schoolGrade,
        workType,
        workPosition,
        workYears,
        workStartTime,
        workEndTime,
        // Eski
        sportDays: days,
        morningType,
        eveningType,
        sportTypes,
        sportName
      }
      
      const updatedUserData = { 
        ...userData, 
        name: isDemo ? userData.name : name,
        settings: updatedSettings 
      }
      setUserData(updatedUserData)
      
      if (!isDemo) {
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
    }

    const timer = setTimeout(saveSettings, 1000)
    return () => clearTimeout(timer)
  }, [name, age, gender, isHousewife, notes, doesSport, sportFrequency, sport1Name, sport2Name, userType, schoolGrade, workType, workPosition, workYears, workStartTime, workEndTime, days, morningType, eveningType, sportTypes, sportName, isDemo])

  return (
    <div className="card">
      <h2>SOZLAMALAR</h2>

      {/* 1. ISM / YOSH */}
      <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '20px', border: '2px solid #00d4ff' }}>
        <h3 style={{ color: '#00d4ff', marginTop: 0, marginBottom: '16px' }}>
          👤 ISM / YOSH
        </h3>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            Ismingiz:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ismingizni kiriting..."
            disabled={isDemo}
            style={{
              width: '100%',
              padding: '12px',
              background: isDemo ? '#16213e' : '#0a0e27',
              border: '2px solid #0f3460',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div>
          <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            Yoshingiz:
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Yoshingizni kiriting..."
            min="1"
            max="120"
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

      {/* 2. JINS */}
      <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '20px', border: '2px solid #ff00ff' }}>
        <h3 style={{ color: '#ff00ff', marginTop: 0, marginBottom: '16px' }}>
          👤 JINS
        </h3>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            Jinsingizni tanlang
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                setGender('male')
                setIsHousewife(false)
              }}
              style={{
                flex: 1,
                padding: '12px',
                background: gender === 'male' ? '#00d4ff' : '#16213e',
                color: gender === 'male' ? '#0a0e27' : '#fff',
                border: `2px solid ${gender === 'male' ? '#00d4ff' : '#0f3460'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              👨 ERKAK
            </button>
            <button
              onClick={() => setGender('female')}
              style={{
                flex: 1,
                padding: '12px',
                background: gender === 'female' ? '#00d4ff' : '#16213e',
                color: gender === 'female' ? '#0a0e27' : '#fff',
                border: `2px solid ${gender === 'female' ? '#00d4ff' : '#0f3460'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              👩 AYOL
            </button>
          </div>
        </div>

        {gender === 'female' && (
          <div style={{ background: '#16213e', padding: '16px', borderRadius: '8px', border: '2px solid #0f3460' }}>
            <label style={{ color: '#ff00ff', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
              Siz ishlaysizmi yoki uy bekasisizmi?
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setIsHousewife(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: !isHousewife ? '#00d4ff' : '#16213e',
                  color: !isHousewife ? '#0a0e27' : '#fff',
                  border: `2px solid ${!isHousewife ? '#00d4ff' : '#0f3460'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                💼 ISHLAYMAN
              </button>
              <button
                onClick={() => setIsHousewife(true)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: isHousewife ? '#00d4ff' : '#16213e',
                  color: isHousewife ? '#0a0e27' : '#fff',
                  border: `2px solid ${isHousewife ? '#00d4ff' : '#0f3460'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                🏠 UY BEKASI
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. IZOH */}
      <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '20px', border: '2px solid #ffaa00' }}>
        <h3 style={{ color: '#ffaa00', marginTop: 0, marginBottom: '16px' }}>
          📝 IZOH
        </h3>
        <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
          O'zingiz haqingizda qisqacha yozing:
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Masalan: Maqsadlarim, qiziqishlarim, rejalarim..."
          style={{
            width: '100%',
            padding: '12px',
            background: '#0a0e27',
            border: '2px solid #0f3460',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
            minHeight: '100px',
            resize: 'vertical',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* 4. SPORT QILASIZMI? */}
      <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '20px', border: '2px solid #00ff88' }}>
        <h3 style={{ color: '#00ff88', marginTop: 0, marginBottom: '16px' }}>
          💪 SPORT QILASIZMI?
        </h3>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                setDoesSport(true)
                if (!sportFrequency) setSportFrequency('1')
              }}
              style={{
                flex: 1,
                padding: '12px',
                background: doesSport ? '#00ff88' : '#16213e',
                color: doesSport ? '#0a0e27' : '#fff',
                border: `2px solid ${doesSport ? '#00ff88' : '#0f3460'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              ✅ HA
            </button>
            <button
              onClick={() => {
                setDoesSport(false)
                setSportFrequency('')
                setSport1Name('')
                setSport2Name('')
              }}
              style={{
                flex: 1,
                padding: '12px',
                background: !doesSport ? '#ff0055' : '#16213e',
                color: !doesSport ? '#fff' : '#aaa',
                border: `2px solid ${!doesSport ? '#ff0055' : '#0f3460'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              ❌ YO'Q
            </button>
          </div>
        </div>

        {doesSport && (
          <div style={{ background: '#16213e', padding: '16px', borderRadius: '8px', border: '2px solid #0f3460' }}>
            <label style={{ color: '#00ff88', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
              Kuniga necha mahal sport qilasiz?
            </label>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button
                onClick={() => {
                  setSportFrequency('1')
                  setSport2Name('')
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: sportFrequency === '1' ? '#00d4ff' : '#16213e',
                  color: sportFrequency === '1' ? '#0a0e27' : '#fff',
                  border: `2px solid ${sportFrequency === '1' ? '#00d4ff' : '#0f3460'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                1 MAHAL
              </button>
              <button
                onClick={() => setSportFrequency('2')}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: sportFrequency === '2' ? '#00d4ff' : '#16213e',
                  color: sportFrequency === '2' ? '#0a0e27' : '#fff',
                  border: `2px solid ${sportFrequency === '2' ? '#00d4ff' : '#0f3460'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                2 MAHAL
              </button>
            </div>

            {sportFrequency && (
              <>
                <div style={{ marginBottom: sportFrequency === '2' ? '16px' : '0' }}>
                  <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                    {sportFrequency === '1' ? 'Sport turi:' : '1-sport turi:'}
                  </label>
                  <input
                    type="text"
                    value={sport1Name}
                    onChange={(e) => setSport1Name(e.target.value)}
                    placeholder="Masalan: Yugurish, Suzish, Futbol..."
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

                {sportFrequency === '2' && (
                  <div>
                    <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                      2-sport turi:
                    </label>
                    <input
                      type="text"
                      value={sport2Name}
                      onChange={(e) => setSport2Name(e.target.value)}
                      placeholder="Masalan: Gym, Yoga, Tennis..."
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
                )}
              </>
            )}
          </div>
        )}
      </div>
