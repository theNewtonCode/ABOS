import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { DbAchievement } from '../../types/database'

export function useAchievements() {
  const [achievements, setAchievements] = useState<DbAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('achievements')
      .select('*')
      .eq('visible', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setAchievements(data ?? [])
        setLoading(false)
      })
  }, [])

  return { achievements, loading, error }
}
