import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

// Lazy so a missing RESEND_API_KEY doesn't crash the module at import time.
let _resend: Resend | null = null
function getResend(): Resend | null {
  if (_resend) return _resend
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  _resend = new Resend(key)
  return _resend
}

// ── Anniversary event constants (in Eastern Time — the spa is in Sunny Isles Beach, FL) ──
const EVENT_SLUG    = 'anniversary-4-year-2026'
const EVENT_TITLE   = '4 Year Anniversary Celebration'
const EVENT_ADDRESS = '16850 Collins Ave, Suite 105 · Sunny Isles Beach, FL'
const EVENT_MAP_URL = 'https://maps.google.com/?q=16850+Collins+Ave+Suite+105+Sunny+Isles+Beach+FL'

// Reminder schedule — each fires as soon as the cron runs after its trigger
// time. All times are Eastern (EDT in August, UTC-4).
type ReminderConfig = {
  column:      'reminder_week_sent_at' | 'reminder_48h_sent_at' | 'reminder_dayof_sent_at'
  sendAfterISO: string   // don't send before this UTC time
  subject:     string
  buildHtml:   (firstName: string, guests: number) => string
}

const REMINDERS: ReminderConfig[] = [
  {
    column:       'reminder_week_sent_at',
    // Friday, July 31 2026 at 10:00 AM EDT = 14:00 UTC
    sendAfterISO: '2026-07-31T14:00:00Z',
    subject:      'One week away — Manhattan Laser Spa\'s 4 Year Anniversary',
    buildHtml:    (firstName, guests) => buildWeekHtml(firstName, guests),
  },
  {
    column:       'reminder_48h_sent_at',
    // Wednesday, August 5 2026 at 10:00 AM EDT = 14:00 UTC
    sendAfterISO: '2026-08-05T14:00:00Z',
    subject:      '48 hours to go — see you Friday',
    buildHtml:    (firstName, guests) => buildFortyEightHtml(firstName, guests),
  },
  {
    column:       'reminder_dayof_sent_at',
    // Friday, August 7 2026 at 9:00 AM EDT = 13:00 UTC
    sendAfterISO: '2026-08-07T13:00:00Z',
    subject:      'Tonight at 6 PM — see you soon',
    buildHtml:    (firstName, guests) => buildDayOfHtml(firstName, guests),
  },
]

// Absolute stop: don't fire any reminder after the event has already ended
// (Sat Aug 8 at 4 AM EDT = 8 AM UTC), even if the DB says the flag is null.
// This is a safety net in case the cron gets re-enabled after the fact.
const EVENT_ENDED_ISO = '2026-08-08T08:00:00Z'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  // Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 500 })
  }

  const nowISO = new Date().toISOString()

  // Hard stop after the event has ended — nothing to do.
  if (nowISO > EVENT_ENDED_ISO) {
    return NextResponse.json({ ok: true, skipped: 'event has ended' })
  }

  const resend = getResend()
  if (!resend) {
    return NextResponse.json({ ok: false, error: 'Resend not configured' }, { status: 500 })
  }

  const summary: Record<string, { pending: number; sent: number; failed: number }> = {}

  for (const reminder of REMINDERS) {
    summary[reminder.column] = { pending: 0, sent: 0, failed: 0 }

    // Not yet time to send this reminder.
    if (nowISO < reminder.sendAfterISO) continue

    // Fetch all RSVPs attending this event that haven't received THIS reminder yet.
    const { data: rsvps, error } = await supabase
      .from('rsvps')
      .select('id, full_name, email, num_guests')
      .eq('event_slug', EVENT_SLUG)
      .eq('attending', true)
      .is(reminder.column, null)

    if (error) {
      console.error(`[reminders] query failed for ${reminder.column}:`, error)
      continue
    }

    summary[reminder.column].pending = rsvps?.length ?? 0

    for (const rsvp of rsvps ?? []) {
      const firstName = (rsvp.full_name ?? '').trim().split(/\s+/)[0] || 'friend'

      // ── STAMP-BEFORE-SEND (spam guarantee) ────────────────────────────
      // We stamp the "sent_at" column FIRST, then attempt the email. If the
      // stamp fails, we skip this RSVP for this cycle and try again next
      // hour. If the stamp succeeds but the email fails, the guest just
      // doesn't get THIS particular reminder — they'll still get the other
      // reminders. This trade-off eliminates any possibility of the same
      // reminder being sent twice, even under retries or concurrent crons.
      //
      // The `.is(column, null)` on the update is an optimistic lock: if any
      // other process has already stamped this row, our update matches zero
      // rows and we skip without sending.
      const { data: stamped, error: stampError } = await supabase
        .from('rsvps')
        .update({ [reminder.column]: new Date().toISOString() })
        .eq('id', rsvp.id)
        .is(reminder.column, null)
        .select('id')

      if (stampError) {
        console.error(`[reminders] stamp failed for RSVP ${rsvp.id} (${reminder.column}):`, stampError)
        summary[reminder.column].failed++
        continue
      }
      if (!stamped || stamped.length === 0) {
        // Another process stamped it first — skip silently, they'll get it from that one.
        continue
      }

      // Now safe to send — no matter what happens with Resend, no double-send.
      try {
        const { error: sendError } = await resend.emails.send({
          from:    'Manhattan Laser Spa <noreply@send.manhattanlaserspa.com>',
          to:      rsvp.email,
          subject: reminder.subject,
          html:    reminder.buildHtml(firstName, rsvp.num_guests ?? 1),
        })

        if (sendError) {
          console.error(`[reminders] Resend rejected ${rsvp.email} (${reminder.column}) — already stamped, will not retry:`, sendError)
          summary[reminder.column].failed++
          continue
        }

        summary[reminder.column].sent++
      } catch (err) {
        console.error(`[reminders] send failed for ${rsvp.email} (${reminder.column}) — already stamped, will not retry:`, err)
        summary[reminder.column].failed++
      }
    }
  }

  return NextResponse.json({ ok: true, at: nowISO, summary })
}

// ─── Email templates ─────────────────────────────────────────────────────────

function shellHtml(inner: string): string {
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border-radius:12px;">
      ${inner}
      <div style="border-top:1px solid #e8e0d8;padding-top:24px;margin-top:32px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#c4b8a8;">${EVENT_ADDRESS}</p>
        <p style="margin:6px 0 0;font-size:12px;color:#c4b8a8;">
          Need to change your plans? Call
          <a href="tel:+13057053997" style="color:#9b8ea0;">305-705-3997</a>
        </p>
      </div>
    </div>
  `
}

function buildWeekHtml(firstName: string, guests: number): string {
  return shellHtml(`
    <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #e8e0d8;margin-bottom:28px;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#bfa45f;">One Week Away</p>
      <h1 style="margin:0;font-size:32px;font-weight:300;color:#1a1a2e;">See you next Friday, ${escapeHtml(firstName)}</h1>
    </div>

    <p style="font-size:15px;color:#5a5068;line-height:1.7;margin:0 0 22px;">
      Our 4 Year Anniversary is just one week away — Friday, <strong>August 7</strong> from 6 to 10 PM.
      We've saved a spot for <strong>${guests} guest${guests === 1 ? '' : 's'}</strong>.
    </p>

    <div style="background:#fff;border:1px solid #e8e0d8;border-radius:12px;padding:22px;margin:24px 0;">
      <h2 style="margin:0 0 12px;font-size:13px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:#9b8ea0;">The Evening</h2>
      <p style="margin:0 0 6px;font-size:15px;color:#1a1a2e;line-height:1.6;">🍾 Champagne · 🎶 Live music · 🎁 Raffles &amp; goodie bags</p>
      <p style="margin:0;font-size:15px;color:#1a1a2e;line-height:1.6;"><strong>30% off the entire menu</strong>, one night only — every treatment, package, and service, bookable at the event.</p>
    </div>

    <p style="font-size:14px;color:#5a5068;line-height:1.7;margin:0 0 8px;">
      Can't wait to celebrate with you.
    </p>
    <p style="font-size:14px;color:#5a5068;line-height:1.7;margin:0;">
      With gratitude,<br />
      <em style="color:#9b8ea0;">The Manhattan Laser Spa Team</em>
    </p>
  `)
}

function buildFortyEightHtml(firstName: string, guests: number): string {
  return shellHtml(`
    <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #e8e0d8;margin-bottom:28px;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#bfa45f;">48 Hours Away</p>
      <h1 style="margin:0;font-size:32px;font-weight:300;color:#1a1a2e;">Two more days, ${escapeHtml(firstName)}</h1>
    </div>

    <p style="font-size:15px;color:#5a5068;line-height:1.7;margin:0 0 22px;">
      Just a quick reminder — our 4 Year Anniversary is <strong>this Friday</strong> and we can't wait to see you.
    </p>

    <div style="background:#fff;border:1px solid #e8e0d8;border-radius:12px;padding:22px;margin:24px 0;">
      <h2 style="margin:0 0 12px;font-size:13px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:#9b8ea0;">The Details</h2>
      <p style="margin:0 0 6px;font-size:15px;color:#1a1a2e;line-height:1.5;"><strong>When:</strong> Friday, August 7 · 6 PM – 10 PM</p>
      <p style="margin:0 0 6px;font-size:15px;color:#1a1a2e;line-height:1.5;"><strong>Where:</strong> ${EVENT_ADDRESS}</p>
      <p style="margin:0 0 6px;font-size:15px;color:#1a1a2e;line-height:1.5;"><strong>Your party:</strong> ${guests} guest${guests === 1 ? '' : 's'}</p>
      <p style="margin:0;font-size:15px;color:#1a1a2e;line-height:1.5;"><strong>Don't forget:</strong> the entire menu is 30% off — one night only, bookable at the event.</p>
    </div>

    <div style="text-align:center;margin:28px 0;">
      <a href="${EVENT_MAP_URL}" style="display:inline-block;background:#9b8ea0;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;">
        Get Directions
      </a>
    </div>

    <p style="font-size:14px;color:#5a5068;line-height:1.7;margin:0;">
      See you Friday.
    </p>
  `)
}

function buildDayOfHtml(firstName: string, guests: number): string {
  return shellHtml(`
    <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #e8e0d8;margin-bottom:28px;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#bfa45f;">Tonight</p>
      <h1 style="margin:0;font-size:36px;font-weight:300;color:#1a1a2e;">See you tonight, ${escapeHtml(firstName)}</h1>
    </div>

    <p style="font-size:15px;color:#5a5068;line-height:1.7;margin:0 0 22px;">
      Doors open at <strong>6 PM</strong>. We're ready for you and ${guests === 1 ? 'you' : `your party of ${guests}`}.
    </p>

    <div style="background:#fff;border:1px solid #e8e0d8;border-radius:12px;padding:22px;margin:24px 0;">
      <h2 style="margin:0 0 12px;font-size:13px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:#9b8ea0;">Tonight&apos;s Details</h2>
      <p style="margin:0 0 6px;font-size:15px;color:#1a1a2e;line-height:1.5;"><strong>Time:</strong> 6 PM – 10 PM</p>
      <p style="margin:0 0 6px;font-size:15px;color:#1a1a2e;line-height:1.5;"><strong>Address:</strong> ${EVENT_ADDRESS}</p>
      <p style="margin:0;font-size:15px;color:#1a1a2e;line-height:1.5;">Live music, champagne, raffles, goodie bags — and <strong>30% off the entire menu</strong>, tonight only.</p>
    </div>

    <div style="text-align:center;margin:28px 0 20px;">
      <a href="${EVENT_MAP_URL}" style="display:inline-block;background:#9b8ea0;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;">
        Open in Maps
      </a>
    </div>

    <p style="font-size:14px;color:#5a5068;line-height:1.7;margin:0;text-align:center;">
      Running late or can't find us? Call <a href="tel:+13057053997" style="color:#9b8ea0;">305-705-3997</a>.
    </p>
  `)
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
