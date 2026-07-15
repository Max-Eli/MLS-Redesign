'use client'

import { useRef, useState } from 'react'
import { Check, Users, Minus, Plus } from 'lucide-react'

export function RsvpForm() {
  const [status, setStatus]         = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg]     = useState('')
  const [guests, setGuests]         = useState(1)
  const mountedAt                   = useRef(Date.now())

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const fd = new FormData(e.currentTarget)
    const body = {
      fullName:       (fd.get('full_name')   as string).trim(),
      email:          (fd.get('email')       as string).trim(),
      phone:          (fd.get('phone')       as string).trim(),
      attending:      'yes',
      numGuests:      guests,
      notes:          (fd.get('notes')       as string)?.trim() || null,
      website:        fd.get('website') as string,
      formElapsedMs:  Date.now() - mountedAt.current,
    }

    try {
      const res = await fetch('/api/rsvp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please call us at 305-705-3997.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-cream-50 border border-cream-200 rounded-3xl p-8 sm:p-12 text-center">
        <div className="mx-auto flex items-center justify-center size-14 rounded-full bg-mauve text-white mb-6">
          <Check size={22} strokeWidth={2.5} />
        </div>
        <p className="eyebrow text-mauve-600 mb-3">Thank You</p>
        <h3 className="font-display text-2xl sm:text-3xl font-light text-dark-50 mb-4">
          Your RSVP is <span className="italic text-mauve">received</span>
        </h3>
        <p className="text-sm text-dark-50/60 leading-relaxed max-w-sm mx-auto">
          We can&apos;t wait to celebrate with you. A confirmation is on its way to your inbox.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
      {/* Honeypot — invisible to humans, bots fill it and get silently dropped */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}
      />

      {/* Name */}
      <div>
        <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
          Full Name
        </label>
        <input
          type="text"
          name="full_name"
          required
          autoComplete="name"
          placeholder="Your name"
          className="w-full h-12 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors"
        />
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full h-12 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors"
          />
        </div>
        <div>
          <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            required
            autoComplete="tel"
            placeholder="(305) 000-0000"
            className="w-full h-12 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors"
          />
        </div>
      </div>

      {/* Guest count */}
      <div>
        <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2.5">
          Number of Guests (including yourself)
        </label>
        <div className="flex items-center gap-4 bg-cream-50 border border-cream-200 rounded-xl h-14 px-3">
          <div className="flex-shrink-0 flex items-center justify-center size-9 rounded-lg bg-white">
            <Users size={16} className="text-mauve" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setGuests(g => Math.max(1, g - 1))}
              disabled={guests <= 1}
              className="size-11 rounded-full border border-cream-300 bg-white text-dark-50 hover:border-mauve hover:text-mauve disabled:opacity-40 disabled:hover:border-cream-300 disabled:hover:text-dark-50 flex items-center justify-center transition-colors"
              aria-label="Decrease guests"
            >
              <Minus size={16} />
            </button>
            <span className="font-display text-2xl md:text-3xl font-light text-dark-50 tabular-nums w-10 text-center">
              {guests}
            </span>
            <button
              type="button"
              onClick={() => setGuests(g => Math.min(4, g + 1))}
              disabled={guests >= 4}
              className="size-11 rounded-full border border-cream-300 bg-white text-dark-50 hover:border-mauve hover:text-mauve disabled:opacity-40 disabled:hover:border-cream-300 disabled:hover:text-dark-50 flex items-center justify-center transition-colors"
              aria-label="Increase guests"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        <p className="mt-2 text-2xs text-dark-50/40 pl-1">Max 4 per RSVP. For larger parties, please call us.</p>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
          A Note <span className="text-dark-50/30 normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Anything you'd like us to know…"
          className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors resize-none"
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-500 leading-relaxed">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full h-14 bg-mauve text-white text-xs md:text-sm font-semibold tracking-widest uppercase hover:bg-mauve-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 rounded-xl"
      >
        {status === 'submitting' ? (
          <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          'Send My Reply'
        )}
      </button>

      <p className="text-2xs text-dark-50/40 text-center leading-relaxed">
        Your details are used only to confirm your RSVP and are never shared.
      </p>
    </form>
  )
}
