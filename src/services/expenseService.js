import { supabase } from '../lib/supabase'

export const addExpense = async ({ groupId, name, amount, paidBy, splitType, splits, createdBy }) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert({ group_id: groupId, name, amount, paid_by: paidBy, split_type: splitType, created_by: createdBy })
    .select()
    .single()

  if (error) throw error

  const splitRows = splits.map(s => ({
    expense_id: data.id,
    member_id: s.member_id,
    amount: s.amount,
    percentage: s.percentage || null
  }))

  const { error: splitError } = await supabase
    .from('expense_splits')
    .insert(splitRows)

  if (splitError) throw splitError

  return data
}

export const getExpenses = async (groupId) => {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      expense_splits(*),
      members!expenses_paid_by_fkey(id, name)
    `)
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}