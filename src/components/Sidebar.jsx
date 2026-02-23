import './Sidebar.css'
import { 
  Settings, Utensils, Calendar, Dumbbell, MessageCircle,
  TrendingUp, BarChart3, PieChart, GraduationCap, Briefcase, Home,
  Users, UserCheck, Trash2, MessageSquare, FileText, Activity, X
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Sidebar({ isOpen, onClose, activeTab, onTabChange, userData, isAdmin }) {
  const [unreadChatCount, setUnreadChatCount] = useState(0)

  const settings = userData?.settings || {}
  const userType = settings.userType
  const schoolGrade = settings.schoolGrade

  // Load unread chat count for admin
  useEffect(() => {
    if (isAdmin) {
      loadUnreadChatCount()
      // Refresh every 30 seconds
      const interval = setInterval(loadUnreadChatCount, 30000)
      
      // Listen for refresh events from AdminSorovlarTab
      const handleRefresh = () => loadUnreadChatCount()
      window.addEventListener('refreshChatCount', handleRefresh)
      
      return () => {
        clearInterval(interval)
        window.removeEventListener('refreshChatCount', handleRefresh)
      }
    }
  }, [isAdmin])

  const loadUnreadChatCount = async () => {
    try {
      const response = await fetch('/api/admin/chat-users')
      if (response.ok) {
        const result = await response.json()
        const totalUnread = result.users.reduce((sum, user) => sum + (user.unreadCount || 0), 0)
        setUnreadChatCount(totalUnread)
      }
    } catch (err) {
      console.error('Error loading unread count:', err)
    }
  }

  console.log('🔍 Sidebar Debug:', {
    userType,
    schoolGrade,
    workType: settings.workType,
    hasUserData: !!userData,
    settings
  })

  const userTabs = [
    // ASOSIY BO'LIM
    { id: 'settings', label: 'Sozlamalar', section: 'ASOSIY', icon: Settings },
    { id: 'daily-schedule', label: 'Kunlik Tartib', section: 'ASOSIY', icon: Calendar },
    // Ish/Maktab bu yerga dinamik qo'shiladi
    // Sport faqat doesSport === true bo'lsa
    { id: 'nutrition', label: 'AI Ovqatlanish', section: 'ASOSIY', icon: Utensils },
    { id: 'admin-chat', label: 'Admin bilan gaplashish', section: 'ASOSIY', icon: MessageCircle },
    // TAHLIL BO'LIM
    { id: 'insights', label: 'AI Maslahat', section: 'TAHLIL', icon: TrendingUp },
    { id: 'weekly', label: 'Haftalik', section: 'TAHLIL', icon: BarChart3 },
    { id: 'stats', label: 'Statistika', section: 'TAHLIL', icon: PieChart }
  ]

  // Maktab yoki Ish tablarini qo'shish (Kunlik Tartib dan keyin, 2-pozitsiyaga)
  let insertIndex = 2 // Kunlik Tartib dan keyin
  
  // MAKTAB - erkak yoki qiz (faqat uy bekasi bo'lmasa)
  const showSchool = (userType === 'school' || userType === 'both') && schoolGrade
  const isFemaleHousewife = settings.gender === 'female' && settings.isHousewife === true
  const isFemaleStudent = settings.gender === 'female' && settings.isHousewife === 'student'
  
  if ((showSchool && !isFemaleHousewife) || isFemaleStudent) {
    userTabs.splice(insertIndex, 0, { 
      id: 'school', 
      label: `${schoolGrade}-sinf`, 
      section: 'ASOSIY',
      icon: GraduationCap
    })
    insertIndex++
  }
  
  // ISH - erkak yoki qiz (faqat uy bekasi yoki o'quvchi bo'lmasa)
  const showWork = (userType === 'work' || userType === 'both')
  
  if (showWork && !isFemaleHousewife && !isFemaleStudent) {
    userTabs.splice(insertIndex, 0, { 
      id: 'work', 
      label: 'Ish', 
      section: 'ASOSIY',
      icon: Briefcase
    })
    insertIndex++
  }

  // Uy bekasi - faqat qizlar uchun (faqat uy bekasi yoki ikkaviham)
  if (settings.gender === 'female' && (settings.isHousewife === true || settings.isHousewife === 'both')) {
    userTabs.splice(insertIndex, 0, { 
      id: 'housework', 
      label: 'Uy ishlari', 
      section: 'ASOSIY',
      icon: Home
    })
    insertIndex++
  }

  // Sport faqat doesSport === true bo'lsa
  if (settings.doesSport === true) {
    userTabs.splice(insertIndex, 0, { 
      id: 'sport', 
      label: 'Sport Mashqlari', 
      section: 'ASOSIY',
      icon: Dumbbell
    })
  }

  const adminTabs = [
    { id: 'admin-dashboard', label: 'Boshi', section: 'ADMIN', icon: Activity },
    { id: 'admin-users', label: 'Azolar', section: 'ADMIN', icon: Users },
    { id: 'admin-deleted', label: 'Ochirilganlar', section: 'ADMIN', icon: Trash2 },
    { id: 'admin-pending', label: 'Sorovlar', section: 'ADMIN', icon: UserCheck },
    { id: 'admin-sorovlar', label: 'Chat Sorovlar', section: 'ADMIN', icon: MessageSquare },
    { id: 'admin-reports', label: 'Hisobot', section: 'ADMIN', icon: FileText },
    { id: 'admin-stats', label: 'Statistika', section: 'ADMIN', icon: PieChart }
  ]

  const tabs = isAdmin ? adminTabs : userTabs

  const renderSection = (sectionName) => {
    const sectionTabs = tabs.filter(t => t.section === sectionName)
    if (sectionTabs.length === 0) return null

    return (
      <div key={sectionName} className="sidebar-section">
        <p className="sidebar-label">
          {sectionName === 'ASOSIY' && 'ASOSIY'}
          {sectionName === 'MASLAHATLAR' && 'MASLAHATLAR'}
          {sectionName === 'TAHLIL' && 'TAHLIL'}
          {sectionName === 'PREMIUM' && 'PREMIUM'}
          {sectionName === 'ADMIN' && 'ADMIN PANEL'}
        </p>
        {sectionTabs.map(tab => {
          const Icon = tab.icon
          const showBadge = tab.id === 'admin-sorovlar' && unreadChatCount > 0
          return (
            <button
              key={tab.id}
              className={`sidebar-btn ${tab.premium ? 'premium' : ''} ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              style={{ position: 'relative' }}
            >
              {Icon && <Icon size={18} style={{ marginRight: '8px' }} />}
              {tab.label}
              {showBadge && (
                <span style={{
                  position: 'absolute',
                  top: '50%',
                  right: '12px',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#ff0055',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {unreadChatCount}
                </span>
              )}
            </button>
          )
        })}
        {sectionName !== 'PREMIUM' && <hr className="sidebar-divider" />}
      </div>
    )
  }

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="sidebar-close" onClick={onClose}>
          <X size={18} style={{ marginRight: '6px' }} />
          YOPISH
        </button>
        
        <div className="sidebar-user">
          <p>Foydalanuvchi:</p>
          <p className="sidebar-name">{userData?.name || 'Foydalanuvchi'}</p>
        </div>
        
        <hr className="sidebar-divider" />
        
        {renderSection('ASOSIY')}
        {renderSection('TAHLIL')}
        {renderSection('PREMIUM')}
        {renderSection('ADMIN')}
      </div>
    </>
  )
}
