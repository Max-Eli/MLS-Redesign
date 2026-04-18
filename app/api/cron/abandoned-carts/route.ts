import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { fetchPendingReminders, markReminderSent } from '@/lib/abandoned-carts'
import { buildAbandonedCartEmail } from '@/lib/abandoned-cart-email'

const resend = new Resend(process.env.RESEND_API_KEY)

const DELAY_MINUTES = Number(process.env.ABANDONED_CART_DELAY_MINUTES ?? 60)

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const carts = await fetchPendingReminders(DELAY_MINUTES)

  let sent = 0
  let failed = 0

  for (const cart of carts) {
    const { subject, html } = buildAbandonedCartEmail(cart)
    try {
      await resend.emails.send({
        from:    'Manhattan Laser Spa <noreply@send.manhattanlaserspa.com>',
        to:      cart.email,
        subject,
        html,
      })
      await markReminderSent(cart.id)
      sent++
    } catch (err) {
      console.error(`Failed to send abandoned cart reminder to ${cart.email}:`, err)
      failed++
    }
  }

  return NextResponse.json({
    processed: carts.length,
    sent,
    failed,
    delayMinutes: DELAY_MINUTES,
  })
}
