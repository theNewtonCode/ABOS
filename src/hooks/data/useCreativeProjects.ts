import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { DbCreativeProject } from '../../types/database'

export function useCreativeProjects() {
  const [projects, setProjects] = useState<DbCreativeProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('creative_projects')
      .select('*')
      .eq('visible', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setProjects(data ?? [])
        setLoading(false)
      })
  }, [])

  return { projects, loading, error }
}
