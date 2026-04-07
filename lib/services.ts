import type { MLSService, MLSServiceCategory } from '@/types/services'
import { servicePrices } from '@/lib/servicePrices'

const WP_URL = process.env.WORDPRESS_URL || 'https://manhattanlaserspa.com'

function injectPrices(service: MLSService): MLSService {
  const p = servicePrices[service.slug]
  if (!p) return service
  return {
    ...service,
    meta: {
      mls_price:           p.price        ?? '',
      mls_sale_price:      p.salePrice    ?? '',
      mls_duration:        p.duration     ?? '',
      mls_badge:           p.badge        ?? '',
      mls_is_featured:     service.meta?.mls_is_featured ?? false,
      mls_stripe_price_id: service.meta?.mls_stripe_price_id ?? '',
    },
  }
}
const API    = `${WP_URL}/wp-json/wp/v2`

async function apiFetch<T>(endpoint: string, revalidate = 3600): Promise<{ data: T; headers: Headers }> {
  const res = await fetch(`${API}${endpoint}`, {
    next: { revalidate },
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Services API error ${res.status}: ${endpoint}`)
  return { data: await res.json() as T, headers: res.headers }
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getServiceCategories(): Promise<MLSServiceCategory[]> {
  try {
    const { data } = await apiFetch<MLSServiceCategory[]>(
      '/mls_service_cat?per_page=100&orderby=count&order=desc',
      86400
    )
    return data.filter(c => c.count > 0)
  } catch {
    return []
  }
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function getServices(params?: {
  page?: number
  perPage?: number
  category?: number | string
  search?: string
  featured?: boolean
}): Promise<{ services: MLSService[]; total: number; totalPages: number }> {
  const qs = new URLSearchParams({
    _embed:   'true',
    per_page: String(params?.perPage ?? 24),
    page:     String(params?.page ?? 1),
    status:   'publish',
    orderby:  'title',
    order:    'asc',
    ...(params?.category ? { mls_service_cat: String(params.category) } : {}),
    ...(params?.search   ? { search: params.search } : {}),
  })

  try {
    const res = await fetch(`${API}/mls_service?${qs}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`${res.status}`)
    const data     = (await res.json() as MLSService[]).map(injectPrices)
    const total      = parseInt(res.headers.get('x-wp-total')      ?? '0')
    const totalPages = parseInt(res.headers.get('x-wp-totalpages') ?? '1')
    return { services: data, total, totalPages }
  } catch {
    return { services: [], total: 0, totalPages: 0 }
  }
}

export async function getServiceBySlug(slug: string): Promise<MLSService | null> {
  try {
    const { data } = await apiFetch<MLSService[]>(
      `/mls_service?slug=${slug}&_embed=true&status=publish`,
      3600
    )
    const service = (data as MLSService[])[0] ?? null
    return service ? injectPrices(service) : null
  } catch {
    return null
  }
}

export async function getFeaturedServices(limit = 3): Promise<MLSService[]> {
  try {
    // Get services marked as featured via meta
    const { services } = await getServices({ perPage: 100 })
    const featured = services.filter(s => s.meta.mls_is_featured === true || s.meta.mls_is_featured === '1')
    return featured.slice(0, limit)
  } catch {
    return []
  }
}

export async function getAllServiceSlugs(): Promise<string[]> {
  try {
    const { data } = await apiFetch<Array<{ slug: string }>>(
      '/mls_service?per_page=100&status=publish&_fields=slug',
      86400
    )
    return (data as Array<{ slug: string }>).map(s => s.slug)
  } catch {
    return []
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getServiceImage(service: MLSService): { src: string; alt: string } | null {
  const media = service._embedded?.['wp:featuredmedia']?.[0]
  if (!media) return null
  const src =
    media.media_details?.sizes?.large?.source_url ??
    media.media_details?.sizes?.medium_large?.source_url ??
    media.source_url
  return { src, alt: media.alt_text || service.title.rendered }
}

export function getServiceCategories_fromPost(service: MLSService): Array<{ id: number; name: string; slug: string }> {
  return service._embedded?.['wp:term']?.flat().filter(t => t.taxonomy === 'mls_service_cat') ?? []
}

export function formatServicePrice(price: string | undefined | null): string {
  if (!price) return ''
  const num = parseFloat(price)
  if (isNaN(num) || num <= 0) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function isOnSale(service: MLSService): boolean {
  return !!service.meta?.mls_sale_price && service.meta.mls_sale_price !== ''
}

export function safeMeta(service: MLSService): MLSService['meta'] {
  return service.meta ?? {
    mls_price: '',
    mls_sale_price: '',
    mls_duration: '',
    mls_badge: '',
    mls_is_featured: false,
    mls_stripe_price_id: '',
  }
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}
