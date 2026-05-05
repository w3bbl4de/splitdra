import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getGroupByJoinToken, joinGroup } from '../services/groupService'
import { sendOtp, verifyOtp } from '../services/authService'
import { useAuth } from '../hooks/useAuth'

export default function GroupJoinPage() {
  const { joinToken } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [group, setGroup] = useState(null)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    fetchGroup()
  }, [joinToken])

  useEffect(() => {
    if (user && group) {
      handleJoin()
    }
  }, [user, group])

  const fetchGroup = async () => {
    try {
      const data = await getGroupByJoinToken(joinToken)
      setGroup(data)
    } catch (err) {
      setError('Invalid or expired group link')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    setJoining(true)
    try {
      const userName = profile?.full_name || user.email.split('@')[0]
      await joinGroup(group.id, user.id, userName)
      navigate(`/groups/${group.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setJoining(false)
    }
  }

  const handleSendOtp = async () => {
    if (!email.trim()) return
    try {
      await sendOtp(email)
      setSent(true)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return
    try {
      await verifyOtp(email, otp)
    } catch (err) {
      setError('Invalid code. Please try again.')
    }
  }

  if (loading) return <p style={styles.message}>Loading...</p>
  if (joining) return <p style={styles.message}>Joining group...</p>
  if (error && !group) return <p style={styles.errorFull}>{error}</p>

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatar}>
          {group?.name?.charAt(0).toUpperCase()}
        </div>
        <h1 style={styles.title}>{group?.name}</h1>
        <p style={styles.subtitle}>You have been invited to join this group.</p>

        {error && <p style={styles.error}>{error}</p>}

        {!user && !sent && (
          <>
            <p style={styles.label}>Enter your email to join</p>
            <input
              style={styles.input}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button style={styles.btn} onClick={handleSendOtp}>
              Send Code
            </button>
          </>
        )}

        {!user && sent && (
          <>
            <p style={styles.label}>Enter the code sent to {email}</p>
            <input
              style={styles.input}
              type="number"
              placeholder="6-digit code"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <button style={styles.btn} onClick={handleVerifyOtp}>
              Verify & Join
            </button>
            <button
              style={styles.resendBtn}
              onClick={() => { setSent(false); setOtp(''); setError(null) }}
            >
              Use different email
            </button>
          </>
        )}

        {user && (
          <button style={styles.btn} onClick={handleJoin}>
            Join {group?.name}
          </button>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f9fafb',
    padding: '16px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '32px 24px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: '#6366f1',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 auto 16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#9ca3af',
    marginBottom: '24px',
  },
  label: {
    fontSize: '14px',
    color: '#374151',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    outline: 'none',
    textAlign: 'center',
  },
  btn: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#6366f1',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  resendBtn: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    background: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '13px',
  },
  message: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: '40px',
  },
  errorFull: {
    textAlign: 'center',
    color: '#ef4444',
    marginTop: '40px',
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    marginBottom: '12px',
  },
}