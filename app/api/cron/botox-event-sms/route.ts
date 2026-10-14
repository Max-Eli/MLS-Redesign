import { NextResponse } from 'next/server'
import { getTwilio, getTwilioFrom } from '@/lib/twilio'
import { runSmsReminders } from '@/lib/anniversary-sms'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
// ~60 sequential Twilio sends need more than the default function budget;
// if a run still gets cut short, the per-campaign send log means the next
// hourly run finishes the remainder without double-texting anyone.
export const maxDuration = 60

// Scheduled day-of SMS for The Botox Event (Oct 15, 2026). Runs hourly via
// Vercel cron; the window below means it actually sends on the first run at
// or after 9:00 AM ET on event day, and never after doors open at 4 PM.
// Credentials come from TWILIO_* env vars. Auth: Bearer <CRON_SECRET>.
// Query params: ?dryRun=1 (preview, no send) · ?test=<number> (single send).
const SEND_AFTER_ISO  = '2026-10-15T13:00:00Z' // Thu Oct 15, 9:00 AM EDT
const SEND_BEFORE_ISO = '2026-10-15T20:00:00Z' // doors open, 4:00 PM EDT
const EVENT_ENDED_ISO = '2026-10-16T08:00:00Z'

const CAMPAIGN = 'botox-dayof-2026-10-15'
const MESSAGE =
  `Hi {name}! TODAY'S the day: The Botox Event at Manhattan Laser Spa, 4-8 PM, ` +
  `16850 Collins Ave Ste 105, Sunny Isles Beach. Botox $6.99/unit at the event only - ` +
  `plus champagne, raffles & goodie bags. See you soon! Reply STOP to opt out, HELP for help.`

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const url    = new URL(req.url)
  const dryRun = url.searchParams.get('dryRun') === '1'
  const testTo = url.searchParams.get('test')

  // Time window — a test/dry run is allowed any time, the real blast only
  // inside its day-of window.
  const nowISO = new Date().toISOString()
  if (!dryRun && !testTo) {
    if (nowISO < SEND_AFTER_ISO)  return NextResponse.json({ ok: true, skipped: 'before send window' })
    if (nowISO > SEND_BEFORE_ISO) return NextResponse.json({ ok: true, skipped: 'after send window' })
  }

  const result = await runSmsReminders({
    client:        getTwilio(),
    from:          getTwilioFrom() ?? '',
    message:       MESSAGE,
    campaign:      CAMPAIGN,
    dryRun,
    testTo,
    eventSlug:     'botox-event-oct-2026',
    eventEndedISO: EVENT_ENDED_ISO,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
