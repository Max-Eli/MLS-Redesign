import { supabase } from './supabase'

export interface BlogPostRow {
  id:               number
  wp_id:            number | null
  slug:             string
  title:            string
  content:          string
  excerpt:          string | null
  featured_image:   string | null
  category:         string | null
  tags:             string[] | null
  reading_minutes:  number | null
  published_at:     string
  modified_at:      string | null
  active:           boolean
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function fetchBlogPosts(params?: {
  page?: number
  perPage?: number
  category?: string
  search?: string
}): Promise<{ posts: BlogPostRow[]; total: number; totalPages: number }> {
  if (!supabase) return { posts: [], total: 0, totalPages: 0 }

  const perPage = params?.perPage ?? 12
  const page    = params?.page    ?? 1
  const from    = (page - 1) * perPage
  const to      = from + perPage - 1

  let query = supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('active', true)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (params?.category) query = query.eq('category', params.category)
  if (params?.search)   query = query.ilike('title', `%${params.search}%`)

  const { data, error, count } = await query
  if (error || !data) {
    console.error('fetchBlogPosts error:', error)
    return { posts: [], total: 0, totalPages: 0 }
  }

  const total = count ?? data.length
  return {
    posts: data as BlogPostRow[],
    total,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPostRow | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()
  if (error) {
    console.error('fetchBlogPostBySlug error:', error)
    return null
  }
  return (data ?? null) as BlogPostRow | null
}

export async function fetchAllBlogPostSlugs(): Promise<string[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('active', true)
  if (error || !data) return []
  return data.map(r => r.slug as string)
}

// ─── Formatting helpers ──────────────────────────────────────────────────────

export function formatBlogDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return ''
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}
