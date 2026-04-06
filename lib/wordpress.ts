import type { WPPost, WPPage, WPCategory } from '@/types/wordpress'

const WP_URL = process.env.WORDPRESS_URL || 'https://manhattanlaserspa.com'
const WP_API = `${WP_URL}/wp-json/wp/v2`

async function wpFetch<T>(
  endpoint: string,
  options?: RequestInit,
  revalidate = 3600
): Promise<T> {
  const res = await fetch(`${WP_API}${endpoint}`, {
    ...options,
    next: { revalidate },
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  })

  if (!res.ok) {
    throw new Error(`WP API error ${res.status}: ${endpoint}`)
  }

  return res.json() as Promise<T>
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getPosts(params?: {
  page?: number
  perPage?: number
  category?: number
  search?: string
}): Promise<{ posts: WPPost[]; total: number; totalPages: number }> {
  const qs = new URLSearchParams({
    _embed: 'true',
    per_page: String(params?.perPage ?? 12),
    page: String(params?.page ?? 1),
    status: 'publish',
    ...(params?.category ? { categories: String(params.category) } : {}),
    ...(params?.search ? { search: params.search } : {}),
  })

  const res = await fetch(`${WP_API}/posts?${qs}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`WP posts error: ${res.status}`)

  const posts = (await res.json()) as WPPost[]
  const total = parseInt(res.headers.get('x-wp-total') ?? '0')
  const totalPages = parseInt(res.headers.get('x-wp-totalpages') ?? '1')

  return { posts, total, totalPages }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const posts = await wpFetch<WPPost[]>(
      `/posts?slug=${slug}&_embed=true&status=publish`
    )
    return posts[0] ?? null
  } catch {
    return null
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const posts = await wpFetch<Array<{ slug: string }>>(
      `/posts?per_page=100&status=publish&_fields=slug`,
      undefined,
      86400
    )
    return posts.map((p) => p.slug)
  } catch {
    return []
  }
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  try {
    const pages = await wpFetch<WPPage[]>(
      `/pages?slug=${slug}&_embed=true&status=publish`
    )
    return pages[0] ?? null
  } catch {
    return null
  }
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<WPCategory[]> {
  try {
    return await wpFetch<WPCategory[]>(`/categories?per_page=50&hide_empty=true`, undefined, 86400)
  } catch {
    return []
  }
}

// ─── Featured image helpers ────────────────────────────────────────────────────

export function getPostFeaturedImage(post: WPPost): {
  src: string
  alt: string
} | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (!media) return null

  const src =
    media.media_details?.sizes?.large?.source_url ??
    media.media_details?.sizes?.full?.source_url ??
    media.source_url

  return { src, alt: media.alt_text || post.title.rendered }
}

export function getPostCategories(
  post: WPPost
): Array<{ id: number; name: string; slug: string }> {
  return (
    post._embedded?.['wp:term']
      ?.flat()
      .filter((t) => t.taxonomy === 'category') ?? []
  )
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
