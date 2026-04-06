import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export async function createPaymentIntent(params: {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: params.amount,
    currency: params.currency ?? 'usd',
    // Stripe Payment Element supports card, Affirm, and Klarna natively
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      source: 'manhattan-laser-spa-web',
      ...params.metadata,
    },
  })
}

export async function constructWebhookEvent(
  payload: Buffer,
  signature: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEventAsync(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}
