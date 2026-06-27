import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAdminAuth } from '../../../contexts/AdminAuthContext'

export default function SiteConfigSection() {
  const { token } = useAdminAuth()
  const [alertVisible, setAlertVisible] = useState(true)
  const [alertMessage, setAlertMessage] = useState('')
  const [bootVersion, setBootVersion] = useState('')
  const [siteStatus, setSiteStatus] = useState('online')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/config', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then((d: Record<string, string>) => {
        setAlertVisible(d['alert_visible'] === 'true')
        setAlertMessage(d['alert_message'] ?? '')
        setBootVersion(d['boot_version'] ?? '')
        setSiteStatus(d['site_status'] ?? 'online')
      })
  }, [token])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          alert_visible: String(alertVisible),
          alert_message: alertMessage,
          boot_version: bootVersion,
          site_status: siteStatus,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('✓ Config saved')
    } catch (e: unknown) {
      toast.error(`✗ ${e instanceof Error ? e.message : 'Save failed'}`)
    } finally { setSaving(false) }
  }

  const inp: React.CSSProperties = {
    background: '#040d04', border: '1px solid #00ff4633', borderRadius: 3,
    color: '#00ff46', fontFamily: "'Share Tech Mono', monospace", fontSize: 13,
    padding: '8px 12px', width: '100%', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="admin-section-header">
        <div className="admin-section-comment">// editing: site_config</div>
        <div className="admin-section-title">Site Config</div>
        <div className="admin-section-subtitle">Global settings for the portfolio OS</div>
        <hr className="admin-divider" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: form */}
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div className={`admin-toggle-track ${alertVisible ? 'on' : ''}`} onClick={() => setAlertVisible(v => !v)} style={{ cursor: 'pointer' }}>
                <div className="admin-toggle-thumb" />
              </div>
              <label style={{ color: '#00ff4699', fontSize: 11 }}>System Alert Visible</label>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 6 }}>
              Alert Message <span style={{ color: '#00ff4633' }}>({alertMessage.length}/120)</span>
            </label>
            <input value={alertMessage} onChange={e => setAlertMessage(e.target.value)} maxLength={120}
              style={inp} onFocus={e => e.target.style.borderColor = '#00ff46'} onBlur={e => e.target.style.borderColor = '#00ff4633'} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 6 }}>Boot Version</label>
            <input value={bootVersion} onChange={e => setBootVersion(e.target.value)}
              style={inp} onFocus={e => e.target.style.borderColor = '#00ff46'} onBlur={e => e.target.style.borderColor = '#00ff4633'} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 6 }}>Site Status</label>
            <select value={siteStatus} onChange={e => setSiteStatus(e.target.value)}
              style={{ ...inp, cursor: 'pointer' }}>
              <option value="online">online</option>
              <option value="maintenance">maintenance</option>
            </select>
          </div>

          <button onClick={save} disabled={saving} className="admin-btn-primary">
            {saving ? 'saving...' : '$ commit config --push'}
          </button>
        </div>

        {/* Right: preview */}
        <div>
          <div style={{ color: '#00ff4444', fontSize: 11, marginBottom: 10 }}>// live preview</div>
          {alertVisible ? (
            <div style={{
              background: '#0a1a0a', border: '1px solid #00ff46aa', borderRadius: 3,
              padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
              fontFamily: "'Share Tech Mono', monospace",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ff46', display: 'inline-block' }} />
              <span style={{ color: '#00ff46', fontSize: 11, flex: 1 }}>[ SYS_ALERT ] {alertMessage}</span>
              <button style={{ background: '#00ff46', color: '#050a05', border: 'none', borderRadius: 2, padding: '3px 8px', fontSize: 10, fontFamily: 'inherit' }}>INITIALIZE CONTACT</button>
            </div>
          ) : (
            <div style={{ color: '#00ff4433', fontSize: 12, padding: '12px', border: '1px dashed #00ff4422', borderRadius: 3 }}>
              alert hidden
            </div>
          )}
          <div style={{ marginTop: 16, color: '#00ff4444', fontSize: 11 }}>// boot header</div>
          <div style={{ marginTop: 6, fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#00ff46' }}>
            UDAY//OS {bootVersion}
          </div>
        </div>
      </div>
    </div>
  )
}
