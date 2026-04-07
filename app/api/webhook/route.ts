import { NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const payload   = Buffer.from(await req.arrayBuffer())
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = await constructWebhookEvent(payload, signature)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent
    const { items, customer_email } = intent.metadata as {
      items?: string
      customer_email?: string
    }
    console.log(`✅ Payment succeeded: ${intent.id} | ${customer_email ?? 'guest'} | ${items ?? ''}`)
    // TODO: send confirmation email, create booking record, etc.
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as Stripe.PaymentIntent
    console.error(`❌ Payment failed: ${intent.id} | ${intent.last_payment_error?.message ?? 'unknown'}`)
  }

  return NextResponse.json({ received: true })
}
