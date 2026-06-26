import { useRef } from 'react'
import {
  IconUser, IconFolder, IconChartBar, IconMail, IconPencil, IconPalette
} from '@tabler/icons-react'
import DesktopIcon from './DesktopIcon'
import Window from './Window'
import { WindowInstance } from '../types'

const ICONS = [
  { id: 'about',    label: 'about_me.txt',  icon: <IconUser size={26} /> },
  { id: 'projects', label: 'projects.exe',  icon: <IconFolder size={26} /> },
  { id: 'skills',   label: 'skills.sys',    icon: <IconChartBar size={26} /> },
  { id: 'contact',  label: 'contact.sh',    icon: <IconMail size={26} /> },
  { id: 'blog',     label: 'blog/',         icon: <IconPencil size={26} /> },
  { id: 'creative', label: 'creative/',     icon: <IconPalette size={26} /> },
]

interface Props {
  windows: WindowInstance[]
  onOpen: (id: string) => void
  onClose: (id: string) => void
  onFocus: (id: string) => void
  onUpdate: (id: string, updates: Partial<WindowInstance>) => void
  showMatrix: boolean
  onMatrixDone: () => void
  MatrixRain: React.ComponentType<{ onDone: () => void }>
}

export default function Desktop({ windows, onOpen, onClose, onFocus, onUpdate, showMatrix, onMatrixDone, MatrixRain }: Props) {
  const desktopRef = useRef<HTMLDivElement>(null!)

  return (
    <div
      ref={desktopRef}
      style={{ flex: 1, position: 'relative', background: '#050a05', overflow: 'hidden' }}
    >
      {/* Desktop icons */}
      <div style={{ position: 'absolute', left: 12, top: 12, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 2 }}>
        {ICONS.map(ic => (
          <DesktopIcon
            key={ic.id}
            icon={ic.icon}
            label={ic.label}
            onClick={() => onOpen(ic.id)}
          />
        ))}
      </div>

      {/* Windows */}
      {windows.map(win => (
        <Window
          key={win.id}
          win={win}
          onClose={() => onClose(win.id)}
          onFocus={() => onFocus(win.id)}
          onUpdate={u => onUpdate(win.id, u)}
          desktopRef={desktopRef}
        />
      ))}

      {/* Matrix rain */}
      {showMatrix && <MatrixRain onDone={onMatrixDone} />}
    </div>
  )
}
