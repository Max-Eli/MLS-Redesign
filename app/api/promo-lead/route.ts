import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { firstName, phone, email } = await req.json()

    if (!firstName || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Notify the spa
    await resend.emails.send({
      from: 'Manhattan Laser Spa <noreply@send.manhattanlaserspa.com>',
      to:   'florida@manhattanlaserspa.com',
      subject: `New VIP Lead — ${firstName} claimed $100 off`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border-radius:12px;">
          <div style="border-bottom:1px solid #e8e0d8;padding-bottom:24px;margin-bottom:28px;">
            <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9b8ea0;">Manhattan Laser Spa</p>
            <h1 style="margin:8px 0 0;font-size:26px;font-weight:300;color:#1a1a2e;">New VIP Lead</h1>
            <p style="margin:8px 0 0;font-size:14px;color:#9b8ea0;">Claimed promo code <strong>MLS100OFF</strong></p>
          </div>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;width:40%;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;">${firstName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Phone</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;font-size:14px;color:#1a1a2e;"><a href="tel:${phone}" style="color:#9b8ea0;">${phone}</a></td>
            </tr>
            ${email ? `<tr>
              <td style="padding:10px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9b8ea0;">Email</td>
              <td style="padding:10px 0;font-size:14px;color:#1a1a2e;"><a href="mailto:${email}" style="color:#9b8ea0;">${email}</a></td>
            </tr>` : ''}
          </table>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e8e0d8;">
            <p style="margin:0;font-size:12px;color:#c4b8a8;">Sent from manhattanlaserspa.com welcome popup</p>
          </div>
        </div>
      `,
    })

    // Send promo code to client (if email provided)
    if (email) {
      await resend.emails.send({
        from: 'Manhattan Laser Spa <noreply@send.manhattanlaserspa.com>',
        to:   email,
        subject: 'Your $100 off code is here 🎁',
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#faf9f7;padding:40px 32px;border-radius:12px;">
            <div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #e8e0d8;margin-bottom:32px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9b8ea0;">Manhattan Laser Spa</p>
              <h1 style="margin:0;font-size:36px;font-weight:300;color:#1a1a2e;">Welcome, ${firstName}</h1>
            </div>

            <p style="font-size:15px;color:#5a5068;line-height:1.7;margin:0 0 28px;">
              Thank you for joining our VIP list. Here's your exclusive welcome offer — use the code below at checkout to save $100 on your first treatment.
            </p>

            <div style="text-align:center;border:2px dashed #c4afd0;border-radius:16px;padding:28px 24px;margin-bottom:32px;background:#fff;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#9b8ea0;">Your Promo Code</p>
              <p style="margin:0;font-size:40px;font-weight:300;letter-spacing:0.1em;color:#9b8ea0;font-family:Georgia,serif;">MLS100OFF</p>
              <p style="margin:8px 0 0;font-size:12px;color:#c4b8a8;">Valid for 90 days · New clients only · One use per person</p>
            </div>

            <div style="text-align:center;margin-bottom:32px;">
              <a href="https://manhattanlaserspa.com/shop" style="display:inline-block;background:#9b8ea0;color:#fff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;">
                Browse Treatments
              </a>
            </div>

            <div style="border-top:1px solid #e8e0d8;padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#c4b8a8;">16850 Collins Ave, Suite 105 · Sunny Isles Beach, FL 33160</p>
              <p style="margin:6px 0 0;font-size:12px;color:#c4b8a8;">305-705-3997 · florida@manhattanlaserspa.com</p>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Promo lead error:', err)
    return NextResponse.json({ error: 'Failed to process lead' }, { status: 500 })
  }
}
