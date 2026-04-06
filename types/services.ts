export interface MLSServiceMeta {
  mls_price: string
  mls_sale_price: string
  mls_duration: string
  mls_badge: string
  mls_is_featured: boolean | string
  mls_stripe_price_id: string
}

export interface MLSServiceCategory {
  id: number
  name: string
  slug: string
  count: number
  description: string
}

export interface MLSService {
  id: number
  slug: string
  status: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  featured_media: number
  date: string
  modified: string
  mls_service_cat: number[]
  meta: MLSServiceMeta
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number
      source_url: string
      alt_text: string
      media_details?: {
        sizes?: {
          large?: { source_url: string }
          medium_large?: { source_url: string }
          medium?: { source_url: string }
          thumbnail?: { source_url: string }
        }
      }
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
      taxonomy: string
    }>>
  }
}
