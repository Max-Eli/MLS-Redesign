import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { constructWebhookEvent, stripe } from '@/lib/stripe'
import type Stripe from 'stripe'

const resend = new Resend(process.env.RESEND_API_KEY)

// Pull billing_details from the latest charge — Stripe PaymentElement collects
// email + name when the customer pays, and the checkout page doesn't ask up-front.
async function getBillingDetails(intent: Stripe.PaymentIntent): Promise<{ email?: string; name?: string }> {
  const chargeId = typeof intent.latest_charge === 'string' ? intent.latest_charge : intent.latest_charge?.id
  if (!chargeId) return {}
  try {
    const charge = await stripe.charges.retrieve(chargeId)
    return {
      email: charge.billing_details.email ?? undefined,
      name:  charge.billing_details.name  ?? undefined,
    }
  } catch (err) {
    console.error('Failed to fetch charge billing details:', err)
    return {}
  }
}

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
    const { items, customer_email: metaEmail, customer_name: metaName, promo_code, discount } = intent.metadata as {
      items?:          string
      customer_email?: string
      customer_name?:  string
      promo_code?:     string
      discount?:       string
    }

    // Prefer Stripe billing_details over metadata (metadata is rarely set for this checkout flow)
    const billing        = await getBillingDetails(intent)
    const customer_email = metaEmail ?? billing.email
    const customer_name  = metaName  ?? billing.name

    const amountFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0,
    }).format(intent.amount / 100)

    let parsedItems: { name: string; price: string; qty: number }[] = []
    try { parsedItems = JSON.parse(items ?? '[]') } catch {}

    const itemsHtml = parsedItems.map(item => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;">${item.name}${item.qty > 1 ? ` × ${item.qty}` : ''}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;text-align:right;">${item.price}</td>
      </tr>
    `).join('')

    const discountRow = promo_code && discount ? `
      <tr>
        <td style="padding:10px 0;font-size:13px;color:#9b8ea0;">Promo code (${promo_code})</td>
        <td style="padding:10px 0;font-size:13px;color:#9b8ea0;text-align:right;">−${discount}</td>
      </tr>
    ` : ''

    // Email to customer
    if (customer_email) {
      await resend.emails.send({
        from: 'Manhattan Laser Spa <noreply@send.manhattanlaserspa.com>',
        to:   customer_email,
        subject: `Your order is confirmed — ${amountFormatted} paid`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border-radius:12px;">
            <div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #e8e0d8;margin-bottom:32px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9b8ea0;">Manhattan Laser Spa</p>
              <h1 style="margin:0 0 8px;font-size:32px;font-weight:300;color:#1a1a2e;">Order Confirmed</h1>
              <p style="margin:0;font-size:14px;color:#9b8ea0;">Thank you${customer_name ? `, ${customer_name.split(' ')[0]}` : ''} — we're looking forward to seeing you.</p>
            </div>

            <h2 style="font-size:14px;font-weight:400;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;margin:0 0 16px;">Order Summary</h2>

            <table style="width:100%;border-collapse:collapse;">
              ${itemsHtml}
              ${discountRow}
              <tr>
                <td style="padding:14px 0 0;font-size:14px;font-weight:600;color:#1a1a2e;">Total Paid</td>
                <td style="padding:14px 0 0;font-size:16px;font-weight:400;color:#1a1a2e;text-align:right;">${amountFormatted}</td>
              </tr>
            </table>

            <div style="margin:32px 0;padding:24px;background:#fff;border-radius:12px;border:1px solid #e8e0d8;">
              <h3 style="margin:0 0 12px;font-size:13px;font-weight:400;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">What Happens Next</h3>
              <p style="margin:0 0 8px;font-size:14px;color:#5a5068;line-height:1.6;">Our team will contact you within 24 hours to schedule your appointment at a time that works for you.</p>
              <p style="margin:0;font-size:14px;color:#5a5068;line-height:1.6;">Your purchase is valid for <strong>12 months</strong> from the date of purchase.</p>
            </div>

            <div style="text-align:center;margin-bottom:32px;">
              <a href="tel:+13057053997" style="display:inline-block;background:#9b8ea0;color:#fff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;">
                Call Us to Book
              </a>
            </div>

            <div style="border-top:1px solid #e8e0d8;padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#c4b8a8;">16850 Collins Ave, Suite 105 · Sunny Isles Beach, FL 33160</p>
              <p style="margin:6px 0 0;font-size:12px;color:#c4b8a8;">305-705-3997 · florida@manhattanlaserspa.com</p>
            </div>
          </div>
        `,
      }).catch(err => console.error('Failed to send customer confirmation:', err))
    }

    // Notify the spa
    await resend.emails.send({
      from: 'Manhattan Laser Spa <noreply@send.manhattanlaserspa.com>',
      to:   'florida@manhattanlaserspa.com',
      subject: `New Order — ${amountFormatted} from ${customer_name ?? customer_email ?? 'Guest'}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border-radius:12px;">
          <div style="border-bottom:1px solid #e8e0d8;padding-bottom:24px;margin-bottom:28px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9b8ea0;">Manhattan Laser Spa</p>
            <h1 style="margin:8px 0 0;font-size:26px;font-weight:300;color:#1a1a2e;">New Order Received</h1>
          </div>

          <table style="width:100%;border-collapse:collapse;">
            ${customer_name ? `<tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;width:40%;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Customer</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;">${customer_name}</td>
            </tr>` : ''}
            ${customer_email ? `<tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;"><a href="mailto:${customer_email}" style="color:#9b8ea0;">${customer_email}</a></td>
            </tr>` : ''}
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Total</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;font-weight:600;">${amountFormatted}</td>
            </tr>
            ${promo_code ? `<tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Promo</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#9b8ea0;">${promo_code} (−${discount})</td>
            </tr>` : ''}
            <tr>
              <td style="padding:10px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;vertical-align:top;">Items</td>
              <td style="padding:10px 0;font-size:14px;color:#1a1a2e;line-height:1.7;">
                ${parsedItems.map(i => `${i.name}${i.qty > 1 ? ` × ${i.qty}` : ''}`).join('<br>')}
              </td>
            </tr>
          </table>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e8e0d8;">
            <p style="margin:0;font-size:12px;color:#c4b8a8;">Payment ID: ${intent.id}</p>
          </div>
        </div>
      `,
    }).catch(err => console.error('Failed to send spa notification:', err))
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as Stripe.PaymentIntent
    console.error(`❌ Payment failed: ${intent.id} | ${intent.last_payment_error?.message ?? 'unknown'}`)
  }

  return NextResponse.json({ received: true })
}
