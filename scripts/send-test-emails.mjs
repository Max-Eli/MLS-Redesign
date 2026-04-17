// One-off: send the same emails the Stripe webhook would send, using fake data,
// so we can eyeball them in both inboxes without running a real purchase.
//
// Usage:
//   node scripts/send-test-emails.mjs
//
// Requires RESEND_API_KEY in .env.local.

import { readFileSync } from 'node:fs'
import { Resend } from 'resend'

// Load RESEND_API_KEY from .env.local
const envFile = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
for (const rawLine of envFile.split('\n')) {
  const line = rawLine.trim()
  if (!line || line.startsWith('#')) continue
  const eq = line.indexOf('=')
  if (eq === -1) continue
  const key = line.slice(0, eq).trim()
  const value = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
  if (key) process.env[key] = value
}

if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY not found in .env.local')
  process.exit(1)
}

const resend = new Resend(process.env.RESEND_API_KEY)

// Fake order data (mirrors what the webhook constructs from a real payment)
const customer_email  = 'codenestwebstudios@gmail.com'
const customer_name   = 'Sofia Martinez'
const customer_phone  = '(305) 555-0123'
const amountFormatted = '$398'
const parsedItems = [
  { name: "Mother's Day Lip Filler",           price: '$399.00', qty: 1 },
  { name: "Mother's Day Deep Cleansing Facial", price: '$120.00', qty: 1 },
]
const promo_code = 'MOMSDAY'
const discount   = '$121.00'
const paymentId  = 'pi_test_1234567890abcdef'

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

// ─── 1. Customer receipt ─────────────────────────────────────────────────────
const customerRes = await resend.emails.send({
  from: 'Manhattan Laser Spa <noreply@send.manhattanlaserspa.com>',
  to:   customer_email,
  subject: `[TEST] Your order is confirmed — ${amountFormatted} paid`,
  html: `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border-radius:12px;">
      <div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #e8e0d8;margin-bottom:32px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9b8ea0;">Manhattan Laser Spa</p>
        <h1 style="margin:0 0 8px;font-size:32px;font-weight:300;color:#1a1a2e;">Order Confirmed</h1>
        <p style="margin:0;font-size:14px;color:#9b8ea0;">Thank you, ${customer_name.split(' ')[0]} — we're looking forward to seeing you.</p>
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
})

console.log('Customer receipt →', customer_email, '|', customerRes.data?.id ?? customerRes.error)

// ─── 2. Spa notification ─────────────────────────────────────────────────────
const spaRes = await resend.emails.send({
  from: 'Manhattan Laser Spa <noreply@send.manhattanlaserspa.com>',
  to:   'florida@manhattanlaserspa.com',
  subject: `[TEST] New Order — ${amountFormatted} from ${customer_name}`,
  html: `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border-radius:12px;">
      <div style="border-bottom:1px solid #e8e0d8;padding-bottom:24px;margin-bottom:28px;">
        <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9b8ea0;">Manhattan Laser Spa</p>
        <h1 style="margin:8px 0 0;font-size:26px;font-weight:300;color:#1a1a2e;">New Order Received</h1>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;width:40%;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Customer</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;">${customer_name}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;"><a href="mailto:${customer_email}" style="color:#9b8ea0;">${customer_email}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Phone</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;"><a href="tel:${customer_phone}" style="color:#9b8ea0;">${customer_phone}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Total</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;font-weight:600;">${amountFormatted}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Promo</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#9b8ea0;">${promo_code} (−${discount})</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;vertical-align:top;">Items</td>
          <td style="padding:10px 0;font-size:14px;color:#1a1a2e;line-height:1.7;">
            ${parsedItems.map(i => `${i.name}${i.qty > 1 ? ` × ${i.qty}` : ''}`).join('<br>')}
          </td>
        </tr>
      </table>

      <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e8e0d8;">
        <p style="margin:0;font-size:12px;color:#c4b8a8;">Payment ID: ${paymentId}</p>
      </div>
    </div>
  `,
})

console.log('Spa notification →', 'florida@manhattanlaserspa.com', '|', spaRes.data?.id ?? spaRes.error)
