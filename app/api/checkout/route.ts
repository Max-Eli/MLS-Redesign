import { NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe'
import { fetchServiceBySlug } from '@/lib/supabase'
import { validatePromoCode } from '@/lib/promos'
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

// Verify prices server-side against Supabase — never trust client-sent prices
async function verifyPrices(items: CartItem[]): Promise<{ valid: boolean; amount: number; error?: string }> {
  let verifiedTotal = 0

  for (const item of items) {
    if (!item.slug) return { valid: false, amount: 0, error: 'Missing item slug' }
    if (item.quantity < 1 || item.quantity > 100) return { valid: false, amount: 0, error: 'Invalid quantity' }

    try {
      const service = await fetchServiceBySlug(item.slug)
      if (!service) return { valid: false, amount: 0, error: `Item not found: ${item.name}` }

      const price = parseFloat(service.sale_price || service.price || '0')
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
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { items, email, promoCode }: { items: CartItem[]; email?: string; promoCode?: string } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    if (items.length > 20) {
      return NextResponse.json({ error: 'Too many items' }, { status: 400 })
    }

    const { valid, amount: verifiedAmount, error } = await verifyPrices(items)
    if (!valid) {
      return NextResponse.json({ error: error ?? 'Price verification failed' }, { status: 400 })
    }

    // Apply promo code discount server-side — never trust client-sent discount amounts
    let discountCents = 0
    let appliedPromo: string | undefined
    if (promoCode) {
      const promo = await validatePromoCode(promoCode)
      if (promo) {
        discountCents = promo.discountCents
        appliedPromo = promoCode.trim().toUpperCase()
      }
    }

    const amount = Math.max(50, verifiedAmount - discountCents)

    if (verifiedAmount < 50) {
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
        ...(appliedPromo ? { promo_code: appliedPromo, discount: `$${(discountCents / 100).toFixed(2)}` } : {}),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
