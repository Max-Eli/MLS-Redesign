import { NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { createOrder, updateOrderStatus } from '@/lib/woocommerce'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const payload = Buffer.from(await req.arrayBuffer())
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
    const { items, customer_email, wc_order_id } = intent.metadata as {
      items?: string
      customer_email?: string
      wc_order_id?: string
    }

    // Update existing WooCommerce order if ID was stored in metadata
    if (wc_order_id) {
      try {
        await updateOrderStatus(parseInt(wc_order_id), 'processing', intent.id)
      } catch (err) {
        console.error('Failed to update WC order:', err)
      }
    }

    console.log(`Payment succeeded: ${intent.id} — ${customer_email ?? 'guest'}`)
  }

  return NextResponse.json({ received: true })
}
