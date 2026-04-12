import { useState } from 'react'

export default function MemberCard({ member, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [email, setEmail] = useState(member.email || '')
  const [phone, setPhone] = useState(member.phone || '')
  const [saving, setSaving] = useState(false)

  const inviteLink = `${window.location.origin}/join/${member.invite_token}`

  const handleSave = async () => {
    setSaving(true)
    try {
      await onUpdate(member.id, { email, phone })
      setExpanded(false)
    } finally {
      setSaving(false)
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
            {member.user_id ? '✓ Joined' : 'Pending'}
          </p>
        </div>
        <span style={styles.chevron}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div style={styles.cardBody}>
          <input
            style={styles.input}
            placeholder="📧 Email (optional)"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="📱 Phone (optional)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>

          <div style={styles.inviteSection}>
            <p style={styles.inviteLabel}>Invite Link</p>
            <p style={styles.inviteLink}>{inviteLink}</p>
            <div style={styles.inviteButtons}>
              <button style={styles.copyBtn} onClick={handleCopy}>Copy</button>
              <button style={styles.shareBtn} onClick={handleShare}>Share</button>
            </div>
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
  saveBtn: {
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
  inviteSection: {
    background: '#f9fafb',
    borderRadius: '8px',
    padding: '12px',
  },
  inviteLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '4px',
  },
  inviteLink: {
    fontSize: '11px',
    color: '#6366f1',
    wordBreak: 'break-all',
    marginBottom: '10px',
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
}