import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGroupDetail } from '../hooks/useGroupDetail'
import MemberCard from '../components/MemberCard'

export default function GroupDetailPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { group, members, loading, error, add, update } = useGroupDetail(groupId)
  const [name, setName] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = async () => {
    if (!name.trim()) return
    await add(name)
    setName('')
    setShowForm(false)
  }

  if (loading) return <p style={styles.message}>Loading...</p>
  if (error) return <p style={styles.error}>{error}</p>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/groups')}>← Back</button>
        <h1 style={styles.title}>{group?.name}</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>+ Add</button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Member name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <div style={styles.formButtons}>
            <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            <button style={styles.createBtn} onClick={handleAdd}>Add</button>
          </div>
        </div>
      )}

      <h2 style={styles.sectionTitle}>Members ({members.length})</h2>

      {members.length === 0 && (
        <p style={styles.message}>No members yet. Add one!</p>
      )}

      {members.map(member => (
        <MemberCard key={member.id} member={member} onUpdate={update} />
      ))}
    </div>
  )
}

const styles = {
  container: { padding: '24px 16px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6366f1',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
  },
  addBtn: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  form: {
    background: '#fff',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
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
  formButtons: { display: 'flex', gap: '8px' },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  createBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    background: '#6366f1',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '12px',
  },
  message: { textAlign: 'center', color: '#9ca3af', marginTop: '40px' },
  error: { color: '#ef4444', fontSize: '13px' },
}
