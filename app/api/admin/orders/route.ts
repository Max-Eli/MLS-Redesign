import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { fetchRedemptionsByIds, formatOrderNumber } from '@/lib/order-redemptions'

const stripeKey = process.env.STRIPE_SECRET_KEY || ''
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: '2024-06-20' }) : null

export async function GET(req: Request) {
  if (!stripe) {
    return NextResponse.json({ orders: [], hasMore: false })
  }

  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get('cursor') ?? undefined

  try {
    const intents = await stripe.paymentIntents.list({
      limit:          25,
      starting_after: cursor,
    })

    const succeeded = intents.data.filter(pi => pi.status === 'succeeded')
    const redemptions = await fetchRedemptionsByIds(succeeded.map(pi => pi.id))

    const orders = succeeded.map(pi => {
      const r = redemptions.get(pi.id)
      return {
        id:             pi.id,
        order_number:   formatOrderNumber(r?.order_number ?? null),
        amount:         pi.amount,
        currency:       pi.currency,
        created:        pi.created,
        customer_email: pi.metadata.customer_email ?? null,
        customer_name:  pi.metadata.customer_name  ?? null,
        customer_phone: pi.metadata.customer_phone ?? null,
        items:          pi.metadata.items           ?? null,
        promo_code:     pi.metadata.promo_code      ?? null,
        discount:       pi.metadata.discount        ?? null,
        redeemed_at:    r?.redeemed_at ?? null,
        redeemed_by:    r?.redeemed_by ?? null,
        notes:          r?.notes       ?? null,
      }
    })

    return NextResponse.json({ orders, hasMore: intents.has_more, nextCursor: intents.data.at(-1)?.id })
  } catch (err) {
    console.error('Admin orders error:', err)
    return NextResponse.json({ orders: [], hasMore: false }, { status: 500 })
  }
}
