import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMemberByToken, claimMember } from '../services/groupService'
import { sendOtp, verifyOtp } from '../services/authService'
import { useAuth } from '../hooks/useAuth'

export default function JoinPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [member, setMember] = useState(null)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    fetchMember()
  }, [token])

  useEffect(() => {
    if (user && member) {
      handleClaim()
    }
  }, [user, member])

  const fetchMember = async () => {
    try {
      const data = await getMemberByToken(token)
      setMember(data)
    } catch (err) {
      setError('Invalid or expired invite link')
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async () => {
    if (member.user_id) {
      navigate(`/groups/${member.group_id}`)
      return
    }
    setClaiming(true)
    try {
      await claimMember(token, user.id)
      navigate(`/groups/${member.group_id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setClaiming(false)
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
  if (claiming) return <p style={styles.message}>Joining group...</p>

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatar}>
          {member?.name?.charAt(0).toUpperCase()}
        </div>
        <h1 style={styles.title}>Hi, {member?.name}!</h1>
        <p style={styles.subtitle}>You have been invited to join a group.</p>

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
            <button style={styles.resendBtn} onClick={() => { setSent(false); setOtp(''); setError(null) }}>
              Use different email
            </button>
          </>
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
    marginTop: '16px',
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    marginBottom: '12px',
  },
}