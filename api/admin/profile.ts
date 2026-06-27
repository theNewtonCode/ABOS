import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabaseAdmin } from '../_supabaseAdmin'
import { verifyAdmin } from '../_verifyAdmin'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('profile').select('*').limit(1).single()
    if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message })
    return res.status(200).json(data ?? null)
  }

  if (req.method === 'PUT') {
    if (!verifyAdmin(req, res)) return
    const { data: existing } = await supabaseAdmin.from('profile').select('id').limit(1).single()
    const payload = { ...req.body, updated_at: new Date().toISOString() }
    let result
    if (existing?.id) {
      result = await supabaseAdmin.from('profile').update(payload).eq('id', existing.id).select().single()
    } else {
      result = await supabaseAdmin.from('profile').insert(payload).select().single()
    }
    if (result.error) return res.status(500).json({ error: result.error.message })
    return res.status(200).json(result.data)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
