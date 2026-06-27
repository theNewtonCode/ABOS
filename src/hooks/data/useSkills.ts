import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { DbSkill } from '../../types/database'

export function useSkills() {
  const [skills, setSkills] = useState<DbSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('skills')
      .select('*')
      .eq('visible', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setSkills(data ?? [])
        setLoading(false)
      })
  }, [])

  return { skills, loading, error }
}
