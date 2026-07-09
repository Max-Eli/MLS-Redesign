import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: Request) {
  if (!supabase) return NextResponse.json({ rsvps: [] })

  const { searchParams } = new URL(req.url)
  const eventSlug = searchParams.get('event') ?? 'anniversary-4-year-2026'

  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('event_slug', eventSlug)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[admin/rsvps] error:', error)
    return NextResponse.json({ rsvps: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({ rsvps: data ?? [] })
}
