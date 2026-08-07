import { NextResponse } from 'next/server'
import { isAdminAuthed } from '@/lib/admin-auth'
import { makeTwilioClient } from '@/lib/twilio'
import { runSmsReminders, DEFAULT_SMS_MESSAGE, DEFAULT_CAMPAIGN } from '@/lib/anniversary-sms'

export const dynamic = 'force-dynamic'

// Send the anniversary SMS reminder from the admin panel. Twilio credentials
// are supplied per-request from the UI (never persisted). Falls back to
// TWILIO_* env vars for any field left blank. Requires a valid admin session.
export async function POST(req: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({})) as {
    accountSid?: string
    authToken?:  string
    fromNumber?: string
    message?:    string
    campaign?:   string
    batchSize?:  number
    dryRun?:     boolean
    test?:       string
  }

  const accountSid = (body.accountSid || process.env.TWILIO_ACCOUNT_SID || '').trim()
  const authToken  = (body.authToken  || process.env.TWILIO_AUTH_TOKEN  || '').trim()
  const fromNumber = (body.fromNumber || process.env.TWILIO_FROM_NUMBER || '').trim()
  const message    = (body.message && body.message.trim()) || DEFAULT_SMS_MESSAGE
  const campaign   = (body.campaign && body.campaign.trim()) || DEFAULT_CAMPAIGN
  const dryRun     = body.dryRun === true
  const testTo     = body.test?.trim() || null
  // Cap batch size to a sane range; omit → send everyone in one call.
  const batchSize  = typeof body.batchSize === 'number' && body.batchSize > 0
    ? Math.min(50, Math.floor(body.batchSize))
    : undefined

  // A dry run just counts recipients — no credentials needed for that preview.
  if (!dryRun) {
    if (!accountSid || !authToken) {
      return NextResponse.json({ ok: false, error: 'Enter your Twilio Account SID and Auth Token.' }, { status: 400 })
    }
    if (!fromNumber) {
      return NextResponse.json({ ok: false, error: 'Enter the Twilio From number (E.164, e.g. +13055551234).' }, { status: 400 })
    }
  }

  const client = dryRun && !accountSid ? null : makeTwilioClient(accountSid, authToken)
  if (!dryRun && !client) {
    return NextResponse.json({ ok: false, error: 'Twilio rejected those credentials — check the Account SID and Auth Token.' }, { status: 400 })
  }

  const result = await runSmsReminders({ client, from: fromNumber, message, campaign, limit: batchSize, dryRun, testTo })
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
