import { supabase } from '@/lib/supabase'
import { toE164US, type TwilioClient } from '@/lib/twilio'

// ── Anniversary event constants (Eastern Time — Sunny Isles Beach, FL) ──
export const ANNIVERSARY_EVENT_SLUG = 'anniversary-4-year-2026'

// Safety net: never send after the event has ended (Sat Aug 8, 4 AM EDT).
const EVENT_ENDED_ISO = '2026-08-08T08:00:00Z'

// Default campaign key used by the env-based cron trigger.
export const DEFAULT_CAMPAIGN = 'anniversary-reminder'

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
  campaign?:     string
  summary?:      { pending: number; sent: number; skippedInvalid: number; failed: number }
  remaining?:    number   // recipients still un-sent for this campaign after this batch
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
// Dedup is per-CAMPAIGN: a guest already logged in sms_sends for this campaign
// is skipped, but a brand-new campaign name reaches the whole audience again —
// so you can send a day-before and a day-of blast without collisions.
// - dryRun: count + preview masked numbers, no sends, no DB writes.
// - testTo: send exactly one message to that number, no DB writes.
// - otherwise: send to every attending RSVP not yet sent for `campaign`.
export async function runSmsReminders(params: {
  client:    TwilioClient | null
  from:      string
  message:   string
  campaign:  string
  limit?:    number        // process at most this many recipients (one batch); omit for all
  dryRun?:   boolean
  testTo?:   string | null
}): Promise<SmsResult> {
  const { client, from, message, limit, dryRun = false, testTo = null } = params
  const campaign = (params.campaign || DEFAULT_CAMPAIGN).trim()
  const mode: SmsMode = testTo ? 'test' : dryRun ? 'dryRun' : 'live'

  if (!supabase) return { ok: false, mode, campaign, error: 'Supabase not configured' }

  const nowISO = new Date().toISOString()
  if (nowISO > EVENT_ENDED_ISO) {
    return { ok: true, mode, campaign, error: 'Event has ended — nothing sent.' }
  }

  // ── Test mode: single message, no DB writes ──
  if (testTo) {
    const to = toE164US(testTo)
    if (!to) return { ok: false, mode: 'test', campaign, error: `Invalid test number: ${testTo}` }
    if (dryRun) return { ok: true, mode: 'test', campaign, to: maskPhone(to) }
    if (!client || !from) return { ok: false, mode: 'test', campaign, error: 'Twilio credentials or From number missing.' }
    try {
      const msg = await client.messages.create({ from, to, body: renderBody(message, 'there') })
      return { ok: true, mode: 'test', campaign, sid: msg.sid, to: maskPhone(to) }
    } catch (err) {
      return { ok: false, mode: 'test', campaign, error: String(err) }
    }
  }

  // ── Audience: attending RSVPs, minus anyone already sent for this campaign ──
  const { data: rsvps, error } = await supabase
    .from('rsvps')
    .select('id, full_name, phone')
    .eq('event_slug', ANNIVERSARY_EVENT_SLUG)
    .eq('attending', true)

  if (error) return { ok: false, mode, campaign, error: error.message }

  const { data: already, error: sentErr } = await supabase
    .from('sms_sends')
    .select('rsvp_id')
    .eq('campaign', campaign)

  if (sentErr) return { ok: false, mode, campaign, error: sentErr.message }
  const alreadySent = new Set((already ?? []).map(r => r.rsvp_id))

  const pendingAll = (rsvps ?? []).filter(r => !alreadySent.has(r.id))

  // ── Dry run: preview the whole remaining audience, no DB writes ──
  if (dryRun) {
    const summary = { pending: pendingAll.length, sent: 0, skippedInvalid: 0, failed: 0 }
    const preview: string[] = []
    for (const rsvp of pendingAll) {
      const to = toE164US(rsvp.phone)
      if (!to) { summary.skippedInvalid++; continue }
      preview.push(maskPhone(to))
    }
    return { ok: true, mode: 'dryRun', campaign, summary, remaining: pendingAll.length, wouldSendTo: preview }
  }

  if (!client || !from) {
    return { ok: false, mode: 'live', campaign, error: 'Twilio credentials or From number missing.' }
  }

  // ── Live: process just ONE batch (up to `limit`) so the caller can loop and
  // pace the sends. `handled` counts everyone removed from the pending set this
  // call — including invalid numbers, which we log so they don't reappear and
  // stall the batch loop — so `remaining` reliably reaches 0. ──
  const batch = limit && limit > 0 ? pendingAll.slice(0, limit) : pendingAll
  const summary = { pending: pendingAll.length, sent: 0, skippedInvalid: 0, failed: 0 }
  let handled = 0

  for (const rsvp of batch) {
    const to = toE164US(rsvp.phone)

    if (!to) {
      // Log as invalid (claim-before-send) so this guest leaves the pending set.
      await supabase.from('sms_sends').upsert(
        { rsvp_id: rsvp.id, campaign, status: 'invalid' },
        { onConflict: 'rsvp_id,campaign', ignoreDuplicates: true })
      summary.skippedInvalid++; handled++
      continue
    }

    // CLAIM-BEFORE-SEND: insert the (rsvp_id, campaign) row first. The unique
    // constraint + ignoreDuplicates means a concurrent request that already
    // claimed this guest yields no row here, so we skip — no double-text.
    const { data: claimed, error: claimErr } = await supabase
      .from('sms_sends')
      .upsert({ rsvp_id: rsvp.id, campaign, to_phone: to, status: 'sending' },
              { onConflict: 'rsvp_id,campaign', ignoreDuplicates: true })
      .select('id')

    if (claimErr) { summary.failed++; handled++; continue }
    if (!claimed || claimed.length === 0) { handled++; continue } // claimed elsewhere

    try {
      const msg = await client.messages.create({ from, to, body: renderBody(message, firstNameOf(rsvp.full_name)) })
      await supabase.from('sms_sends').update({ twilio_sid: msg.sid, status: 'sent' })
        .eq('rsvp_id', rsvp.id).eq('campaign', campaign)
      summary.sent++; handled++
    } catch (err) {
      console.error(`[anniversary-sms] send failed for RSVP ${rsvp.id} (campaign ${campaign}) — claimed, will not retry:`, err)
      await supabase.from('sms_sends').update({ status: 'failed' })
        .eq('rsvp_id', rsvp.id).eq('campaign', campaign)
      summary.failed++; handled++
    }
  }

  return { ok: true, mode: 'live', campaign, summary, remaining: Math.max(0, pendingAll.length - handled) }
}
