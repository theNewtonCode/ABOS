import { useState, useCallback, useRef } from 'react'
import { WindowInstance } from '../types'
import { windowDefs } from '../data/content'
import AboutWindow from '../components/windows/AboutWindow'
import SkillsWindow from '../components/windows/SkillsWindow'
import ProjectsWindow from '../components/windows/ProjectsWindow'
import ContactWindow from '../components/windows/ContactWindow'
import BlogWindow from '../components/windows/BlogWindow'
import CreativeWindow from '../components/windows/CreativeWindow'

const componentMap: Record<string, React.ComponentType> = {
  about: AboutWindow,
  skills: SkillsWindow,
  projects: ProjectsWindow,
  contact: ContactWindow,
  blog: BlogWindow,
  creative: CreativeWindow,
}

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowInstance[]>([])
  const zCounter = useRef(10)

  const openWindow = useCallback((id: string) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id)
      if (existing) {
        zCounter.current++
        const z = zCounter.current
        return prev.map(w =>
          w.id === id
            ? { ...w, zIndex: z, isActive: true, flash: true }
            : { ...w, isActive: false }
        )
      }
      const def = windowDefs[id]
      if (!def) return prev
      zCounter.current++
      const offset = prev.length * 24
      return [
        ...prev.map(w => ({ ...w, isActive: false })),
        {
          id,
          title: def.title,
          component: componentMap[id],
          x: def.defaultX + offset,
          y: def.defaultY + offset,
          width: def.w,
          height: def.h,
          zIndex: zCounter.current,
          isActive: true,
          flash: false,
        },
      ]
    })
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id))
  }, [])

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      zCounter.current++
      const z = zCounter.current
      return prev.map(w => w.id === id ? { ...w, zIndex: z, isActive: true } : { ...w, isActive: false })
    })
  }, [])

  const updateWindow = useCallback((id: string, updates: Partial<WindowInstance>) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
  }, [])

  return { windows, openWindow, closeWindow, focusWindow, updateWindow }
}
