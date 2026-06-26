import { useState } from 'react'

interface Props {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export default function DesktopIcon({ icon, label, onClick }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Open ${label}`}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        cursor: 'pointer',
        padding: '6px 4px',
        borderRadius: 4,
        width: 90,
        userSelect: 'none',
      }}
    >
      <div style={{
        width: 52,
        height: 52,
        border: `1px solid ${hovered ? '#00ff46' : '#00ff4633'}`,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hovered ? '#00ff4610' : 'transparent',
        color: '#00ff46',
        transition: 'all 0.15s',
      }}>
        {icon}
      </div>
      <span style={{ color: '#00ff4699', fontSize: 12, textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </div>
  )
}
