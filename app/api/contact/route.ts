import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// IP rate limit — 3 requests per 10 minutes
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 10 * 60_000 })
    return false
  }
  if (entry.count >= 3) return true
  entry.count++
  return false
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { firstName, lastName, email, phone, treatment, message, website, formElapsedMs } = await req.json()

    // Honeypot — real users can't see this field; bots fill everything.
    // Return success silently so the bot moves on instead of retrying.
    if (typeof website === 'string' && website.trim() !== '') {
      return NextResponse.json({ ok: true })
    }

    // Time-to-fill — bots submit in milliseconds; humans take >2s.
    if (typeof formElapsedMs === 'number' && formElapsedMs < 2000) {
      return NextResponse.json({ ok: true })
    }

    if (!firstName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Manhattan Laser Spa <noreply@send.manhattanlaserspa.com>',
      to:   'florida@manhattanlaserspa.com',
      replyTo: email,
      subject: `New Consultation Request — ${firstName} ${lastName ?? ''}`.trim(),
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border-radius:12px;">
          <div style="border-bottom:1px solid #e8e0d8;padding-bottom:24px;margin-bottom:28px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9b8ea0;">Manhattan Laser Spa</p>
            <h1 style="margin:8px 0 0;font-size:26px;font-weight:300;color:#1a1a2e;">New Consultation Request</h1>
          </div>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;width:40%;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;">${firstName} ${lastName ?? ''}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;"><a href="mailto:${email}" style="color:#9b8ea0;">${email}</a></td>
            </tr>
            ${phone ? `<tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Phone</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;"><a href="tel:${phone}" style="color:#9b8ea0;">${phone}</a></td>
            </tr>` : ''}
            ${treatment ? `<tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Treatment</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;">${treatment}</td>
            </tr>` : ''}
            ${message ? `<tr>
              <td style="padding:10px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;vertical-align:top;">Message</td>
              <td style="padding:10px 0;font-size:14px;color:#1a1a2e;line-height:1.6;">${message}</td>
            </tr>` : ''}
          </table>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e8e0d8;">
            <p style="margin:0;font-size:12px;color:#c4b8a8;">Sent from manhattanlaserspa.com contact form</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
