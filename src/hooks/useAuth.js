import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ensureProfile = async (user) => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!data) {
    await supabase
      .from('profiles')
      .insert({ id: user.id, email: user.email })
    return { id: user.id, email: user.email, full_name: null }
  }
  return data
}

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) {
        const p = await ensureProfile(u)
        setProfile(p)
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        const p = await ensureProfile(u)
        setProfile(p)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return { user, profile, loading }
}