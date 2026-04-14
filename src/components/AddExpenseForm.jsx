import { useState } from 'react'

export default function AddExpenseForm({ members, onSubmit, onCancel }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(members[0]?.id || '')
  const [splitType, setSplitType] = useState('equal')
  const [percentages, setPercentages] = useState(
    Object.fromEntries(members.map(m => [m.id, 0]))
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const totalPercentage = Object.values(percentages).reduce((a, b) => a + Number(b), 0)

  const handlePercentageChange = (memberId, value) => {
    setPercentages(prev => ({ ...prev, [memberId]: value }))
  }

  const buildSplits = () => {
    const total = parseFloat(amount)
    if (splitType === 'equal') {
      const share = total / members.length
      return members.map(m => ({ member_id: m.id, amount: share }))
    }
    if (splitType === 'percentage') {
      return members.map(m => ({
        member_id: m.id,
        amount: (total * Number(percentages[m.id])) / 100,
        percentage: Number(percentages[m.id])
      }))
    }
    return []
  }

  const handleSubmit = async () => {
    if (!name.trim() || !amount || !paidBy) {
      setError('Please fill all fields')
      return
    }
    if (splitType === 'percentage' && totalPercentage !== 100) {
      setError('Percentages must add up to 100')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const splits = buildSplits()
      await onSubmit({ name, amount: parseFloat(amount), paidBy, splitType, splits })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={styles.form}>
      <h2 style={styles.formTitle}>Add Expense</h2>

      <input
        style={styles.input}
        placeholder="Expense name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <label style={styles.label}>Paid by</label>
      <select
        style={styles.input}
        value={paidBy}
        onChange={e => setPaidBy(e.target.value)}
      >
        {members.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>

      <label style={styles.label}>Split type</label>
      <div style={styles.splitTypes}>
        {['equal', 'percentage'].map(type => (
          <button
            key={type}
            style={{ ...styles.splitBtn, ...(splitType === type ? styles.splitBtnActive : {}) }}
            onClick={() => setSplitType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {splitType === 'percentage' && (
        <div style={styles.percentageSection}>
          <p style={styles.label}>Set percentages (total: {totalPercentage}%)</p>
          {members.map(m => (
            <div key={m.id} style={styles.percentageRow}>
              <span style={styles.memberName}>{m.name}</span>
              <input
                style={styles.percentageInput}
                type="number"
                value={percentages[m.id]}
                onChange={e => handlePercentageChange(m.id, e.target.value)}
              />
              <span style={styles.percentSign}>%</span>
            </div>
          ))}
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.formButtons}>
        <button style={styles.cancelBtn} onClick={onCancel}>Cancel</button>
        <button style={styles.submitBtn} onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Add'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  form: {
    background: '#fff',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    border: '1px solid #e5e7eb',
  },
  formTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
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
    background: '#fff',
  },
  label: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '6px',
    display: 'block',
  },
  splitTypes: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  splitBtn: {
    flex: 1,
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#6b7280',
  },
  splitBtnActive: {
    background: '#6366f1',
    color: '#fff',
    border: '1px solid #6366f1',
  },
  percentageSection: {
    background: '#f9fafb',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
  },
  percentageRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  memberName: {
    flex: 1,
    fontSize: '14px',
    color: '#111827',
  },
  percentageInput: {
    width: '60px',
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    outline: 'none',
    textAlign: 'right',
  },
  percentSign: {
    fontSize: '14px',
    color: '#6b7280',
  },
  formButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '4px',
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
  submitBtn: {
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
  error: {
    color: '#ef4444',
    fontSize: '13px',
    marginBottom: '8px',
  },
}