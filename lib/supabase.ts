import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ServiceRow {
  id:              number
  slug:            string
  title:           string
  excerpt:         string | null
  content:         string | null
  category_slug:   string | null
  price:           string
  sale_price:      string | null
  duration:        string | null
  badge:           string | null
  is_featured:     boolean
  stripe_price_id: string | null
  image_url:       string | null
  active:          boolean
  sort_order:      number
}

export interface CategoryRow {
  id:          number
  name:        string
  slug:        string
  description: string | null
  sort_order:  number
  active:      boolean
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function fetchServices(params?: {
  categorySlug?: string
  search?: string
  featured?: boolean
  page?: number
  perPage?: number
}): Promise<{ services: ServiceRow[]; total: number }> {
  if (!supabase) return { services: [], total: 0 }

  const perPage = params?.perPage ?? 24
  const page    = params?.page    ?? 1
  const from    = (page - 1) * perPage
  const to      = from + perPage - 1

  let query = supabase
    .from('services')
    .select('*', { count: 'exact' })
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .order('title',      { ascending: true })
    .range(from, to)

  if (params?.categorySlug) query = query.eq('category_slug', params.categorySlug)
  if (params?.featured)     query = query.eq('is_featured', true)
  if (params?.search)       query = query.ilike('title', `%${params.search}%`)

  const { data, error, count } = await query
  if (error || !data) return { services: [], total: 0 }
  return { services: data, total: count ?? data.length }
}

export async function fetchServiceBySlug(slug: string): Promise<ServiceRow | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()
  if (error || !data) return null
  return data
}

export async function fetchAllServiceSlugs(): Promise<string[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('services')
    .select('slug')
    .eq('active', true)
  if (error || !data) return []
  return data.map((r: { slug: string }) => r.slug)
}

export async function fetchCategories(): Promise<CategoryRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })
  if (error || !data) return []
  return data
}
