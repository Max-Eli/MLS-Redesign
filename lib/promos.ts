import { supabase } from '@/lib/supabase'

export interface PromoCode {
  id:             number
  code:           string
  discount_cents: number
  label:          string
  active:         boolean
  uses:           number
  created_at:     string
}

export async function fetchPromoCodes(): Promise<PromoCode[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data
}

export async function validatePromoCode(code: string): Promise<{ valid: boolean; discountCents: number; label: string } | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('promo_codes')
    .select('discount_cents, label')
    .eq('code', code.trim().toUpperCase())
    .eq('active', true)
    .single()
  if (error || !data) return null
  return { valid: true, discountCents: data.discount_cents, label: data.label }
}

export async function incrementPromoUses(code: string): Promise<void> {
  if (!supabase) return
  await supabase.rpc('increment_promo_uses', { promo_code: code })
}
