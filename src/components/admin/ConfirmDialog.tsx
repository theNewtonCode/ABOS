import { useState } from 'react'

interface Props {
  word?: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ word = 'DELETE', message, onConfirm, onCancel }: Props) {
  const [input, setInput] = useState('')

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(5,10,5,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000,
    }}>
      <div style={{
        background: '#0a120a', border: '1px solid #ff5f5766', borderRadius: 4,
        padding: 28, width: 340, fontFamily: "'Share Tech Mono', monospace",
      }}>
        <div style={{ color: '#ff5f57', fontSize: 13, marginBottom: 12 }}>⚠ {message}</div>
        <div style={{ color: '#00ff4699', fontSize: 11, marginBottom: 8 }}>
          Type <strong style={{ color: '#ff5f57' }}>{word}</strong> to confirm:
        </div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={word}
          style={{
            background: '#040d04', border: '1px solid #ff5f5744', borderRadius: 3,
            color: '#ff5f57', fontFamily: 'inherit', fontSize: 13,
            padding: '8px 12px', width: '100%', outline: 'none', marginBottom: 16,
          }}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onConfirm}
            disabled={input !== word}
            style={{
              flex: 1, background: input === word ? '#ff5f57' : '#ff5f5733',
              color: '#fff', border: 'none', borderRadius: 3, padding: '8px 0',
              fontSize: 12, fontFamily: 'inherit',
              cursor: input === word ? 'pointer' : 'not-allowed',
            }}
          >
            CONFIRM DELETE
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1, background: 'transparent', color: '#00ff4699',
              border: '1px solid #00ff4633', borderRadius: 3, padding: '8px 0',
              fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  )
}
