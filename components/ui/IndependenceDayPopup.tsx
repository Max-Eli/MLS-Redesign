'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'

const STORAGE_KEY    = 'mls_july4_popup_shown_2026'
const CAMPAIGN_START = '2026-06-24'
const CAMPAIGN_END   = '2026-07-06'

type Offer = {
  title:        string
  subtitle?:    string
  price:        string
  regular?:     string
  slug?:        string
  expandSizes?: boolean
}

const MAIN_OFFERS: Offer[] = [
  {
    title:    'PicoWay Pigmentation',
    subtitle: 'Single session',
    price:    '$249',
    regular:  '$499',
    slug:     'july-4th-picoway-pigmentation',
  },
  {
    title:       'Laser Hair Removal',
    subtitle:    'Package of 6',
    price:       'from $199',
    expandSizes: true,
  },
  {
    title:    'RF Microneedling',
    subtitle: 'Single session',
    price:    '$399',
    regular:  '$550',
    slug:     'july-4th-rf-microneedling',
  },
  {
    title:    'Lip Filler',
    subtitle: 'Full session',
    price:    '$399',
    slug:     'july-4th-lip-filler',
  },
]

const LASER_SIZES: Offer[] = [
  {
    title:    'Small',
    subtitle: 'Upper lip, chin, sideburns, underarms',
    price:    '$199',
    slug:     'july-4th-laser-hair-removal-small',
  },
  {
    title:    'Medium',
    subtitle: 'Half arms, bikini line, lower legs',
    price:    '$299',
    regular:  '$499',
    slug:     'july-4th-laser-hair-removal-medium',
  },
  {
    title:    'Large',
    subtitle: 'Full arms, full legs, full back, Brazilian',
    price:    '$399',
    regular:  '$599',
    slug:     'july-4th-laser-hair-removal-large',
  },
  {
    title:    'Full Body',
    subtitle: 'Head-to-toe coverage',
    price:    '$1,400',
    regular:  '$2,499',
    slug:     'july-4th-laser-hair-removal-full-body',
  },
]

export function IndependenceDayPopup() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'main' | 'laser'>('main')

  useEffect(() => {
    const now = Date.now()
    if (now < new Date(CAMPAIGN_START).getTime()) return
    if (now > new Date(CAMPAIGN_END + 'T23:59:59').getTime()) return
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {}
    const t = setTimeout(() => setOpen(true), 2000)
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

  const offers = view === 'main' ? MAIN_OFFERS : LASER_SIZES

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
            aria-label="Independence Day offers"
            className="relative w-full max-w-xl my-4 bg-cream rounded-3xl shadow-luxury-lg overflow-hidden animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative glows — red + mauve */}
            <div className="absolute -top-24 -right-20 size-64 rounded-full bg-red-500/12 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 -left-24 size-72 rounded-full bg-mauve/15 blur-3xl pointer-events-none" />

            {/* Back arrow (only on laser sub-view) */}
            {view === 'laser' && (
              <button
                onClick={() => setView('main')}
                className="absolute top-3 left-3 z-20 inline-flex items-center justify-center size-9 rounded-full bg-dark/5 hover:bg-dark/10 text-dark-50/40 hover:text-dark-50 transition-colors"
                aria-label="Back to all offers"
              >
                <ArrowLeft size={15} />
              </button>
            )}

            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 z-20 inline-flex items-center justify-center size-9 rounded-full bg-dark/5 hover:bg-dark/10 text-dark-50/40 hover:text-dark-50 transition-colors"
              aria-label="Close"
            >
              <X size={15} />
            </button>

            <div className="relative px-7 pt-12 pb-8 md:px-12 md:pt-14 md:pb-10 text-center">
              {view === 'main' ? (
                <>
                  <p className="eyebrow text-red-700 mb-5">Independence Day Edit</p>
                  <h2 className="font-display text-4xl md:text-5xl font-light leading-[1.05] text-dark-50">
                    Spark <span className="italic text-red-600">Your Glow</span>
                  </h2>
                </>
              ) : (
                <>
                  <p className="eyebrow text-red-700 mb-5">Laser Hair Removal Packages</p>
                  <h2 className="font-display text-4xl md:text-5xl font-light leading-[1.05] text-dark-50">
                    Choose Your <span className="italic text-red-600">Size</span>
                  </h2>
                </>
              )}

              <div className="w-10 h-px bg-gold-400 mx-auto my-6" />

              <p className="text-sm md:text-[0.95rem] text-dark-50/55 leading-relaxed max-w-sm mx-auto mb-8">
                {view === 'main'
                  ? "A curated selection of our most-requested treatments, priced exclusively for Independence Day."
                  : 'Six sessions per package. Select the size that fits your treatment area.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-7 text-left">
                {offers.map((o) => {
                  const cardBody = (
                    <>
                      <p className="text-2xs font-semibold tracking-widest uppercase text-dark-50/45">
                        {o.title}
                      </p>
                      <p className="font-display text-2xl md:text-3xl font-light text-dark-50 leading-none flex items-baseline gap-2 mt-2">
                        {o.price}
                        {o.regular && (
                          <span className="text-xs text-dark-50/30 line-through font-sans">{o.regular}</span>
                        )}
                      </p>
                      {o.subtitle && (
                        <p className="mt-2 text-2xs text-dark-50/50 leading-relaxed">
                          {o.subtitle}
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-2xs font-semibold tracking-widest uppercase text-red-700">
                          {o.expandSizes ? 'Choose Size' : 'Shop'}
                        </span>
                        <ArrowRight size={12} className="text-red-700" />
                      </div>
                    </>
                  )

                  if (o.expandSizes) {
                    return (
                      <button
                        key={o.title}
                        onClick={() => setView('laser')}
                        className="text-left bg-white rounded-2xl border border-cream-300 hover:border-red-300 px-4 py-4 md:px-5 md:py-5 transition-colors"
                      >
                        {cardBody}
                      </button>
                    )
                  }

                  return (
                    <Link
                      key={o.title}
                      href={o.slug ? `/product/${o.slug}` : '/promotions'}
                      onClick={dismiss}
                      className="block bg-white rounded-2xl border border-cream-300 hover:border-red-300 px-4 py-4 md:px-5 md:py-5 transition-colors"
                    >
                      {cardBody}
                    </Link>
                  )
                })}
              </div>

              <p className="mt-2 text-2xs text-dark-50/35 tracking-wide">
                Limited appointments · Offer expires July 6, 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
