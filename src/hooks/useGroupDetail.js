import { useState, useEffect } from 'react'
import { getGroupById, getMembers, addMember, updateMember } from '../services/groupService'

export const useGroupDetail = (groupId) => {
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!groupId) return
    fetchAll()
  }, [groupId])

  const fetchAll = async () => {
    try {
      const [groupData, membersData] = await Promise.all([
        getGroupById(groupId),
        getMembers(groupId)
      ])
      setGroup(groupData)
      setMembers(membersData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const add = async (name) => {
    try {
      const newMember = await addMember(groupId, name)
      setMembers(prev => [...prev, newMember])
    } catch (err) {
      throw err
    }
  }

  const update = async (memberId, updates) => {
    try {
      const updated = await updateMember(memberId, updates)
      setMembers(prev => prev.map(m => m.id === memberId ? updated : m))
    } catch (err) {
      throw err
    }
  }

  return { group, members, loading, error, add, update }
}
