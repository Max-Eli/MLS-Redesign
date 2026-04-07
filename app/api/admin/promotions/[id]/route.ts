import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })
  const body = await req.json()

  const { data, error } = await supabase
    .from('promotions')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ promotion: data })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })
  const { error } = await supabase.from('promotions').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
