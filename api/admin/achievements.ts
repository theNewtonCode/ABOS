import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabaseAdmin } from '../_supabaseAdmin'
import { verifyAdmin } from '../_verifyAdmin'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('achievements').select('*').order('sort_order')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (!verifyAdmin(req, res)) return

  if (req.method === 'POST') {
    const { data, error } = await supabaseAdmin.from('achievements')
      .insert({ ...req.body, updated_at: new Date().toISOString() }).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })
    const { data, error } = await supabaseAdmin.from('achievements')
      .update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })
    const { error } = await supabaseAdmin.from('achievements').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
