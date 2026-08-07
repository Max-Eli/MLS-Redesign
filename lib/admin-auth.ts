import { cookies } from 'next/headers'

// Recompute the same HMAC(admin password, secret) token the login route issues,
// so API routes can verify the admin_token cookie server-side. Keeps the auth
// scheme in one place — mirrors middleware.ts.
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

// True only when the caller presents a valid admin_token cookie. Used to gate
// sensitive admin API routes (middleware only protects /admin pages, not /api).
export async function isAdminAuthed(): Promise<boolean> {
  const pass   = process.env.ADMIN_PASSWORD || ''
  const secret = process.env.ADMIN_SECRET   || 'mls-admin-secret'
  if (!pass) return false

  const token = cookies().get('admin_token')?.value
  if (!token) return false

  const expected = await makeToken(pass, secret)
  return token === expected
}
