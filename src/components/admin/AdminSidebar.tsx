import { NavLink } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import {
  IconUser, IconCode, IconFolder, IconTrophy,
  IconPencil, IconPalette, IconSettings, IconLogout,
} from '@tabler/icons-react'

const NAV = [
  { to: '/admin/dashboard',              label: 'Profile',      icon: <IconUser size={14} /> },
  { to: '/admin/dashboard/skills',       label: 'Skills',       icon: <IconCode size={14} /> },
  { to: '/admin/dashboard/projects',     label: 'Projects',     icon: <IconFolder size={14} /> },
  { to: '/admin/dashboard/achievements', label: 'Achievements', icon: <IconTrophy size={14} /> },
  { to: '/admin/dashboard/blog',         label: 'Blog',         icon: <IconPencil size={14} /> },
  { to: '/admin/dashboard/creative',     label: 'Creative',     icon: <IconPalette size={14} /> },
  { to: '/admin/dashboard/config',       label: 'Site Config',  icon: <IconSettings size={14} /> },
]

const base: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '10px 20px', fontSize: 13, textDecoration: 'none',
  color: '#00ff4688', cursor: 'pointer', transition: 'all 0.15s',
  borderLeft: '2px solid transparent',
}

export default function AdminSidebar() {
  const { logout } = useAdminAuth()

  return (
    <div style={{
      width: 220, background: '#040d04', borderRight: '1px solid #00ff4622',
      height: '100vh', position: 'sticky', top: 0, display: 'flex',
      flexDirection: 'column', fontFamily: "'Share Tech Mono', monospace",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ color: '#00ff46', fontWeight: 'bold', fontSize: 14, letterSpacing: 2 }}>UDAY//OS</div>
        <div style={{ color: '#00ff4666', fontSize: 10, marginTop: 2, marginBottom: 16 }}>ADMIN PANEL</div>
        <div style={{ borderTop: '1px solid #00ff4622', marginBottom: 8 }} />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {NAV.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === '/admin/dashboard'}
            style={({ isActive }) => ({
              ...base,
              color: isActive ? '#00ff46' : '#00ff4688',
              borderLeftColor: isActive ? '#00ff46' : 'transparent',
              background: isActive ? '#00ff4608' : 'transparent',
            })}
            onMouseEnter={e => { if (!(e.currentTarget as HTMLAnchorElement).className.includes('active')) { (e.currentTarget as HTMLElement).style.color = '#00ff46'; (e.currentTarget as HTMLElement).style.background = '#00ff4605' } }}
            onMouseLeave={e => { if (!(e.currentTarget as HTMLAnchorElement).className.includes('active')) { (e.currentTarget as HTMLElement).style.color = '#00ff4688'; (e.currentTarget as HTMLElement).style.background = 'transparent' } }}
          >
            {n.icon}
            {n.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 0', borderTop: '1px solid #00ff4622' }}>
        <button
          onClick={logout}
          style={{
            ...base as React.CSSProperties,
            background: 'none', border: 'none', width: '100%',
            textAlign: 'left', color: '#ff5f5788', cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ff5f57')}
          onMouseLeave={e => (e.currentTarget.style.color = '#ff5f5788')}
        >
          <IconLogout size={14} />
          Logout
        </button>
      </div>
    </div>
  )
}
