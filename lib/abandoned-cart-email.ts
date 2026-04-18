import type { AbandonedCartRow } from './abandoned-carts'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://manhattanlaserspa.com'

function formatMoney(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(cents / 100)
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function buildAbandonedCartEmail(cart: AbandonedCartRow): { subject: string; html: string } {
  const firstName = cart.first_name?.trim() || ''
  const greeting  = firstName ? `Hi ${escapeHtml(firstName)},` : 'Hi there,'
  const recoveryUrl = `${SITE_URL}/cart/recover?token=${encodeURIComponent(cart.recovery_token)}`
  const total = formatMoney(cart.subtotal_cents)

  const itemsHtml = cart.items.map(item => {
    const linePrice = formatMoney(Math.round(item.price * 100) * item.quantity)
    const image = item.image
      ? `<img src="${escapeHtml(item.image)}" alt="" width="68" height="68" style="display:block;border-radius:8px;object-fit:cover;background:#faf9f7;" />`
      : `<div style="width:68px;height:68px;border-radius:8px;background:linear-gradient(135deg,#f4eef0,#faf9f7);"></div>`
    return `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #f0ebe4;vertical-align:middle;width:84px;">${image}</td>
        <td style="padding:14px 0;border-bottom:1px solid #f0ebe4;vertical-align:middle;">
          <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:15px;color:#1a1a2e;line-height:1.3;">${escapeHtml(item.name)}</p>
          ${item.quantity > 1 ? `<p style="margin:0;font-size:12px;color:#9b8ea0;">Quantity: ${item.quantity}</p>` : ''}
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #f0ebe4;vertical-align:middle;font-family:Georgia,serif;font-size:15px;color:#1a1a2e;text-align:right;white-space:nowrap;">${linePrice}</td>
      </tr>
    `
  }).join('')

  const subject = `You left something behind — your Manhattan Laser Spa cart`

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border-radius:12px;">
      <div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #e8e0d8;margin-bottom:32px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9b8ea0;">Manhattan Laser Spa</p>
        <h1 style="margin:0 0 12px;font-size:30px;font-weight:300;color:#1a1a2e;line-height:1.2;">Still thinking it over?</h1>
        <p style="margin:0;font-size:14px;color:#5a5068;line-height:1.6;">${greeting} you left a few treatments in your cart — we saved everything so you can pick up right where you left off.</p>
      </div>

      <h2 style="font-size:12px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:#9b8ea0;margin:0 0 12px;">Your Cart</h2>

      <table style="width:100%;border-collapse:collapse;">
        ${itemsHtml}
        ${cart.promo_code ? `
          <tr>
            <td colspan="2" style="padding:12px 0;font-size:13px;color:#9b8ea0;">Promo code applied</td>
            <td style="padding:12px 0;font-size:13px;color:#9b8ea0;text-align:right;">${escapeHtml(cart.promo_code)}</td>
          </tr>
        ` : ''}
        <tr>
          <td colspan="2" style="padding:16px 0 0;font-size:14px;font-weight:600;color:#1a1a2e;">Subtotal</td>
          <td style="padding:16px 0 0;font-family:Georgia,serif;font-size:18px;color:#1a1a2e;text-align:right;">${total}</td>
        </tr>
      </table>

      <div style="text-align:center;margin:40px 0 32px;">
        <a href="${recoveryUrl}" style="display:inline-block;background:#9b8ea0;color:#fff;text-decoration:none;padding:16px 44px;border-radius:8px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;">
          Complete Your Purchase
        </a>
        <p style="margin:14px 0 0;font-size:12px;color:#9b8ea0;">Prices are held for a limited time.</p>
      </div>

      <div style="margin:32px 0;padding:24px;background:#fff;border-radius:12px;border:1px solid #e8e0d8;">
        <h3 style="margin:0 0 10px;font-size:12px;font-weight:400;letter-spacing:0.1em;text-transform:uppercase;color:#9b8ea0;">Need Help Deciding?</h3>
        <p style="margin:0 0 8px;font-size:14px;color:#5a5068;line-height:1.6;">Our specialists are happy to walk you through what's best for your goals — no obligation.</p>
        <p style="margin:0;font-size:14px;color:#5a5068;line-height:1.6;">Call us at <a href="tel:+13057053997" style="color:#9b8ea0;">305-705-3997</a> or reply to this email.</p>
      </div>

      <div style="border-top:1px solid #e8e0d8;padding-top:24px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#c4b8a8;">16850 Collins Ave, Suite 105 · Sunny Isles Beach, FL 33160</p>
        <p style="margin:6px 0 0;font-size:12px;color:#c4b8a8;">305-705-3997 · florida@manhattanlaserspa.com</p>
      </div>
    </div>
  `

  return { subject, html }
}
