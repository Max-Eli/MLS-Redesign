import { NextResponse } from 'next/server'
import { getTwilio, getTwilioFrom } from '@/lib/twilio'
import { runSmsReminders, DEFAULT_SMS_MESSAGE, DEFAULT_CAMPAIGN } from '@/lib/anniversary-sms'

export const dynamic = 'force-dynamic'

// Env-credential trigger for the anniversary SMS reminder (reads TWILIO_* from
// the environment). Auth: Bearer <CRON_SECRET>, same scheme as the email cron.
// Query params: ?dryRun=1 (preview, no send) · ?test=<number> (single send).
// The admin panel uses /api/admin/send-reminders instead, with credentials
// entered in the UI.
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

  const result = await runSmsReminders({
    client:   getTwilio(),
    from:     getTwilioFrom() ?? '',
    message:  DEFAULT_SMS_MESSAGE,
    campaign: url.searchParams.get('campaign') || DEFAULT_CAMPAIGN,
    dryRun,
    testTo,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
