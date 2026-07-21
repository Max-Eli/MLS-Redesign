'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'

const STORAGE_KEY    = 'mls_anniversary_bar_dismissed_2026'
const CAMPAIGN_START = '2026-07-15'
const CAMPAIGN_END   = '2026-08-07'
const ROTATE_MS      = 5000

const MESSAGES = [
  {
    eyebrow: '4 Year Anniversary',
    text:    'Friday, August 7 · Live music, champagne & more',
    cta:     'RSVP',
  },
  {
    eyebrow: 'One Night Only',
    text:    '30% OFF the entire menu — every treatment, package & service',
    cta:     'Reserve',
  },
]

export function AnnouncementBar() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [index, setIndex]     = useState(0)

  useEffect(() => {
    setMounted(true)
    const now = Date.now()
    if (now < new Date(CAMPAIGN_START).getTime()) return
    if (now > new Date(CAMPAIGN_END + 'T23:59:59').getTime()) return
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {}
    setVisible(true)
  }, [])

  // Publish banner height as a CSS variable so the fixed Header can offset
  // itself downward via top-[var(--banner-h,0px)] without needing to import
  // any state from us.
  useEffect(() => {
    if (!mounted) return
    document.documentElement.style.setProperty(
      '--banner-h',
      visible ? '44px' : '0px',
    )
    return () => {
      document.documentElement.style.setProperty('--banner-h', '0px')
    }
  }, [mounted, visible])

  // Auto-rotate through messages.
  useEffect(() => {
    if (!visible) return
    const t = setInterval(() => {
      setIndex(i => (i + 1) % MESSAGES.length)
    }, ROTATE_MS)
    return () => clearInterval(t)
  }, [visible])

  function dismiss() {
    setVisible(false)
    try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
  }

  if (!visible) return null

  const msg = MESSAGES[index]

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-11 bg-dark border-b border-white/10">
      {/* Clickable message region — goes to /anniversary */}
      <Link
        href="/anniversary"
        className="flex items-center justify-center gap-2 sm:gap-3 h-full px-10 sm:px-14 text-white/90 hover:text-white transition-colors"
      >
        <div key={index} className="flex items-center gap-2 sm:gap-3 animate-fade-in min-w-0">
          <span className="hidden sm:inline text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-gold-400">
            {msg.eyebrow}
          </span>
          <span className="hidden sm:inline text-gold-400/40">·</span>
          <span className="text-2xs sm:text-xs font-medium truncate">
            {msg.text}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-2xs font-semibold tracking-widest uppercase text-gold-400 whitespace-nowrap">
            {msg.cta}
            <ArrowRight size={11} />
          </span>
          <ArrowRight size={11} className="sm:hidden text-gold-400 flex-shrink-0" />
        </div>
      </Link>

      {/* Pagination dots */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5">
        {MESSAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show message ${i + 1}`}
            className={`size-1.5 rounded-full transition-colors ${
              i === index ? 'bg-gold-400' : 'bg-white/25 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  )
}
