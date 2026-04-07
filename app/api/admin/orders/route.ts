import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2025-01-27.acacia' })

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get('cursor') ?? undefined

  try {
    const intents = await stripe.paymentIntents.list({
      limit:          25,
      starting_after: cursor,
    })

    const orders = intents.data
      .filter(pi => pi.status === 'succeeded')
      .map(pi => ({
        id:            pi.id,
        amount:        pi.amount,
        currency:      pi.currency,
        created:       pi.created,
        customer_email: pi.metadata.customer_email ?? null,
        customer_name:  pi.metadata.customer_name  ?? null,
        items:          pi.metadata.items           ?? null,
        promo_code:     pi.metadata.promo_code      ?? null,
        discount:       pi.metadata.discount        ?? null,
      }))

    return NextResponse.json({ orders, hasMore: intents.has_more, nextCursor: intents.data.at(-1)?.id })
  } catch (err) {
    console.error('Admin orders error:', err)
    return NextResponse.json({ orders: [], hasMore: false }, { status: 500 })
  }
}
