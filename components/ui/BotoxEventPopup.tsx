'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, ArrowRight, Calendar, Clock, MapPin } from 'lucide-react'

const STORAGE_KEY    = 'mls_botox_popup_shown_2026'
const CAMPAIGN_START = '2026-09-28'
const CAMPAIGN_END   = '2026-10-15'

export function BotoxEventPopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const now = Date.now()
    if (now < new Date(CAMPAIGN_START).getTime()) return
    if (now > new Date(CAMPAIGN_END + 'T23:59:59').getTime()) return
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {}
    const t = setTimeout(() => setOpen(true), 2500)
    return () => clearTimeout(t)
  }, [])

  // Lock background scroll while the popup is open
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [open])

  function dismiss() {
    setOpen(false)
    try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-dark/60 backdrop-blur-sm animate-fade-in" aria-hidden />

      <div className="fixed inset-0 z-[101] overflow-y-auto overscroll-contain">
        <div className="flex min-h-full items-center justify-center p-4" onClick={dismiss}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="The Botox Event — October 15"
            className="relative w-full max-w-md my-4 bg-cream rounded-3xl shadow-luxury-lg overflow-hidden animate-fade-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Decorative glows — light theme */}
            <div className="absolute -top-20 -right-14 size-52 rounded-full bg-mauve/12 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-14 size-52 rounded-full bg-gold/12 blur-3xl pointer-events-none" />

            <button
              onClick={dismiss}
              className="absolute top-3 right-3 z-20 inline-flex items-center justify-center size-9 rounded-full bg-dark/5 hover:bg-dark/10 text-dark-50/50 hover:text-dark-50 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="relative px-7 pt-12 pb-8 md:px-10 md:pt-14 md:pb-10 text-center">
              <p className="eyebrow text-mauve-600 mb-4">You&apos;re Invited</p>

              <p className="font-display font-light text-dark-50 leading-[0.95] text-5xl md:text-6xl">
                The <span className="italic text-mauve">Botox</span>
                <br />
                Event
              </p>

              <div className="w-10 h-px bg-gold-400 mx-auto my-6" />

              <div className="space-y-2.5 mb-6">
                <div className="flex items-center justify-center gap-2 text-sm text-dark-50/80">
                  <Calendar size={13} className="text-mauve" />
                  <span>Thursday, October 15</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-dark-50/80">
                  <Clock size={13} className="text-mauve" />
                  <span>4:00 – 8:00 PM</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-dark-50/80">
                  <MapPin size={13} className="text-mauve" />
                  <span>Sunny Isles Beach</span>
                </div>
              </div>

              <div className="mx-2 rounded-2xl border border-mauve/15 bg-white px-4 py-4 mb-7 shadow-sm">
                <p className="text-[0.6rem] font-semibold tracking-[0.25em] uppercase text-gold-500 mb-1.5">
                  One Evening Only
                </p>
                <p className="font-display font-light text-dark-50 text-3xl md:text-4xl leading-none">
                  $6<span className="text-mauve">.99</span>
                  <span className="align-top text-sm md:text-base tracking-widest ml-1.5">/ UNIT</span>
                </p>
                <p className="mt-2 text-2xs text-dark-50/50 leading-relaxed">
                  Botox at event-only pricing · Champagne, raffles &amp; goodie bags
                </p>
              </div>

              <Link
                href="/botox-event"
                onClick={dismiss}
                className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-mauve hover:bg-mauve-600 py-3.5 text-xs md:text-sm font-semibold tracking-widest uppercase text-white transition-colors"
              >
                RSVP Now
                <ArrowRight size={14} />
              </Link>

              <p className="mt-4 text-2xs text-dark-50/40 leading-relaxed">
                Space is limited · RSVP required
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
