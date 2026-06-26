import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  output: string
  onClear: () => void
}

export default function OutputBar({ output, onClear }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!output) { setVisible(false); return }
    setVisible(true)
    const id = setTimeout(() => { setVisible(false); onClear() }, 3000)
    return () => clearTimeout(id)
  }, [output, onClear])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            bottom: 52,
            left: 0,
            right: 0,
            background: '#040d04cc',
            borderTop: '1px solid #00ff4633',
            padding: '6px 14px',
            color: '#00ff46',
            fontSize: 12,
            fontFamily: 'inherit',
            zIndex: 200,
            backdropFilter: 'blur(2px)',
          }}
        >
          {output}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
