import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
const supabaseKey  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export interface PriceRow {
  slug:       string
  price:      string
  sale_price: string | null
  duration:   string | null
  badge:      string | null
  active:     boolean
}

export async function fetchPrices(): Promise<Record<string, PriceRow>> {
  if (!supabase) return {}

  const { data, error } = await supabase
    .from('service_prices')
    .select('*')
    .eq('active', true)

  if (error || !data) return {}

  return Object.fromEntries(data.map((row: PriceRow) => [row.slug, row]))
}
