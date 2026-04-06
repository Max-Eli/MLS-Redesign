import { NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe'
import type { CartItem } from '@/types/cart'

export async function POST(req: Request) {
  try {
    const { items, email }: { items: CartItem[]; email?: string } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const amount = Math.round(
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
    )

    if (amount < 50) {
      return NextResponse.json({ error: 'Order total too low' }, { status: 400 })
    }

    const itemsSummary = items
      .map((i) => `${i.name} x${i.quantity}`)
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
