'use client'

import { useEffect, useState } from 'react'
import { X, Mail, Phone, User, Tag, Receipt, CheckCircle2, Clock, StickyNote, Loader2 } from 'lucide-react'

export interface AdminOrder {
  id:             string
  order_number:   string | null
  amount:         number
  currency:       string
  created:        number
  customer_email: string | null
  customer_name:  string | null
  customer_phone: string | null
  items:          string | null
  promo_code:     string | null
  discount:       string | null
  redeemed_at:    string | null
  redeemed_by:    string | null
  notes:          string | null
}

interface Props {
  order: AdminOrder | null
  onClose: () => void
  onUpdated: (order: AdminOrder) => void
}

function fmt(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(cents / 100)
}

function fmtDateTime(input: number | string) {
  const d = typeof input === 'number' ? new Date(input * 1000) : new Date(input)
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function parseItems(raw: string | null): { name: string; price: string; qty: number }[] {
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

export function OrderDetailDrawer({ order, onClose, onUpdated }: Props) {
  const [staffName, setStaffName] = useState('')
  const [notes, setNotes]         = useState('')
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    if (!order) return
    setStaffName(order.redeemed_by ?? '')
    setNotes(order.notes ?? '')
    setError('')
  }, [order?.id])

  useEffect(() => {
    if (!order) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [order, onClose])

  if (!order) return null

  const items = parseItems(order.items)
  const isRedeemed = !!order.redeemed_at

  async function toggleRedeem() {
    if (!order) return
    setSaving(true)
    setError('')
    const res = await fetch(`/api/admin/orders/${order.id}/redeem`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        action:     isRedeemed ? 'unredeem' : 'redeem',
        redeemedBy: staffName || undefined,
        notes:      notes || null,
      }),
    })
    setSaving(false)
    if (!res.ok) {
      setError('Could not update redemption')
      return
    }
    const { redemption } = await res.json()
    onUpdated({
      ...order,
      redeemed_at: redemption.redeemed_at,
      redeemed_by: redemption.redeemed_by,
      notes:       redemption.notes,
    })
  }

  async function saveNotes() {
    if (!order) return
    setSaving(true)
    setError('')
    const res = await fetch(`/api/admin/orders/${order.id}/redeem`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ notes: notes || null }),
    })
    setSaving(false)
    if (!res.ok) {
      setError('Could not save notes')
      return
    }
    const { redemption } = await res.json()
    onUpdated({
      ...order,
      redeemed_at: redemption.redeemed_at,
      redeemed_by: redemption.redeemed_by,
      notes:       redemption.notes,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        aria-label="Close"
        onClick={onClose}
        className="flex-1 bg-dark/30 backdrop-blur-sm animate-fade-in"
      />

      <aside className="w-full max-w-xl bg-cream border-l border-cream-200 overflow-y-auto shadow-luxury-lg animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white/90 backdrop-blur border-b border-cream-200 px-6 py-4">
          <div>
            <p className="text-2xs font-medium tracking-widest uppercase text-dark-50/40">Order Detail</p>
            {order.order_number ? (
              <>
                <p className="font-display text-lg text-dark-50 mt-0.5 leading-tight">{order.order_number}</p>
                <p className="font-mono text-2xs text-dark-50/40 mt-0.5">{order.id}</p>
              </>
            ) : (
              <p className="font-mono text-xs text-dark-50/70 mt-0.5">{order.id}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="size-9 flex items-center justify-center rounded-xl text-dark-50/40 hover:text-dark-50 hover:bg-cream-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status strip */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
            isRedeemed
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
              : 'bg-gold-50 border-gold-100 text-gold-600'
          }`}>
            {isRedeemed ? <CheckCircle2 size={16} /> : <Clock size={16} />}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {isRedeemed ? 'Redeemed' : 'Awaiting redemption'}
              </p>
              {isRedeemed && order.redeemed_at && (
                <p className="text-xs opacity-80 mt-0.5">
                  {fmtDateTime(order.redeemed_at)}
                  {order.redeemed_by && ` · by ${order.redeemed_by}`}
                </p>
              )}
            </div>
          </div>

          {/* Amount + date */}
          <div className="bg-white border border-cream-200 rounded-2xl p-5 shadow-luxury">
            <p className="text-2xs font-medium tracking-widest uppercase text-dark-50/40 mb-2">Total Paid</p>
            <p className="font-display text-4xl font-light text-dark-50 leading-none">{fmt(order.amount)}</p>
            <p className="text-xs text-dark-50/50 mt-3">{fmtDateTime(order.created)}</p>
          </div>

          {/* Customer */}
          <div>
            <p className="text-2xs font-medium tracking-widest uppercase text-dark-50/40 mb-3">Customer</p>
            <div className="bg-white border border-cream-200 rounded-2xl p-5 shadow-luxury space-y-3">
              {order.customer_name && (
                <div className="flex items-center gap-3">
                  <User size={14} className="text-dark-50/30 flex-shrink-0" />
                  <p className="text-sm text-dark-50">{order.customer_name}</p>
                </div>
              )}
              {order.customer_email && (
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-dark-50/30 flex-shrink-0" />
                  <a href={`mailto:${order.customer_email}`} className="text-sm text-mauve-600 hover:underline truncate">
                    {order.customer_email}
                  </a>
                </div>
              )}
              {order.customer_phone && (
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-dark-50/30 flex-shrink-0" />
                  <a href={`tel:${order.customer_phone}`} className="text-sm text-mauve-600 hover:underline">
                    {order.customer_phone}
                  </a>
                </div>
              )}
              {!order.customer_name && !order.customer_email && !order.customer_phone && (
                <p className="text-sm text-dark-50/40 italic">No customer details captured</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-2xs font-medium tracking-widest uppercase text-dark-50/40 mb-3">Items</p>
            <div className="bg-white border border-cream-200 rounded-2xl overflow-hidden shadow-luxury">
              {items.length === 0 ? (
                <p className="px-5 py-4 text-sm text-dark-50/40 italic">No line items recorded</p>
              ) : (
                items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-cream-100 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <Receipt size={13} className="text-dark-50/30 flex-shrink-0" />
                      <p className="text-sm text-dark-50 truncate">
                        {it.name}{it.qty > 1 && <span className="text-dark-50/50"> × {it.qty}</span>}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-dark-50 flex-shrink-0">{it.price}</p>
                  </div>
                ))
              )}
              {order.promo_code && (
                <div className="flex items-center justify-between px-5 py-3 bg-mauve-50/50">
                  <div className="flex items-center gap-2">
                    <Tag size={13} className="text-mauve-600" />
                    <p className="text-sm text-mauve-700 font-mono tracking-widest">{order.promo_code}</p>
                  </div>
                  {order.discount && <p className="text-sm text-mauve-700">−{order.discount}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Redemption controls */}
          <div>
            <p className="text-2xs font-medium tracking-widest uppercase text-dark-50/40 mb-3">Redemption</p>
            <div className="bg-white border border-cream-200 rounded-2xl p-5 shadow-luxury space-y-4">
              {!isRedeemed && (
                <div>
                  <label className="block text-xs font-medium text-dark-50/60 mb-1.5">Staff member (optional)</label>
                  <input
                    type="text"
                    value={staffName}
                    onChange={e => setStaffName(e.target.value)}
                    placeholder="e.g. Ana"
                    className="w-full h-10 px-3 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-dark-50/60 mb-1.5">
                  <StickyNote size={12} />
                  Internal notes
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any details to track about this order…"
                  className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all resize-none"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={toggleRedeem}
                  disabled={saving}
                  className={`flex items-center justify-center gap-2 flex-1 h-11 rounded-xl text-xs font-semibold tracking-widest uppercase transition-colors disabled:opacity-50 ${
                    isRedeemed
                      ? 'bg-cream-100 border border-cream-200 text-dark-50 hover:bg-cream-200'
                      : 'bg-mauve hover:bg-mauve-600 text-white shadow-luxury'
                  }`}
                >
                  {saving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isRedeemed ? (
                    <>Mark as pending</>
                  ) : (
                    <><CheckCircle2 size={14} /> Mark as redeemed</>
                  )}
                </button>
                {isRedeemed && (
                  <button
                    onClick={saveNotes}
                    disabled={saving}
                    className="h-11 px-4 rounded-xl text-xs font-semibold tracking-widest uppercase border border-cream-200 text-dark-50 hover:bg-cream-100 transition-colors disabled:opacity-50"
                  >
                    Save notes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
