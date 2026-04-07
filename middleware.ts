import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function adminToken(): Promise<string> {
  const pass   = process.env.ADMIN_PASSWORD ?? ''
  const secret = process.env.ADMIN_SECRET   ?? 'mls-admin-secret'

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(pass))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (pathname === '/admin/login')    return NextResponse.next()

  const cookie   = req.cookies.get('admin_token')?.value
  const expected = await adminToken()

  if (cookie && cookie === expected) return NextResponse.next()

  const login = req.nextUrl.clone()
  login.pathname = '/admin/login'
  return NextResponse.redirect(login)
}

export const config = { matcher: ['/admin/:path*'] }
