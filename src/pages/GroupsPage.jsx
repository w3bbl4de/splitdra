import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGroups } from '../hooks/useGroups'

export default function GroupsPage() {
  const { groups, loading, error, addGroup } = useGroups()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) return
    await addGroup(name)
    setName('')
    setShowForm(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Groups</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>+ New</button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Group name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <div style={styles.formButtons}>
            <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            <button style={styles.createBtn} onClick={handleCreate}>Create</button>
          </div>
        </div>
      )}

      {loading && <p style={styles.message}>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && groups.length === 0 && (
        <p style={styles.message}>No groups yet. Create one!</p>
      )}

      <div style={styles.list}>
        {groups.map(group => (
          <div
            key={group.id}
            style={styles.card}
            onClick={() => navigate(`/groups/${group.id}`)}
          >
            <p style={styles.groupName}>{group.name}</p>
            <p style={styles.groupDate}>
              {new Date(group.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '24px 16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
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
    fontWeight: '500',
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
  formButtons: {
    display: 'flex',
    gap: '8px',
  },
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
    fontWeight: '500',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#111827',
  },
  groupDate: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  message: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: '40px',
  },
  error: {
    textAlign: 'center',
    color: '#ef4444',
    marginTop: '16px',
  },
}