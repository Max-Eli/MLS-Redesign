import { NextRequest, NextResponse } from 'next/server'
import { getConsultationServices, getSlots, type LumeSlot } from '@/lib/lume'
import { getRule, resolveService } from '@/lib/bookingRules'

export async function GET(req: NextRequest) {
  const interest = req.nextUrl.searchParams.get('interest') || ''
  const date = req.nextUrl.searchParams.get('date') || ''
  const rule = getRule(interest)

  if (!rule || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  try {
    const service = resolveService(rule, await getConsultationServices())
    if (!service) return NextResponse.json({ slots: [] })

    // Query each eligible provider separately and merge. (A single
    // provider=any query credits an arbitrary provider per slot, which
    // would drop times where only a filtered-out provider was credited.)
    const perProvider = await Promise.all(
      rule.providerIds.map(pid => getSlots(service.id, date, pid).catch(() => [] as LumeSlot[])),
    )
    const merged = new Map<string, LumeSlot>()
    for (const providerSlots of perProvider) {
      for (const slot of providerSlots) {
        if (slot.available && !merged.has(slot.start)) merged.set(slot.start, slot)
      }
    }
    const slots = Array.from(merged.values()).sort((a, b) => a.start.localeCompare(b.start))
    return NextResponse.json({ slots })
  } catch {
    return NextResponse.json({ error: 'Could not load availability.' }, { status: 503 })
  }
}
