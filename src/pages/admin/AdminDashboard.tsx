import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AdminSidebar from '../../components/admin/AdminSidebar'
import ProfileSection from './sections/ProfileSection'
import SkillsSection from './sections/SkillsSection'
import ProjectsSection from './sections/ProjectsSection'
import AchievementsSection from './sections/AchievementsSection'
import BlogSection from './sections/BlogSection'
import CreativeSection from './sections/CreativeSection'
import SiteConfigSection from './sections/SiteConfigSection'
import '../../styles/admin.css'

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050a05', fontFamily: "'Share Tech Mono', monospace" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '28px 32px', minHeight: '100vh', overflowY: 'auto' }}>
        <Routes>
          <Route index element={<ProfileSection />} />
          <Route path="skills" element={<SkillsSection />} />
          <Route path="projects" element={<ProjectsSection />} />
          <Route path="achievements" element={<AchievementsSection />} />
          <Route path="blog" element={<BlogSection />} />
          <Route path="creative" element={<CreativeSection />} />
          <Route path="config" element={<SiteConfigSection />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          success: { style: { background: '#0a1a0a', border: '1px solid #00ff4666', color: '#00ff46', fontFamily: "'Share Tech Mono', monospace", fontSize: 12 } },
          error:   { style: { background: '#1a0505', border: '1px solid #ff5f5766', color: '#ff5f57', fontFamily: "'Share Tech Mono', monospace", fontSize: 12 } },
        }}
      />
    </div>
  )
}
