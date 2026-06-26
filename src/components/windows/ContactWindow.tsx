import { contactData } from '../../data/content'

export default function ContactWindow() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src="/assets/avatar.png"
            alt="uday"
            style={{
              width: 40,
              height: 40,
              objectFit: 'cover',
              objectPosition: 'center top',
              border: '1px solid #00ff4666',
              borderRadius: 3,
              display: 'block',
            }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,70,0.04) 2px, rgba(0,255,70,0.04) 4px)',
            pointerEvents: 'none',
            borderRadius: 3,
          }} />
        </div>
        <div>
          <div style={{ color: '#00ff46', marginBottom: 4 }}>$ ping uday@firstprinciple.dev</div>
          <div style={{ color: '#00ff4699', fontSize: 11 }}>... connection established ✓</div>
        </div>
      </div>
      {contactData.links.map(l => (
        <div key={l.key} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
          <span style={{ color: '#00ff4699', width: 72, flexShrink: 0 }}>{l.key}</span>
          <span style={{ color: '#00ff4699' }}>→</span>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#00ff46', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            {l.value}
          </a>
        </div>
      ))}
      <div style={{
        marginTop: 14,
        border: '1px solid #00ff4633',
        borderRadius: 3,
        padding: '10px 12px',
      }}>
        <div style={{ color: '#00ff46', marginBottom: 4 }}>$ status --freelance</div>
        <div style={{ color: '#28c840', marginBottom: 4 }}>● AVAILABLE for new projects</div>
        <div style={{ color: '#00ff4699', fontSize: 11 }}>ServiceNow · Power BI · Data Science · Consulting</div>
      </div>
    </div>
  )
}
