import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAdminAuth } from '../../../contexts/AdminAuthContext'
import { DbProject } from '../../../types/database'
import FileUploader from '../../../components/admin/FileUploader'
import TagInput from '../../../components/admin/TagInput'
import ConfirmDialog from '../../../components/admin/ConfirmDialog'

type FormData = Omit<DbProject, 'id' | 'created_at' | 'updated_at' | 'tags' | 'preview_image_url' | 'pdf_url' | 'featured' | 'visible' | 'sort_order'>

const inp: React.CSSProperties = {
  background: '#040d04', border: '1px solid #00ff4633', borderRadius: 3,
  color: '#00ff46', fontFamily: "'Share Tech Mono', monospace", fontSize: 13,
  padding: '8px 12px', width: '100%', outline: 'none', boxSizing: 'border-box',
}

export default function ProjectsSection() {
  const { token } = useAdminAuth()
  const [projects, setProjects] = useState<DbProject[]>([])
  const [selected, setSelected] = useState<DbProject | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [featured, setFeatured] = useState(false)
  const [visible, setVisible] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { register, handleSubmit, reset } = useForm<FormData>()

  const load = () =>
    fetch('/api/admin/projects', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => Array.isArray(d) && setProjects(d))

  useEffect(() => { load() }, [token])

  const openProject = (p: DbProject) => {
    setSelected(p); setIsNew(false)
    reset({ name: p.name, description: p.description, live_url: p.live_url ?? '', github_url: p.github_url ?? '' })
    setTags(p.tags ?? []); setImageUrl(p.preview_image_url); setPdfUrl(p.pdf_url)
    setFeatured(p.featured); setVisible(p.visible)
  }

  const openNew = () => {
    setSelected({ id: '', name: '', description: '', tags: [], preview_image_url: null, pdf_url: null, live_url: null, github_url: null, featured: false, visible: true, sort_order: projects.length, created_at: '', updated_at: '' })
    setIsNew(true); reset({ name: '', description: '', live_url: '', github_url: '' })
    setTags([]); setImageUrl(null); setPdfUrl(null); setFeatured(false); setVisible(true)
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    try {
      const body = { ...data, tags, preview_image_url: imageUrl, pdf_url: pdfUrl, featured, visible, sort_order: selected?.sort_order ?? projects.length }
      const res = await fetch(isNew ? '/api/admin/projects' : `/api/admin/projects?id=${selected!.id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success(isNew ? '✓ Project created' : '✓ Project updated')
      setSelected(null); load()
    } catch (e: unknown) {
      toast.error(`✗ ${e instanceof Error ? e.message : 'Save failed'}`)
    } finally { setSaving(false) }
  }

  const deleteProject = async (id: string) => {
    await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setDeleteId(null); setSelected(null); load(); toast.success('Project deleted')
  }

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* Left: grid */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="admin-section-header">
          <div className="admin-section-comment">// editing: project_dashboard.exe</div>
          <div className="admin-section-title">Projects</div>
          <hr className="admin-divider" />
        </div>
        <button onClick={openNew} className="admin-btn-secondary" style={{ marginBottom: 16 }}>+ NEW PROJECT</button>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {projects.map(p => (
            <div key={p.id} className="admin-card" onClick={() => openProject(p)} style={{ cursor: 'pointer', borderColor: selected?.id === p.id ? '#00ff46' : undefined }}>
              <div style={{ color: '#00ff46', fontSize: 13, marginBottom: 6 }}>{p.name}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {!p.visible && <span style={{ fontSize: 9, color: '#ffbd2e', border: '1px solid #ffbd2e44', borderRadius: 2, padding: '1px 4px' }}>HIDDEN</span>}
                {p.featured && <span style={{ fontSize: 9, color: '#28c840', border: '1px solid #28c84044', borderRadius: 2, padding: '1px 4px' }}>FEATURED</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: edit panel */}
      {selected && (
        <div style={{ width: 360, flexShrink: 0, background: '#0a120a', border: '1px solid #00ff4633', borderRadius: 4, padding: 20, position: 'sticky', top: 0, height: 'fit-content', maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ color: '#00ff46', fontSize: 13 }}>{isNew ? '// new project' : '// editing'}</span>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#00ff4699', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {(['name', 'description', 'live_url', 'github_url'] as const).map(f => (
              <div key={f} style={{ marginBottom: 12 }}>
                <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 4 }}>{f}</label>
                {f === 'description'
                  ? <textarea {...register(f)} rows={3} style={{ ...inp, resize: 'vertical' }} />
                  : <input {...register(f)} style={inp} />}
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 4 }}>tags</label>
              <TagInput value={tags} onChange={setTags} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 4 }}>preview image</label>
              <FileUploader bucket="project-images" currentUrl={imageUrl} accept={{ 'image/*': [] }} onUploaded={setImageUrl} onClear={() => setImageUrl(null)} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 4 }}>PDF</label>
              <FileUploader bucket="project-pdfs" currentUrl={pdfUrl} accept={{ 'application/pdf': [] }} onUploaded={setPdfUrl} onClear={() => setPdfUrl(null)} preview="filename" label="Drop PDF (max 25MB)" />
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              {[['Featured', featured, setFeatured], ['Visible', visible, setVisible]].map(([label, val, set]) => (
                <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className={`admin-toggle-track ${val ? 'on' : ''}`} onClick={() => (set as React.Dispatch<React.SetStateAction<boolean>>)(v => !v)} style={{ cursor: 'pointer' }}>
                    <div className="admin-toggle-thumb" />
                  </div>
                  <span style={{ color: '#00ff4699', fontSize: 11 }}>{label as string}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} className="admin-btn-primary" style={{ flex: 1 }}>
                {saving ? 'saving...' : isNew ? '$ create' : '$ update'}
              </button>
              {!isNew && <button type="button" onClick={() => setDeleteId(selected.id)} className="admin-btn-danger">✕</button>}
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <ConfirmDialog message="Delete this project permanently?" onConfirm={() => deleteProject(deleteId)} onCancel={() => setDeleteId(null)} />
      )}
    </div>
  )
}
