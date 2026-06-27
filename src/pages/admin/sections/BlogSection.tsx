import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAdminAuth } from '../../../contexts/AdminAuthContext'
import { DbBlogPost } from '../../../types/database'
import ConfirmDialog from '../../../components/admin/ConfirmDialog'

type FormData = { title: string; slug: string; excerpt: string; content: string; external_url: string; sort_order: number }

const inp: React.CSSProperties = {
  background: '#040d04', border: '1px solid #00ff4633', borderRadius: 3,
  color: '#00ff46', fontFamily: "'Share Tech Mono', monospace", fontSize: 13,
  padding: '8px 12px', width: '100%', outline: 'none', boxSizing: 'border-box',
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function BlogSection() {
  const { token } = useAdminAuth()
  const [posts, setPosts] = useState<DbBlogPost[]>([])
  const [selected, setSelected] = useState<DbBlogPost | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [published, setPublished] = useState(false)
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormData>()
  const title = watch('title', '')
  const content = watch('content', '')

  const load = () =>
    fetch('/api/admin/blog', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => Array.isArray(d) && setPosts(d))

  useEffect(() => { load() }, [token])

  // Auto-generate slug from title on new posts
  useEffect(() => {
    if (isNew && title) setValue('slug', slugify(title))
  }, [title, isNew, setValue])

  const open = (p: DbBlogPost) => {
    setSelected(p); setIsNew(false)
    reset({ title: p.title, slug: p.slug, excerpt: p.excerpt ?? '', content: p.content ?? '', external_url: p.external_url ?? '', sort_order: p.sort_order })
    setPublished(p.published)
  }

  const openNew = () => {
    setSelected({ id: '', title: '', slug: '', excerpt: null, content: null, external_url: null, published: false, sort_order: posts.length, created_at: '', updated_at: '' })
    setIsNew(true); reset({ title: '', slug: '', excerpt: '', content: '', external_url: '', sort_order: posts.length })
    setPublished(false)
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    try {
      const body = { ...data, published }
      const res = await fetch(isNew ? '/api/admin/blog' : `/api/admin/blog?id=${selected!.id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success(isNew ? '✓ Post created' : '✓ Post updated')
      setSelected(null); load()
    } catch (e: unknown) {
      toast.error(`✗ ${e instanceof Error ? e.message : 'Save failed'}`)
    } finally { setSaving(false) }
  }

  const del = async (id: string) => {
    await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setDeleteId(null); setSelected(null); load(); toast.success('Post deleted')
  }

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="admin-section-header">
          <div className="admin-section-comment">// editing: blog/</div>
          <div className="admin-section-title">Blog</div>
          <hr className="admin-divider" />
        </div>
        <button onClick={openNew} className="admin-btn-secondary" style={{ marginBottom: 16 }}>+ NEW POST</button>
        {posts.map(p => (
          <div key={p.id} className="admin-card" onClick={() => open(p)} style={{ cursor: 'pointer', borderColor: selected?.id === p.id ? '#00ff46' : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ color: '#00ff46', fontSize: 13 }}>{p.title}</div>
              <span style={{ fontSize: 9, color: p.published ? '#28c840' : '#ffbd2e', border: `1px solid ${p.published ? '#28c84044' : '#ffbd2e44'}`, borderRadius: 2, padding: '1px 5px', flexShrink: 0, marginLeft: 8 }}>
                {p.published ? 'PUBLISHED' : 'DRAFT'}
              </span>
            </div>
            {p.excerpt && <div style={{ color: '#00ff4699', fontSize: 11, marginTop: 4 }}>{p.excerpt}</div>}
          </div>
        ))}
      </div>
      {selected && (
        <div style={{ width: 420, flexShrink: 0, background: '#0a120a', border: '1px solid #00ff4633', borderRadius: 4, padding: 20, position: 'sticky', top: 0, height: 'fit-content', maxHeight: '92vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ color: '#00ff46', fontSize: 13 }}>{isNew ? '// new post' : '// editing'}</span>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#00ff4699', cursor: 'pointer' }}>✕</button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 4 }}>title</label>
              <input {...register('title')} style={inp} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 4 }}>slug</label>
              <input {...register('slug')} style={inp} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 4 }}>excerpt (160 chars)</label>
              <input {...register('excerpt')} maxLength={160} style={inp} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ color: '#00ff4699', fontSize: 11 }}>content (markdown)</label>
                <button type="button" onClick={() => setPreview(p => !p)} style={{ background: 'none', border: 'none', color: '#00ff4699', fontSize: 11, cursor: 'pointer' }}>
                  {preview ? '← edit' : 'preview →'}
                </button>
              </div>
              {preview
                ? <div style={{ ...inp, minHeight: 140, padding: 12, whiteSpace: 'pre-wrap', color: '#00ff46', fontSize: 12 }}>{content || '(empty)'}</div>
                : <textarea {...register('content')} rows={8} style={{ ...inp, resize: 'vertical' }} />
              }
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 4 }}>external URL</label>
              <input {...register('external_url')} style={inp} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div className={`admin-toggle-track ${published ? 'on' : ''}`} onClick={() => setPublished(v => !v)} style={{ cursor: 'pointer' }}>
                <div className="admin-toggle-thumb" />
              </div>
              <span style={{ color: published ? '#28c840' : '#00ff4699', fontSize: 11 }}>
                {published ? 'PUBLISHED' : 'DRAFT'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} className="admin-btn-primary" style={{ flex: 1 }}>{saving ? 'saving...' : isNew ? '$ create' : '$ update'}</button>
              {!isNew && <button type="button" onClick={() => setDeleteId(selected.id)} className="admin-btn-danger">✕</button>}
            </div>
          </form>
        </div>
      )}
      {deleteId && <ConfirmDialog message="Delete this post permanently?" onConfirm={() => del(deleteId)} onCancel={() => setDeleteId(null)} />}
    </div>
  )
}
