// Server-side client for the LumèCRM public booking API.
// The API key must never reach the browser — only import this from
// route handlers / server components.

const API_BASE = process.env.LUME_API_URL || 'https://api.xn--lumcrm-5ua.com/api/booking'
const TENANT = process.env.LUME_TENANT_SLUG || 'manhattan-laser-spa'

// Existing clients sign in here to book any treatment (not just consults).
export const PORTAL_LOGIN_URL = 'https://manhattan-laser-spa.xn--lumcrm-5ua.com/portal/login'

export interface LumeService {
  id: number
  name: string
  description: string
  duration_minutes: number
  price_cents: number
  category_name: string
  category_color: string
  hero_photo_url: string | null
}

export interface LumeSlot {
  start: string
  end: string
  available: boolean
  provider_id: number
}

export interface LumeInfo {
  name: string
  cancellation_policy: string
  booking_window_days: number
  locations: { id: number; name: string; timezone: string }[]
}

async function lumeFetch(path: string, init?: RequestInit & { next?: { revalidate: number } }) {
  const key = process.env.LUME_API_KEY
  if (!key) throw new Error('LUME_API_KEY is not configured')

  const res = await fetch(`${API_BASE}/${TENANT}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  return res
}

export async function getBookingInfo(): Promise<LumeInfo> {
  const res = await lumeFetch('/info/', { next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`info fetch failed: ${res.status}`)
  return res.json()
}

export async function getConsultationServices(): Promise<LumeService[]> {
  const res = await lumeFetch('/services/', { next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`services fetch failed: ${res.status}`)
  const services: LumeService[] = await res.json()
  return services.filter(s => s.category_name === 'Consultations')
}

export async function getSlots(
  serviceId: number,
  date: string,
  provider: number | 'any' = 'any',
): Promise<LumeSlot[]> {
  const res = await lumeFetch(
    `/slots/?service=${serviceId}&date=${date}&provider=${provider}`,
    { cache: 'no-store' },
  )
  if (!res.ok) throw new Error(`slots fetch failed: ${res.status}`)
  return res.json()
}

export interface BookingPayload {
  service_id: number
  provider_id: number
  location_id: number
  start_time: string
  customer_first_name: string
  customer_last_name: string
  customer_email: string
  customer_phone: string
  notes?: string
  email_marketing_opt_in?: boolean
  sms_marketing_opt_in?: boolean
}

export async function submitBooking(payload: BookingPayload) {
  const res = await lumeFetch('/book/', {
    method: 'POST',
    body: JSON.stringify(payload),
    cache: 'no-store',
  })
  const data = await res.json().catch(() => ({}))
  return { status: res.status, data }
}
