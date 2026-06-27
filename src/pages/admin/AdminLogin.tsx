import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { IconShieldLock, IconEye, IconEyeOff } from '@tabler/icons-react'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})
type FormData = z.infer<typeof schema>

const inp: React.CSSProperties = {
  background: '#040d04', border: '1px solid #00ff4633', borderRadius: 3,
  color: '#00ff46', fontFamily: "'Share Tech Mono', monospace", fontSize: 13,
  padding: '8px 12px', width: '100%', outline: 'none',
}

export default function AdminLogin() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setAuthError('')
    try {
      // Try the API route first (works on Vercel / vercel dev)
      // Fall back to client-side env var check (works on plain vite dev)
      let token: string | null = null

      const apiAvailable = import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co'

      if (apiAvailable) {
        const res = await fetch('/api/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        // If the route doesn't exist (Vite dev), res will be an HTML 404
        const contentType = res.headers.get('content-type') ?? ''
        if (contentType.includes('application/json')) {
          const json = await res.json()
          if (!res.ok) throw new Error(json.error ?? 'Authentication failed')
          token = json.token
        }
      }

      // Client-side fallback: check VITE_ prefixed creds
      if (!token) {
        const expectedEmail = import.meta.env.VITE_ADMIN_EMAIL
        const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD
        if (!expectedEmail || !expectedPassword) {
          throw new Error('API not reachable. Run via: vercel dev')
        }
        if (data.email !== expectedEmail || data.password !== expectedPassword) {
          throw new Error('Invalid credentials')
        }
        // Generate a simple client-side token
        token = btoa(JSON.stringify({ sub: data.email, role: 'admin', exp: Date.now() + 86400000 }))
      }

      login(token)
      navigate('/admin/dashboard')
    } catch (e: unknown) {
      setAuthError(e instanceof Error ? e.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#050a05', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Share Tech Mono', monospace",
    }}>
      <div style={{ width: 400, background: '#0a120a', border: '1px solid #00ff4666', borderRadius: 4, padding: 32 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <IconShieldLock size={32} color="#00ff46" style={{ marginBottom: 10 }} />
          <div style={{ color: '#00ff46', fontSize: 18, letterSpacing: 3, fontWeight: 'bold', marginBottom: 6 }}>
            ADMIN ACCESS
          </div>
          <div style={{ color: '#00ff4666', fontSize: 12 }}>// authenticate to continue</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 6 }}>
              $ email --user
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              style={{ ...inp, borderColor: errors.email ? '#ff5f57' : '#00ff4633' }}
              onFocus={e => (e.target.style.borderColor = '#00ff46')}
              onBlur={e => (e.target.style.borderColor = errors.email ? '#ff5f57' : '#00ff4633')}
            />
            {errors.email && <div style={{ color: '#ff5f57', fontSize: 10, marginTop: 4 }}>{errors.email.message}</div>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: '#00ff4699', fontSize: 11, display: 'block', marginBottom: 6 }}>
              $ password --secure
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                style={{ ...inp, paddingRight: 40, borderColor: errors.password ? '#ff5f57' : '#00ff4633' }}
                onFocus={e => (e.target.style.borderColor = '#00ff46')}
                onBlur={e => (e.target.style.borderColor = errors.password ? '#ff5f57' : '#00ff4633')}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#00ff4666', padding: 0 }}
              >
                {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
            {errors.password && <div style={{ color: '#ff5f57', fontSize: 10, marginTop: 4 }}>{errors.password.message}</div>}
          </div>

          {/* Error */}
          {authError && (
            <div style={{ background: '#1a0505', border: '1px solid #ff5f5766', borderRadius: 3, padding: '8px 12px', color: '#ff5f57', fontSize: 12, marginBottom: 16 }}>
              ACCESS DENIED — {authError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: loading ? '#00ff4666' : '#00ff46',
              color: '#050a05', border: 'none', borderRadius: 3, padding: '10px 0',
              fontSize: 13, fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold', letterSpacing: 2,
            }}
          >
            {loading ? 'authenticating...' : 'AUTHENTICATE →'}
          </button>
        </form>

        <div style={{ marginTop: 24, color: '#00ff4633', fontSize: 10, textAlign: 'center', lineHeight: 1.6 }}>
          This page is not indexed. Unauthorized access attempts are logged.
        </div>
      </div>
    </div>
  )
}
