import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  if (!supabase) return NextResponse.json({ promos: [] })
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ promos: data })
}

export async function POST(req: Request) {
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })
  const { code, discount_cents, label } = await req.json()

  if (!code || !discount_cents || !label) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('promo_codes')
    .insert({ code: code.trim().toUpperCase(), discount_cents: Number(discount_cents), label })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ promo: data })
}
