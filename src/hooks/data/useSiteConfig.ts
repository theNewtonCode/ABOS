import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export function useSiteConfig() {
  const [config, setConfig] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('site_config')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          setError(error.message)
        } else {
          const map: Record<string, string> = {}
          for (const row of data ?? []) map[row.key] = row.value
          setConfig(map)
        }
        setLoading(false)
      })
  }, [])

  return { config, loading, error }
}
