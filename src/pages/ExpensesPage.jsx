import { useState, useEffect } from 'react'
import { getAllExpenses } from '../services/expenseService'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllExpenses().then(data => {
      setExpenses(data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={styles.message}>Loading...</p>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Expenses</h1>
      </div>

      {expenses.length === 0 && (
        <p style={styles.message}>No expenses yet.</p>
      )}

      {expenses.map(expense => (
        <div key={expense.id} style={styles.card}>
          <div style={styles.left}>
            <p style={styles.name}>{expense.name}</p>
            <p style={styles.meta}>
              {expense.groups?.name} · Paid by {expense.members?.name}
            </p>
          </div>
          <p style={styles.amount}>£{expense.amount.toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: { padding: '24px 16px' },
  header: {
    marginBottom: '24px',
  },
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
  name: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#111827',
    margin: 0,
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
    color: '#111827',
    margin: 0,
  },
  message: { textAlign: 'center', color: '#9ca3af', marginTop: '40px' },
}