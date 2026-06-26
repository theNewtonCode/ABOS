import { motion } from 'framer-motion'

interface Props {
  onClose: () => void
  onContact: () => void
}

export default function SystemAlert({ onClose, onContact }: Props) {
  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: 36,
        left: 12,
        right: 12,
        background: '#0a1a0a',
        border: '1px solid #00ff46aa',
        borderRadius: 3,
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 99,
        fontFamily: 'inherit',
        flexWrap: 'wrap',
      }}
    >
      <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ff46', flexShrink: 0, display: 'inline-block' }} />
      <span style={{ color: '#00ff46', fontSize: 11, flex: 1 }}>
        [ SYS_ALERT ] Uday is currently open for freelance projects — ServiceNow · Power BI · Data Science
      </span>
      <button
        onClick={onContact}
        aria-label="Initialize contact"
        style={{
          background: '#00ff46',
          color: '#050a05',
          border: 'none',
          borderRadius: 2,
          padding: '4px 10px',
          fontSize: 10,
          fontFamily: 'inherit',
          cursor: 'pointer',
          fontWeight: 'bold',
          letterSpacing: 1,
        }}
      >
        INITIALIZE CONTACT
      </button>
      <button
        onClick={onClose}
        aria-label="Dismiss alert"
        style={{
          background: 'transparent',
          color: '#00ff4699',
          border: 'none',
          cursor: 'pointer',
          fontSize: 14,
          padding: '0 4px',
          fontFamily: 'inherit',
        }}
      >
        ✕
      </button>
    </motion.div>
  )
}
