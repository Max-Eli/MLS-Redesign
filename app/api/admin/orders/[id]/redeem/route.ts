import { NextResponse } from 'next/server'
import { markRedeemed, unmarkRedeemed, updateRedemptionNotes } from '@/lib/order-redemptions'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({})) as {
    action?:      'redeem' | 'unredeem'
    redeemedBy?:  string
    notes?:       string | null
  }

  if (body.action === 'unredeem') {
    const row = await unmarkRedeemed(params.id)
    if (!row) return NextResponse.json({ error: 'Failed' }, { status: 500 })
    return NextResponse.json({ redemption: row })
  }

  const row = await markRedeemed(params.id, {
    redeemedBy: body.redeemedBy?.trim() || undefined,
    notes:      body.notes ?? null,
  })
  if (!row) return NextResponse.json({ error: 'Failed' }, { status: 500 })
  return NextResponse.json({ redemption: row })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({})) as { notes?: string | null }
  const row = await updateRedemptionNotes(params.id, body.notes ?? null)
  if (!row) return NextResponse.json({ error: 'Failed' }, { status: 500 })
  return NextResponse.json({ redemption: row })
}
