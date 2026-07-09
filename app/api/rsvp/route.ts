import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

// Lazy so a missing RESEND_API_KEY (e.g. local dev) doesn't crash the module
// at import time — the Resend constructor throws immediately on undefined.
let _resend: Resend | null = null
function getResend(): Resend | null {
  if (_resend) return _resend
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  _resend = new Resend(key)
  return _resend
}

// IP rate limit — 5 RSVPs per 10 minutes (families sharing one connection
// might submit a few in a row; this leaves room without being spammy).
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 10 * 60_000 })
    return false
  }
  if (entry.count >= 5) return true
  entry.count++
  return false
}

const EVENT_SLUG    = 'anniversary-4-year-2026'
const EVENT_LABEL   = '4 Year Anniversary Celebration'
const NOTIFY_EMAIL  = 'florida@manhattanlaserspa.com'

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const {
      fullName, email, phone,
      attending, numGuests,
      dietary, notes,
      website, formElapsedMs,
    } = await req.json() as {
      fullName?:      string
      email?:         string
      phone?:         string
      attending?:     'yes' | 'no'
      numGuests?:     number
      dietary?:       string | null
      notes?:         string | null
      website?:       string
      formElapsedMs?: number
    }

    // Honeypot — real users can't see this field; bots fill everything.
    // Return success silently so the bot moves on instead of retrying.
    if (typeof website === 'string' && website.trim() !== '') {
      return NextResponse.json({ ok: true })
    }

    // Time-to-fill — bots submit in milliseconds; humans take >2s.
    if (typeof formElapsedMs === 'number' && formElapsedMs < 2000) {
      return NextResponse.json({ ok: true })
    }

    if (!fullName?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (attending !== 'yes' && attending !== 'no') {
      return NextResponse.json({ error: 'Invalid RSVP response' }, { status: 400 })
    }

    const guestCount = attending === 'yes'
      ? Math.min(4, Math.max(1, numGuests ?? 1))
      : 0

    // ── Store in Supabase (graceful — logs and continues if unavailable) ──
    if (supabase) {
      const { error: dbError } = await supabase.from('rsvps').insert({
        event_slug:            EVENT_SLUG,
        full_name:             fullName.trim(),
        email:                 email.trim().toLowerCase(),
        phone:                 phone.trim(),
        attending:             attending === 'yes',
        num_guests:            guestCount,
        dietary_restrictions:  dietary ?? null,
        notes:                 notes ?? null,
      })
      if (dbError) {
        console.error('[rsvp] Supabase insert failed:', dbError)
        // continue — email notification is still useful even if DB write fails
      }
    } else {
      console.warn('[rsvp] Supabase not configured — skipping DB insert (dev mode)')
    }

    // ── Send confirmation + spa notification emails (graceful) ──
    const resend = getResend()
    if (resend) {
      const emailPromises: Promise<unknown>[] = []

      // Notify the spa
      emailPromises.push(
        resend.emails.send({
          from:    'Manhattan Laser Spa <noreply@send.manhattanlaserspa.com>',
          to:      NOTIFY_EMAIL,
          replyTo: email,
          subject: `New RSVP — ${fullName} (${attending === 'yes' ? `${guestCount} guest${guestCount === 1 ? '' : 's'}` : 'Declining'})`,
          html: buildSpaNotificationHtml({
            fullName, email, phone,
            attending: attending === 'yes',
            guestCount, dietary, notes,
          }),
        }).catch(err => console.error('[rsvp] Resend spa notify failed:', err)),
      )

      // Confirmation to guest (only if attending — declines don't need a "thanks for coming" note)
      if (attending === 'yes') {
        emailPromises.push(
          resend.emails.send({
            from:    'Manhattan Laser Spa <noreply@send.manhattanlaserspa.com>',
            to:      email,
            subject: `You're confirmed — 4 Year Anniversary Celebration`,
            html: buildGuestConfirmationHtml({
              fullName,
              guestCount,
            }),
          }).catch(err => console.error('[rsvp] Resend guest confirmation failed:', err)),
        )
      }

      await Promise.all(emailPromises)
    } else {
      console.warn('[rsvp] Resend not configured — skipping email (dev mode)')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[rsvp] error:', err)
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 })
  }
}

function buildSpaNotificationHtml(p: {
  fullName:   string
  email:      string
  phone:      string
  attending:  boolean
  guestCount: number
  dietary:    string | null | undefined
  notes:      string | null | undefined
}): string {
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border-radius:12px;">
      <div style="border-bottom:1px solid #e8e0d8;padding-bottom:24px;margin-bottom:28px;">
        <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9b8ea0;">Manhattan Laser Spa</p>
        <h1 style="margin:8px 0 0;font-size:26px;font-weight:300;color:#1a1a2e;">New RSVP — ${EVENT_LABEL}</h1>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;width:40%;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Guest</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;">${p.fullName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;"><a href="mailto:${p.email}" style="color:#9b8ea0;">${p.email}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Phone</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;"><a href="tel:${p.phone}" style="color:#9b8ea0;">${p.phone}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Attending</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:${p.attending ? '#1a1a2e' : '#9b8ea0'};font-weight:${p.attending ? '600' : '400'};">
            ${p.attending ? `Yes — ${p.guestCount} guest${p.guestCount === 1 ? '' : 's'}` : 'Regretfully declining'}
          </td>
        </tr>
        ${p.dietary ? `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Dietary</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;">${p.dietary}</td>
        </tr>` : ''}
        ${p.notes ? `<tr>
          <td style="padding:10px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;vertical-align:top;">Note</td>
          <td style="padding:10px 0;font-size:14px;color:#1a1a2e;line-height:1.6;">${p.notes}</td>
        </tr>` : ''}
      </table>

      <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e8e0d8;">
        <p style="margin:0;font-size:12px;color:#c4b8a8;">Sent from manhattanlaserspa.com/anniversary</p>
      </div>
    </div>
  `
}

function buildGuestConfirmationHtml(p: { fullName: string; guestCount: number }): string {
  const firstName = p.fullName.trim().split(/\s+/)[0]
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border-radius:12px;">
      <div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #e8e0d8;margin-bottom:32px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9b8ea0;">Manhattan Laser Spa</p>
        <h1 style="margin:0;font-size:36px;font-weight:300;color:#1a1a2e;">You're Confirmed, ${firstName}</h1>
      </div>

      <p style="font-size:15px;color:#5a5068;line-height:1.7;margin:0 0 22px;">
        Thank you for RSVP'ing to our 4 Year Anniversary Celebration. We've reserved your spot for
        <strong>${p.guestCount} guest${p.guestCount === 1 ? '' : 's'}</strong> and can't wait to celebrate with you.
      </p>

      <div style="background:#fff;border:1px solid #e8e0d8;border-radius:12px;padding:24px;margin:24px 0;">
        <h2 style="margin:0 0 14px;font-size:13px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:#9b8ea0;">Event Details</h2>
        <p style="margin:0 0 6px;font-size:15px;color:#1a1a2e;line-height:1.5;"><strong>Date:</strong> Friday, August 7, 2026</p>
        <p style="margin:0 0 6px;font-size:15px;color:#1a1a2e;line-height:1.5;"><strong>Time:</strong> 6:00 PM – 10:00 PM</p>
        <p style="margin:0 0 12px;font-size:15px;color:#1a1a2e;line-height:1.5;"><strong>Location:</strong> 16850 Collins Ave, Suite 105 · Sunny Isles Beach, FL</p>
        <p style="margin:0;font-size:14px;color:#5a5068;line-height:1.5;">Live music · Champagne · Raffles · Goodie bags · <strong style="color:#1a1a2e;">30% off the entire menu</strong>, one night only.</p>
      </div>

      <p style="font-size:14px;color:#5a5068;line-height:1.7;margin:0 0 22px;">
        We'll send a reminder closer to the date. If anything changes with your plans, simply reply to this email.
      </p>

      <div style="border-top:1px solid #e8e0d8;padding-top:24px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#c4b8a8;">Questions? Call us at 305-705-3997</p>
      </div>
    </div>
  `
}
