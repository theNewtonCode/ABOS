import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAdminAuth } from '../../../contexts/AdminAuthContext'
import FileUploader from '../../../components/admin/FileUploader'
import TagInput from '../../../components/admin/TagInput'

const schema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  degree: z.string().min(1),
  location: z.string().min(1),
  experience: z.string().min(1),
  stack: z.string().min(1),
  bio: z.string().min(1),
  status_message: z.string().max(120).optional(),
  linkedin_url: z.string().optional(),
  github_url: z.string().optional(),
  fiverr_url: z.string().optional(),
  upwork_url: z.string().optional(),
  email: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const inp: React.CSSProperties = {
  background: '#040d04', border: '1px solid #00ff4633', borderRadius: 3,
  color: '#00ff46', fontFamily: "'Share Tech Mono', monospace", fontSize: 13,
  padding: '8px 12px', width: '100%', outline: 'none', boxSizing: 'border-box',
}

export default function ProfileSection() {
  const { token } = useAdminAuth()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [available, setAvailable] = useState(true)
  const [openTo, setOpenTo] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    fetch('/api/admin/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d?.id) {
          reset(d)
          setAvatarUrl(d.avatar_url)
          setAvailable(d.available ?? true)
          setOpenTo(d.open_to ?? [])
        }
      })
  }, [token, reset])

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...data, avatar_url: avatarUrl, available, open_to: openTo }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('✓ Profile updated')
    } catch (e: unknown) {
      toast.error(`✗ ${e instanceof Error ? e.message : 'Update failed'}`)
    } finally {
      setSaving(false)
    }
  }

  const field = (label: string, name: keyof FormData, opts?: { textarea?: boolean; rows?: number }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 6 }}>{label}</label>
      {opts?.textarea
        ? <textarea {...register(name)} rows={opts.rows ?? 4} style={{ ...inp, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#00ff46'} onBlur={e => e.target.style.borderColor = '#00ff4633'} />
        : <input {...register(name)} style={{ ...inp }} onFocus={e => e.target.style.borderColor = '#00ff46'} onBlur={e => e.target.style.borderColor = '#00ff4633'} />
      }
      {errors[name] && <div style={{ color: '#ff5f57', fontSize: 10, marginTop: 4 }}>{errors[name]?.message as string}</div>}
    </div>
  )

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="admin-section-header">
        <div className="admin-section-comment">// editing: profile</div>
        <div className="admin-section-title">Profile</div>
        <div className="admin-section-subtitle">about_me.txt window content</div>
        <hr className="admin-divider" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Avatar */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 8 }}>Avatar Image</label>
          <FileUploader
            bucket="avatars"
            currentUrl={avatarUrl}
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
            label="Drop avatar image (PNG/JPG, max 5MB)"
            onUploaded={setAvatarUrl}
            onClear={() => setAvatarUrl(null)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>{field('name', 'name')}{field('role', 'role')}{field('degree', 'degree')}</div>
          <div>{field('location', 'location')}{field('experience', 'experience')}{field('stack', 'stack')}</div>
        </div>

        {field('Bio', 'bio', { textarea: true, rows: 4 })}

        {/* Available toggle */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#00ff4699', fontSize: 11 }}>Available for freelance</span>
          <div className={`admin-toggle-track ${available ? 'on' : ''}`} onClick={() => setAvailable(a => !a)} style={{ cursor: 'pointer' }}>
            <div className="admin-toggle-thumb" />
          </div>
          <span style={{ color: available ? '#28c840' : '#00ff4666', fontSize: 11 }}>{available ? 'OPEN' : 'CLOSED'}</span>
        </div>

        {field('status_message (max 120 chars)', 'status_message')}

        {/* Open to tags */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 6 }}>Open to (tags)</label>
          <TagInput value={openTo} onChange={setOpenTo} placeholder="e.g. ServiceNow" />
        </div>

        <div style={{ borderTop: '1px solid #00ff4622', paddingTop: 16, marginBottom: 16 }}>
          <div style={{ color: '#00ff4444', fontSize: 11, marginBottom: 12 }}>// contact links</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {field('linkedin_url', 'linkedin_url')}
            {field('github_url', 'github_url')}
            {field('fiverr_url', 'fiverr_url')}
            {field('upwork_url', 'upwork_url')}
            {field('email', 'email')}
          </div>
        </div>

        <button type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? 'saving...' : '$ commit profile --push'}
        </button>
      </form>
    </div>
  )
}
