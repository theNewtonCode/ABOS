import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { DbBlogPost } from '../../types/database'

export function useBlogPosts() {
  const [posts, setPosts] = useState<DbBlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setPosts(data ?? [])
        setLoading(false)
      })
  }, [])

  return { posts, loading, error }
}
