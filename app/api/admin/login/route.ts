import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

export async function POST(req: Request) {
  const { password } = await req.json()

  const adminPass = process.env.ADMIN_PASSWORD ?? ''
  if (!adminPass || password !== adminPass) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const secret = process.env.ADMIN_SECRET ?? 'mls-admin-secret'
  const token  = createHmac('sha256', secret).update(adminPass).digest('hex')

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
