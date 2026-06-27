import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createHmac } from 'crypto'

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export function signJwt(payload: Record<string, unknown>): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64url(JSON.stringify(payload))
  const sig = createHmac('sha256', process.env.JWT_SECRET!)
    .update(`${header}.${body}`).digest('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  return `${header}.${body}.${sig}`
}

export function verifyJwt(token: string): Record<string, unknown> | null {
  try {
    const [header, body, sig] = token.split('.')
    const expected = createHmac('sha256', process.env.JWT_SECRET!)
      .update(`${header}.${body}`).digest('base64')
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    if (sig !== expected) return null
    const payload = JSON.parse(Buffer.from(body, 'base64').toString())
    if (payload.exp && Date.now() / 1000 > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export function verifyAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  const token = auth.slice(7)
  const payload = verifyJwt(token)
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' })
    return false
  }
  return true
}
