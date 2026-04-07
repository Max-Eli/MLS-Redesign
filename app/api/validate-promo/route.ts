import { NextResponse } from 'next/server'
import { validatePromoCode } from '@/lib/promos'

export async function POST(req: Request) {
  try {
    const { code } = await req.json()
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 })
    }

    const promo = await validatePromoCode(code)
    if (!promo) {
      return NextResponse.json({ valid: false, error: 'Invalid or expired promo code' })
    }

    return NextResponse.json({ valid: true, discountCents: promo.discountCents, label: promo.label })
  } catch {
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 })
  }
}
