import { supabase } from './supabase'

export interface SkincareProductRow {
  id:            number
  brand:         string
  slug:          string
  name:          string
  description:   string | null
  category:      string | null
  price:         string | null
  image_url:     string | null
  external_path: string | null
  is_featured:   boolean
  sort_order:    number
  active:        boolean
}

export interface BrandMeta {
  slug:       'alumiermd' | 'epicutis'
  name:       string
  tagline:    string
  baseUrl:    string
  referralCode?: string
}

// ─── Brand configuration ─────────────────────────────────────────────────────
// Practice codes live in env so they can rotate without a migration/redeploy.
export const BRANDS: Record<string, BrandMeta> = {
  alumiermd: {
    slug:         'alumiermd',
    name:         'AlumierMD',
    tagline:      'Medical-grade skincare, prescribed by our specialists.',
    baseUrl:      'https://us.alumiermd.com',
    referralCode: process.env.ALUMIERMD_REFERRAL_CODE || 'UUX2DWDK',
  },
  epicutis: {
    slug:         'epicutis',
    name:         'Epicutis',
    tagline:      'Next-generation lipid science for visibly stronger skin.',
    baseUrl:      'https://epicutis.com',
    referralCode: process.env.EPICUTIS_REFERRAL_CODE,
  },
}

export function getBrand(slug: string): BrandMeta | null {
  return BRANDS[slug] ?? null
}

// ─── URL composition ─────────────────────────────────────────────────────────
/**
 * Appends the brand's practice/referral code to a product URL. Customers landing
 * on the brand site via this URL are credited to the spa's account.
 */
export function buildBrandProductUrl(brand: string, externalPath: string | null): string {
  const meta = getBrand(brand)
  if (!meta) return '#'

  const path = externalPath || '/'
  const sep  = path.includes('?') ? '&' : '?'
  const code = meta.referralCode ? `${sep}code=${encodeURIComponent(meta.referralCode)}` : ''
  return `${meta.baseUrl}${path}${code}`
}

// ─── Queries ─────────────────────────────────────────────────────────────────
export async function fetchSkincareProducts(brand: string): Promise<SkincareProductRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('skincare_products')
    .select('*')
    .eq('brand',  brand)
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .order('name',       { ascending: true })

  if (error) {
    console.error('fetchSkincareProducts error:', error)
    return []
  }
  return (data ?? []) as SkincareProductRow[]
}

export async function fetchSkincareProductBySlug(brand: string, slug: string): Promise<SkincareProductRow | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('skincare_products')
    .select('*')
    .eq('brand',  brand)
    .eq('slug',   slug)
    .eq('active', true)
    .maybeSingle()

  if (error) {
    console.error('fetchSkincareProductBySlug error:', error)
    return null
  }
  return (data ?? null) as SkincareProductRow | null
}

export async function fetchFeaturedSkincare(limit = 6): Promise<SkincareProductRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('skincare_products')
    .select('*')
    .eq('is_featured', true)
    .eq('active',      true)
    .order('sort_order', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('fetchFeaturedSkincare error:', error)
    return []
  }
  return (data ?? []) as SkincareProductRow[]
}

// ─── Category helpers ────────────────────────────────────────────────────────
export function getUniqueCategories(products: SkincareProductRow[]): string[] {
  const seen = new Set<string>()
  for (const p of products) if (p.category) seen.add(p.category)
  return Array.from(seen)
}

export function formatSkincarePrice(price: string | null): string | null {
  if (!price) return null
  const num = parseFloat(price)
  if (isNaN(num)) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: num % 1 === 0 ? 0 : 2,
  }).format(num)
}
