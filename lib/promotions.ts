import { supabase } from '@/lib/supabase'

export interface Promotion {
  id:             number
  title:          string
  description:    string | null
  services:       string | null
  original_price: number | null
  promo_price:    number | null
  badge:          string | null
  image_url:      string | null
  active:         boolean
  starts_at:      string | null
  ends_at:        string | null
  sort_order:     number
  created_at:     string
}

export async function fetchActivePromotions(): Promise<Promotion[]> {
  if (!supabase) return []
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('active', true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data
}

export async function fetchAllPromotions(): Promise<Promotion[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data
}
