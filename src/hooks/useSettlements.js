import { useState, useEffect } from 'react'
import { addSettlement, getSettlements } from '../services/settlementService'
import { useAuth } from './useAuth'

export const useSettlements = (groupId) => {
  const { user } = useAuth()
  const [settlements, setSettlements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!groupId) return
    fetchSettlements()
  }, [groupId])

  const fetchSettlements = async () => {
    try {
      const data = await getSettlements(groupId)
      setSettlements(data)
    } finally {
      setLoading(false)
    }
  }

  const settle = async ({ fromMemberId, toMemberId, amount }) => {
    try {
      await addSettlement({ groupId, fromMemberId, toMemberId, amount, createdBy: user.id })
      await fetchSettlements()
    } catch (err) {
      throw err
    }
  }

  return { settlements, loading, settle }
}