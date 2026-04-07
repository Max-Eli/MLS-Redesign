import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  if (!supabase) return NextResponse.json({ promotions: [] })
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ promotions: data })
}

export async function POST(req: Request) {
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })
  const body = await req.json()
  const { title, description, services, original_price, promo_price, badge, image_url, starts_at, ends_at, sort_order } = body

  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('promotions')
    .insert({
      title,
      description:    description    || null,
      services:       services       || null,
      original_price: original_price ? Number(original_price) : null,
      promo_price:    promo_price    ? Number(promo_price)    : null,
      badge:          badge          || null,
      image_url:      image_url      || null,
      starts_at:      starts_at      || null,
      ends_at:        ends_at        || null,
      sort_order:     sort_order     ? Number(sort_order) : 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ promotion: data })
}
