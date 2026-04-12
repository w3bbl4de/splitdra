import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function DashboardPage() {
  return (
    <div style={{ paddingBottom: '64px', minHeight: '100vh', background: '#f9fafb' }}>
      <Outlet />
      <Navbar />
    </div>
  )
}