import { useState } from 'react'
import { projects } from '../../data/content'

export default function ProjectsWindow() {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div>
      <div style={{ color: '#00ff4699', marginBottom: 12, fontSize: 11 }}>// active_projects/</div>
      {projects.map(p => (
        <div
          key={p.name}
          onMouseEnter={() => setHovered(p.name)}
          onMouseLeave={() => setHovered(null)}
          style={{
            border: `1px solid ${hovered === p.name ? '#00ff46' : '#00ff4633'}`,
            borderRadius: 3,
            padding: '8px 10px',
            marginBottom: 8,
            cursor: 'default',
            transition: 'border-color 0.15s',
          }}
        >
          <div style={{ color: '#00ff46', fontSize: 12, marginBottom: 3 }}>{p.name}</div>
          <div style={{ color: '#00ff4699', fontSize: 11, marginBottom: 5 }}>{p.description}</div>
          <div style={{ color: '#00ff4633', fontSize: 10 }}>[{p.tags.join(' · ')}]</div>
        </div>
      ))}
    </div>
  )
}
