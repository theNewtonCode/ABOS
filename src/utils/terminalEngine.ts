import { Command } from '../types'

const commands: Command[] = [
  {
    trigger: 'help',
    action: () => 'commands: about · skills · projects · contact · blog · creative · whoami · ls · date · hire · status · clear · matrix',
  },
  { trigger: 'about', action: (o) => { o('about'); return 'opening about_me.txt...' } },
  { trigger: 'skills', action: (o) => { o('skills'); return 'loading skill_matrix.dat...' } },
  { trigger: 'projects', action: (o) => { o('projects'); return 'mounting project_dashboard.exe...' } },
  { trigger: 'contact', action: (o) => { o('contact'); return 'executing contact.sh...' } },
  { trigger: 'blog', action: (o) => { o('blog'); return 'reading blog/...' } },
  { trigger: 'creative', action: (o) => { o('creative'); return 'mounting creative/...' } },
  { trigger: 'whoami', action: () => 'uday bhatnagar — servicenow consultant · data scientist · creator · engineer artist' },
  { trigger: 'ls', action: () => 'about_me.txt   skills.sys   project_dashboard.exe   contact.sh   blog/   creative/' },
  { trigger: 'date', action: () => new Date().toString() },
  { trigger: 'hire', action: (o) => { o('contact'); return '[SYS] initiating hire sequence...' } },
  { trigger: 'status', action: () => "● uday is ONLINE and AVAILABLE for freelance. type 'hire' to connect." },
  { trigger: 'clear', action: () => '__CLEAR__' },
  { trigger: 'matrix', action: () => '__MATRIX__' },
]

export function processCommand(
  input: string,
  openWindow: (id: string) => void
): string {
  const cmd = input.trim().toLowerCase()
  if (!cmd) return ''
  const found = commands.find(c => c.trigger === cmd)
  if (found) return found.action(openWindow)
  return `command not found: ${cmd}. type 'help'`
}
