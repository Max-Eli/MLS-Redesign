'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag, X } from 'lucide-react'

interface Promo {
  id:             number
  code:           string
  discount_cents: number
  label:          string
  active:         boolean
  uses:           number
  created_at:     string
}

function fmt(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(cents / 100)
}

export default function AdminPromosPage() {
  const [promos, setPromos]     = useState<Promo[]>([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [form, setForm]         = useState({ code: '', discount: '', label: '' })
  const [error, setError]       = useState('')

  async function load() {
    setLoading(true)
    const res  = await fetch('/api/admin/promos')
    const data = await res.json()
    setPromos(data.promos ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function createPromo(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const discountCents = Math.round(parseFloat(form.discount) * 100)
    if (!form.code || isNaN(discountCents) || discountCents <= 0 || !form.label) {
      setError('All fields are required and discount must be a valid number')
      return
    }
    setSaving(true)
    const res = await fetch('/api/admin/promos', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ code: form.code, discount_cents: discountCents, label: form.label }),
    })
    setSaving(false)
    if (res.ok) {
      setForm({ code: '', discount: '', label: '' })
      setShowForm(false)
      load()
    } else {
      const d = await res.json()
      setError(d.error ?? 'Failed to create')
    }
  }

  async function toggleActive(promo: Promo) {
    await fetch(`/api/admin/promos/${promo.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ active: !promo.active }),
    })
    load()
  }

  async function deletePromo(id: number) {
    if (!confirm('Delete this promo code?')) return
    await fetch(`/api/admin/promos/${id}`, { method: 'DELETE' })
    load()
  }

  const activeCount = promos.filter(p => p.active).length

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <p className="eyebrow mb-2">Marketing</p>
          <h1 className="font-display text-4xl font-light text-dark-50 mb-1">Promo Codes</h1>
          <p className="text-sm text-dark-50/50">
            {activeCount} active · {promos.length} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-mauve hover:bg-mauve-600 text-white text-xs font-semibold tracking-widest uppercase px-4 py-2.5 rounded-xl shadow-luxury transition-colors"
        >
          <Plus size={14} />
          New Code
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white border border-cream-200 rounded-2xl shadow-luxury p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-medium text-dark-50">Create Promo Code</h2>
            <button onClick={() => setShowForm(false)} className="text-dark-50/30 hover:text-dark-50 transition-colors">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={createPromo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-2xs tracking-widest uppercase text-dark-50/40 mb-1.5">Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="SUMMER25"
                  className="w-full h-10 px-3 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 font-mono tracking-widest transition-all"
                />
              </div>
              <div>
                <label className="block text-2xs tracking-widest uppercase text-dark-50/40 mb-1.5">Discount ($)</label>
                <input
                  type="number"
                  value={form.discount}
                  onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
                  placeholder="50"
                  min="1"
                  step="0.01"
                  className="w-full h-10 px-3 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-2xs tracking-widest uppercase text-dark-50/40 mb-1.5">Label</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="$50 off your first treatment"
                  className="w-full h-10 px-3 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
                />
              </div>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="bg-mauve hover:bg-mauve-600 text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-xl shadow-luxury transition-colors disabled:opacity-50"
              >
                {saving ? 'Creating…' : 'Create Code'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-dark-50/50 hover:text-dark-50 transition-colors px-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-cream-200 rounded-2xl overflow-hidden shadow-luxury">
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_2fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-cream-200 bg-cream-50 text-2xs font-medium tracking-widest uppercase text-dark-50/40">
          <span>Code</span>
          <span>Discount</span>
          <span>Label</span>
          <span>Uses</span>
          <span>Status</span>
          <span></span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="size-6 border-2 border-cream-200 border-t-mauve rounded-full animate-spin" />
          </div>
        ) : promos.length === 0 ? (
          <div className="text-center py-20">
            <Tag size={22} className="mx-auto text-dark-50/20 mb-3" />
            <p className="text-sm text-dark-50/40">No promo codes yet — create your first one above</p>
          </div>
        ) : (
          promos.map(promo => (
            <div
              key={promo.id}
              className={`grid grid-cols-[1.5fr_1fr_2fr_auto_auto_auto] gap-4 px-5 py-4 border-b border-cream-100 last:border-0 items-center hover:bg-cream-50 transition-colors ${promo.active ? '' : 'opacity-60'}`}
            >
              <p className="text-sm font-mono font-medium text-dark-50 tracking-widest">{promo.code}</p>
              <p className="text-sm text-dark-50 font-medium">{fmt(promo.discount_cents)}</p>
              <p className="text-sm text-dark-50/60 truncate">{promo.label}</p>
              <p className="text-sm text-dark-50/50 text-center min-w-8">{promo.uses}</p>
              <button onClick={() => toggleActive(promo)} className="flex items-center justify-center" aria-label={promo.active ? 'Disable' : 'Enable'}>
                {promo.active
                  ? <ToggleRight size={24} className="text-mauve" />
                  : <ToggleLeft  size={24} className="text-dark-50/20" />
                }
              </button>
              <button
                onClick={() => deletePromo(promo.id)}
                className="size-8 flex items-center justify-center rounded-lg text-dark-50/30 hover:text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
