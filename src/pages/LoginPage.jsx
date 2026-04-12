import { useState } from 'react'
import { sendMagicLink } from '../services/authService'

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

  if (sent) return <p>Check your email for the magic link!</p>

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Send Magic Link</button>
      {error && <p>{error}</p>}
    </div>
  )
}