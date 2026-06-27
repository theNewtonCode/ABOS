import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdminAuth()
  if (!isAuthenticated) return <Navigate to="/admin" replace />
  return <>{children}</>
}
