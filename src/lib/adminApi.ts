import { supabaseAdmin, isDev } from './supabase'

// In dev (VITE_SUPABASE_SERVICE_ROLE_KEY set): write directly to Supabase.
// On Vercel (key not exposed): proxy through /api/* serverless routes.

async function apiFetch(path: string, method: string, body?: unknown, token?: string) {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const ct = res.headers.get('content-type') ?? ''
  if (!ct.includes('application/json')) throw new Error('API not available')
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Request failed')
  return json
}

// ── PROFILE ──────────────────────────────────────────────

export async function getProfile(token?: string) {
  if (isDev) {
    const { data, error } = await supabaseAdmin.from('profile').select('*').limit(1).single()
    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
  }
  return apiFetch('/api/admin/profile', 'GET', undefined, token)
}

export async function saveProfile(payload: Record<string, unknown>, token?: string) {
  if (isDev) {
    const { data: existing } = await supabaseAdmin.from('profile').select('id').limit(1).single()
    const row = { ...payload, updated_at: new Date().toISOString() }
    const { data, error } = existing?.id
      ? await supabaseAdmin.from('profile').update(row).eq('id', existing.id).select().single()
      : await supabaseAdmin.from('profile').insert(row).select().single()
    if (error) throw new Error(error.message)
    return data
  }
  return apiFetch('/api/admin/profile', 'PUT', payload, token)
}

// ── SKILLS ───────────────────────────────────────────────

export async function getSkills(token?: string) {
  if (isDev) {
    const { data, error } = await supabaseAdmin.from('skills').select('*').order('sort_order')
    if (error) throw new Error(error.message)
    return data ?? []
  }
  return apiFetch('/api/admin/skills', 'GET', undefined, token)
}

export async function saveSkills(skills: unknown[], token?: string) {
  if (isDev) {
    const toUpsert = (skills as Record<string, unknown>[]).map((s, i) => {
      const row = { ...s, sort_order: i, updated_at: new Date().toISOString() }
      if (row._new && typeof row.id === 'string' && row.id.startsWith('new-')) delete row.id
      delete row._new
      return row
    })
    const { data, error } = await supabaseAdmin.from('skills').upsert(toUpsert).select()
    if (error) throw new Error(error.message)
    return data
  }
  return apiFetch('/api/admin/skills', 'PUT', skills, token)
}

export async function deleteSkill(id: string, token?: string) {
  if (isDev) {
    const { error } = await supabaseAdmin.from('skills').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return
  }
  return apiFetch(`/api/admin/skills?id=${id}`, 'DELETE', undefined, token)
}

// ── PROJECTS ─────────────────────────────────────────────

export async function getProjects(token?: string) {
  if (isDev) {
    const { data, error } = await supabaseAdmin.from('projects').select('*').order('sort_order')
    if (error) throw new Error(error.message)
    return data ?? []
  }
  return apiFetch('/api/admin/projects', 'GET', undefined, token)
}

export async function createProject(payload: Record<string, unknown>, token?: string) {
  if (isDev) {
    const now = new Date().toISOString()
    const { data, error } = await supabaseAdmin.from('projects').insert({ ...payload, created_at: now, updated_at: now }).select().single()
    if (error) throw new Error(error.message)
    return data
  }
  return apiFetch('/api/admin/projects', 'POST', payload, token)
}

export async function updateProject(id: string, payload: Record<string, unknown>, token?: string) {
  if (isDev) {
    const { data, error } = await supabaseAdmin.from('projects').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data
  }
  return apiFetch(`/api/admin/projects?id=${id}`, 'PUT', payload, token)
}

export async function deleteProject(id: string, token?: string) {
  if (isDev) {
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return
  }
  return apiFetch(`/api/admin/projects?id=${id}`, 'DELETE', undefined, token)
}

// ── ACHIEVEMENTS ─────────────────────────────────────────

export async function getAchievements(token?: string) {
  if (isDev) {
    const { data, error } = await supabaseAdmin.from('achievements').select('*').order('sort_order')
    if (error) throw new Error(error.message)
    return data ?? []
  }
  return apiFetch('/api/admin/achievements', 'GET', undefined, token)
}

export async function createAchievement(payload: Record<string, unknown>, token?: string) {
  if (isDev) {
    const { data, error } = await supabaseAdmin.from('achievements').insert({ ...payload, updated_at: new Date().toISOString() }).select().single()
    if (error) throw new Error(error.message)
    return data
  }
  return apiFetch('/api/admin/achievements', 'POST', payload, token)
}

export async function updateAchievement(id: string, payload: Record<string, unknown>, token?: string) {
  if (isDev) {
    const { data, error } = await supabaseAdmin.from('achievements').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data
  }
  return apiFetch(`/api/admin/achievements?id=${id}`, 'PUT', payload, token)
}

export async function deleteAchievement(id: string, token?: string) {
  if (isDev) {
    const { error } = await supabaseAdmin.from('achievements').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return
  }
  return apiFetch(`/api/admin/achievements?id=${id}`, 'DELETE', undefined, token)
}

// ── BLOG ─────────────────────────────────────────────────

export async function getBlogPosts(token?: string) {
  if (isDev) {
    const { data, error } = await supabaseAdmin.from('blog_posts').select('*').order('sort_order')
    if (error) throw new Error(error.message)
    return data ?? []
  }
  return apiFetch('/api/admin/blog', 'GET', undefined, token)
}

export async function createBlogPost(payload: Record<string, unknown>, token?: string) {
  if (isDev) {
    const now = new Date().toISOString()
    const { data: existing } = await supabaseAdmin.from('blog_posts').select('id').eq('slug', payload.slug).maybeSingle()
    if (existing) throw new Error(`Slug "${payload.slug}" already exists`)
    const { data, error } = await supabaseAdmin.from('blog_posts').insert({ ...payload, created_at: now, updated_at: now }).select().single()
    if (error) throw new Error(error.message)
    return data
  }
  return apiFetch('/api/admin/blog', 'POST', payload, token)
}

export async function updateBlogPost(id: string, payload: Record<string, unknown>, token?: string) {
  if (isDev) {
    const { data: existing } = await supabaseAdmin.from('blog_posts').select('id').eq('slug', payload.slug as string).neq('id', id).maybeSingle()
    if (existing) throw new Error(`Slug "${payload.slug}" already exists`)
    const { data, error } = await supabaseAdmin.from('blog_posts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return data
  }
  return apiFetch(`/api/admin/blog?id=${id}`, 'PUT', payload, token)
}

export async function deleteBlogPost(id: string, token?: string) {
  if (isDev) {
    const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return
  }
  return apiFetch(`/api/admin/blog?id=${id}`, 'DELETE', undefined, token)
}

// ── CREATIVE ─────────────────────────────────────────────

export async function getCreative(token?: string) {
  if (isDev) {
    const { data, error } = await supabaseAdmin.from('creative_projects').select('*').order('sort_order')
    if (error) throw new Error(error.message)
    return data ?? []
  }
  return apiFetch('/api/admin/creative', 'GET', undefined, token)
}

export async function saveCreative(items: unknown[], token?: string) {
  if (isDev) {
    const toUpsert = (items as Record<string, unknown>[]).map((s, i) => {
      const row = { ...s, sort_order: i, updated_at: new Date().toISOString() }
      if (row._new && typeof row.id === 'string' && row.id.startsWith('new-')) delete row.id
      delete row._new
      return row
    })
    const { data, error } = await supabaseAdmin.from('creative_projects').upsert(toUpsert).select()
    if (error) throw new Error(error.message)
    return data
  }
  return apiFetch('/api/admin/creative', 'PUT', items, token)
}

export async function deleteCreative(id: string, token?: string) {
  if (isDev) {
    const { error } = await supabaseAdmin.from('creative_projects').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return
  }
  return apiFetch(`/api/admin/creative?id=${id}`, 'DELETE', undefined, token)
}

// ── CONFIG ───────────────────────────────────────────────

export async function getConfig(token?: string) {
  if (isDev) {
    const { data, error } = await supabaseAdmin.from('site_config').select('*')
    if (error) throw new Error(error.message)
    const map: Record<string, string> = {}
    for (const row of data ?? []) map[row.key] = row.value
    return map
  }
  return apiFetch('/api/admin/config', 'GET', undefined, token)
}

export async function saveConfig(pairs: Record<string, string>, token?: string) {
  if (isDev) {
    const rows = Object.entries(pairs).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }))
    const { error } = await supabaseAdmin.from('site_config').upsert(rows)
    if (error) throw new Error(error.message)
    return
  }
  return apiFetch('/api/admin/config', 'PUT', pairs, token)
}

// ── FILE UPLOAD ───────────────────────────────────────────

export async function uploadFile(file: File, bucket: string, token?: string): Promise<string> {
  if (isDev) {
    const path = `${Date.now()}-${file.name}`
    const { error } = await supabaseAdmin.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) throw new Error(error.message)
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bucket', bucket)
  formData.append('path', `${Date.now()}-${file.name}`)
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Upload failed')
  return json.url
}
