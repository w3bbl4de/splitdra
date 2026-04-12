import { supabase } from '../lib/supabase'

export const createGroup = async (name, userId) => {
  const { data, error } = await supabase
    .from('groups')
    .insert({ name, created_by: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getGroups = async (userId) => {
  const { data, error } = await supabase
    .from('groups')
    .select('id, name, created_at')
    .eq('created_by', userId)

  if (error) throw error
  return data
}

export const getGroupById = async (groupId) => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', groupId)
    .single()

  if (error) throw error
  return data
}

export const getMembers = async (groupId) => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export const addMember = async (groupId, name) => {
  const { data, error } = await supabase
    .from('members')
    .insert({ group_id: groupId, name })
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateMember = async (memberId, updates) => {
  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', memberId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getMemberByToken = async (token) => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('invite_token', token)
    .single()

  if (error) throw error
  return data
}

export const claimMember = async (token, userId) => {
  const { data, error } = await supabase
    .from('members')
    .update({ user_id: userId, joined_at: new Date().toISOString() })
    .eq('invite_token', token)
    .is('user_id', null)
    .select()
    .single()

  if (error) throw error
  return data
}