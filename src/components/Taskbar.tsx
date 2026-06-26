import { useEffect, useState } from 'react'

interface Props {
  onOpenAbout: () => void
}

export default function Taskbar({ onOpenAbout }: Props) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setTime(d.toTimeString().slice(0, 8))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      height: 28,
      background: '#0a120a',
      borderBottom: '1px solid #00ff4688',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: 10,
      flexShrink: 0,
      zIndex: 100,
      position: 'relative',
      fontFamily: 'inherit',
    }}>
      <span style={{ color: '#00ff46', fontWeight: 'bold', letterSpacing: 2, fontSize: 12 }}>UDAY//OS</span>
      <span style={{ color: '#00ff4633' }}>|</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff46', display: 'inline-block' }} />
        <span style={{ color: '#00ff46', fontSize: 11 }}>ONLINE</span>
      </span>
      <span style={{ color: '#00ff4633' }}>|</span>
      <span style={{ color: '#00ff4699', fontSize: 11 }}>v2.6.25</span>

      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <img
          src="/assets/avatar.png"
          alt="Open about"
          onClick={onOpenAbout}
          aria-label="Open about_me.txt"
          style={{
            width: 18,
            height: 18,
            borderRadius: 2,
            border: '1px solid #00ff4666',
            objectFit: 'cover',
            objectPosition: 'center top',
            cursor: 'pointer',
            display: 'block',
          }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        />
        <span style={{ color: '#00ff46', fontSize: 12, letterSpacing: 1 }}>{time}</span>
      </div>
    </div>
  )
}
