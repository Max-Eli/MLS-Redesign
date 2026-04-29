'use client'

import { useRef, useState } from 'react'

export function ContactForm() {
  const [status, setStatus]     = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const mountedAt               = useRef(Date.now())

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const fd = new FormData(e.currentTarget)
    const body = {
      firstName:     fd.get('first_name') as string,
      lastName:      fd.get('last_name')  as string,
      email:         fd.get('email')      as string,
      phone:         fd.get('phone')      as string,
      treatment:     fd.get('treatment')  as string,
      message:       fd.get('message')    as string,
      website:       fd.get('website')    as string,
      formElapsedMs: Date.now() - mountedAt.current,
    }

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please call us at 305-705-3997 or email florida@manhattanlaserspa.com.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="w-12 h-px bg-gold-400 mx-auto mb-8" />
        <p className="eyebrow mb-3">Message Received</p>
        <h2 className="font-display text-3xl font-light text-dark-50 mb-4">
          Thank You for Reaching Out
        </h2>
        <p className="text-sm text-dark-50/60 leading-relaxed max-w-sm">
          Our team will get back to you within 24 hours to schedule your consultation.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot — invisible to humans, bots fill it and get silently dropped */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            required
            className="w-full h-12 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors"
            placeholder="Sofia"
          />
        </div>
        <div>
          <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            className="w-full h-12 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors"
            placeholder="Martinez"
          />
        </div>
      </div>

      <div>
        <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full h-12 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors"
          placeholder="sofia@example.com"
        />
      </div>

      <div>
        <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          className="w-full h-12 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors"
          placeholder="(305) 000-0000"
        />
      </div>

      <div>
        <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
          Treatment of Interest
        </label>
        <select
          name="treatment"
          className="w-full h-12 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors appearance-none"
        >
          <option value="">Select a treatment…</option>
          <optgroup label="Laser Treatments">
            <option>Laser Hair Removal</option>
            <option>Laser Skin Resurfacing</option>
            <option>Carbon Laser Facial</option>
            <option>Laser Genesis</option>
          </optgroup>
          <optgroup label="Body Contouring">
            <option>CoolSculpting Elite</option>
            <option>EMSculpt</option>
            <option>Endosphere Therapy</option>
            <option>LPG Endermologie</option>
          </optgroup>
          <optgroup label="Injectables">
            <option>Botox / Xeomin</option>
            <option>Dermal Fillers</option>
            <option>Kybella</option>
            <option>PDO Thread Lift</option>
            <option>PRP Facelift</option>
          </optgroup>
          <optgroup label="Facial Treatments">
            <option>HydraFacial</option>
            <option>RF Microneedling</option>
            <option>JetPeel</option>
            <option>PRX-T33 Peel</option>
          </optgroup>
          <optgroup label="Wellness">
            <option>IV Therapy</option>
            <option>PRP Hair Restoration</option>
            <option>Medical Weight Loss</option>
            <option>Hormone Replacement Therapy</option>
          </optgroup>
          <option>Not sure — I&apos;d like a consultation</option>
        </select>
      </div>

      <div>
        <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
          Message (optional)
        </label>
        <textarea
          name="message"
          rows={4}
          className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors resize-none"
          placeholder="Tell us about your goals or any questions you have…"
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-500 leading-relaxed">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full h-14 bg-mauve text-white text-xs font-semibold tracking-widest uppercase hover:bg-mauve-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {status === 'submitting' ? (
          <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          'Request Consultation'
        )}
      </button>

      <p className="text-2xs text-dark-50/40 text-center leading-relaxed">
        By submitting, you agree to be contacted by our team.
        Your information is protected under our{' '}
        <a href="/privacy" className="underline decoration-dotted hover:text-mauve transition-colors">Privacy Policy</a>.
      </p>
    </form>
  )
}
