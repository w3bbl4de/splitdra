export const calculateDebts = (splits, members) => {
  const balances = {}

  members.forEach(m => { balances[m.id] = 0 })

  splits.forEach(split => {
    const payerId = split.expenses.paid_by
    const owerId = split.member_id
    const amount = split.amount

    if (payerId === owerId) return

    balances[payerId] = (balances[payerId] || 0) + amount
    balances[owerId] = (balances[owerId] || 0) - amount
  })

  const debts = []
  const memberMap = Object.fromEntries(members.map(m => [m.id, m.name]))

  const creditors = Object.entries(balances).filter(([, b]) => b > 0)
  const debtors = Object.entries(balances).filter(([, b]) => b < 0)

  creditors.forEach(([creditorId, credit]) => {
    let remaining = credit
    debtors.forEach(([debtorId, debt]) => {
      const owed = Math.min(remaining, Math.abs(debt))
      if (owed > 0.01) {
        debts.push({
          from: memberMap[debtorId],
          to: memberMap[creditorId],
          amount: owed.toFixed(2)
        })
        remaining -= owed
      }
    })
  })

  return debts
}