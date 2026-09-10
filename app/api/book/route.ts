import { NextRequest, NextResponse } from 'next/server'
import { getConsultationServices, submitBooking } from '@/lib/lume'
import { getRule, resolveService } from '@/lib/bookingRules'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot — real users never fill this field.
  if (body.company) return NextResponse.json({ ok: true }, { status: 201 })

  const first = String(body.first_name ?? '').trim()
  const last = String(body.last_name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const phone = normalizePhone(String(body.phone ?? ''))
  const rule = getRule(String(body.interest ?? ''))
  const providerId = Number(body.provider_id)
  const locationId = Number(body.location_id)
  const startTime = String(body.start_time ?? '')

  if (!first || !last) return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 })
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  if (!phone) return NextResponse.json({ error: 'Please enter a valid U.S. phone number.' }, { status: 400 })
  if (!rule || !providerId || !locationId || !startTime) {
    return NextResponse.json({ error: 'Your selected time is missing — please pick a time again.' }, { status: 400 })
  }
  // Enforce provider eligibility for this consultation type.
  if (!rule.providerIds.includes(providerId)) {
    return NextResponse.json({ error: 'Please pick a time again.' }, { status: 400 })
  }

  const userNotes = String(body.notes ?? '').slice(0, 900)
  const notes = [`Interest: ${rule.label}`, userNotes.trim()].filter(Boolean).join(' — ')

  try {
    const service = resolveService(rule, await getConsultationServices())
    if (!service) throw new Error('no consultation service')

    const { status, data } = await submitBooking({
      service_id: service.id,
      provider_id: providerId,
      location_id: locationId,
      start_time: startTime,
      customer_first_name: first.slice(0, 100),
      customer_last_name: last.slice(0, 100),
      customer_email: email.slice(0, 254),
      customer_phone: phone,
      notes,
      email_marketing_opt_in: Boolean(body.email_opt_in),
      sms_marketing_opt_in: Boolean(body.sms_opt_in),
    })

    if (status === 201) return NextResponse.json(data, { status: 201 })
    if (status === 409) {
      return NextResponse.json(
        { error: 'That time was just taken — please choose another slot.', stale: true },
        { status: 409 },
      )
    }
    const detail =
      typeof data?.detail === 'string'
        ? data.detail
        : 'We could not complete your booking. Please try again or call us at (305) 705-3997.'
    return NextResponse.json({ error: detail }, { status: 400 })
  } catch {
    return NextResponse.json(
      { error: 'Booking is temporarily unavailable. Please call us at (305) 705-3997.' },
      { status: 503 },
    )
  }
}
