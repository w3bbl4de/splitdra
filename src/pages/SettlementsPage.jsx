import { useState, useEffect } from 'react'
import { getAllSettlements } from '../services/settlementService'

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllSettlements().then(data => {
      setSettlements(data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={styles.message}>Loading...</p>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Settlements</h1>
      </div>

      {settlements.length === 0 && (
        <p style={styles.message}>No settlements yet.</p>
      )}

      {settlements.map(settlement => (
        <div key={settlement.id} style={styles.card}>
          <div style={styles.left}>
            <p style={styles.text}>
              <span style={styles.name}>{settlement.from?.name}</span>
              {' paid '}
              <span style={styles.name}>{settlement.to?.name}</span>
            </p>
            <p style={styles.meta}>
              {settlement.groups?.name} · {new Date(settlement.settled_at).toLocaleDateString()}
            </p>
          </div>
          <p style={styles.amount}>£{settlement.amount.toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: { padding: '24px 16px' },
  header: { marginBottom: '24px' },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  left: { flex: 1 },
  text: {
    fontSize: '15px',
    color: '#111827',
    margin: 0,
  },
  name: {
    fontWeight: '600',
    color: '#6366f1',
  },
  meta: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
    marginTop: '2px',
  },
  amount: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#22c55e',
    margin: 0,
  },
  message: { textAlign: 'center', color: '#9ca3af', marginTop: '40px' },
}