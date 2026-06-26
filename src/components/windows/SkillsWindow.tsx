import { skills } from '../../data/content'

export default function SkillsWindow() {
  return (
    <div>
      <div style={{ color: '#00ff4699', marginBottom: 12, fontSize: 11 }}>// loading skill_matrix.dat</div>
      {skills.map(s => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ color: '#00ff4699', width: 120, flexShrink: 0, fontSize: 11 }}>{s.name}</span>
          <div style={{ flex: 1, height: 4, background: '#00ff4620', borderRadius: 2 }}>
            <div style={{ width: `${s.value}%`, height: '100%', background: '#00ff46', borderRadius: 2 }} />
          </div>
          <span style={{ color: '#00ff4633', fontSize: 10, width: 32, textAlign: 'right' }}>{s.value}%</span>
        </div>
      ))}
    </div>
  )
}
