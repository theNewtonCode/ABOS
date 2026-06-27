import type { VercelRequest, VercelResponse } from '@vercel/node'
import { signJwt } from './_verifyAdmin'

// Simple in-memory rate limiter (resets on cold start — acceptable for serverless)
const attempts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' })
  }

  const { email, password } = req.body ?? {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = signJwt({
    sub: email,
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
  })

  return res.status(200).json({ token })
}
