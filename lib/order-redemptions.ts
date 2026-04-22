import { supabase } from './supabase'

export interface OrderRedemption {
  stripe_payment_intent_id: string
  redeemed_at:              string | null
  redeemed_by:              string | null
  notes:                    string | null
  created_at:               string
  updated_at:               string
}

export async function fetchRedemptionsByIds(ids: string[]): Promise<Map<string, OrderRedemption>> {
  const map = new Map<string, OrderRedemption>()
  if (!supabase || ids.length === 0) return map

  const { data, error } = await supabase
    .from('order_redemptions')
    .select('*')
    .in('stripe_payment_intent_id', ids)

  if (error || !data) return map
  for (const row of data as OrderRedemption[]) {
    map.set(row.stripe_payment_intent_id, row)
  }
  return map
}

export async function markRedeemed(
  id: string,
  opts: { redeemedBy?: string; notes?: string | null } = {},
): Promise<OrderRedemption | null> {
  if (!supabase) return null
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('order_redemptions')
    .upsert({
      stripe_payment_intent_id: id,
      redeemed_at:              now,
      redeemed_by:              opts.redeemedBy ?? null,
      notes:                    opts.notes ?? null,
      updated_at:               now,
    }, { onConflict: 'stripe_payment_intent_id' })
    .select()
    .single()

  if (error || !data) return null
  return data as OrderRedemption
}

export async function unmarkRedeemed(id: string): Promise<OrderRedemption | null> {
  if (!supabase) return null
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('order_redemptions')
    .upsert({
      stripe_payment_intent_id: id,
      redeemed_at:              null,
      redeemed_by:              null,
      updated_at:               now,
    }, { onConflict: 'stripe_payment_intent_id' })
    .select()
    .single()

  if (error || !data) return null
  return data as OrderRedemption
}

export async function updateRedemptionNotes(id: string, notes: string | null): Promise<OrderRedemption | null> {
  if (!supabase) return null
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('order_redemptions')
    .upsert({
      stripe_payment_intent_id: id,
      notes,
      updated_at: now,
    }, { onConflict: 'stripe_payment_intent_id' })
    .select()
    .single()

  if (error || !data) return null
  return data as OrderRedemption
}
