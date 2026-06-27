import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface AdminAuthContextType {
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem('admin_token')
  )

  const login = useCallback((t: string) => {
    sessionStorage.setItem('admin_token', t)
    setToken(t)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('admin_token')
    setToken(null)
    window.location.href = '/admin'
  }, [])

  return (
    <AdminAuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
