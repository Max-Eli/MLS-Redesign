'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, Pencil, X, Check } from 'lucide-react'
import type { Promotion } from '@/lib/promotions'

const EMPTY = {
  title: '', description: '', services: '',
  original_price: '', promo_price: '', badge: '',
  image_url: '', starts_at: '', ends_at: '', sort_order: '0',
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
    <div className={opts?.span ? 'col-span-2' : ''}>
      <label className="block text-2xs tracking-widest uppercase text-white/30 mb-1.5">{label}</label>
      {key === 'description' || key === 'services' ? (
        <textarea
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={opts?.placeholder}
          rows={2}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-mauve/50 resize-none"
        />
      ) : (
        <input
          type={opts?.type ?? 'text'}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={opts?.placeholder}
          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-mauve/50"
        />
      )}
    </div>
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white mb-1">Promotions</h1>
          <p className="text-sm text-white/30">{promos.filter(p => p.active).length} active · {promos.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-mauve hover:bg-mauve-600 text-white text-xs font-semibold tracking-widest uppercase px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={14} />
          New Promotion
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/5 border border-white/8 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-medium text-white">{editing ? 'Edit Promotion' : 'New Promotion'}</h2>
            <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white transition-colors"><X size={16} /></button>
          </div>

          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {field('title',          'Title *',            { span: false, placeholder: 'Summer Glow Package' })}
              {field('badge',          'Badge',              { placeholder: 'Limited Time, Best Value…' })}
              {field('description',    'Description',        { span: true,  placeholder: 'What makes this promotion special…' })}
              {field('services',       'Services Included',  { span: true,  placeholder: 'HydraFacial + Laser Genesis + LED Therapy' })}
              {field('original_price', 'Original Price ($)', { type: 'number', placeholder: '750' })}
              {field('promo_price',    'Promo Price ($)',    { type: 'number', placeholder: '499' })}
              {field('image_url',      'Image URL',          { span: true, placeholder: '/facialtreaments.png or https://…' })}
              {field('starts_at',      'Start Date',         { type: 'date' })}
              {field('ends_at',        'End Date',           { type: 'date' })}
              {field('sort_order',     'Sort Order',         { type: 'number', placeholder: '0' })}
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-mauve hover:bg-mauve-600 text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                <Check size={13} />
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Promotion'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-sm text-white/30 hover:text-white transition-colors px-3">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="size-5 border-2 border-white/10 border-t-mauve rounded-full animate-spin" />
        </div>
      ) : promos.length === 0 ? (
        <div className="text-center py-20 text-sm text-white/30">No promotions yet — create your first one above</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promos.map(p => (
            <div key={p.id} className={`bg-white/5 border rounded-2xl p-5 transition-colors ${p.active ? 'border-white/10' : 'border-white/5 opacity-50'}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-medium text-white">{p.title}</h3>
                    {p.badge && (
                      <span className="text-2xs bg-mauve/20 text-mauve px-2 py-0.5 rounded-full">{p.badge}</span>
                    )}
                  </div>
                  {p.description && <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{p.description}</p>}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(p)} className="size-7 flex items-center justify-center text-white/25 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => toggleActive(p)} className="size-7 flex items-center justify-center transition-colors rounded-lg hover:bg-white/5">
                    {p.active ? <ToggleRight size={18} className="text-mauve" /> : <ToggleLeft size={18} className="text-white/20" />}
                  </button>
                  <button onClick={() => del(p.id)} className="size-7 flex items-center justify-center text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {p.services && (
                <p className="text-xs text-white/50 mb-3 leading-relaxed">
                  <span className="text-white/25 mr-1">Includes:</span>{p.services}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  {p.promo_price != null ? (
                    <>
                      <span className="text-lg font-light text-white">{fmt(p.promo_price)}</span>
                      {p.original_price != null && (
                        <span className="text-sm text-white/25 line-through">{fmt(p.original_price)}</span>
                      )}
                      {p.original_price != null && p.promo_price != null && (
                        <span className="text-xs text-green-400">Save {fmt(p.original_price - p.promo_price)}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-white/30 italic">Call for pricing</span>
                  )}
                </div>
                <div className="text-right">
                  {(p.starts_at || p.ends_at) && (
                    <p className="text-2xs text-white/25">
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
