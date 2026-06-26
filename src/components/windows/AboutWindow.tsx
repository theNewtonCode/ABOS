import { aboutData } from '../../data/content'

export default function AboutWindow() {
  return (
    <div>
      {aboutData.fields.map(f => (
        <div key={f.key} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
          <span style={{ color: '#00ff4699', minWidth: 80 }}>{f.key}</span>
          <span style={{ color: '#00ff4699' }}>→</span>
          <span style={{ color: f.key === 'status' ? '#28c840' : '#00ff46' }}>{f.value}</span>
        </div>
      ))}
      <div style={{
        marginTop: 16,
        paddingTop: 12,
        borderTop: '1px solid #00ff4633',
        color: '#00ff4699',
        fontSize: 11,
        lineHeight: 1.8,
        whiteSpace: 'pre-line',
      }}>
        {aboutData.footer}
      </div>
    </div>
  )
}
