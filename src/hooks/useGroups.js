import { useState, useEffect } from 'react'
import { createGroup, getGroups } from '../services/groupService'
import { useAuth } from './useAuth'

export const useGroups = () => {
  const { user } = useAuth()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    fetchGroups()
  }, [user])

  const fetchGroups = async () => {
    try {
      const data = await getGroups(user.id)
      setGroups(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addGroup = async (name) => {
    try {
      const newGroup = await createGroup(name, user.id)
      setGroups(prev => [newGroup, ...prev])
    } catch (err) {
      setError(err.message)
    }
  }

  return { groups, loading, error, addGroup }
}