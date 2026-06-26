import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINES = [
  'UDAY//OS v2.6.25',
  'Copyright © 2025 First Principle Studio',
  '',
  'Initializing kernel...',
  'Loading modules: [servicenow] [python] [powerbi] [creativity]',
  'Mounting filesystem...',
  'Starting desktop environment...',
  '● System ready.',
]

interface Props {
  onDone: () => void
}

export default function BootSequence({ onDone }: Props) {
  const [lines, setLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState('')
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const doneRef = useRef(false)

  useEffect(() => {
    if (doneRef.current) return
    if (lineIdx >= LINES.length) {
      if (doneRef.current) return
      doneRef.current = true
      setTimeout(() => {
        setVisible(false)
        setTimeout(onDone, 400)
      }, 600)
      return
    }

    const line = LINES[lineIdx]
    if (charIdx < line.length) {
      const id = setTimeout(() => setCharIdx(c => c + 1), 20)
      setCurrentLine(line.slice(0, charIdx + 1))
      return () => clearTimeout(id)
    } else {
      const id = setTimeout(() => {
        setLines(prev => [...prev, line])
        setCurrentLine('')
        setCharIdx(0)
        setLineIdx(i => i + 1)
      }, 120)
      return () => clearTimeout(id)
    }
  }, [lineIdx, charIdx, onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#050a05',
            zIndex: 10000,
            padding: '40px 48px',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 14,
            lineHeight: 2,
            color: '#00ff46',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {lines.map((l, i) => <div key={i}>{l || '\u00a0'}</div>)}
          {lineIdx < LINES.length && (
            <div>{currentLine}<span className="blink-cursor">|</span></div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
