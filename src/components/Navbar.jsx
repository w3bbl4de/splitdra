import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { signOut } from '../services/authService'
import { useState, useEffect } from 'react'
import { getGroups } from '../services/groupService'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  const [showGroupPicker, setShowGroupPicker] = useState(false)
  const [groups, setGroups] = useState([])

  useEffect(() => {
    if (!user) return
    getGroups(user.id).then(setGroups)
  }, [user])

  const handleAddClick = () => {
    setShowGroupPicker(true)
  }

  const handleGroupSelect = (groupId) => {
    setShowGroupPicker(false)
    navigate(`/groups/${groupId}?addExpense=true`)
  }

  const avatarLetter = user?.email?.charAt(0).toUpperCase()

  return (
    <>
      {/* Styles */}
      <style>{`
        .container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          animation: slideUpNav 0.4s ease;
        }

        @keyframes slideUpNav {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .nav {
          height: 70px;
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-around;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: #9ca3af;
          font-size: 12px;
          background: none;
          border: none;
          cursor: pointer;
          transition: transform 0.15s ease, color 0.2s ease;
        }

        .item:active {
          transform: scale(0.9);
        }

        .active {
          color: #6366f1;
        }

        .fabSpace {
          width: 60px;
        }

        .fab {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #6366f1;
          color: white;
          border: none;
          font-size: 28px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);

          animation: fabPop 0.5s ease;
          transition: transform 0.2s ease;
        }

        .fab:active {
          transform: translateX(-50%) scale(0.9);
        }

        @keyframes fabPop {
          0% { transform: translateX(-50%) scale(0); }
          60% { transform: translateX(-50%) scale(1.2); }
          100% { transform: translateX(-50%) scale(1); }
        }

        .avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #6366f1;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
        }

        /* Overlay fade */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 200;
          display: flex;
          align-items: flex-end;
          animation: fadeIn 0.25s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Slide-up modal */
        .profileCard {
          width: 100%;
          background: #fff;
          border-radius: 16px 16px 0 0;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;

          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .avatarLarge {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #6366f1;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;

          animation: popIn 0.3s ease;
        }

        @keyframes popIn {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .email {
          color: #374151;
          font-size: 14px;
          animation: fadeIn 0.4s ease;
        }

        .logoutBtn {
          width: 100%;
          padding: 12px;
          background: #fee2e2;
          color: #ef4444;
          border: none;
          border-radius: 8px;
          cursor: pointer;

          transition: transform 0.15s ease, background 0.2s;
        }

        .logoutBtn:active {
          transform: scale(0.97);
          background: #fecaca;
        }
      `}</style>

      {/* Group Picker Modal */}
      {showGroupPicker && (
        <div style={styles.overlay} onClick={() => setShowGroupPicker(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Select a Group</h2>
            {groups.length === 0 && (
              <p style={styles.modalEmpty}>No groups yet. Create one first.</p>
            )}
            {groups.map(group => (
              <button
                key={group.id}
                style={styles.groupItem}
                onClick={() => handleGroupSelect(group.id)}
              >
                {group.name}
              </button>
            ))}
            <button style={styles.cancelModalBtn} onClick={() => setShowGroupPicker(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div
          className="overlay"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="profileCard"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="avatarLarge">{avatarLetter}</div>
            <p className="email">{user?.email}</p>
            <button className="logoutBtn" onClick={signOut}>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="container">
        <nav className="nav">
          <NavLink
            to="/groups"
            className={({ isActive }) =>
              `item ${isActive ? 'active' : ''}`
            }
          >
            <span>⊞</span>
            <span>Groups</span>
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `item ${isActive ? 'active' : ''}`
            }
          >
            <span>₹</span>
            <span>Expenses</span>
          </NavLink>

          <div className="fabSpace"></div>

          <NavLink
            to="/settlements"
            className={({ isActive }) =>
              `item ${isActive ? 'active' : ''}`
            }
          >
            <span>✓</span>
            <span>Settlements</span>
          </NavLink>

          <button
            className="item"
            onClick={() => setShowProfile(true)}
          >
            <div className="avatar">{avatarLetter}</div>
            <span>Profile</span>
          </button>

          <button className="fab" onClick={handleAddClick}>+</button>
        </nav>
      </div>
    </>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'flex-end',
    zIndex: 999,
  },
  modal: {
    width: '100%',
    background: '#fff',
    borderRadius: '16px 16px 0 0',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  modalEmpty: {
    fontSize: '14px',
    color: '#9ca3af',
    textAlign: 'center',
  },
  groupItem: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#111827',
    textAlign: 'left',
  },
  cancelModalBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#fee2e2',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '4px',
  },
  addNavBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
}