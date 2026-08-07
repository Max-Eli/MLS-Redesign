import { supabase } from '@/lib/supabase'
import { toE164US, type TwilioClient } from '@/lib/twilio'

// ── Anniversary event constants (Eastern Time — Sunny Isles Beach, FL) ──
export const ANNIVERSARY_EVENT_SLUG = 'anniversary-4-year-2026'

// Safety net: never send after the event has ended (Sat Aug 8, 4 AM EDT).
const EVENT_ENDED_ISO = '2026-08-08T08:00:00Z'

// Dedup column on the rsvps table — stamp-before-send guarantees no guest is
// ever texted twice, even under retries or concurrent requests.
const SMS_COLUMN = 'reminder_sms_sent_at'

// Default copy. `{name}` is replaced with the guest's first name. Includes the
// brand name + STOP/HELP opt-out required for A2P 10DLC-registered traffic.
export const DEFAULT_SMS_MESSAGE =
  `Hi {name}! Reminder from Manhattan Laser Spa: our 4 Year Anniversary is TOMORROW, ` +
  `Fri Aug 7, 6–10 PM at 16850 Collins Ave Ste 105, Sunny Isles Beach. ` +
  `Champagne, live music, raffles & 30% off the entire menu — one night only. ` +
  `Can't wait to see you! Reply STOP to opt out, HELP for help.`

export type SmsMode = 'dryRun' | 'test' | 'live'

export interface SmsResult {
  ok:            boolean
  mode:          SmsMode
  summary?:      { pending: number; sent: number; skippedInvalid: number; failed: number }
  wouldSendTo?:  string[]
  sid?:          string
  to?:           string
  error?:        string
}

function firstNameOf(fullName: string | null): string {
  return (fullName ?? '').trim().split(/\s+/)[0] || 'there'
}

function maskPhone(e164: string): string {
  return e164.length > 4 ? `${e164.slice(0, -4).replace(/\d/g, '•')}${e164.slice(-4)}` : e164
}

// Fill in {name} and guarantee a STOP/HELP line is present (appended if the
// custom copy omitted it) so every send stays compliant.
function renderBody(template: string, firstName: string): string {
  const withName = template.split('{name}').join(firstName)
  if (/\bstop\b/i.test(withName)) return withName
  return `${withName.trimEnd()} Reply STOP to opt out, HELP for help.`
}

// Core sender, shared by the admin endpoint and the cron endpoint.
// - dryRun: count + preview masked numbers, no sends, no DB writes.
// - testTo: send exactly one message to that number, no DB writes.
// - otherwise: send to every attending RSVP not yet texted (stamp-before-send).
export async function runSmsReminders(params: {
  client:   TwilioClient | null
  from:     string
  message:  string
  dryRun?:  boolean
  testTo?:  string | null
}): Promise<SmsResult> {
  const { client, from, message, dryRun = false, testTo = null } = params
  const mode: SmsMode = testTo ? 'test' : dryRun ? 'dryRun' : 'live'

  if (!supabase) return { ok: false, mode, error: 'Supabase not configured' }

  const nowISO = new Date().toISOString()
  if (nowISO > EVENT_ENDED_ISO) {
    return { ok: true, mode, error: 'Event has ended — nothing sent.' }
  }

  // ── Test mode: single message, no DB writes ──
  if (testTo) {
    const to = toE164US(testTo)
    if (!to) return { ok: false, mode: 'test', error: `Invalid test number: ${testTo}` }
    if (dryRun) return { ok: true, mode: 'test', to: maskPhone(to) }
    if (!client || !from) return { ok: false, mode: 'test', error: 'Twilio credentials or From number missing.' }
    try {
      const msg = await client.messages.create({ from, to, body: renderBody(message, 'there') })
      return { ok: true, mode: 'test', sid: msg.sid, to: maskPhone(to) }
    } catch (err) {
      return { ok: false, mode: 'test', error: String(err) }
    }
  }

  // ── Fetch attending RSVPs that haven't gotten the SMS yet ──
  const { data: rsvps, error } = await supabase
    .from('rsvps')
    .select('id, full_name, phone')
    .eq('event_slug', ANNIVERSARY_EVENT_SLUG)
    .eq('attending', true)
    .is(SMS_COLUMN, null)

  if (error) return { ok: false, mode, error: error.message }

  const summary = { pending: rsvps?.length ?? 0, sent: 0, skippedInvalid: 0, failed: 0 }
  const preview: string[] = []

  if (!dryRun && (!client || !from)) {
    return { ok: false, mode: 'live', error: 'Twilio credentials or From number missing.' }
  }

  for (const rsvp of rsvps ?? []) {
    const to = toE164US(rsvp.phone)
    if (!to) { summary.skippedInvalid++; continue }

    if (dryRun) { preview.push(maskPhone(to)); continue }

    // STAMP-BEFORE-SEND under an optimistic lock (.is(col, null)): if zero rows
    // match, another request already claimed this guest — skip. No double-text.
    const { data: stamped, error: stampErr } = await supabase
      .from('rsvps')
      .update({ [SMS_COLUMN]: new Date().toISOString() })
      .eq('id', rsvp.id)
      .is(SMS_COLUMN, null)
      .select('id')

    if (stampErr) { summary.failed++; continue }
    if (!stamped || stamped.length === 0) continue // claimed elsewhere

    try {
      await client!.messages.create({ from, to, body: renderBody(message, firstNameOf(rsvp.full_name)) })
      summary.sent++
    } catch (err) {
      console.error(`[anniversary-sms] send failed for RSVP ${rsvp.id} — already stamped, will not retry:`, err)
      summary.failed++
    }
  }

  return { ok: true, mode: dryRun ? 'dryRun' : 'live', summary, ...(dryRun ? { wouldSendTo: preview } : {}) }
}
