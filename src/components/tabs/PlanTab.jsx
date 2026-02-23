import { useState, useEffect } from 'react'
import Toast from '../Toast'
import { NotificationManager } from '../Notification'

export default function PlanTab({ userData, setUserData }) {
  const [plans, setPlans] = useState([])
  const [showPlans, setShowPlans] = useState(false)
  const [planCode, setPlanCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [toast, setToast] = useState(null)
  const [newPlanName, setNewPlanName] = useState('')
  const [newPlanDescription, setNewPlanDescription] = useState('')
  const [newPlanStart, setNewPlanStart] = useState('')
  const [newPlanEnd, setNewPlanEnd] = useState('')
  const [editingPlan, setEditingPlan] = useState(null)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    if (userData?.plans) {
      setPlans(userData.plans)
    }
  }, [userData])

  const handleCodeSubmit = (e) => {
    e.preventDefault()
    
    // Check if user is blocked or subscription expired
    if (userData && (userData.blocked || userData.blockStatus === 'blocked')) {
      NotificationManager.show({
        type: 'blocked',
        title: '⚠️ OYLIK TUGADI',
        message: 'Sizning oylik tolovingiz tugadi. Iltimos +998 91 833 5005 raqamiga telefon qiling va oylikka to\'lab qoying!',
        duration: 0
      })
      return
    }

    // Check subscription expiry
    if (userData && userData.subscriptionExpiry) {
      const expiryDate = new Date(userData.subscriptionExpiry)
      const today = new Date()
      if (expiryDate < today) {
        NotificationManager.show({
          type: 'blocked',
          title: '⚠️ OYLIK TUGADI',
          message: 'Sizning oylik tolovingiz tugadi. Iltimos +998 91 833 5005 raqamiga telefon qiling va oylikka to\'lab qoying!',
          duration: 0
        })
        return
      }
    }

    // Debug: Check if user status is TUGAGAN (blocked in Uzbek)
    if (userData?.status === 'TUGAGAN' || userData?.status === 'tugagan' || userData?.blockStatus === 'tugagan') {
      NotificationManager.show({
        type: 'blocked',
        title: '⚠️ OYLIK TUGADI',
        message: 'Sizning oylik tolovingiz tugadi. Iltimos +998 91 833 5005 raqamiga telefon qiling va oylikka to\'lab qoying!',
        duration: 0
      })
      return
    }

    if (!planCode.trim()) {
      NotificationManager.warning('XATO', 'Kod kiritish kerak!', 3000)
      return
    }
    
    // Agar userData da planCode bo'lmasa, yangi kod o'rnatish
    if (!userData?.planCode) {
      if (planCode.length >= 4 && planCode.length <= 6) {
        // Yangi kod o'rnatish
        savePlanCode(planCode)
        setShowPlans(true)
        NotificationManager.success('KOD O\'RNATILDI', 'Reja kod muvaffaqiyatli qo\'rnatildi ✓', 2500)
        setPlanCode('')
      } else {
        NotificationManager.error('XATO', 'Kod 4-6 raqam bo\'lishi kerak!', 3000)
      }
      return
    }
    
    // Mavjud kodni tekshirish
    if (planCode === userData.planCode) {
      setShowPlans(true)
      setCodeError('')
    } else {
      NotificationManager.error('KOD XATO', 'Kiritilgan kod noto\'g\'ri!', 3000)
      setPlanCode('')
    }
  }

  const savePlanCode = async (code) => {
    try {
      await fetch('/api/save-plan-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          planCode: code
        })
      })
      setUserData({ ...userData, planCode: code })
    } catch (err) {
      console.error('Error saving plan code:', err)
    }
  }

  const handleAddPlan = async () => {
    if (!newPlanName.trim() || !newPlanDescription.trim() || !newPlanStart || !newPlanEnd) {
      NotificationManager.warning('XATO', 'Barcha maydonlarni to\'ldiring!', 3000)
      return
    }

    const newPlan = {
      id: Date.now(),
      name: newPlanName,
      description: newPlanDescription,
      startDate: newPlanStart,
      endDate: newPlanEnd,
      completed: false,
      createdAt: new Date()
    }

    const updatedPlans = [...plans, newPlan]
    setPlans(updatedPlans)

    // MongoDB ga saqlash
    try {
      const response = await fetch('/api/save-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          plans: updatedPlans
        })
      })

      if (response.ok) {
        setNewPlanName('')
        setNewPlanDescription('')
        setNewPlanStart('')
        setNewPlanEnd('')
        setUserData({ ...userData, plans: updatedPlans })
        NotificationManager.success('QOSHILDI', 'Yangi reja muvaffaqiyatli qo\'shildi ✓', 2500)
      }
    } catch (err) {
      console.error('Error adding plan:', err)
      NotificationManager.error('XATO', 'Reja qo\'shishda xato yuz berdi', 3000)
    }
  }

  const startEdit = (plan) => {
    setEditingPlan(plan.id)
    setEditData({
      name: plan.name,
      description: plan.description || '',
      startDate: plan.startDate,
      endDate: plan.endDate
    })
  }

  const saveEdit = async () => {
    const updatedPlans = plans.map(p =>
      p.id === editingPlan ? { ...p, ...editData } : p
    )
    setPlans(updatedPlans)

    try {
      await fetch('/api/save-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          plans: updatedPlans
        })
      })
      setUserData({ ...userData, plans: updatedPlans })
      setEditingPlan(null)
      NotificationManager.success('TAHRIRLANDI', 'Reja muvaffaqiyatli tahrirlandi ✓', 2500)
    } catch (err) {
      console.error('Error updating plan:', err)
      NotificationManager.error('XATO', 'Rejani tahrirlashda xato yuz berdi', 3000)
    }
  }

  const handleTogglePlan = async (planId) => {
    const updatedPlans = plans.map(p =>
      p.id === planId ? { ...p, completed: !p.completed } : p
    )
    setPlans(updatedPlans)

    try {
      await fetch('/api/save-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userData?.phone,
          plans: updatedPlans
        })
      })
      setUserData({ ...userData, plans: updatedPlans })
      NotificationManager.success('YANGILANDI', 'Reja holati yangilandi ✓', 2200)
    } catch (err) {
      console.error('Error updating plan:', err)
      NotificationManager.error('XATO', 'Rejani yangilashda xato', 3000)
    }
  }

  const handleDeletePlan = async (planId) => {
    const notifId = NotificationManager.show({
      type: 'warning',
      title: 'O\'CHIRISH',
      message: 'Rejani o\'chirishni tasdiqlaysizmi? Bu amalni orqaga qaytarish mumkin emas!',
      duration: 0,
      buttons: [
        {
          label: 'HA, O\'CHIRISH',
          color: 'rgba(255, 0, 85, 0.8)',
          onClick: async () => {
            const updatedPlans = plans.filter(p => p.id !== planId)
            setPlans(updatedPlans)

            try {
              await fetch('/api/save-plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  phone: userData?.phone,
                  plans: updatedPlans
                })
              })
              setUserData({ ...userData, plans: updatedPlans })
              NotificationManager.success('O\'CHIRILDI', 'Reja muvaffaqiyatli o\'chirildi ✓', 2500)
            } catch (err) {
              console.error('Error deleting plan:', err)
              NotificationManager.error('XATO', 'Rejani o\'chirishda xato', 3000)
            }
          }
        },
        {
          label: 'BEKOR',
          color: 'rgba(100, 150, 200, 0.8)',
          onClick: () => {}
        }
      ]
    })
  }

  if (!showPlans) {
    return (
      <div className="card">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <h2>REJALAR</h2>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '400px',
          padding: '40px'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🔒</div>
          <h3 style={{ color: '#00d4ff', marginBottom: '16px' }}>
            {userData?.planCode ? 'Kodni kiriting' : 'Kod o\'rnating'}
          </h3>
          <p style={{ color: '#aaa', marginBottom: '24px', textAlign: 'center' }}>
            {userData?.planCode 
              ? 'Rejalar bo\'limiga kirish uchun kodni kiriting'
              : 'Rejalar bo\'limini himoya qilish uchun 4-6 raqamli kod o\'rnating'
            }
          </p>
          
          <form onSubmit={handleCodeSubmit} style={{ width: '100%', maxWidth: '300px' }}>
            <input
              type="password"
              value={planCode}
              onChange={(e) => setPlanCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Kod (4-6 raqam)"
              style={{
                width: '100%',
                padding: '16px',
                background: '#0a0e27',
                border: '2px solid #00d4ff',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '24px',
                textAlign: 'center',
                letterSpacing: '8px',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px 32px',
                background: '#00d4ff',
                color: '#0a0e27',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              {userData?.planCode ? 'KIRISH' : 'O\'RNATISH'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>REJALAR</h2>

      {/* Edit Modal */}
      {editingPlan && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#0a0e27',
            border: '2px solid #00d4ff',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ color: '#00d4ff', marginTop: 0 }}>REJANI TAHRIRLASH</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                placeholder="Reja nomi"
                className="input"
              />
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                placeholder="Reja haqida"
                className="input"
                style={{ minHeight: '80px', resize: 'vertical' }}
              />
              <input
                type="date"
                value={editData.startDate}
                onChange={(e) => setEditData({...editData, startDate: e.target.value})}
                className="input"
              />
              <input
                type="date"
                value={editData.endDate}
                onChange={(e) => setEditData({...editData, endDate: e.target.value})}
                className="input"
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={saveEdit}
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
                  SAQLASH
                </button>
                <button
                  onClick={() => setEditingPlan(null)}
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
          </div>
        </div>
      )}

      {/* Rejalar ro'yxati */}
      <div style={{ marginBottom: '24px', background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #0f3460', minHeight: '300px', maxHeight: '400px', overflowY: 'auto' }}>
        {plans.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', marginTop: '50px' }}>
            Rejalar yo'q
          </p>
        ) : (
          plans.map(plan => (
            <div key={plan.id} style={{ marginBottom: '12px', background: '#16213e', padding: '12px', borderRadius: '8px', border: `2px solid ${plan.completed ? '#00ff88' : '#0f3460'}` }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                {/* Chap tomondagi tugmalar */}
                <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    style={{
                      padding: '6px 8px',
                      background: '#ff0055',
                      color: '#fff',
                      border: '2px solid #ff0055',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>
                  <button
                    onClick={() => handleTogglePlan(plan.id)}
                    style={{
                      padding: '6px 8px',
                      background: plan.completed ? '#00ff88' : '#16213e',
                      color: plan.completed ? '#0a0e27' : '#00ff88',
                      border: `2px solid ${plan.completed ? '#00ff88' : '#00ff88'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {plan.completed ? '✓' : '✗'}
                  </button>
                </div>

                {/* O'ng tomondagi matn */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        color: plan.completed ? '#00ff88' : '#00d4ff', 
                        fontWeight: 'bold', 
                        margin: '0 0 4px 0', 
                        textDecoration: plan.completed ? 'line-through' : 'none',
                        transition: 'color 0.3s ease'
                      }}>
                        {plan.name}
                      </p>
                      {plan.description && (
                        <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                          {plan.description}
                        </p>
                      )}
                      <p style={{ color: '#aaa', fontSize: '12px', margin: 0 }}>
                        {new Date(plan.startDate).toLocaleDateString('uz-UZ')} - {new Date(plan.endDate).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                    <button
                      onClick={() => startEdit(plan)}
                      style={{
                        padding: '6px 10px',
                        background: '#00d4ff',
                        color: '#0a0e27',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        marginLeft: '8px'
                      }}
                    >
                      ✎ TAHRIR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Yangi reja qo'shish */}
      <div style={{ background: '#0a0e27', borderRadius: '12px', padding: '16px', border: '2px solid #0f3460' }}>
        <h3 style={{ color: '#00d4ff', marginTop: 0 }}>YANGI REJA</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            value={newPlanName}
            onChange={(e) => setNewPlanName(e.target.value)}
            placeholder="Reja nomi"
            className="input"
          />
          <textarea
            value={newPlanDescription}
            onChange={(e) => setNewPlanDescription(e.target.value)}
            placeholder="Reja haqida"
            className="input"
            style={{ minHeight: '80px', resize: 'vertical' }}
          />
          <input
            type="date"
            value={newPlanStart}
            onChange={(e) => setNewPlanStart(e.target.value)}
            className="input"
          />
          <input
            type="date"
            value={newPlanEnd}
            onChange={(e) => setNewPlanEnd(e.target.value)}
            className="input"
          />
          <button
            onClick={handleAddPlan}
            style={{
              padding: '12px',
              background: '#00ff88',
              color: '#0a0e27',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            REJA QO'SHISH
          </button>
        </div>
      </div>
    </div>
  )
}
