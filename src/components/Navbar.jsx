import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { signOut } from '../services/authService'
import { useState } from 'react'

export default function Navbar() {
  const { user } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  const avatarLetter = user?.email?.charAt(0).toUpperCase()

  return (
    <>
      {showProfile && (
        <div
          style={styles.overlay}
          onClick={() => setShowProfile(false)}
        >
          <div
            style={styles.profileCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.avatar}>{avatarLetter}</div>
            <p style={styles.email}>{user?.email}</p>
            <button
              style={styles.logoutBtn}
              onClick={signOut}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <nav style={styles.nav}>
        <NavLink
          to="/groups"
          style={({ isActive }) => ({
            ...styles.navItem,
            color: isActive ? '#6366f1' : '#9ca3af',
          })}
        >
          <span style={styles.icon}>⊞</span>
          <span style={styles.label}>Groups</span>
        </NavLink>

        <NavLink
          to="/expenses"
          style={({ isActive }) => ({
            ...styles.navItem,
            color: isActive ? '#6366f1' : '#9ca3af',
          })}
        >
          <span style={styles.icon}>₹</span>
          <span style={styles.label}>Expenses</span>
        </NavLink>

        <NavLink
          to="/settlements"
          style={({ isActive }) => ({
            ...styles.navItem,
            color: isActive ? '#6366f1' : '#9ca3af',
          })}
        >
          <span style={styles.icon}>✓</span>
          <span style={styles.label}>Settlements</span>
        </NavLink>

        <button
          style={styles.navItem}
          onClick={() => setShowProfile(true)}
        >
          <div style={styles.avatarSmall}>{avatarLetter}</div>
          <span style={styles.label}>Profile</span>
        </button>
      </nav>
    </>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '64px',
    background: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 100,
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    padding: '8px 16px',
  },
  icon: {
    fontSize: '20px',
  },
  label: {
    fontSize: '11px',
  },
  avatarSmall: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#6366f1',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'flex-end',
  },
  profileCard: {
    width: '100%',
    background: '#fff',
    borderRadius: '16px 16px 0 0',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#6366f1',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  email: {
    color: '#374151',
    fontSize: '14px',
  },
  logoutBtn: {
    width: '100%',
    padding: '12px',
    background: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
}