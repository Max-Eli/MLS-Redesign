'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { CalendarHeart, Users, Search, Download, Phone, Mail } from 'lucide-react'
import { StatCard } from '@/components/admin/StatCard'

type Rsvp = {
  id:                    number
  event_slug:            string
  full_name:             string
  email:                 string
  phone:                 string
  attending:             boolean
  num_guests:            number
  dietary_restrictions:  string | null
  notes:                 string | null
  created_at:            string
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function AdminRsvpsPage() {
  const [rsvps, setRsvps]     = useState<Rsvp[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/rsvps')
    const data = await res.json()
    setRsvps(data.rsvps ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rsvps
    return rsvps.filter(r =>
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q)     ||
      r.phone.toLowerCase().includes(q)     ||
      (r.notes ?? '').toLowerCase().includes(q)
    )
  }, [rsvps, search])

  const stats = useMemo(() => {
    const attending   = rsvps.filter(r => r.attending)
    const totalGuests = attending.reduce((sum, r) => sum + r.num_guests, 0)
    return {
      rsvps:  rsvps.length,
      guests: totalGuests,
    }
  }, [rsvps])

  function exportCsv() {
    const header = ['Name', 'Email', 'Phone', 'Guests', 'Notes', 'RSVP Date']
    const rows = filtered.map(r => [
      r.full_name,
      r.email,
      r.phone,
      r.num_guests,
      r.notes ?? '',
      new Date(r.created_at).toLocaleString('en-US'),
    ])
    const csv = [header, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `anniversary-rsvps-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="mb-8">
        <p className="eyebrow mb-2">Event Registrations</p>
        <h1 className="font-display text-4xl font-light text-dark-50 mb-1">4 Year Anniversary RSVPs</h1>
        <p className="text-sm text-dark-50/50">Friday, August 7 · 6–10 PM · Manhattan Laser Spa</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard label="Total RSVPs"  value={stats.rsvps.toString()}  icon={CalendarHeart} tint="mauve" />
        <StatCard label="Total Guests" value={stats.guests.toString()} icon={Users}         tint="slate" hint="Includes plus-ones" />
      </div>

      {/* Controls */}
      <div className="bg-white border border-cream-200 rounded-2xl shadow-luxury p-4 mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-50/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, phone, notes…"
            className="w-full h-10 pl-10 pr-3 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
          />
        </div>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-dark-50 hover:bg-dark text-white text-xs font-semibold tracking-widest uppercase transition-colors disabled:opacity-40"
        >
          <Download size={13} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-cream-200 rounded-2xl overflow-hidden shadow-luxury">
        <div className="hidden md:grid grid-cols-[1fr_1.4fr_auto_1.3fr] gap-4 px-5 py-3 border-b border-cream-200 bg-cream-50 text-2xs font-medium tracking-widest uppercase text-dark-50/40">
          <span>Guest</span>
          <span>Contact</span>
          <span className="text-center">Party</span>
          <span>Note</span>
        </div>

        {loading && rsvps.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <span className="size-6 border-2 border-cream-200 border-t-mauve rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-sm text-dark-50/40">
            {rsvps.length === 0
              ? 'No RSVPs yet. Share the link and check back once guests start replying.'
              : 'No RSVPs match your search.'}
          </div>
        ) : (
          filtered.map(r => (
            <div
              key={r.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr_auto_1.3fr] gap-4 px-5 py-4 border-b border-cream-100 last:border-0 hover:bg-cream-50 transition-colors items-start"
            >
              {/* Guest */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark-50 truncate">{r.full_name}</p>
                <p className="text-2xs text-dark-50/40 mt-0.5">
                  RSVP&apos;d {fmtDate(r.created_at)} · {fmtTime(r.created_at)}
                </p>
              </div>

              {/* Contact */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 text-2xs text-dark-50/60">
                  <Mail size={11} className="text-dark-50/30 flex-shrink-0" />
                  <a href={`mailto:${r.email}`} className="truncate hover:text-mauve transition-colors">{r.email}</a>
                </div>
                <div className="flex items-center gap-1.5 text-2xs text-dark-50/60">
                  <Phone size={11} className="text-dark-50/30 flex-shrink-0" />
                  <a href={`tel:${r.phone}`} className="hover:text-mauve transition-colors">{r.phone}</a>
                </div>
              </div>

              {/* Party size */}
              <div className="md:text-center">
                <span className="inline-flex items-center gap-1.5 bg-mauve-50 text-mauve-700 text-2xs font-medium px-2.5 py-1 rounded-full">
                  <Users size={10} />
                  {r.num_guests}
                </span>
              </div>

              {/* Note */}
              <div className="min-w-0 text-xs text-dark-50/60">
                {r.notes
                  ? <p className="line-clamp-2 text-dark-50/60">{r.notes}</p>
                  : <span className="text-dark-50/20">—</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
