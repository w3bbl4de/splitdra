import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user } = useAuth()
  const avatarLetter = user?.email?.charAt(0).toUpperCase()

  return (
    <div className={styles.container}>
      
      {/* Bottom Bar */}
      <nav className={styles.nav}>

        {/* LEFT SIDE */}
        <NavLink to="/groups" className={({ isActive }) => isActive ? styles.active : styles.item}>
          <span>⊞</span>
          <small>Groups</small>
        </NavLink>

        <NavLink to="/expenses" className={({ isActive }) => isActive ? styles.active : styles.item}>
          <span>₹</span>
          <small>Expenses</small>
        </NavLink>

        {/* SPACE FOR FAB */}
        <div className={styles.fabSpace}></div>

        {/* RIGHT SIDE */}
        <NavLink to="/settlements" className={({ isActive }) => isActive ? styles.active : styles.item}>
          <span>✓</span>
          <small>Settlements</small>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : styles.item}>
          <div className={styles.avatar}>{avatarLetter}</div>
          <small>Profile</small>
        </NavLink>

      </nav>

      {/* FLOATING BUTTON */}
      <button className={styles.fab}>
        +
      </button>

    </div>
  )
}