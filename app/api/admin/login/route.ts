import { NextResponse } from 'next/server'

// Brute-force protection — max 5 attempts per IP per 15 minutes
const loginAttempts = new Map<string, { count: number; resetAt: number; lockedUntil?: number }>()

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now     = Date.now()
  const entry   = loginAttempts.get(ip)
  const WINDOW  = 15 * 60 * 1000  // 15 minutes
  const MAX     = 5
  const LOCKOUT = 30 * 60 * 1000  // 30 minute lockout after max attempts

  if (entry?.lockedUntil && now < entry.lockedUntil) {
    return { allowed: false, retryAfter: Math.ceil((entry.lockedUntil - now) / 1000) }
  }

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW })
    return { allowed: true }
  }

  entry.count++
  if (entry.count >= MAX) {
    entry.lockedUntil = now + LOCKOUT
    return { allowed: false, retryAfter: Math.ceil(LOCKOUT / 1000) }
  }

  return { allowed: true }
}

async function makeToken(password: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(password))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed, retryAfter } = checkRateLimit(ip)

  if (!allowed) {
    return NextResponse.json(
      { error: `Too many login attempts. Try again in ${Math.ceil((retryAfter ?? 1800) / 60)} minutes.` },
      { status: 429, headers: { 'Retry-After': String(retryAfter ?? 1800) } }
    )
  }

  const { password } = await req.json()
  const adminPass    = process.env.ADMIN_PASSWORD || ''

  if (!adminPass || password !== adminPass) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  // Clear attempts on successful login
  loginAttempts.delete(ip)

  const secret = process.env.ADMIN_SECRET || 'mls-admin-secret'
  const token  = await makeToken(adminPass, secret)

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7, // 7 days
    path:     '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('admin_token')
  return res
}
