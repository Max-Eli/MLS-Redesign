'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, Pencil, X, Check, Sparkles } from 'lucide-react'
import type { Promotion } from '@/lib/promotions'

const EMPTY = {
  title: '', description: '', services: '',
  original_price: '', promo_price: '', badge: '',
  image_url: '', product_slug: '', starts_at: '', ends_at: '', sort_order: '0',
}

function fmt(n: number | null) {
  if (!n) return null
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
}

function fmtDate(s: string | null) {
  if (!s) return null
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminPromotionsPage() {
  const [promos, setPromos]     = useState<Promotion[]>([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<Promotion | null>(null)
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  async function load() {
    setLoading(true)
    const res  = await fetch('/api/admin/promotions')
    const data = await res.json()
    setPromos(data.promotions ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setError('')
    setShowForm(true)
  }

  function openEdit(p: Promotion) {
    setEditing(p)
    setForm({
      title:          p.title,
      description:    p.description    ?? '',
      services:       p.services       ?? '',
      original_price: p.original_price != null ? String(p.original_price) : '',
      promo_price:    p.promo_price    != null ? String(p.promo_price)    : '',
      badge:          p.badge          ?? '',
      image_url:      p.image_url      ?? '',
      product_slug:   p.product_slug   ?? '',
      starts_at:      p.starts_at      ? p.starts_at.slice(0, 10) : '',
      ends_at:        p.ends_at        ? p.ends_at.slice(0, 10)   : '',
      sort_order:     String(p.sort_order),
    })
    setError('')
    setShowForm(true)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    setError('')
    setSaving(true)

    const body = {
      title:          form.title.trim(),
      description:    form.description.trim()    || null,
      services:       form.services.trim()       || null,
      original_price: form.original_price        ? Number(form.original_price) : null,
      promo_price:    form.promo_price            ? Number(form.promo_price)    : null,
      badge:          form.badge.trim()           || null,
      image_url:      form.image_url.trim()       || null,
      product_slug:   form.product_slug.trim()    || null,
      starts_at:      form.starts_at              || null,
      ends_at:        form.ends_at                || null,
      sort_order:     Number(form.sort_order)     || 0,
    }

    const url    = editing ? `/api/admin/promotions/${editing.id}` : '/api/admin/promotions'
    const method = editing ? 'PATCH' : 'POST'
    const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

    setSaving(false)
    if (res.ok) {
      setShowForm(false)
      setEditing(null)
      load()
    } else {
      const d = await res.json()
      setError(d.error ?? 'Failed to save')
    }
  }

  async function toggleActive(p: Promotion) {
    await fetch(`/api/admin/promotions/${p.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !p.active }),
    })
    load()
  }

  async function del(id: number) {
    if (!confirm('Delete this promotion?')) return
    await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' })
    load()
  }

  const field = (key: keyof typeof EMPTY, label: string, opts?: { type?: string; placeholder?: string; span?: boolean }) => (
    <div className={opts?.span ? 'md:col-span-2' : ''}>
      <label className="block text-2xs tracking-widest uppercase text-dark-50/40 mb-1.5">{label}</label>
      {key === 'description' || key === 'services' ? (
        <textarea
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={opts?.placeholder}
          rows={2}
          className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 resize-none transition-all"
        />
      ) : (
        <input
          type={opts?.type ?? 'text'}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={opts?.placeholder}
          className="w-full h-10 px-3 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
        />
      )}
    </div>
  )

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <p className="eyebrow mb-2">Marketing</p>
          <h1 className="font-display text-4xl font-light text-dark-50 mb-1">Promotions</h1>
          <p className="text-sm text-dark-50/50">
            {promos.filter(p => p.active).length} active · {promos.length} total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-mauve hover:bg-mauve-600 text-white text-xs font-semibold tracking-widest uppercase px-4 py-2.5 rounded-xl shadow-luxury transition-colors"
        >
          <Plus size={14} />
          New Promotion
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-cream-200 rounded-2xl shadow-luxury p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-medium text-dark-50">{editing ? 'Edit Promotion' : 'New Promotion'}</h2>
            <button onClick={() => setShowForm(false)} className="text-dark-50/30 hover:text-dark-50 transition-colors">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('title',          'Title *',            { placeholder: 'Summer Glow Package' })}
              {field('badge',          'Badge',              { placeholder: 'Limited Time, Best Value…' })}
              {field('description',    'Description',        { span: true,  placeholder: 'What makes this promotion special…' })}
              {field('services',       'Services Included',  { span: true,  placeholder: 'HydraFacial + Laser Genesis + LED Therapy' })}
              {field('original_price', 'Original Price ($)', { type: 'number', placeholder: '750' })}
              {field('promo_price',    'Promo Price ($)',    { type: 'number', placeholder: '499' })}
              {field('image_url',      'Image URL',          { span: true, placeholder: '/facialtreaments.png or https://…' })}
              {field('product_slug',   'Link to Service (optional)', { span: true, placeholder: 'mothers-day-botox-per-unit — makes the card "Shop Now"' })}
              {field('starts_at',      'Start Date',         { type: 'date' })}
              {field('ends_at',        'End Date',           { type: 'date' })}
              {field('sort_order',     'Sort Order',         { type: 'number', placeholder: '0' })}
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-mauve hover:bg-mauve-600 text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-xl shadow-luxury transition-colors disabled:opacity-50"
              >
                <Check size={13} />
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Promotion'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-dark-50/50 hover:text-dark-50 transition-colors px-3">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="size-6 border-2 border-cream-200 border-t-mauve rounded-full animate-spin" />
        </div>
      ) : promos.length === 0 ? (
        <div className="bg-white border border-cream-200 rounded-2xl shadow-luxury text-center py-20">
          <Sparkles size={22} className="mx-auto text-dark-50/20 mb-3" />
          <p className="text-sm text-dark-50/40">No promotions yet — create your first one above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promos.map(p => (
            <div
              key={p.id}
              className={`bg-white border rounded-2xl shadow-luxury p-5 transition-all ${p.active ? 'border-cream-200' : 'border-cream-200 opacity-60'}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-medium text-dark-50">{p.title}</h3>
                    {p.badge && (
                      <span className="text-2xs bg-mauve-50 text-mauve-700 px-2 py-0.5 rounded-full font-medium">{p.badge}</span>
                    )}
                  </div>
                  {p.description && <p className="text-xs text-dark-50/50 leading-relaxed line-clamp-2">{p.description}</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(p)} className="size-8 flex items-center justify-center text-dark-50/30 hover:text-dark-50 transition-colors rounded-lg hover:bg-cream-100">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => toggleActive(p)} className="size-8 flex items-center justify-center transition-colors rounded-lg hover:bg-cream-100" aria-label={p.active ? 'Disable' : 'Enable'}>
                    {p.active ? <ToggleRight size={20} className="text-mauve" /> : <ToggleLeft size={20} className="text-dark-50/20" />}
                  </button>
                  <button onClick={() => del(p.id)} className="size-8 flex items-center justify-center text-dark-50/30 hover:text-red-500 hover:bg-red-50 transition-colors rounded-lg">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {p.services && (
                <p className="text-xs text-dark-50/60 mb-3 leading-relaxed">
                  <span className="text-dark-50/30 mr-1">Includes:</span>{p.services}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-cream-100">
                <div className="flex items-baseline gap-2">
                  {p.promo_price != null ? (
                    <>
                      <span className="font-display text-xl font-light text-dark-50">{fmt(p.promo_price)}</span>
                      {p.original_price != null && (
                        <span className="text-sm text-dark-50/30 line-through">{fmt(p.original_price)}</span>
                      )}
                      {p.original_price != null && p.promo_price != null && (
                        <span className="text-2xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Save {fmt(p.original_price - p.promo_price)}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-dark-50/40 italic">Call for pricing</span>
                  )}
                </div>
                <div className="text-right">
                  {(p.starts_at || p.ends_at) && (
                    <p className="text-2xs text-dark-50/40">
                      {p.starts_at && `From ${fmtDate(p.starts_at)}`}
                      {p.starts_at && p.ends_at && ' · '}
                      {p.ends_at && `Until ${fmtDate(p.ends_at)}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
