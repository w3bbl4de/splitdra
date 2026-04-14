import { useState, useEffect } from 'react'
import { addExpense, getExpenses } from '../services/expenseService'
import { useAuth } from './useAuth'

export const useExpenses = (groupId) => {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!groupId) return
    fetchExpenses()
  }, [groupId])

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses(groupId)
      setExpenses(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const add = async (expenseData) => {
    try {
      await addExpense({ ...expenseData, createdBy: user.id })
      await fetchExpenses()
    } catch (err) {
      throw err
    }
  }

  return { expenses, loading, error, add }
}