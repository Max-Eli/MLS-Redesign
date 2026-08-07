import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getTwilio, getTwilioFrom, toE164US } from '@/lib/twilio'

// ── Anniversary event constants (Eastern Time — Sunny Isles Beach, FL) ──
const EVENT_SLUG = 'anniversary-4-year-2026'

// Absolute safety net: never fire an SMS after the event has ended
// (Sat Aug 8 at 4 AM EDT = 8 AM UTC).
const EVENT_ENDED_ISO = '2026-08-08T08:00:00Z'

// The one reminder this endpoint sends. Dedup column on the rsvps table so a
// re-run (or a concurrent request) can never double-text the same guest.
const SMS_COLUMN = 'reminder_sms_sent_at'

export const dynamic = 'force-dynamic'

// Brand + STOP/HELP are required for A2P 10DLC-registered traffic. Keep this
// as a single reminder message; personalize only the first name.
function buildSms(firstName: string): string {
  return (
    `Hi ${firstName}! Reminder from Manhattan Laser Spa: our 4 Year Anniversary is TOMORROW, ` +
    `Fri Aug 7, 6–10 PM at 16850 Collins Ave Ste 105, Sunny Isles Beach. ` +
    `Champagne, live music, raffles & 30% off the entire menu — one night only. ` +
    `Can't wait to see you! Reply STOP to opt out, HELP for help.`
  )
}

function firstNameOf(fullName: string | null): string {
  return (fullName ?? '').trim().split(/\s+/)[0] || 'there'
}

function maskPhone(e164: string): string {
  return e164.length > 4 ? `${e164.slice(0, -4).replace(/\d/g, '•')}${e164.slice(-4)}` : e164
}

export async function GET(req: Request) {
  // Auth — same Bearer <CRON_SECRET> scheme as the email reminder cron.
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const url     = new URL(req.url)
  const dryRun  = url.searchParams.get('dryRun') === '1'
  const testTo  = url.searchParams.get('test')   // if set, send ONE message here and stop

  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Supabase not configured' }, { status: 500 })
  }

  const nowISO = new Date().toISOString()
  if (nowISO > EVENT_ENDED_ISO) {
    return NextResponse.json({ ok: true, skipped: 'event has ended' })
  }

  const client = getTwilio()
  const from   = getTwilioFrom()
  if (!dryRun && (!client || !from)) {
    return NextResponse.json(
      { ok: false, error: 'Twilio not configured (need TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER)' },
      { status: 500 },
    )
  }

  // ── Test mode: send a single message to the supplied number, no DB writes ──
  if (testTo) {
    const to = toE164US(testTo)
    if (!to) return NextResponse.json({ ok: false, error: `Invalid test number: ${testTo}` }, { status: 400 })
    if (dryRun) return NextResponse.json({ ok: true, mode: 'test+dryRun', wouldSendTo: maskPhone(to) })
    try {
      const msg = await client!.messages.create({ from: from!, to, body: buildSms('there') })
      return NextResponse.json({ ok: true, mode: 'test', sid: msg.sid, to: maskPhone(to) })
    } catch (err) {
      return NextResponse.json({ ok: false, mode: 'test', error: String(err) }, { status: 502 })
    }
  }

  // ── Fetch attending RSVPs that haven't gotten the SMS yet ──
  const { data: rsvps, error } = await supabase
    .from('rsvps')
    .select('id, full_name, phone')
    .eq('event_slug', EVENT_SLUG)
    .eq('attending', true)
    .is(SMS_COLUMN, null)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  const summary = { pending: rsvps?.length ?? 0, sent: 0, skippedInvalid: 0, failed: 0 }
  const preview: string[] = []

  for (const rsvp of rsvps ?? []) {
    const to = toE164US(rsvp.phone)
    if (!to) {
      summary.skippedInvalid++
      continue
    }

    // Dry run: report what WOULD be sent, touch nothing.
    if (dryRun) {
      preview.push(maskPhone(to))
      continue
    }

    // ── STAMP-BEFORE-SEND: stamp the dedup column first under an optimistic
    // lock (.is(col, null)). If zero rows match, another request already
    // claimed this guest — skip. Guarantees no double-text even under retries
    // or concurrent invocations. ──
    const { data: stamped, error: stampErr } = await supabase
      .from('rsvps')
      .update({ [SMS_COLUMN]: new Date().toISOString() })
      .eq('id', rsvp.id)
      .is(SMS_COLUMN, null)
      .select('id')

    if (stampErr) { summary.failed++; continue }
    if (!stamped || stamped.length === 0) continue // claimed elsewhere

    try {
      await client!.messages.create({ from: from!, to, body: buildSms(firstNameOf(rsvp.full_name)) })
      summary.sent++
    } catch (err) {
      // Already stamped — we won't retry this guest, but log for follow-up.
      console.error(`[anniversary-sms] send failed for RSVP ${rsvp.id} — already stamped, will not retry:`, err)
      summary.failed++
    }
  }

  return NextResponse.json({
    ok: true,
    at: nowISO,
    mode: dryRun ? 'dryRun' : 'live',
    summary,
    ...(dryRun ? { wouldSendTo: preview } : {}),
  })
}
