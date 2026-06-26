import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Taskbar from './components/Taskbar'
import Desktop from './components/Desktop'
import TerminalBar from './components/TerminalBar'
import OutputBar from './components/OutputBar'
import SystemAlert from './components/SystemAlert'
import BootSequence from './components/BootSequence'
import MatrixRain from './components/MatrixRain'
import { useWindowManager } from './hooks/useWindowManager'

export default function App() {
  const [booted, setBooted] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [output, setOutput] = useState('')
  const [showMatrix, setShowMatrix] = useState(false)
  const { windows, openWindow, closeWindow, focusWindow, updateWindow } = useWindowManager()

  const handleBootDone = useCallback(() => {
    setBooted(true)
    setTimeout(() => setShowAlert(true), 100)
    setTimeout(() => openWindow('about'), 800)
    setTimeout(() => openWindow('projects'), 1200)
  }, [openWindow])

  const handleOutput = useCallback((s: string) => setOutput(s), [])
  const handleMatrix = useCallback(() => {
    setShowMatrix(true)
    setOutput('// matrix protocol engaged')
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: "'Share Tech Mono', monospace" }}>
      {/* CRT overlays */}
      <div className="crt-scanlines" />
      <div className="crt-flicker" />

      <AnimatePresence>
        {!booted && <BootSequence onDone={handleBootDone} />}
      </AnimatePresence>

      <Taskbar onOpenAbout={() => openWindow('about')} />

      {/* Main area wrapper for alert positioning */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AnimatePresence>
          {showAlert && booted && (
            <SystemAlert
              onClose={() => setShowAlert(false)}
              onContact={() => { openWindow('contact'); setShowAlert(false) }}
            />
          )}
        </AnimatePresence>

        <Desktop
          windows={windows}
          onOpen={openWindow}
          onClose={closeWindow}
          onFocus={focusWindow}
          onUpdate={updateWindow}
          showMatrix={showMatrix}
          onMatrixDone={() => setShowMatrix(false)}
          MatrixRain={MatrixRain}
        />

        <OutputBar output={output} onClear={() => setOutput('')} />

        <TerminalBar
          onOutput={handleOutput}
          onOpenWindow={openWindow}
          onMatrix={handleMatrix}
        />
      </div>

      {/* Mobile fallback */}
      <div className="mobile-notice">
        <div>📺 UdayOS is best viewed on a desktop browser.</div>
        <div style={{ fontSize: 12, marginTop: 8, color: '#00ff4699' }}>
          uday@portfolio:~$ desktop recommended
        </div>
      </div>
    </div>
  )
}
