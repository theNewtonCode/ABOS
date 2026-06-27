import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabaseAdmin } from '../_supabaseAdmin'
import { verifyAdmin } from '../_verifyAdmin'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('projects').select('*').order('sort_order')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (!verifyAdmin(req, res)) return

  if (req.method === 'POST') {
    const { data, error } = await supabaseAdmin.from('projects')
      .insert({ ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })
    const { data, error } = await supabaseAdmin.from('projects')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })
    // Delete associated storage files
    const { data: proj } = await supabaseAdmin.from('projects').select('preview_image_url,pdf_url').eq('id', id).single()
    if (proj?.preview_image_url) {
      const path = proj.preview_image_url.split('/project-images/')[1]
      if (path) await supabaseAdmin.storage.from('project-images').remove([path])
    }
    if (proj?.pdf_url) {
      const path = proj.pdf_url.split('/project-pdfs/')[1]
      if (path) await supabaseAdmin.storage.from('project-pdfs').remove([path])
    }
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
