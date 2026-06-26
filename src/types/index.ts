import React from 'react'

export interface WindowInstance {
  id: string
  title: string
  component: React.ComponentType
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  isActive: boolean
  flash?: boolean
}

export interface SkillItem {
  name: string
  value: number
}

export interface ProjectItem {
  name: string
  description: string
  tags: string[]
}

export interface Command {
  trigger: string
  action: (openWindow: (id: string) => void) => string
}
