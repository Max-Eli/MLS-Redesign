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

// Slugs of services whose linked promotion has been deactivated, has expired,
// or hasn't started yet. Campaign services (e.g. Mother's Day) keep their own
// row in `services` so the catalog stays clean year-round, but the `promotions`
// table is the source of truth for visibility — toggling a promotion off in
// /admin/promotions or passing its `ends_at` automatically hides the matching
// service from the shop, featured list, product detail, and sitemap.
export async function fetchInactivePromoSlugs(): Promise<string[]> {
  if (!supabase) return []
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('promotions')
    .select('product_slug')
    .not('product_slug', 'is', null)
    .or(`active.eq.false,starts_at.gt.${now},ends_at.lt.${now}`)

  if (error || !data) return []
  return data
    .map((r: { product_slug: string | null }) => r.product_slug)
    .filter((s): s is string => !!s)
}

// Inverse of fetchInactivePromoSlugs — slugs of services linked to a
// currently active promotion (started, not yet expired, active=true).
// Used by the Promotions filter chip on /shop so the chip shows every
// service with an active promotion regardless of its treatment category.
export async function fetchActivePromoSlugs(): Promise<string[]> {
  if (!supabase) return []
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('promotions')
    .select('product_slug')
    .eq('active', true)
    .not('product_slug', 'is', null)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)

  if (error || !data) return []
  return data
    .map((r: { product_slug: string | null }) => r.product_slug)
    .filter((s): s is string => !!s)
}

export async function fetchServices(params?: {
  categorySlug?: string
  search?: string
  featured?: boolean
  page?: number
  perPage?: number
}): Promise<{ services: ServiceRow[]; total: number }> {
  if (!supabase) return { services: [], total: 0 }

  const inactiveSlugs = await fetchInactivePromoSlugs()

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

  // Special-case: the "Promotions" filter chip on /shop filters by slugs of
  // services linked to active promotions, not by literal category_slug. This
  // lets services keep their real treatment category while still surfacing
  // under Promotions during a campaign.
  if (params?.categorySlug === 'promotions') {
    const activeSlugs = await fetchActivePromoSlugs()
    if (activeSlugs.length === 0) return { services: [], total: 0 }
    query = query.in('slug', activeSlugs)
  } else if (params?.categorySlug) {
    query = query.eq('category_slug', params.categorySlug)
  }
  if (params?.featured) query = query.eq('is_featured', true)
  if (params?.search)   query = query.ilike('title', `%${params.search}%`)
  if (inactiveSlugs.length > 0) {
    query = query.not('slug', 'in', `(${inactiveSlugs.map(s => `"${s}"`).join(',')})`)
  }

  const { data, error, count } = await query
  if (error || !data) return { services: [], total: 0 }
  return { services: data, total: count ?? data.length }
}

export async function fetchServiceBySlug(slug: string): Promise<ServiceRow | null> {
  if (!supabase) return null

  // Same visibility rule as fetchServices: if the linked promotion is off
  // or out of window, the product page returns null (404) too.
  const inactiveSlugs = await fetchInactivePromoSlugs()
  if (inactiveSlugs.includes(slug)) return null

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

  const inactiveSlugs = await fetchInactivePromoSlugs()

  const { data, error } = await supabase
    .from('services')
    .select('slug')
    .eq('active', true)
  if (error || !data) return []
  return data
    .map((r: { slug: string }) => r.slug)
    .filter((slug: string) => !inactiveSlugs.includes(slug))
}

export async function fetchCategories(): Promise<(CategoryRow & { count: number })[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('service_categories')
    .select('*, services(count)')
    .eq('active', true)
    .order('sort_order', { ascending: true })
  if (error || !data) return []
  return data.map((row: CategoryRow & { services: [{ count: number }] }) => ({
    ...row,
    count: row.services?.[0]?.count ?? 0,
  }))
}
