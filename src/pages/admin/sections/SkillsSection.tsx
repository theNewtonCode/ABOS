import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAdminAuth } from '../../../contexts/AdminAuthContext'
import { DbSkill } from '../../../types/database'
import ConfirmDialog from '../../../components/admin/ConfirmDialog'

type EditSkill = DbSkill & { _new?: boolean }

export default function SkillsSection() {
  const { token } = useAdminAuth()
  const [skills, setSkills] = useState<EditSkill[]>([])
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/skills', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => Array.isArray(d) && setSkills(d))
  }, [token])

  const update = (id: string, field: keyof EditSkill, value: unknown) =>
    setSkills(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))

  const addSkill = () => {
    const newSkill: EditSkill = {
      id: `new-${Date.now()}`, name: '', value: 50, category: 'general',
      sort_order: skills.length, visible: true, updated_at: new Date().toISOString(), _new: true,
    }
    setSkills(prev => [...prev, newSkill])
  }

  const deleteSkill = async (id: string) => {
    if (id.startsWith('new-')) { setSkills(prev => prev.filter(s => s.id !== id)); setDeleteId(null); return }
    await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setSkills(prev => prev.filter(s => s.id !== id))
    setDeleteId(null)
    toast.success('Skill deleted')
  }

  const save = async () => {
    setSaving(true)
    try {
      const payload = skills.map((s, i) => ({ ...s, sort_order: i }))
      const res = await fetch('/api/admin/skills', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      const updated = await res.json()
      setSkills(updated)
      toast.success('✓ Skills saved')
    } catch (e: unknown) {
      toast.error(`✗ ${e instanceof Error ? e.message : 'Save failed'}`)
    } finally {
      setSaving(false)
    }
  }

  const inp = (val: string | number, onChange: (v: string) => void, w?: number | string) => (
    <input value={val} onChange={e => onChange(e.target.value)}
      style={{ background: '#040d04', border: '1px solid #00ff4622', borderRadius: 2, color: '#00ff46', fontFamily: "'Share Tech Mono', monospace", fontSize: 12, padding: '4px 8px', width: w ?? '100%', outline: 'none' }}
      onFocus={e => e.target.style.borderColor = '#00ff46'}
      onBlur={e => e.target.style.borderColor = '#00ff4622'}
    />
  )

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="admin-section-header">
        <div className="admin-section-comment">// editing: skills.sys</div>
        <div className="admin-section-title">Skills</div>
        <div className="admin-section-subtitle">Skill bar chart data</div>
        <hr className="admin-divider" />
      </div>

      <div style={{ marginBottom: 12 }}>
        {skills.map(s => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '8px 12px', background: '#0a120a', borderRadius: 3, border: '1px solid #00ff4611' }}>
            <div style={{ flex: 2 }}>{inp(s.name, v => update(s.id, 'name', v))}</div>
            <div style={{ flex: 1 }}>
              <input type="range" min={0} max={100} value={s.value}
                onChange={e => update(s.id, 'value', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00ff46' }}
              />
            </div>
            <span style={{ color: '#00ff4699', fontSize: 12, width: 36, textAlign: 'right', flexShrink: 0 }}>{s.value}%</span>
            {inp(s.category, v => update(s.id, 'category', v), 100)}
            <div className={`admin-toggle-track ${s.visible ? 'on' : ''}`} onClick={() => update(s.id, 'visible', !s.visible)}
              style={{ cursor: 'pointer', flexShrink: 0 }}>
              <div className="admin-toggle-thumb" />
            </div>
            <button onClick={() => setDeleteId(s.id)} className="admin-btn-danger" style={{ padding: '4px 8px', flexShrink: 0 }}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={addSkill} className="admin-btn-secondary">+ ADD SKILL</button>
        <button onClick={save} disabled={saving} className="admin-btn-primary">
          {saving ? 'saving...' : '$ commit skills --push'}
        </button>
      </div>

      {deleteId && (
        <ConfirmDialog
          message="Delete this skill permanently?"
          onConfirm={() => deleteSkill(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
