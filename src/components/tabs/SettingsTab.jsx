import { useState, useEffect } from 'react'
import { NotificationManager } from '../Notification'

export default function SettingsTab({ userData, setUserData }) {
  // 1. ISM / YOSH
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  
  // 2. JINS
  const [gender, setGender] = useState('') // 'male' yoki 'female'
  const [isHousewife, setIsHousewife] = useState(false) // uy bekasi
  
  // 3. MAQSAD
  const [goal, setGoal] = useState('')
  
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

  // 6. GEMINI API KEY
  const [geminiApiKey, setGeminiApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  const isDemo = userData?.phone === '+998901234567'

  // Initialize
  useEffect(() => {
    if (userData?.settings) {
      setName(userData.name || '')
      setAge(userData.settings.age || '')
      setGender(userData.settings.gender || '')
      setIsHousewife(userData.settings.isHousewife || false)
      setGoal(userData.settings.goal || '')
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
      setGeminiApiKey(userData.settings.geminiApiKey || '')
      
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
        goal,
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
        geminiApiKey,
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
          await fetch('/api/save-settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: userData.phone,
              name,
              settings: updatedSettings
            })
          })
        } catch (err) {
          console.error('Save error:', err)
        }
      }
    }

    const timer = setTimeout(saveSettings, 1000)
    return () => clearTimeout(timer)
  }, [name, age, gender, isHousewife, goal, doesSport, sportFrequency, sport1Name, sport2Name, userType, schoolGrade, workType, workPosition, workYears, workStartTime, workEndTime, geminiApiKey, days, morningType, eveningType, sportTypes, sportName, isDemo])

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
              👧 QIZ
            </button>
          </div>
        </div>

        {gender === 'female' && (
          <div style={{ background: '#16213e', padding: '16px', borderRadius: '8px', border: '2px solid #0f3460', marginTop: '16px' }}>
            <label style={{ color: '#ff00ff', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
              Siz o'qiysizmi, ishlaysizmi yoki uy bekasisizmi?
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => {
                  setIsHousewife('student')
                  setUserType('school')
                }}
                style={{
                  padding: '12px',
                  background: isHousewife === 'student' ? '#00d4ff' : '#16213e',
                  color: isHousewife === 'student' ? '#0a0e27' : '#fff',
                  border: `2px solid ${isHousewife === 'student' ? '#00d4ff' : '#0f3460'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                📚 O'QIYMAN
              </button>
              <button
                onClick={() => {
                  setIsHousewife(false)
                  setUserType('work')
                }}
                style={{
                  padding: '12px',
                  background: isHousewife === false && gender === 'female' ? '#00d4ff' : '#16213e',
                  color: isHousewife === false && gender === 'female' ? '#0a0e27' : '#fff',
                  border: `2px solid ${isHousewife === false && gender === 'female' ? '#00d4ff' : '#0f3460'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                💼 FAQAT ISHLAYMAN
              </button>
              <button
                onClick={() => {
                  setIsHousewife(true)
                  setUserType('')
                }}
                style={{
                  padding: '12px',
                  background: isHousewife === true ? '#00d4ff' : '#16213e',
                  color: isHousewife === true ? '#0a0e27' : '#fff',
                  border: `2px solid ${isHousewife === true ? '#00d4ff' : '#0f3460'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                🏠 FAQAT UY BEKASI
              </button>
              <button
                onClick={() => {
                  setIsHousewife('both')
                  setUserType('both')
                }}
                style={{
                  padding: '12px',
                  background: isHousewife === 'both' ? '#00d4ff' : '#16213e',
                  color: isHousewife === 'both' ? '#0a0e27' : '#fff',
                  border: `2px solid ${isHousewife === 'both' ? '#00d4ff' : '#0f3460'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                💼🏠 IKKAVIHAM (ISH + UY ISHLARI)
              </button>
            </div>
          </div>
        )}

        {gender === 'male' && (
          <div style={{ background: '#16213e', padding: '16px', borderRadius: '8px', border: '2px solid #0f3460', marginTop: '16px' }}>
            <label style={{ color: '#00d4ff', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
              Siz o'qiysizmi yoki ishlaysizmi?
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => setUserType('school')}
                style={{
                  padding: '12px',
                  background: userType === 'school' ? '#00d4ff' : '#16213e',
                  color: userType === 'school' ? '#0a0e27' : '#fff',
                  border: `2px solid ${userType === 'school' ? '#00d4ff' : '#0f3460'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                📚 O'QIYMAN
              </button>
              <button
                onClick={() => setUserType('work')}
                style={{
                  padding: '12px',
                  background: userType === 'work' ? '#00d4ff' : '#16213e',
                  color: userType === 'work' ? '#0a0e27' : '#fff',
                  border: `2px solid ${userType === 'work' ? '#00d4ff' : '#0f3460'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                💼 ISHLAYMAN
              </button>
              <button
                onClick={() => setUserType('both')}
                style={{
                  padding: '12px',
                  background: userType === 'both' ? '#00d4ff' : '#16213e',
                  color: userType === 'both' ? '#0a0e27' : '#fff',
                  border: `2px solid ${userType === 'both' ? '#00d4ff' : '#0f3460'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                📚💼 IKKAVIHAM (O'QIYMAN + ISHLAYMAN)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. MAQSADINGIZNI YOZING */}
      <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '20px', border: '2px solid #ffaa00' }}>
        <h3 style={{ color: '#ffaa00', marginTop: 0, marginBottom: '16px' }}>
          🎯 MAQSADINGIZNI YOZING
        </h3>
        <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
          Asosiy maqsadingiz nima? (Bu maqsadga qarab sizga maxsus maslahatlar beriladi)
        </label>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Masalan: IELTS 7.5 ball olish, Biznesni rivojlantirish, 10 kg yo'qotish, Yangi ko'nikma o'rganish..."
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
        <p style={{ color: '#ffaa00', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
          💡 Maslahat: Maqsadingizni aniq va batafsil yozing. Bu sizga mos video, podcast va kitoblar tavsiya qilishimizga yordam beradi.
        </p>
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

      {/* 5. MAKTAB YOKI ISH - faqat "faqat uy bekasi" bo'lmasa ko'rinadi */}
      {isHousewife !== true && (
        <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '20px', border: '2px solid #ff6b6b' }}>
          <h3 style={{ color: '#ff6b6b', marginTop: 0, marginBottom: '16px' }}>
            🎓💼 MAKTAB YOKI ISH
          </h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              Siz maktab o'quvchisizmi yoki ishlaysizmi?
            </label>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <button
                onClick={() => {
                  if (userType === 'school') {
                    setUserType('')
                  } else {
                    setUserType('school')
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: userType === 'school' ? '#00d4ff' : '#16213e',
                  color: userType === 'school' ? '#0a0e27' : '#fff',
                  border: `2px solid ${userType === 'school' ? '#00d4ff' : '#0f3460'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                🎓 MAKTAB O'QUVCHISI
              </button>
              <button
                onClick={() => {
                  if (userType === 'work') {
                    setUserType('')
                  } else {
                    setUserType('work')
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: userType === 'work' ? '#00d4ff' : '#16213e',
                  color: userType === 'work' ? '#0a0e27' : '#fff',
                  border: `2px solid ${userType === 'work' ? '#00d4ff' : '#0f3460'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                💼 ISHLAYMAN
              </button>
            </div>
            <button
              onClick={() => {
                if (userType === 'both') {
                  setUserType('')
                } else {
                  setUserType('both')
                }
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: userType === 'both' ? '#00d4ff' : '#16213e',
                color: userType === 'both' ? '#0a0e27' : '#fff',
                border: `2px solid ${userType === 'both' ? '#00d4ff' : '#0f3460'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              🎓💼 IKKAVIHAM
            </button>
          </div>

          {/* Agar MAKTAB tanlangan bo'lsa */}
          {(userType === 'school' || userType === 'both') && (
            <div style={{ background: '#16213e', padding: '16px', borderRadius: '8px', border: '2px solid #0f3460', marginBottom: userType === 'both' ? '16px' : '0' }}>
              <label style={{ color: '#00d4ff', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
                Nechinchi sinfda o'qiysiz?
              </label>
              <select
                value={schoolGrade}
                onChange={(e) => setSchoolGrade(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0a0e27',
                  border: '2px solid #0f3460',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}
              >
                <option value="">Tanlang</option>
                <option value="1">1-sinf</option>
                <option value="2">2-sinf</option>
                <option value="3">3-sinf</option>
                <option value="4">4-sinf</option>
                <option value="5">5-sinf</option>
                <option value="6">6-sinf</option>
                <option value="7">7-sinf</option>
                <option value="8">8-sinf</option>
                <option value="9">9-sinf</option>
                <option value="10">10-sinf</option>
                <option value="11">11-sinf</option>
              </select>
            </div>
          )}

          {/* Agar ISH tanlangan bo'lsa */}
          {(userType === 'work' || userType === 'both') && (
            <div style={{ background: '#16213e', padding: '16px', borderRadius: '8px', border: '2px solid #0f3460' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: '#00d4ff', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                  Ish turi:
                </label>
                <input
                  type="text"
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  placeholder="Masalan: Dasturchi, O'qituvchi, Shifokor..."
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

              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: '#00d4ff', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                  Lavozim:
                </label>
                <select
                  value={workPosition}
                  onChange={(e) => setWorkPosition(e.target.value)}
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
                  <option value="">Tanlang</option>
                  <option value="Boshliq">Boshliq</option>
                  <option value="Menejer">Menejer</option>
                  <option value="Ishchi">Ishchi</option>
                  <option value="Boshqaruvchi">Boshqaruvchi</option>
                  <option value="Mutaxassis">Mutaxassis</option>
                  <option value="Yordamchi">Yordamchi</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: '#00d4ff', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                  Necha yillik:
                </label>
                <input
                  type="number"
                  value={workYears}
                  onChange={(e) => setWorkYears(e.target.value)}
                  placeholder="Masalan: 2"
                  min="0"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ color: '#00d4ff', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                    Boshlanish:
                  </label>
                  <input
                    type="time"
                    value={workStartTime}
                    onChange={(e) => setWorkStartTime(e.target.value)}
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
                <div>
                  <label style={{ color: '#00d4ff', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                    Tugash:
                  </label>
                  <input
                    type="time"
                    value={workEndTime}
                    onChange={(e) => setWorkEndTime(e.target.value)}
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
            </div>
          )}
        </div>
      )}

      {/* 6. SOZLAMALAR XULOSASI */}
      <div style={{ background: '#0a0e27', borderRadius: '12px', padding: '20px', border: '2px solid #00d4ff' }}>
        <h3 style={{ color: '#00d4ff', marginTop: 0, marginBottom: '16px' }}>
          📋 SOZLAMALAR XULOSASI
        </h3>
        
        <div style={{ background: '#16213e', padding: '16px', borderRadius: '8px', border: '2px solid #0f3460' }}>
          {name && (
            <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
              👤 Ism: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{name}</span>
            </p>
          )}
          
          {age && (
            <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
              🎂 Yosh: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{age}</span>
            </p>
          )}
          
          {gender && (
            <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
              👤 Jins: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                {gender === 'male' ? '👨 Erkak' : '👧 Qiz'}
              </span>
            </p>
          )}
          
          {gender === 'female' && isHousewife && (
            <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
              🏠 Holat: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                {isHousewife === true ? 'Faqat uy bekasi' : 
                 isHousewife === 'both' ? 'Ish + Uy ishlari' : 
                 isHousewife === 'student' ? 'O\'qiyman' :
                 'Faqat ishlayman'}
              </span>
            </p>
          )}
          
          {goal && (
            <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
              🎯 Maqsad: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                {goal.length > 50 ? goal.substring(0, 50) + '...' : goal}
              </span>
            </p>
          )}
          
          <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
            💪 Sport: <span style={{ color: doesSport ? '#00ff88' : '#ff0055', fontWeight: 'bold' }}>
              {doesSport ? 'Ha' : 'Yo\'q'}
            </span>
          </p>
          
          {doesSport && sportFrequency && (
            <>
              <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
                🏃 Mahal: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                  {sportFrequency === '1' ? '1 mahal' : '2 mahal'}
                </span>
              </p>
              
              {sport1Name && (
                <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
                  🎯 Sport 1: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{sport1Name}</span>
                </p>
              )}
              
              {sportFrequency === '2' && sport2Name && (
                <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
                  🎯 Sport 2: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{sport2Name}</span>
                </p>
              )}
            </>
          )}
          
          {!isHousewife && userType && (
            <>
              <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
                🎓💼 Turi: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                  {userType === 'school' ? 'Maktab o\'quvchisi' : 
                   userType === 'work' ? 'Ishlayman' : 
                   'Ikkaviham'}
                </span>
              </p>
              
              {(userType === 'school' || userType === 'both') && schoolGrade && (
                <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
                  📚 Sinf: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{schoolGrade}-sinf</span>
                </p>
              )}
              
              {(userType === 'work' || userType === 'both') && (
                <>
                  {workType && (
                    <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
                      💼 Ish: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{workType}</span>
                    </p>
                  )}
                  
                  {workPosition && (
                    <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
                      👔 Lavozim: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{workPosition}</span>
                    </p>
                  )}
                  
                  {workYears && (
                    <p style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
                      📅 Tajriba: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{workYears} yil</span>
                    </p>
                  )}
                  
                  {workStartTime && workEndTime && (
                    <p style={{ color: '#fff', fontSize: '14px', marginBottom: '0' }}>
                      ⏰ Vaqt: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                        {workStartTime} - {workEndTime}
                      </span>
                    </p>
                  )}
                </>
              )}
            </>
          )}
          
          {!name && !age && !gender && !goal && !doesSport && !userType && (
            <p style={{ color: '#aaa', fontSize: '14px', textAlign: 'center', margin: 0 }}>
              Hozircha sozlamalar kiritilmagan
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
