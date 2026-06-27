import { useState, KeyboardEvent } from 'react'

interface Props {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export default function TagInput({ value, onChange, placeholder = 'Add tag, press Enter' }: Props) {
  const [input, setInput] = useState('')

  const add = () => {
    const tag = input.trim()
    if (tag && !value.includes(tag)) onChange([...value, tag])
    setInput('')
  }

  const remove = (tag: string) => onChange(value.filter(t => t !== tag))

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); add() }
    if (e.key === 'Backspace' && !input && value.length) remove(value[value.length - 1])
  }

  return (
    <div style={{
      background: '#040d04', border: '1px solid #00ff4633', borderRadius: 3,
      padding: '6px 10px', display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
      minHeight: 38,
    }}>
      {value.map(tag => (
        <span key={tag} style={{
          background: '#00ff4615', border: '1px solid #00ff4633', borderRadius: 2,
          padding: '2px 8px', fontSize: 11, color: '#00ff46', display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {tag}
          <button onClick={() => remove(tag)} style={{ background: 'none', border: 'none', color: '#00ff4699', cursor: 'pointer', padding: 0, fontSize: 11, lineHeight: 1 }}>✕</button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKey}
        onBlur={add}
        placeholder={value.length === 0 ? placeholder : ''}
        style={{
          background: 'transparent', border: 'none', outline: 'none',
          color: '#00ff46', fontFamily: "'Share Tech Mono', monospace",
          fontSize: 12, flex: 1, minWidth: 120,
        }}
      />
    </div>
  )
}
