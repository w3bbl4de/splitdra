import { useState } from 'react'
import { sendMagicLink } from '../services/authService'

const styles = {
  container: { padding: '24px 16px', maxWidth: '480px', margin: '0 auto' },

  header: {
    marginBottom: '24px',
  },

  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
  },

  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px',
  },

  form: {
    background: '#fff',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #e5e7eb',
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
  },

  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    background: '#6366f1',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },

  message: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: '40px',
  },

  error: {
    color: '#ef4444',
    fontSize: '13px',
    marginTop: '8px',
  },
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    try {
      await sendMagicLink(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    }
  }

  if (sent) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Check your email</h1>
          <p style={styles.subtitle}>
            We sent you a magic link to log in.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Login</h1>
        <p style={styles.subtitle}>
          Enter your email to receive a magic link
        </p>
      </div>

      <div style={styles.form}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSubmit} style={styles.button}>
          Send Magic Link
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  )
}