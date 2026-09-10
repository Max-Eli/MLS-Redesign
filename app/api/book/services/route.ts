import { NextResponse } from 'next/server'
import { getBookingInfo, getConsultationServices } from '@/lib/lume'
import { INTEREST_RULES, resolveService } from '@/lib/bookingRules'

// One round trip for the booking page: tenant info + per-interest metadata.
// Service ids and provider eligibility stay server-side.
export async function GET() {
  try {
    const [info, services] = await Promise.all([getBookingInfo(), getConsultationServices()])
    const interests = INTEREST_RULES.map(rule => {
      const service = resolveService(rule, services)
      return service
        ? { id: rule.id, duration_minutes: service.duration_minutes, price_cents: service.price_cents }
        : null
    }).filter(Boolean)

    return NextResponse.json({
      cancellation_policy: info.cancellation_policy,
      booking_window_days: info.booking_window_days,
      location: info.locations[0] ?? null,
      interests,
    })
  } catch {
    return NextResponse.json({ error: 'Booking is temporarily unavailable.' }, { status: 503 })
  }
}
