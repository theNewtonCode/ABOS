import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabaseAdmin } from '../_supabaseAdmin'
import { verifyAdmin } from '../_verifyAdmin'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('skills').select('*').order('sort_order')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (!verifyAdmin(req, res)) return

  if (req.method === 'PUT') {
    const skills = req.body as Array<Record<string, unknown>>
    const payload = skills.map(s => ({ ...s, updated_at: new Date().toISOString() }))
    // Remove _new flag and temp IDs
    const toUpsert = payload.map(s => {
      const { _new, ...rest } = s as Record<string, unknown>
      if (_new && typeof rest.id === 'string' && rest.id.startsWith('new-')) delete rest.id
      return rest
    })
    const { data, error } = await supabaseAdmin.from('skills').upsert(toUpsert).select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })
    const { error } = await supabaseAdmin.from('skills').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
