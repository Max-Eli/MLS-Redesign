import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createHmac } from 'crypto'

function adminToken(): string {
  const pass   = process.env.ADMIN_PASSWORD   ?? ''
  const secret = process.env.ADMIN_SECRET     ?? 'mls-admin-secret'
  return createHmac('sha256', secret).update(pass).digest('hex')
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (pathname === '/admin/login')    return NextResponse.next()

  const cookie = req.cookies.get('admin_token')?.value
  if (cookie && cookie === adminToken()) return NextResponse.next()

  const login = req.nextUrl.clone()
  login.pathname = '/admin/login'
  return NextResponse.redirect(login)
}

export const config = { matcher: ['/admin/:path*'] }
