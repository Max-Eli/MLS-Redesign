'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, ArrowRight, Calendar, MapPin } from 'lucide-react'

const STORAGE_KEY    = 'mls_anniversary_popup_shown_2026'
const CAMPAIGN_START = '2026-07-15'
const CAMPAIGN_END   = '2026-08-07'

export function AnniversaryPopup() {
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-dark/70 backdrop-blur-sm animate-fade-in"
        aria-hidden
      />

      {/* Scroll container */}
      <div className="fixed inset-0 z-[101] overflow-y-auto overscroll-contain">
        <div
          className="flex min-h-full items-center justify-center p-4"
          onClick={dismiss}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="4 Year Anniversary Celebration"
            className="relative w-full max-w-md my-4 bg-dark rounded-3xl shadow-luxury-lg overflow-hidden animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative glows */}
            <div className="absolute -top-24 -right-16 size-56 rounded-full bg-mauve/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-16 size-56 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 z-20 inline-flex items-center justify-center size-9 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="relative px-7 pt-12 pb-8 md:px-10 md:pt-14 md:pb-10 text-center">
              <p className="eyebrow text-gold-400 mb-4">You&apos;re Invited</p>

              <span className="block font-display font-light leading-none text-white text-[6rem] md:text-[7.5rem]">
                4
              </span>

              <p className="mt-1 md:mt-2 font-display font-light text-gold-400 text-2xl md:text-3xl tracking-[0.2em]">
                YEARS
              </p>

              <p className="mt-3 text-2xs md:text-xs font-medium tracking-[0.28em] uppercase text-white/50">
                of Manhattan Laser Spa
              </p>

              <div className="w-10 h-px bg-gold-400 mx-auto my-6" />

              {/* Event summary */}
              <div className="space-y-2.5 mb-6">
                <div className="flex items-center justify-center gap-2 text-sm text-white/85">
                  <Calendar size={13} className="text-mauve-300" />
                  <span>Friday, August 7 · 6 – 10 PM</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-white/85">
                  <MapPin size={13} className="text-mauve-300" />
                  <span>Sunny Isles Beach</span>
                </div>
              </div>

              {/* Deal callout */}
              <div className="mx-2 rounded-2xl border border-gold-400/25 bg-white/5 px-4 py-4 mb-7">
                <p className="text-[0.6rem] font-semibold tracking-[0.25em] uppercase text-gold-400 mb-1">
                  One Night Only
                </p>
                <p className="font-display font-light text-white text-3xl md:text-4xl leading-none">
                  30<span className="text-gold-400">%</span>
                  <span className="align-top text-sm md:text-base tracking-widest ml-1.5">OFF</span>
                </p>
                <p className="mt-2 text-2xs text-white/60 leading-relaxed">
                  The entire menu — every treatment, package, and service
                </p>
              </div>

              <Link
                href="/anniversary"
                onClick={dismiss}
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-mauve hover:bg-mauve-600 py-3.5 text-xs md:text-sm font-semibold tracking-widest uppercase text-white transition-colors"
              >
                RSVP Now
                <ArrowRight size={14} />
              </Link>

              <p className="mt-4 text-2xs text-white/40 leading-relaxed">
                Registration required · Space is limited
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
