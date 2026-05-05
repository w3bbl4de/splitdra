import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import GroupsPage from './pages/GroupsPage'
import GroupDetailPage from './pages/GroupDetailPage'
import JoinPage from './pages/JoinPage'
import ExpensesPage from './pages/ExpensesPage'
import SettlementsPage from './pages/SettlementsPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import GroupJoinPage from './pages/GroupJoinPage'

function AppContent() {
  const { user, profile, loading } = useAuth()
  const location = useLocation()
  const [profileReady, setProfileReady] = useState(false)

  useEffect(() => {
    if (profile?.full_name) setProfileReady(true)
  }, [profile])

  if (loading) return <p>Loading...</p>
  if (!user && !location.pathname.startsWith('/join/')) return <LoginPage />
  if (user && !profileReady && !location.pathname.startsWith('/join/')) return <ProfileSetupPage onDone={() => setProfileReady(true)} />

  return (
    <Routes>
      <Route path="/join/group/:joinToken" element={<GroupJoinPage />} />
      <Route path="/join/:token" element={<JoinPage />} />
      <Route path="/" element={<DashboardPage />}>
        <Route index element={<Navigate to="groups" />} />
        <Route path="groups" element={<GroupsPage />} />
        <Route path="groups/:groupId" element={<GroupDetailPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="settlements" element={<SettlementsPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}