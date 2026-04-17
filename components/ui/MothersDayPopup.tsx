'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'

const STORAGE_KEY    = 'mls_mothers_day_popup_shown_2026'
const CAMPAIGN_START = '2026-04-17'
const CAMPAIGN_END   = '2026-05-12'

const OFFERS = [
  { title: 'Botox',                 price: '$8.99',  unit: '/ unit' },
  { title: 'Lip Filler',            price: '$399',   unit: ''        },
  { title: 'CO2 Eye Rejuvenation',  price: '$299',   unit: ''        },
  { title: 'Deep Cleansing Facial', price: '$120',   unit: ''        },
]

export function MothersDayPopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const now = Date.now()
    if (now < new Date(CAMPAIGN_START).getTime()) return
    if (now > new Date(CAMPAIGN_END).getTime())   return
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {}
    const t = setTimeout(() => setOpen(true), 2000)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    setOpen(false)
    try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
  }

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-dark/70 backdrop-blur-sm animate-fade-in"
        onClick={dismiss}
        aria-hidden
      />

      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mother's Day offers"
          className="pointer-events-auto relative w-full max-w-xl bg-cream rounded-3xl shadow-luxury-lg overflow-hidden animate-fade-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Soft decorative glows */}
          <div className="absolute -top-24 -right-20 size-64 rounded-full bg-mauve/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -left-24 size-72 rounded-full bg-gold/15 blur-3xl pointer-events-none" />

          <button
            onClick={dismiss}
            className="absolute top-4 right-4 z-20 size-8 rounded-full bg-dark/5 hover:bg-dark/10 flex items-center justify-center text-dark-50/40 hover:text-dark-50 transition-colors"
            aria-label="Close"
          >
            <X size={15} />
          </button>

          <div className="relative px-8 pt-12 pb-8 md:px-12 md:pt-14 md:pb-10 text-center">
            <p className="eyebrow text-mauve-600 mb-5">The Mother&apos;s Day Edit</p>

            <h2 className="font-display text-4xl md:text-5xl font-light leading-[1.05] text-dark-50">
              Celebrate <span className="italic text-mauve">Her</span>
            </h2>

            <div className="w-10 h-px bg-gold-400 mx-auto my-6" />

            <p className="text-sm md:text-[0.95rem] text-dark-50/55 leading-relaxed max-w-sm mx-auto mb-8">
              A curated selection of our most-loved treatments, priced exclusively for Mother&apos;s Day.
            </p>

            {/* 2×2 offer grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 text-left">
              {OFFERS.map((o) => (
                <div
                  key={o.title}
                  className="relative bg-white rounded-2xl border border-cream-300 px-4 py-4 md:px-5 md:py-5"
                >
                  <p className="text-2xs font-semibold tracking-widest uppercase text-dark-50/35 mb-1.5 leading-snug">
                    {o.title}
                  </p>
                  <p className="font-display text-2xl md:text-3xl font-light text-dark-50 leading-none">
                    {o.price}
                    {o.unit && (
                      <span className="text-xs tracking-wide text-dark-50/40 font-sans ml-1">{o.unit}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/promotions"
              onClick={dismiss}
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto md:px-10 py-3.5 rounded-xl bg-dark hover:bg-mauve text-white text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              Shop the Edit
              <ArrowRight size={13} />
            </Link>

            <p className="mt-5 text-2xs text-dark-50/35 tracking-wide">
              Limited availability · Ends May 12, 2026
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
