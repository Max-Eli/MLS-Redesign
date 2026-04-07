import { NextResponse } from 'next/server'

// Promo codes map: code → discount in cents
const PROMO_CODES: Record<string, { discountCents: number; label: string }> = {
  MLS100OFF: { discountCents: 10000, label: '$100 off your first treatment' },
}

export async function POST(req: Request) {
  try {
    const { code } = await req.json()
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 })
    }

    const normalized = code.trim().toUpperCase()
    const promo = PROMO_CODES[normalized]

    if (!promo) {
      return NextResponse.json({ valid: false, error: 'Invalid promo code' })
    }

    return NextResponse.json({ valid: true, discountCents: promo.discountCents, label: promo.label })
  } catch {
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 })
  }
}
