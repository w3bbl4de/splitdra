import { supabase } from '../lib/supabase'

export const addSettlement = async ({ groupId, fromMemberId, toMemberId, amount, createdBy }) => {
  const { data, error } = await supabase
    .from('settlements')
    .insert({
      group_id: groupId,
      from_member_id: fromMemberId,
      to_member_id: toMemberId,
      amount,
      created_by: createdBy
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getSettlements = async (groupId) => {
  const { data, error } = await supabase
    .from('settlements')
    .select('*')
    .eq('group_id', groupId)
    .order('settled_at', { ascending: false })

  if (error) throw error
  return data
}