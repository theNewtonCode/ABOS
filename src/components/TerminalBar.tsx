import { useRef, useState } from 'react'
import { processCommand } from '../utils/terminalEngine'

interface Props {
  onOutput: (s: string) => void
  onOpenWindow: (id: string) => void
  onMatrix: () => void
}

export default function TerminalBar({ onOutput, onOpenWindow, onMatrix }: Props) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    const result = processCommand(value, onOpenWindow)
    setValue('')
    if (result === '__MATRIX__') { onMatrix(); onOutput('') }
    else if (result === '__CLEAR__') { onOutput('') }
    else if (result) onOutput(result)
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        height: 52,
        background: '#040d04',
        borderTop: '1px solid #00ff4633',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        gap: 8,
        flexShrink: 0,
        zIndex: 100,
        position: 'relative',
        cursor: 'text',
      }}
    >
      <span style={{ color: '#00ff46', fontSize: 12, flexShrink: 0, fontFamily: 'inherit' }}>
        uday@portfolio:~$
      </span>
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        aria-label="Terminal input"
        spellCheck={false}
        autoComplete="off"
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#00ff46',
          caretColor: '#00ff46',
          fontSize: 12,
          fontFamily: 'inherit',
        }}
      />
      <span style={{ color: '#00ff4699', fontSize: 10, flexShrink: 0 }}>
        try: help · skills · projects · whoami · clear
      </span>
    </div>
  )
}
