import type { MLSService, MLSServiceCategory } from '@/types/services'
import {
  fetchServices,
  fetchServiceBySlug,
  fetchAllServiceSlugs,
  fetchCategories,
  type ServiceRow,
  type CategoryRow,
} from '@/lib/supabase'

// ─── Adapters: Supabase rows → MLSService shape ───────────────────────────────
// Keeps all downstream components (ServiceCard, product page, etc.) unchanged

function rowToService(row: ServiceRow): MLSService {
  return {
    id:               row.id,
    slug:             row.slug,
    status:           'publish',
    date:             '',
    modified:         '',
    mls_service_cat:  [],
    title:            { rendered: row.title },
    excerpt:        { rendered: row.excerpt ? `<p>${row.excerpt}</p>` : '' },
    content:        { rendered: row.content ?? '' },
    featured_media: 0,
    meta: {
      mls_price:           row.price          ?? '',
      mls_sale_price:      row.sale_price      ?? '',
      mls_duration:        row.duration        ?? '',
      mls_badge:           row.badge           ?? '',
      mls_is_featured:     row.is_featured     ?? false,
      mls_stripe_price_id: row.stripe_price_id ?? '',
    },
    _embedded: {
      ...(row.image_url ? {
        'wp:featuredmedia': [{
          id:           0,
          source_url:   row.image_url,
          alt_text:     row.title,
          media_details: { sizes: {} },
        }],
      } : {}),
      'wp:term': [[{
        id:       0,
        name:     row.category_slug ?? '',
        slug:     row.category_slug ?? '',
        taxonomy: 'mls_service_cat',
      }]],
    },
  }
}

function rowToCategory(row: CategoryRow & { count?: number }): MLSServiceCategory {
  return {
    id:          row.id,
    name:        row.name,
    slug:        row.slug,
    count:       row.count ?? 0,
    description: row.description ?? '',
  }
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getServiceCategories(): Promise<MLSServiceCategory[]> {
  try {
    const rows = await fetchCategories()
    return rows.map(rowToCategory)
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
  try {
    // Resolve category slug from id if needed
    let categorySlug: string | undefined
    if (params?.category) {
      const cats = await fetchCategories()
      const cat  = cats.find(c => String(c.id) === String(params.category) || c.slug === String(params.category))
      categorySlug = cat?.slug
    }

    const perPage = params?.perPage ?? 24
    const { services: rows, total } = await fetchServices({
      categorySlug,
      search:   params?.search,
      featured: params?.featured,
      page:     params?.page ?? 1,
      perPage,
    })

    return {
      services:   rows.map(rowToService),
      total,
      totalPages: Math.ceil(total / perPage),
    }
  } catch {
    return { services: [], total: 0, totalPages: 0 }
  }
}

export async function getServiceBySlug(slug: string): Promise<MLSService | null> {
  try {
    const row = await fetchServiceBySlug(slug)
    return row ? rowToService(row) : null
  } catch {
    return null
  }
}

export async function getFeaturedServices(limit = 3): Promise<MLSService[]> {
  try {
    const { services } = await fetchServices({ featured: true, perPage: limit })
    return services.map(rowToService)
  } catch {
    return []
  }
}

export async function getAllServiceSlugs(): Promise<string[]> {
  try {
    return await fetchAllServiceSlugs()
  } catch {
    return []
  }
}

// ─── Helpers (unchanged — all components use these) ──────────────────────────

export function getServiceImage(service: MLSService): { src: string; alt: string } | null {
  const media = service._embedded?.['wp:featuredmedia']?.[0]
  if (!media) return null
  const src =
    media.media_details?.sizes?.large?.source_url ??
    media.media_details?.sizes?.medium_large?.source_url ??
    media.source_url
  if (!src) return null
  return { src, alt: media.alt_text || service.title.rendered }
}

export function getServiceCategories_fromPost(service: MLSService): Array<{ id: number; name: string; slug: string }> {
  return service._embedded?.['wp:term']?.flat().filter(t => t.taxonomy === 'mls_service_cat') ?? []
}

export function formatServicePrice(price: string | undefined | null): string {
  if (!price) return ''
  const num = parseFloat(price)
  if (isNaN(num) || num <= 0) return ''
  const hasCents = Math.round(num * 100) % 100 !== 0
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(num)
}

/** Returns Affirm monthly estimate (price ÷ 12, rounded up) or null if price too low */
export function affirmMonthly(price: string | undefined | null): number | null {
  if (!price) return null
  const num = parseFloat(price)
  if (isNaN(num) || num < 50) return null
  return Math.ceil(num / 12)
}

export function isOnSale(service: MLSService): boolean {
  return !!service.meta?.mls_sale_price && service.meta.mls_sale_price !== ''
}

export function safeMeta(service: MLSService): MLSService['meta'] {
  return service.meta ?? {
    mls_price:           '',
    mls_sale_price:      '',
    mls_duration:        '',
    mls_badge:           '',
    mls_is_featured:     false,
    mls_stripe_price_id: '',
  }
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}
