import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAdminAuth } from '../../../contexts/AdminAuthContext'
import { DbAchievement } from '../../../types/database'
import FileUploader from '../../../components/admin/FileUploader'
import ConfirmDialog from '../../../components/admin/ConfirmDialog'

type FormData = { title: string; issuer: string; date: string; verify_url: string }

const inp: React.CSSProperties = {
  background: '#040d04', border: '1px solid #00ff4633', borderRadius: 3,
  color: '#00ff46', fontFamily: "'Share Tech Mono', monospace", fontSize: 13,
  padding: '8px 12px', width: '100%', outline: 'none', boxSizing: 'border-box',
}

export default function AchievementsSection() {
  const { token } = useAdminAuth()
  const [items, setItems] = useState<DbAchievement[]>([])
  const [selected, setSelected] = useState<DbAchievement | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [visible, setVisible] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { register, handleSubmit, reset } = useForm<FormData>()

  const load = () =>
    fetch('/api/admin/achievements', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => Array.isArray(d) && setItems(d))

  useEffect(() => { load() }, [token])

  const open = (a: DbAchievement) => {
    setSelected(a); setIsNew(false)
    reset({ title: a.title, issuer: a.issuer, date: a.date, verify_url: a.verify_url ?? '' })
    setImageUrl(a.image_url); setVisible(a.visible)
  }

  const openNew = () => {
    setSelected({ id: '', title: '', issuer: '', date: '', image_url: null, verify_url: null, visible: true, sort_order: items.length, updated_at: '' })
    setIsNew(true); reset({ title: '', issuer: '', date: '', verify_url: '' })
    setImageUrl(null); setVisible(true)
  }

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    try {
      const body = { ...data, image_url: imageUrl, visible, sort_order: selected?.sort_order ?? items.length }
      const res = await fetch(isNew ? '/api/admin/achievements' : `/api/admin/achievements?id=${selected!.id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success(isNew ? '✓ Achievement created' : '✓ Achievement updated')
      setSelected(null); load()
    } catch (e: unknown) {
      toast.error(`✗ ${e instanceof Error ? e.message : 'Save failed'}`)
    } finally { setSaving(false) }
  }

  const del = async (id: string) => {
    await fetch(`/api/admin/achievements?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setDeleteId(null); setSelected(null); load(); toast.success('Deleted')
  }

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="admin-section-header">
          <div className="admin-section-comment">// editing: achievements</div>
          <div className="admin-section-title">Achievements</div>
          <hr className="admin-divider" />
        </div>
        <button onClick={openNew} className="admin-btn-secondary" style={{ marginBottom: 16 }}>+ NEW ACHIEVEMENT</button>
        {items.map(a => (
          <div key={a.id} className="admin-card" onClick={() => open(a)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, borderColor: selected?.id === a.id ? '#00ff46' : undefined }}>
            {a.image_url && <img src={a.image_url} alt="" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 2, border: '1px solid #00ff4622' }} />}
            <div>
              <div style={{ color: '#00ff46', fontSize: 12 }}>{a.title}</div>
              <div style={{ color: '#00ff4699', fontSize: 11 }}>{a.issuer} · {a.date}</div>
            </div>
            {!a.visible && <span style={{ marginLeft: 'auto', fontSize: 9, color: '#ffbd2e', border: '1px solid #ffbd2e44', borderRadius: 2, padding: '1px 4px' }}>HIDDEN</span>}
          </div>
        ))}
      </div>
      {selected && (
        <div style={{ width: 340, flexShrink: 0, background: '#0a120a', border: '1px solid #00ff4633', borderRadius: 4, padding: 20, position: 'sticky', top: 0, height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ color: '#00ff46', fontSize: 13 }}>{isNew ? '// new' : '// editing'}</span>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#00ff4699', cursor: 'pointer' }}>✕</button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {(['title', 'issuer', 'date', 'verify_url'] as const).map(f => (
              <div key={f} style={{ marginBottom: 12 }}>
                <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 4 }}>{f}</label>
                <input {...register(f)} style={inp} />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 4 }}>image</label>
              <FileUploader bucket="achievement-images" currentUrl={imageUrl} accept={{ 'image/*': [] }} onUploaded={setImageUrl} onClear={() => setImageUrl(null)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div className={`admin-toggle-track ${visible ? 'on' : ''}`} onClick={() => setVisible(v => !v)} style={{ cursor: 'pointer' }}>
                <div className="admin-toggle-thumb" />
              </div>
              <span style={{ color: '#00ff4699', fontSize: 11 }}>Visible</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} className="admin-btn-primary" style={{ flex: 1 }}>{saving ? 'saving...' : isNew ? '$ create' : '$ update'}</button>
              {!isNew && <button type="button" onClick={() => setDeleteId(selected.id)} className="admin-btn-danger">✕</button>}
            </div>
          </form>
        </div>
      )}
      {deleteId && <ConfirmDialog message="Delete this achievement?" onConfirm={() => del(deleteId)} onCancel={() => setDeleteId(null)} />}
    </div>
  )
}
