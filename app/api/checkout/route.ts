import { NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe'
import type { CartItem } from '@/types/cart'

// Simple in-memory rate limiter — max 10 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= 10) return true
  entry.count++
  return false
}

// Verify prices server-side against WordPress
async function verifyPrices(items: CartItem[]): Promise<{ valid: boolean; amount: number; error?: string }> {
  const WP_URL = process.env.WORDPRESS_URL || 'https://manhattanlaserspa.com'
  let verifiedTotal = 0

  for (const item of items) {
    if (!item.slug) return { valid: false, amount: 0, error: 'Missing item slug' }
    if (item.quantity < 1 || item.quantity > 20) return { valid: false, amount: 0, error: 'Invalid quantity' }

    try {
      const res = await fetch(
        `${WP_URL}/wp-json/wp/v2/mls_service?slug=${item.slug}&_fields=meta&status=publish`,
        { next: { revalidate: 60 } }
      )
      if (!res.ok) return { valid: false, amount: 0, error: `Could not verify item: ${item.name}` }

      const [service] = await res.json()
      if (!service?.meta) return { valid: false, amount: 0, error: `Item not found: ${item.name}` }

      const meta = service.meta
      const price = parseFloat(meta.mls_sale_price || meta.mls_price || '0')
      if (!price || isNaN(price) || price <= 0) {
        return { valid: false, amount: 0, error: `No valid price for: ${item.name}` }
      }

      verifiedTotal += price * item.quantity
    } catch {
      return { valid: false, amount: 0, error: `Verification failed for: ${item.name}` }
    }
  }

  return { valid: true, amount: Math.round(verifiedTotal * 100) }
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { items, email }: { items: CartItem[]; email?: string } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (items.length > 20) {
      return NextResponse.json({ error: 'Too many items' }, { status: 400 })
    }

    // Verify prices server-side — never trust client prices
    const { valid, amount, error } = await verifyPrices(items)
    if (!valid) {
      return NextResponse.json({ error: error ?? 'Price verification failed' }, { status: 400 })
    }

    if (amount < 50) {
      return NextResponse.json({ error: 'Order total too low' }, { status: 400 })
    }

    const itemsSummary = items
      .map(i => `${i.name} x${i.quantity}`)
      .join(', ')
      .slice(0, 500)

    const paymentIntent = await createPaymentIntent({
      amount,
      metadata: {
        items: itemsSummary,
        ...(email ? { customer_email: email } : {}),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
