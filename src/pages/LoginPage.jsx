import { useState } from 'react'
import { sendOtp, verifyOtp } from '../services/authService'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSendOtp = async () => {
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    try {
      await sendOtp(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return
    setLoading(true)
    setError(null)
    try {
      await verifyOtp(email, otp)
    } catch (err) {
      setError('Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>💸</div>
        <h1 style={styles.title}>Bill Splitter</h1>
        <p style={styles.subtitle}>
          {sent ? `Enter the code sent to ${email}` : 'Sign in to continue'}
        </p>

        {!sent ? (
          <>
            <input
              style={styles.input}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button
              style={styles.btn}
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </>
        ) : (
          <>
            <input
              style={styles.input}
              type="number"
              placeholder="6-digit code"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              maxLength={6}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button
              style={styles.btn}
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              style={styles.resendBtn}
              onClick={() => { setSent(false); setOtp(''); setError(null) }}
            >
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
  logo: {
    fontSize: '48px',
    marginBottom: '8px',
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
  error: {
    color: '#ef4444',
    fontSize: '13px',
    marginBottom: '8px',
  },
}