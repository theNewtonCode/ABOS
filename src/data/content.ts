import { SkillItem, ProjectItem } from '../types'

export const aboutData = {
  fields: [
    { key: 'name', value: 'Uday Bhatnagar' },
    { key: 'role', value: 'ServiceNow Consultant + Developer' },
    { key: 'degree', value: 'CSE Data Science, B.Tech' },
    { key: 'location', value: 'Hyderabad, IN' },
    { key: 'channels', value: 'The Lazy Electron / That Engineer Artist' },
    { key: 'brand', value: 'First Principle (boutique engineering studio)' },
    { key: 'status', value: '● OPEN FOR FREELANCE' },
  ],
  footer: 'Engineer by training. Artist by instinct.\nBuilding at the intersection of systems + creativity.',
}

export const skills: SkillItem[] = [
  { name: 'ServiceNow', value: 95 },
  { name: 'Flow Designer', value: 90 },
  { name: 'Power BI', value: 88 },
  { name: 'SQL', value: 85 },
  { name: 'HRSD / SPM', value: 85 },
  { name: 'Python', value: 82 },
  { name: 'AI Agents', value: 80 },
  { name: 'Excel / VBA', value: 80 },
  { name: 'Data Science', value: 78 },
  { name: 'JavaScript', value: 72 },
]

export const projects: ProjectItem[] = [
  {
    name: 'Smart Leave Assistant',
    description: 'AI-powered HRSD Agent with 5 intents, Yokohama release',
    tags: ['ServiceNow', 'AI Agents', 'Flow Designer'],
  },
  {
    name: 'Manager Hub',
    description: 'Client-facing HR/IT dashboard with role-based layouts',
    tags: ['ServiceNow', 'HRSD', 'Demo Assets'],
  },
  {
    name: 'Power BI Analytics Dashboard',
    description: 'KPI drill-through reporting for enterprise client',
    tags: ['Power BI', 'SQL', 'DAX'],
  },
  {
    name: 'The Lazy Electron',
    description: 'Physics + engineering YouTube channel — scripts and production',
    tags: ['Content Creation', 'Education', 'YouTube'],
  },
  {
    name: 'House of Klara',
    description: "Full brand identity system for women's fashion label",
    tags: ['Branding', 'Design', 'Instagram'],
  },
  {
    name: 'First Principle Website',
    description: 'This site — cyberpunk OS-theme portfolio',
    tags: ['React', 'TypeScript', 'Framer Motion'],
  },
  {
    name: 'Presence Tracker',
    description: 'Personal CRM dashboard for digital footprint tracking',
    tags: ['React', 'TypeScript', 'GitHub Gist', 'Ink & Neon theme'],
  },
]

export const blogPosts = [
  'ServiceNow AI Agents — Developer Deep Dive',
  'How I Built a Smart Leave Assistant in Yokohama',
  'Power BI for Non-Developers',
  'CIS Data Foundations — What to Actually Study',
  'Urban Heat Island Effect — Script + Storyboard',
]

export const creativeProjects = [
  { name: 'The Lazy Electron',    platform: 'YouTube · Physics + Engineering', iconKey: 'youtube' },
  { name: 'That Engineer Artist', platform: 'YouTube + Instagram · Art & DIY',  iconKey: 'instagram' },
  { name: 'The Snug Project',     platform: 'Series · Apartment Makeover',      iconKey: 'home' },
  { name: 'House of Klara',       platform: "Branding · Women's Fashion",       iconKey: 'hanger' },
]

export const contactData = {
  links: [
    { key: 'linkedin', value: 'linkedin.com/in/udaybhatnagar', href: 'https://linkedin.com/in/udaybhatnagar' },
    { key: 'github',   value: 'github.com/udaybhatnagar',     href: 'https://github.com/udaybhatnagar' },
    { key: 'fiverr',   value: 'fiverr.com/udaybhatnagar',     href: 'https://fiverr.com/udaybhatnagar' },
    { key: 'email',    value: 'uday@firstprinciple.dev',      href: 'mailto:uday@firstprinciple.dev' },
  ],
}

export const windowDefs: Record<string, { title: string; w: number; h: number; defaultX: number; defaultY: number }> = {
  about:    { title: 'about_me.txt',           w: 500, h: 340, defaultX: 110, defaultY: 35 },
  skills:   { title: 'skills.sys',             w: 330, h: 340, defaultX: 140, defaultY: 60 },
  projects: { title: 'project_dashboard.exe',  w: 400, h: 380, defaultX: 180, defaultY: 50 },
  contact:  { title: 'contact.sh',             w: 320, h: 280, defaultX: 160, defaultY: 80 },
  blog:     { title: 'blog/',                  w: 360, h: 300, defaultX: 120, defaultY: 45 },
  creative: { title: 'creative/',              w: 350, h: 300, defaultX: 150, defaultY: 55 },
}
