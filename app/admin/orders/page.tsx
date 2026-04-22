'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { DollarSign, ShoppingBag, Clock, CheckCircle2, Search, Tag, Mail } from 'lucide-react'
import { StatCard } from '@/components/admin/StatCard'
import { OrderDetailDrawer, type AdminOrder } from '@/components/admin/OrderDetailDrawer'

type Filter = 'all' | 'pending' | 'redeemed'

function fmt(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(cents / 100)
}

function fmtDate(unix: number) {
  return new Date(unix * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminOrdersPage() {
  const [orders, setOrders]   = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [cursor, setCursor]   = useState<string | undefined>()
  const [filter, setFilter]   = useState<Filter>('all')
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState<AdminOrder | null>(null)

  const load = useCallback(async (cur?: string) => {
    setLoading(true)
    const url = '/api/admin/orders' + (cur ? `?cursor=${cur}` : '')
    const res  = await fetch(url)
    const data = await res.json()
    setOrders(prev => cur ? [...prev, ...(data.orders ?? [])] : (data.orders ?? []))
    setHasMore(!!data.hasMore)
    setCursor(data.nextCursor)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter(o => {
      if (filter === 'pending'  && o.redeemed_at)  return false
      if (filter === 'redeemed' && !o.redeemed_at) return false
      if (!q) return true
      return (
        o.customer_name?.toLowerCase().includes(q)  ||
        o.customer_email?.toLowerCase().includes(q) ||
        o.items?.toLowerCase().includes(q)          ||
        o.promo_code?.toLowerCase().includes(q)     ||
        o.id.toLowerCase().includes(q)
      )
    })
  }, [orders, filter, search])

  const stats = useMemo(() => {
    const pending   = orders.filter(o => !o.redeemed_at)
    const redeemed  = orders.filter(o => !!o.redeemed_at)
    const revenue   = orders.reduce((sum, o) => sum + o.amount, 0)
    const thisMonth = (() => {
      const now   = new Date()
      const month = now.getMonth()
      const year  = now.getFullYear()
      return redeemed.filter(o => {
        const d = new Date((o.redeemed_at ?? '') as string)
        return d.getMonth() === month && d.getFullYear() === year
      }).length
    })()
    return { pending: pending.length, redeemed: redeemed.length, revenue, thisMonth, total: orders.length }
  }, [orders])

  function handleUpdate(updated: AdminOrder) {
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
    setSelected(updated)
  }

  const filters: { value: Filter; label: string; count: number }[] = [
    { value: 'all',      label: 'All',      count: stats.total    },
    { value: 'pending',  label: 'Pending',  count: stats.pending  },
    { value: 'redeemed', label: 'Redeemed', count: stats.redeemed },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="mb-8">
        <p className="eyebrow mb-2">Dashboard</p>
        <h1 className="font-display text-4xl font-light text-dark-50 mb-1">Orders</h1>
        <p className="text-sm text-dark-50/50">Track payments and manage redemptions from a single place.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue"     value={fmt(stats.revenue)}          icon={DollarSign}    tint="mauve" />
        <StatCard label="Total Orders"      value={stats.total.toString()}      icon={ShoppingBag}   tint="slate" />
        <StatCard label="Pending Redemption" value={stats.pending.toString()}   icon={Clock}         tint="gold" hint="Awaiting customer visit" />
        <StatCard label="Redeemed / Month"   value={stats.thisMonth.toString()} icon={CheckCircle2}  tint="emerald" hint="Services delivered in current month" />
      </div>

      {/* Controls */}
      <div className="bg-white border border-cream-200 rounded-2xl shadow-luxury p-4 mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-50/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, item, promo, ID…"
            className="w-full h-10 pl-10 pr-3 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-cream-100 rounded-xl p-1">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.value
                  ? 'bg-white text-dark-50 shadow-sm'
                  : 'text-dark-50/50 hover:text-dark-50'
              }`}
            >
              {f.label}
              <span className={`text-2xs ${filter === f.value ? 'text-mauve-600' : 'text-dark-50/30'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-cream-200 rounded-2xl overflow-hidden shadow-luxury">
        <div className="hidden md:grid grid-cols-[1fr_1fr_2fr_auto_auto] gap-4 px-5 py-3 border-b border-cream-200 bg-cream-50 text-2xs font-medium tracking-widest uppercase text-dark-50/40">
          <span>Date</span>
          <span>Amount</span>
          <span>Customer / Items</span>
          <span>Promo</span>
          <span>Status</span>
        </div>

        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <span className="size-6 border-2 border-cream-200 border-t-mauve rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-sm text-dark-50/40">
            {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
          </div>
        ) : (
          filtered.map(order => {
            const isRedeemed = !!order.redeemed_at
            return (
              <button
                key={order.id}
                onClick={() => setSelected(order)}
                className="w-full text-left grid grid-cols-[1fr_auto] md:grid-cols-[1fr_1fr_2fr_auto_auto] gap-4 px-5 py-4 border-b border-cream-100 last:border-0 hover:bg-cream-50 transition-colors items-center"
              >
                <div>
                  <p className="text-sm font-medium text-dark-50">{fmtDate(order.created)}</p>
                  <p className="text-2xs text-dark-50/30 font-mono mt-0.5">{order.id.slice(-10)}</p>
                </div>

                <p className="hidden md:block text-sm font-medium text-dark-50">{fmt(order.amount)}</p>

                <div className="hidden md:block min-w-0">
                  {(order.customer_name || order.customer_email) && (
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Mail size={11} className="text-dark-50/30 flex-shrink-0" />
                      <p className="text-sm text-dark-50/80 truncate">{order.customer_name || order.customer_email}</p>
                    </div>
                  )}
                  {order.items && (
                    <p className="text-xs text-dark-50/40 truncate">{order.items}</p>
                  )}
                </div>

                <div className="hidden md:block">
                  {order.promo_code ? (
                    <span className="inline-flex items-center gap-1 bg-mauve-50 text-mauve-700 text-2xs font-medium px-2 py-1 rounded-full">
                      <Tag size={9} />
                      {order.promo_code}
                    </span>
                  ) : <span className="text-dark-50/20 text-xs">—</span>}
                </div>

                <div>
                  {isRedeemed ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-2xs font-medium px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={10} />
                      Redeemed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-gold-50 text-gold-600 text-2xs font-medium px-2.5 py-1 rounded-full">
                      <Clock size={10} />
                      Pending
                    </span>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => load(cursor)}
            disabled={loading}
            className="text-xs font-semibold tracking-widest uppercase text-mauve-600 hover:text-mauve-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Load more orders'}
          </button>
        </div>
      )}

      <OrderDetailDrawer
        order={selected}
        onClose={() => setSelected(null)}
        onUpdated={handleUpdate}
      />
    </div>
  )
}
