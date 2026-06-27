import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { DbProfile } from '../../types/database'

export function useProfile() {
  const [profile, setProfile] = useState<DbProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('profile')
      .select('*')
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setProfile(data)
        setLoading(false)
      })
  }, [])

  return { profile, loading, error }
}
