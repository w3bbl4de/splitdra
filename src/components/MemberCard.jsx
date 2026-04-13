import { useState } from 'react'
import { sendInviteLink } from '../services/authService'

export default function MemberCard({ member, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [email, setEmail] = useState(member.email || '')
  const [phone, setPhone] = useState(member.phone || '')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const inviteLink = `${window.location.origin}/join/${member.invite_token}`

  const handleSave = async () => {
    try {
      await onUpdate(member.id, { email, phone })
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSendInvite = async () => {
    if (!email.trim()) {
      setError('Enter an email first')
      return
    }
    setSending(true)
    setError(null)
    try {
      await onUpdate(member.id, { email, phone })
      await sendInviteLink(email, member.invite_token)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    alert('Invite link copied!')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my group',
        text: `${member.name} you have been invited to join a group!`,
        url: inviteLink
      })
    } else {
      handleCopy()
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader} onClick={() => setExpanded(!expanded)}>
        <div style={styles.avatar}>
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p style={styles.name}>{member.name}</p>
          <p style={styles.status}>
            {member.user_id ? '✓ Joined' : '⏳ Pending'}
          </p>
        </div>
        <span style={styles.chevron}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={styles.cardBody}>
          <input
            style={styles.input}
            placeholder="📧 Email"
            value={email}
            onChange={e => { setEmail(e.target.value); setSent(false) }}
          />
          <input
            style={styles.input}
            placeholder="📱 Phone (optional)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          {error && <p style={styles.error}>{error}</p>}
          {sent && <p style={styles.success}>Invite sent!</p>}

          <button
            style={styles.inviteBtn}
            onClick={handleSendInvite}
            disabled={sending}
          >
            {sending ? 'Sending...' : '📨 Send Invite'}
          </button>

          <div style={styles.divider} />

          <p style={styles.inviteLabel}>Or share link directly</p>
          <div style={styles.inviteButtons}>
            <button style={styles.copyBtn} onClick={handleCopy}>Copy Link</button>
            <button style={styles.shareBtn} onClick={handleShare}>Share</button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    cursor: 'pointer',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#6366f1',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  name: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#111827',
    margin: 0,
  },
  status: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  chevron: {
    marginLeft: 'auto',
    color: '#9ca3af',
    fontSize: '12px',
  },
  cardBody: {
    padding: '0 16px 16px',
    borderTop: '1px solid #f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingTop: '16px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  inviteBtn: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    background: '#6366f1',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  divider: {
    height: '1px',
    background: '#f3f4f6',
  },
  inviteLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    textAlign: 'center',
  },
  inviteButtons: {
    display: 'flex',
    gap: '8px',
  },
  copyBtn: {
    flex: 1,
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
  },
  shareBtn: {
    flex: 1,
    padding: '8px',
    borderRadius: '8px',
    border: 'none',
    background: '#6366f1',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    margin: 0,
  },
  success: {
    color: '#22c55e',
    fontSize: '13px',
    margin: 0,
  },
}