import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGroupDetail } from '../hooks/useGroupDetail'
import { useExpenses } from '../hooks/useExpenses'
import MemberCard from '../components/MemberCard'
import AddExpenseForm from '../components/AddExpenseForm'
import { calculateDebts } from '../utils/calculateDebts'
import { getDebts } from '../services/expenseService'
import { useSettlements } from '../hooks/useSettlements'

export default function GroupDetailPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { group, members, loading, error, add, update } = useGroupDetail(groupId)
  const { expenses, add: addExpense } = useExpenses(groupId)
  const [name, setName] = useState('')
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [activeTab, setActiveTab] = useState('expenses')
  const [debts, setDebts] = useState([])
  const { settlements, settle } = useSettlements(groupId)

  useEffect(() => {
    if (!groupId || members.length === 0) return
    getDebts(groupId).then(splits => {
      setDebts(calculateDebts(splits, members, settlements))
    })
  }, [groupId, members, expenses, settlements])

  const handleAddMember = async () => {
    if (!name.trim()) return
    await add(name)
    setName('')
    setShowMemberForm(false)
  }

  const handleAddExpense = async (data) => {
    await addExpense({ ...data, groupId })
    setShowExpenseForm(false)
  }

  if (loading) return <p style={styles.message}>Loading...</p>
  if (error) return <p style={styles.error}>{error}</p>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/groups')}>← Back</button>
        <h1 style={styles.title}>{group?.name}</h1>
        <button
          style={styles.addBtn}
          onClick={() => activeTab === 'expenses' ? setShowExpenseForm(true) : setShowMemberForm(true)}
        >
          + Add
        </button>
      </div>

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'expenses' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('expenses')}
        >
          Expenses
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'members' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('members')}
        >
          Members ({members.length})
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'debts' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('debts')}
        >
          Debts
        </button>
      </div>

      {activeTab === 'expenses' && (
        <>
          {showExpenseForm && (
            <AddExpenseForm
              members={members}
              onSubmit={handleAddExpense}
              onCancel={() => setShowExpenseForm(false)}
            />
          )}
          {expenses.length === 0 && !showExpenseForm && (
            <p style={styles.message}>No expenses yet. Add one!</p>
          )}
          {expenses.map(expense => (
            <div key={expense.id} style={styles.expenseCard}>
              <div style={styles.expenseLeft}>
                <p style={styles.expenseName}>{expense.name}</p>
                <p style={styles.expenseMeta}>
                  Paid by {expense.members?.name} · {expense.split_type}
                </p>
              </div>
              <p style={styles.expenseAmount}>£{expense.amount.toFixed(2)}</p>
            </div>
          ))}
        </>
      )}

      {activeTab === 'members' && (
        <>
          {showMemberForm && (
            <div style={styles.form}>
              <input
                style={styles.input}
                placeholder="Member name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <div style={styles.formButtons}>
                <button style={styles.cancelBtn} onClick={() => setShowMemberForm(false)}>Cancel</button>
                <button style={styles.createBtn} onClick={handleAddMember}>Add</button>
              </div>
            </div>
          )}
          {members.length === 0 && (
            <p style={styles.message}>No members yet. Add one!</p>
          )}
          {members.map(member => (
            <MemberCard key={member.id} member={member} onUpdate={update} />
          ))}
        </>
      )}

      {activeTab === 'debts' && (
        <div>
          {debts.length === 0 && (
            <p style={styles.message}>No debts. Everyone is settled up! 🎉</p>
          )}
          {debts.map((debt, i) => (
            <div key={i} style={styles.debtCard}>
              <div style={styles.debtInfo}>
                <p style={styles.debtText}>
                  <span style={styles.debtName}>{debt.from}</span>
                  {' owes '}
                  <span style={styles.debtName}>{debt.to}</span>
                </p>
                <p style={styles.debtAmountText}>£{debt.amount}</p>
              </div>
              <button
                style={styles.settleBtn}
                onClick={() => settle({
                  fromMemberId: debt.fromId,
                  toMemberId: debt.toId,
                  amount: parseFloat(debt.amount)
                })}
              >
                Settle
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '24px 16px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
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
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  tab: {
    padding: '8px 16px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#9ca3af',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
  },
  tabActive: {
    color: '#6366f1',
    borderBottom: '2px solid #6366f1',
  },
  expenseCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  expenseLeft: { flex: 1 },
  expenseName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#111827',
    margin: 0,
  },
  expenseMeta: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
    marginTop: '2px',
  },
  expenseAmount: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
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
  message: { textAlign: 'center', color: '#9ca3af', marginTop: '40px' },
  error: { color: '#ef4444', fontSize: '13px' },
  debtCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  debtInfo: { flex: 1 },
  debtText: {
    fontSize: '14px',
    color: '#111827',
    margin: 0,
  },
  debtName: {
    fontWeight: '600',
    color: '#6366f1',
  },
  debtAmountText: {
    fontSize: '13px',
    color: '#ef4444',
    margin: 0,
    marginTop: '2px',
  },
  settleBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: '#22c55e',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    flexShrink: 0,
  },
}