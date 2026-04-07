'use client'

import { useEffect, useState, useCallback } from 'react'
import { DollarSign, Mail, Tag, ChevronRight } from 'lucide-react'

interface Order {
  id:             string
  amount:         number
  currency:       string
  created:        number
  customer_email: string | null
  customer_name:  string | null
  items:          string | null
  promo_code:     string | null
  discount:       string | null
}

function fmt(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(cents / 100)
}

function fmtDate(unix: number) {
  return new Date(unix * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminOrdersPage() {
  const [orders, setOrders]     = useState<Order[]>([])
  const [loading, setLoading]   = useState(true)
  const [hasMore, setHasMore]   = useState(false)
  const [cursor, setCursor]     = useState<string | undefined>()

  const load = useCallback(async (cur?: string) => {
    setLoading(true)
    const url = '/api/admin/orders' + (cur ? `?cursor=${cur}` : '')
    const res  = await fetch(url)
    const data = await res.json()
    setOrders(prev => cur ? [...prev, ...data.orders] : data.orders)
    setHasMore(data.hasMore)
    setCursor(data.nextCursor)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-white mb-1">Orders</h1>
        <p className="text-sm text-white/30">{orders.length} paid orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: fmt(totalRevenue), icon: DollarSign },
          { label: 'Total Orders',  value: orders.length.toString(), icon: ChevronRight },
          { label: 'Promo Uses',    value: orders.filter(o => o.promo_code).length.toString(), icon: Tag },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white/5 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={14} className="text-mauve" />
              <p className="text-xs text-white/40 tracking-wide uppercase">{label}</p>
            </div>
            <p className="text-2xl font-light text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_2fr_auto] gap-4 px-5 py-3 border-b border-white/8 text-2xs font-medium tracking-widest uppercase text-white/30">
          <span>Date</span>
          <span>Amount</span>
          <span>Customer / Items</span>
          <span>Promo</span>
        </div>

        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <span className="size-5 border-2 border-white/10 border-t-mauve rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-sm text-white/30">No orders yet</div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
              <div>
                <p className="text-sm text-white">{fmtDate(order.created)}</p>
                <p className="text-2xs text-white/20 font-mono mt-0.5">{order.id.slice(-8)}</p>
              </div>
              <p className="text-sm font-medium text-white self-center">{fmt(order.amount)}</p>
              <div className="min-w-0">
                {(order.customer_name || order.customer_email) && (
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Mail size={11} className="text-white/20 flex-shrink-0" />
                    <p className="text-sm text-white/70 truncate">{order.customer_name || order.customer_email}</p>
                  </div>
                )}
                {order.items && (
                  <p className="text-xs text-white/30 truncate">{order.items}</p>
                )}
              </div>
              <div className="self-center">
                {order.promo_code ? (
                  <span className="inline-flex items-center gap-1 bg-mauve/15 text-mauve text-2xs font-medium px-2 py-1 rounded-full">
                    <Tag size={9} />
                    {order.promo_code}
                  </span>
                ) : <span />}
              </div>
            </div>
          ))
        )}
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => load(cursor)}
            disabled={loading}
            className="text-sm text-white/40 hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  )
}
