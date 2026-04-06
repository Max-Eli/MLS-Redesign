import type { WCProduct, WCOrder, WCCreateOrderPayload } from '@/types/woocommerce'

const WP_URL = process.env.WORDPRESS_URL || 'https://manhattanlaserspa.com'
const WC_API = `${WP_URL}/wp-json/wc/v3`
const WC_KEY = process.env.WC_CONSUMER_KEY!
const WC_SECRET = process.env.WC_CONSUMER_SECRET!

function wcAuth(): string {
  return 'Basic ' + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')
}

async function wcFetch<T>(
  endpoint: string,
  options?: RequestInit,
  revalidate = 3600
): Promise<T> {
  const res = await fetch(`${WC_API}${endpoint}`, {
    ...options,
    next: { revalidate },
    headers: {
      'Content-Type': 'application/json',
      Authorization: wcAuth(),
      ...(options?.headers ?? {}),
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`WC API error ${res.status}: ${body}`)
  }

  return res.json() as Promise<T>
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(params?: {
  page?: number
  perPage?: number
  category?: string
  search?: string
  orderby?: string
  order?: 'asc' | 'desc'
}): Promise<{ products: WCProduct[]; total: number; totalPages: number }> {
  const qs = new URLSearchParams({
    per_page: String(params?.perPage ?? 20),
    page: String(params?.page ?? 1),
    status: 'publish',
    ...(params?.category ? { category: params.category } : {}),
    ...(params?.search ? { search: params.search } : {}),
    ...(params?.orderby ? { orderby: params.orderby } : {}),
    ...(params?.order ? { order: params.order } : {}),
  })

  const res = await fetch(`${WC_API}/products?${qs}`, {
    next: { revalidate: 3600 },
    headers: {
      'Content-Type': 'application/json',
      Authorization: wcAuth(),
    },
  })

  if (!res.ok) throw new Error(`WC products error: ${res.status}`)

  const products = (await res.json()) as WCProduct[]
  const total = parseInt(res.headers.get('x-wp-total') ?? '0')
  const totalPages = parseInt(res.headers.get('x-wp-totalpages') ?? '1')

  return { products, total, totalPages }
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  try {
    const products = await wcFetch<WCProduct[]>(`/products?slug=${slug}&status=publish`)
    return products[0] ?? null
  } catch {
    return null
  }
}

export async function getProductById(id: number): Promise<WCProduct | null> {
  try {
    return await wcFetch<WCProduct>(`/products/${id}`)
  } catch {
    return null
  }
}

export async function getFeaturedProducts(limit = 6): Promise<WCProduct[]> {
  try {
    const { products } = await getProducts({ perPage: limit, orderby: 'popularity' })
    return products
  } catch {
    return []
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const products = await wcFetch<Array<{ slug: string }>>(
      `/products?per_page=100&status=publish&_fields=slug`,
      undefined,
      86400
    )
    return products.map((p) => p.slug)
  } catch {
    return []
  }
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function createOrder(payload: WCCreateOrderPayload): Promise<WCOrder> {
  return wcFetch<WCOrder>(`/orders`, {
    method: 'POST',
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  })
}

export async function updateOrderStatus(
  orderId: number,
  status: string,
  transactionId?: string
): Promise<WCOrder> {
  return wcFetch<WCOrder>(
    `/orders/${orderId}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        status,
        ...(transactionId ? { transaction_id: transactionId } : {}),
      }),
      next: { revalidate: 0 },
    },
    0
  )
}

// ─── Product helpers ───────────────────────────────────────────────────────────

export function formatPrice(price: string): string {
  const num = parseFloat(price)
  if (isNaN(num)) return price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}

export function getPriceInCents(price: string): number {
  return Math.round(parseFloat(price) * 100)
}
