import { NextResponse } from 'next/server'
import { fetchActivePromotions } from '@/lib/promotions'

// Small helper so campaign popups (Independence Day, Mother's Day, …) can
// gate themselves on whether any matching promotion is actually active in
// /admin/promotions right now. When the owner toggles a campaign off, the
// popup stops showing and the regular welcome popup takes over — no code
// change or redeploy required.
//
// Response is a de-duped list of the `badge` values on currently active
// promotions (e.g. ["July 4th"] or ["Mother's Day", "July 4th"]).
export const revalidate = 60 // fresh within 60 seconds

export async function GET() {
  try {
    const promotions = await fetchActivePromotions()
    const badges = Array.from(new Set(
      promotions
        .map(p => p.badge)
        .filter((b): b is string => !!b && b.trim() !== '')
    ))
    return NextResponse.json({ campaigns: badges })
  } catch (err) {
    console.error('[campaigns/active] error:', err)
    return NextResponse.json({ campaigns: [] })
  }
}
