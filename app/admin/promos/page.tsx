'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

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
  const [promos, setPromos]   = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({ code: '', discount: '', label: '' })
  const [error, setError]     = useState('')

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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white mb-1">Promo Codes</h1>
          <p className="text-sm text-white/30">{promos.length} codes</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-mauve hover:bg-mauve-600 text-white text-xs font-semibold tracking-widest uppercase px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={14} />
          New Code
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={createPromo} className="bg-white/5 border border-white/8 rounded-2xl p-6 mb-6 space-y-4">
          <h2 className="text-sm font-medium text-white mb-2">Create Promo Code</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-2xs tracking-widest uppercase text-white/30 mb-1.5">Code</label>
              <input
                type="text"
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="SUMMER25"
                className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-mauve/50 font-mono tracking-widest"
              />
            </div>
            <div>
              <label className="block text-2xs tracking-widest uppercase text-white/30 mb-1.5">Discount ($)</label>
              <input
                type="number"
                value={form.discount}
                onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
                placeholder="50"
                min="1"
                step="0.01"
                className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-mauve/50"
              />
            </div>
            <div>
              <label className="block text-2xs tracking-widest uppercase text-white/30 mb-1.5">Label</label>
              <input
                type="text"
                value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                placeholder="$50 off your first treatment"
                className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-mauve/50"
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-mauve hover:bg-mauve-600 text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? 'Creating…' : 'Create Code'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-white/30 hover:text-white transition-colors px-3"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.5fr_1fr_2fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/8 text-2xs font-medium tracking-widest uppercase text-white/30">
          <span>Code</span>
          <span>Discount</span>
          <span>Label</span>
          <span>Uses</span>
          <span>Status</span>
          <span></span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="size-5 border-2 border-white/10 border-t-mauve rounded-full animate-spin" />
          </div>
        ) : promos.length === 0 ? (
          <div className="text-center py-16 text-sm text-white/30">No promo codes yet</div>
        ) : (
          promos.map(promo => (
            <div key={promo.id} className="grid grid-cols-[1.5fr_1fr_2fr_auto_auto_auto] gap-4 px-5 py-4 border-b border-white/5 last:border-0 items-center hover:bg-white/3 transition-colors">
              <p className="text-sm font-mono font-medium text-white tracking-widest">{promo.code}</p>
              <p className="text-sm text-white">{fmt(promo.discount_cents)}</p>
              <p className="text-sm text-white/50 truncate">{promo.label}</p>
              <p className="text-sm text-white/40 text-center">{promo.uses}</p>
              <button onClick={() => toggleActive(promo)} className="flex items-center justify-center">
                {promo.active
                  ? <ToggleRight size={22} className="text-mauve" />
                  : <ToggleLeft  size={22} className="text-white/20" />
                }
              </button>
              <button
                onClick={() => deletePromo(promo.id)}
                className="flex items-center justify-center text-white/20 hover:text-red-400 transition-colors"
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
