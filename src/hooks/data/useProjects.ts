import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { DbProject } from '../../types/database'

export function useProjects() {
  const [projects, setProjects] = useState<DbProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('projects')
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
