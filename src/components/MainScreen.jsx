import { useState, useEffect, useRef } from 'react'
import './MainScreen.css'
import Toast from './Toast'
import Header from './Header'
import Sidebar from './Sidebar'
import { NotificationManager } from './Notification'
import SettingsTab from './tabs/SettingsTab'
import InsightsTab from './tabs/InsightsTab'
import WeeklyTab from './tabs/WeeklyTab'
import StatsTab from './tabs/StatsTab'
import VideosTab from './tabs/VideosTab'
import GalleryTab from './tabs/GalleryTab'
import ReportsTab from './tabs/ReportsTab'
import VideoMaslahatTab from './tabs/VideoMaslahatTab'
import AiNutritionTab from './tabs/AiNutritionTab'
import AdminChatTab from './tabs/AdminChatTab'
import PlanTab from './tabs/PlanTab'
import DailyScheduleTab from './tabs/DailyScheduleTab'
import SportTab from './tabs/SportTab'
import FutureTab from './tabs/FutureTab'
import SchoolTab from './tabs/SchoolTab'
import WorkTab from './tabs/WorkTab'
import HouseworkTab from './tabs/HouseworkTab'
import AdminTab from './tabs/AdminTab'
import AdminDashboard from './tabs/AdminDashboard'
import AdminUsers from './tabs/AdminUsers'
import AdminPending from './tabs/AdminPending'
import AdminDeleted from './tabs/AdminDeleted'
import AdminReports from './tabs/AdminReports'
import AdminStats from './tabs/AdminStats'
import AdminSorovlarTab from './tabs/AdminSorovlarTab'

export default function MainScreen({ user, userData, setUserData, onLogout }) {
  const isAdmin = userData?.isAdmin || user === 'ADMIN'
  const [activeTab, setActiveTab] = useState(isAdmin ? 'admin-dashboard' : 'settings')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState(null)

  // Welcome notification disabled
  // API key modal disabled - admin sets global API key

  // Check if user is approved
  useEffect(() => {
    if (!isAdmin && userData && !userData.approved) {
      // User will be blocked at login, so this shouldn't happen
      // But keep it as backup
    }
  }, [userData, isAdmin])

  // Listen for navigation events from other components
  useEffect(() => {
    const handleNavigate = (event) => {
      if (event.detail) {
        setActiveTab(event.detail)
        setSidebarOpen(false)
      }
    }
    
    window.addEventListener('navigate', handleNavigate)
    return () => window.removeEventListener('navigate', handleNavigate)
  }, [])

  const tabs = {
    settings: <SettingsTab userData={userData} setUserData={setUserData} />,
    school: <SchoolTab userData={userData} setUserData={setUserData} />,
    work: <WorkTab userData={userData} setUserData={setUserData} />,
    housework: <HouseworkTab userData={userData} setUserData={setUserData} />,
    insights: <InsightsTab userData={userData} />,
    weekly: <WeeklyTab userData={userData} />,
    stats: <StatsTab userData={userData} />,
    videos: <VideosTab userData={userData} setUserData={setUserData} />,
    gallery: <GalleryTab userData={userData} setUserData={setUserData} />,
    reports: <ReportsTab userData={userData} />,
    videomaslahat: <VideoMaslahatTab userData={userData} />,
    nutrition: <AiNutritionTab userData={userData} />,
    'admin-chat': <AdminChatTab userData={userData} />,
    'daily-schedule': <DailyScheduleTab userData={userData} setUserData={setUserData} />,
    sport: <SportTab userData={userData} setUserData={setUserData} />,
    future: <FutureTab user={userData} onSave={setUserData} />,
    admin: <AdminTab />,
    'admin-dashboard': <AdminDashboard />,
    'admin-users': <AdminUsers />,
    'admin-pending': <AdminPending onToast={(msg) => setToast(msg)} />,
    'admin-deleted': <AdminDeleted />,
    'admin-reports': <AdminReports />,
    'admin-stats': <AdminStats />,
    'admin-sorovlar': <AdminSorovlarTab />
  }

  // If admin, show admin tab with burger menu
  if (isAdmin) {
    return (
      <div className="main-screen">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <Header 
          user={user}
          userData={userData}
          onLogout={onLogout}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isAdmin={true}
        />
        
        <Sidebar
          key={JSON.stringify(userData?.settings)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab)
            setSidebarOpen(false)
          }}
          userData={userData}
          isAdmin={true}
        />
        
        <div className="overlay" 
          style={{ display: sidebarOpen ? 'block' : 'none' }}
          onClick={() => setSidebarOpen(false)}
        />
        
        <div className="container">
          <div className="tab-content">
            {tabs[activeTab] || <AdminDashboard />}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-screen">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <Header 
        user={user}
        userData={userData}
        onLogout={onLogout}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        isAdmin={false}
      />
      
      <Sidebar
        key={JSON.stringify(userData?.settings)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          setSidebarOpen(false)
        }}
        userData={userData}
        isAdmin={false}
      />
      
      <div className="overlay" 
        style={{ display: sidebarOpen ? 'block' : 'none' }}
        onClick={() => setSidebarOpen(false)}
      />
      
      <div className="container">
        <div className="tab-content">
          {tabs[activeTab]}
        </div>
      </div>
    </div>
  )
}
