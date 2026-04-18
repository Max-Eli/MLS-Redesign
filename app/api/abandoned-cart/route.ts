import { NextResponse } from 'next/server'
import { upsertAbandonedCart } from '@/lib/abandoned-carts'
import type { CartItem } from '@/types/cart'

const rateLimit = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(key)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(key, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= 20) return true
  entry.count++
  return false
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json() as {
      email?:     string
      firstName?: string
      lastName?:  string
      phone?:     string
      items?:     CartItem[]
      subtotal?:  number
      promoCode?: string | null
    }

    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (!body.items?.length) {
      return NextResponse.json({ error: 'Empty cart' }, { status: 400 })
    }
    if (body.items.length > 50) {
      return NextResponse.json({ error: 'Too many items' }, { status: 400 })
    }

    const subtotalCents = Math.round((body.subtotal ?? 0) * 100)

    const row = await upsertAbandonedCart({
      email:         body.email,
      firstName:     body.firstName,
      lastName:      body.lastName,
      phone:         body.phone,
      items:         body.items,
      subtotalCents,
      promoCode:     body.promoCode ?? null,
    })

    if (!row) {
      return NextResponse.json({ error: 'Could not save cart' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('abandoned-cart POST error:', err)
    return NextResponse.json({ error: 'Failed to save cart' }, { status: 500 })
  }
}
