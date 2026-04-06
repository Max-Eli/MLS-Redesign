export interface WPRendered {
  rendered: string
  protected?: boolean
}

export interface WPPost {
  id: number
  date: string
  date_gmt: string
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: WPRendered
  content: WPRendered
  excerpt: WPRendered
  author: number
  featured_media: number
  comment_status: string
  categories: number[]
  tags: number[]
  _embedded?: {
    author?: Array<{ name: string; avatar_urls?: Record<string, string> }>
    'wp:featuredmedia'?: Array<{
      id: number
      source_url: string
      alt_text: string
      media_details?: {
        sizes?: {
          full?: { source_url: string; width: number; height: number }
          large?: { source_url: string; width: number; height: number }
          medium_large?: { source_url: string; width: number; height: number }
          thumbnail?: { source_url: string; width: number; height: number }
        }
      }
    }>
    'wp:term'?: Array<
      Array<{
        id: number
        name: string
        slug: string
        taxonomy: string
      }>
    >
  }
  yoast_head_json?: {
    title?: string
    description?: string
    robots?: { index: string; follow: string }
    canonical?: string
    og_locale?: string
    og_type?: string
    og_title?: string
    og_description?: string
    og_url?: string
    og_site_name?: string
    og_image?: Array<{ url: string; width?: number; height?: number; type?: string }>
    twitter_card?: string
    twitter_title?: string
    twitter_description?: string
  }
}

export interface WPPage {
  id: number
  date: string
  modified: string
  slug: string
  status: string
  type: string
  link: string
  title: WPRendered
  content: WPRendered
  excerpt: WPRendered
  featured_media: number
  parent: number
  _embedded?: WPPost['_embedded']
  yoast_head_json?: WPPost['yoast_head_json']
}

export interface WPCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
}

export interface WPTag {
  id: number
  count: number
  name: string
  slug: string
}

export interface WPMedia {
  id: number
  date: string
  slug: string
  type: string
  link: string
  title: WPRendered
  author: number
  alt_text: string
  caption: WPRendered
  source_url: string
  media_details: {
    width: number
    height: number
    file: string
    sizes: Record<string, {
      file: string
      width: number
      height: number
      source_url: string
    }>
  }
}

export interface WPApiResponse<T> {
  data: T
  headers: {
    'x-wp-total': string
    'x-wp-totalpages': string
  }
}
