import { randomBytes } from 'node:crypto'
import { supabase } from './supabase'
import type { CartItem } from '@/types/cart'

export interface AbandonedCartRow {
  id:                number
  recovery_token:    string
  email:             string
  first_name:        string | null
  last_name:         string | null
  phone:             string | null
  items:             CartItem[]
  subtotal_cents:    number
  promo_code:        string | null
  last_updated_at:   string
  created_at:        string
  reminder_sent_at:  string | null
  converted_at:      string | null
}

function generateRecoveryToken(): string {
  return randomBytes(24).toString('base64url')
}

export interface UpsertAbandonedCartInput {
  email:       string
  firstName?:  string
  lastName?:   string
  phone?:      string
  items:       CartItem[]
  subtotalCents: number
  promoCode?:  string | null
}

/**
 * Save or update the abandoned cart for this email. If a row already exists, we
 * refresh items/timestamp and clear the reminder/conversion flags so a fresh
 * cart gets its own reminder window.
 */
export async function upsertAbandonedCart(
  input: UpsertAbandonedCartInput,
): Promise<AbandonedCartRow | null> {
  if (!supabase) return null

  const email = input.email.trim().toLowerCase()
  if (!email) return null

  const { data: existing } = await supabase
    .from('abandoned_carts')
    .select('recovery_token')
    .ilike('email', email)
    .maybeSingle()

  const recovery_token = existing?.recovery_token ?? generateRecoveryToken()

  const { data, error } = await supabase
    .from('abandoned_carts')
    .upsert(
      {
        recovery_token,
        email,
        first_name:      input.firstName?.trim() || null,
        last_name:       input.lastName?.trim()  || null,
        phone:           input.phone?.trim()     || null,
        items:           input.items,
        subtotal_cents:  input.subtotalCents,
        promo_code:      input.promoCode?.trim() || null,
        last_updated_at: new Date().toISOString(),
        reminder_sent_at: null,
        converted_at:    null,
      },
      { onConflict: 'email' },
    )
    .select('*')
    .single()

  if (error) {
    console.error('upsertAbandonedCart error:', error)
    return null
  }
  return data as AbandonedCartRow
}

export async function markAbandonedCartConverted(email: string): Promise<void> {
  if (!supabase) return
  const lower = email.trim().toLowerCase()
  if (!lower) return
  await supabase
    .from('abandoned_carts')
    .update({ converted_at: new Date().toISOString() })
    .ilike('email', lower)
    .is('converted_at', null)
}

export async function fetchAbandonedCartByToken(token: string): Promise<AbandonedCartRow | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('abandoned_carts')
    .select('*')
    .eq('recovery_token', token)
    .maybeSingle()
  if (error) {
    console.error('fetchAbandonedCartByToken error:', error)
    return null
  }
  return (data ?? null) as AbandonedCartRow | null
}

/** Carts that are ready for a reminder — stale, unsent, unconverted. */
export async function fetchPendingReminders(olderThanMinutes: number): Promise<AbandonedCartRow[]> {
  if (!supabase) return []
  const cutoff = new Date(Date.now() - olderThanMinutes * 60_000).toISOString()
  const { data, error } = await supabase
    .from('abandoned_carts')
    .select('*')
    .is('reminder_sent_at', null)
    .is('converted_at', null)
    .lt('last_updated_at', cutoff)
    .order('last_updated_at', { ascending: true })
    .limit(50)

  if (error) {
    console.error('fetchPendingReminders error:', error)
    return []
  }
  return (data ?? []) as AbandonedCartRow[]
}

export async function markReminderSent(id: number): Promise<void> {
  if (!supabase) return
  await supabase
    .from('abandoned_carts')
    .update({ reminder_sent_at: new Date().toISOString() })
    .eq('id', id)
}
