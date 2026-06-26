import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WindowInstance } from '../types'

interface Props {
  win: WindowInstance
  onClose: () => void
  onFocus: () => void
  onUpdate: (updates: Partial<WindowInstance>) => void
  desktopRef: React.RefObject<HTMLDivElement>
}

export default function Window({ win, onClose, onFocus, onUpdate, desktopRef }: Props) {
  const [visible] = useState(true)
  const [flashing, setFlashing] = useState(false)
  const dragStart = useRef<{ mx: number; my: number; wx: number; wy: number } | null>(null)
  const resizeStart = useRef<{ mx: number; my: number; ww: number; wh: number } | null>(null)
  const isDragging = useRef(false)
  const isResizing = useRef(false)

  // Consume flash flag — pulse titlebar then clear
  useEffect(() => {
    if (!win.flash) return
    setFlashing(true)
    onUpdate({ flash: false })
    const id = setTimeout(() => setFlashing(false), 300)
    return () => clearTimeout(id)
  }, [win.flash]) // eslint-disable-line react-hooks/exhaustive-deps

  const onTitleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    onFocus()
    dragStart.current = { mx: e.clientX, my: e.clientY, wx: win.x, wy: win.y }
    isDragging.current = true

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current || !dragStart.current) return
      const desktop = desktopRef.current
      if (!desktop) return
      const { width: dw, height: dh } = desktop.getBoundingClientRect()
      const dx = ev.clientX - dragStart.current.mx
      const dy = ev.clientY - dragStart.current.my
      const nx = Math.max(0, Math.min(dragStart.current.wx + dx, dw - win.width))
      const ny = Math.max(0, Math.min(dragStart.current.wy + dy, dh - 28))
      onUpdate({ x: nx, y: ny })
    }

    const onUp = () => {
      isDragging.current = false
      dragStart.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [win, onFocus, onUpdate, desktopRef])

  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    resizeStart.current = { mx: e.clientX, my: e.clientY, ww: win.width, wh: win.height }
    isResizing.current = true

    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current || !resizeStart.current) return
      const dx = ev.clientX - resizeStart.current.mx
      const dy = ev.clientY - resizeStart.current.my
      onUpdate({
        width: Math.max(240, resizeStart.current.ww + dx),
        height: Math.max(160, resizeStart.current.wh + dy),
      })
    }

    const onUp = () => {
      isResizing.current = false
      resizeStart.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [win, onUpdate])

  const Comp = win.component

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={win.id}
          initial={{ opacity: 0, scale: 0.92, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onMouseDown={onFocus}
          style={{
            position: 'absolute',
            left: win.x,
            top: win.y,
            width: win.width,
            height: win.height,
            zIndex: win.zIndex,
            display: 'flex',
            flexDirection: 'column',
            background: '#050e05',
            border: `1px solid ${win.isActive ? '#00ff46' : '#00ff4633'}`,
            borderRadius: 4,
            boxShadow: win.isActive ? '0 0 20px #00ff4622' : 'none',
          }}
        >
          {/* Titlebar */}
          <div
            onMouseDown={onTitleMouseDown}
            style={{
              height: 28,
              background: flashing ? '#00ff4622' : '#0a180a',
              borderBottom: `1px solid ${flashing ? '#00ff46' : '#00ff4633'}`,
              borderRadius: '4px 4px 0 0',
              display: 'flex',
              alignItems: 'center',
              padding: '0 8px',
              cursor: 'grab',
              userSelect: 'none',
              flexShrink: 0,
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            {/* Traffic lights */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button
                aria-label="Close window"
                onClick={(e) => { e.stopPropagation(); onClose() }}
                style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', border: 'none', cursor: 'pointer', padding: 0 }}
              />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            </div>
            {/* Title */}
            <div style={{
              flex: 1,
              textAlign: 'center',
              color: '#00ff4699',
              fontSize: 11,
              letterSpacing: 1,
              fontFamily: 'inherit',
            }}>
              {win.title}
            </div>
            <div style={{ width: 52 }} />
          </div>

          {/* Body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 14,
            color: '#00ff46',
            fontSize: 12,
            lineHeight: 1.7,
            fontFamily: 'inherit',
          }} className="win-body">
            <Comp />
          </div>

          {/* Resize handle */}
          <div
            onMouseDown={onResizeMouseDown}
            aria-label="Resize window"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              cursor: 'se-resize',
              background: 'transparent',
              borderRight: '2px solid #00ff4699',
              borderBottom: '2px solid #00ff4699',
              borderRadius: '0 0 3px 0',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
