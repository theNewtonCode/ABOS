import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAdminAuth } from '../../../contexts/AdminAuthContext'
import { DbCreativeProject } from '../../../types/database'
import ConfirmDialog from '../../../components/admin/ConfirmDialog'

type EditItem = DbCreativeProject & { _new?: boolean }

export default function CreativeSection() {
  const { token } = useAdminAuth()
  const [items, setItems] = useState<EditItem[]>([])
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/creative', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => Array.isArray(d) && setItems(d))
  }, [token])

  const update = (id: string, field: keyof EditItem, value: unknown) =>
    setItems(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))

  const addItem = () => setItems(prev => [...prev, {
    id: `new-${Date.now()}`, name: '', platform: '', description: null, url: null,
    icon: '', visible: true, sort_order: prev.length, updated_at: '', _new: true,
  }])

  const deleteItem = async (id: string) => {
    if (id.startsWith('new-')) { setItems(prev => prev.filter(s => s.id !== id)); setDeleteId(null); return }
    await fetch(`/api/admin/creative?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setItems(prev => prev.filter(s => s.id !== id)); setDeleteId(null); toast.success('Deleted')
  }

  const save = async () => {
    setSaving(true)
    try {
      const payload = items.map((s, i) => ({ ...s, sort_order: i }))
      const res = await fetch('/api/admin/creative', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      const updated = await res.json(); setItems(updated)
      toast.success('✓ Creative projects saved')
    } catch (e: unknown) {
      toast.error(`✗ ${e instanceof Error ? e.message : 'Save failed'}`)
    } finally { setSaving(false) }
  }

  const inp = (val: string, onChange: (v: string) => void, w?: number | string, ph?: string) => (
    <input value={val ?? ''} onChange={e => onChange(e.target.value)} placeholder={ph}
      style={{ background: '#040d04', border: '1px solid #00ff4622', borderRadius: 2, color: '#00ff46', fontFamily: "'Share Tech Mono', monospace", fontSize: 12, padding: '4px 8px', width: w ?? '100%', outline: 'none' }}
      onFocus={e => e.target.style.borderColor = '#00ff46'}
      onBlur={e => e.target.style.borderColor = '#00ff4622'}
    />
  )

  return (
    <div style={{ maxWidth: 820 }}>
      <div className="admin-section-header">
        <div className="admin-section-comment">// editing: creative/</div>
        <div className="admin-section-title">Creative Projects</div>
        <hr className="admin-divider" />
      </div>
      {items.map(s => (
        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '8px 12px', background: '#0a120a', borderRadius: 3, border: '1px solid #00ff4611' }}>
          <div style={{ flex: 2 }}>{inp(s.name, v => update(s.id, 'name', v), undefined, 'Name')}</div>
          <div style={{ flex: 2 }}>{inp(s.platform, v => update(s.id, 'platform', v), undefined, 'Platform')}</div>
          <div style={{ flex: 1 }}>{inp(s.icon ?? '', v => update(s.id, 'icon', v), undefined, 'icon key')}</div>
          <div style={{ flex: 2 }}>{inp(s.url ?? '', v => update(s.id, 'url', v), undefined, 'URL')}</div>
          <div className={`admin-toggle-track ${s.visible ? 'on' : ''}`} onClick={() => update(s.id, 'visible', !s.visible)} style={{ cursor: 'pointer', flexShrink: 0 }}>
            <div className="admin-toggle-thumb" />
          </div>
          <button onClick={() => setDeleteId(s.id)} className="admin-btn-danger" style={{ padding: '4px 8px', flexShrink: 0 }}>✕</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button onClick={addItem} className="admin-btn-secondary">+ ADD</button>
        <button onClick={save} disabled={saving} className="admin-btn-primary">{saving ? 'saving...' : '$ commit creative --push'}</button>
      </div>
      {deleteId && <ConfirmDialog message="Delete this creative project?" onConfirm={() => deleteItem(deleteId)} onCancel={() => setDeleteId(null)} />}
    </div>
  )
}
