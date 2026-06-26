import { useState } from 'react'
import { IconBrandYoutube, IconBrandInstagram, IconHome, IconHanger } from '@tabler/icons-react'
import { creativeProjects } from '../../data/content'

const iconMap: Record<string, React.ReactNode> = {
  youtube:   <IconBrandYoutube size={20} />,
  instagram: <IconBrandInstagram size={20} />,
  home:      <IconHome size={20} />,
  hanger:    <IconHanger size={20} />,
}

export default function CreativeWindow() {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div>
      <div style={{ color: '#00ff4699', marginBottom: 12, fontSize: 11 }}>// creative_projects/</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {creativeProjects.map(p => (
          <div
            key={p.name}
            onMouseEnter={() => setHovered(p.name)}
            onMouseLeave={() => setHovered(null)}
            style={{
              border: `1px solid ${hovered === p.name ? '#00ff46' : '#00ff4633'}`,
              borderRadius: 4,
              padding: 10,
              cursor: 'default',
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{ color: '#00ff46', marginBottom: 6 }}>{iconMap[p.iconKey]}</div>
            <div style={{ color: '#00ff46', fontSize: 12, marginBottom: 4 }}>{p.name}</div>
            <div style={{ color: '#00ff4699', fontSize: 10 }}>[{p.platform}]</div>
          </div>
        ))}
      </div>
    </div>
  )
}
