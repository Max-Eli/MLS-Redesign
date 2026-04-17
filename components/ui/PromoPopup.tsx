'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY       = 'mls_popup_shown'
const PROMO_CODE        = 'MLS100OFF'
// While the Mother's Day campaign is running, defer to MothersDayPopup
const MD_CAMPAIGN_START = '2026-04-17'
const MD_CAMPAIGN_END   = '2026-05-12'

export function PromoPopup() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ firstName: '', phone: '', email: '' })
  const [smsConsent, setSmsConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const now = Date.now()
    if (now >= new Date(MD_CAMPAIGN_START).getTime() && now <= new Date(MD_CAMPAIGN_END).getTime()) return
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {}
    const timer = setTimeout(() => setOpen(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setOpen(false)
    try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.firstName.trim()) errs.firstName = 'Please enter your first name'
    if (!form.phone.trim()) {
      errs.phone = 'Please enter your phone number'
    } else if (!/^\+?[\d\s\-().]{7,15}$/.test(form.phone)) {
      errs.phone = 'Enter a valid phone number'
    }
    if (!smsConsent) errs.smsConsent = 'Consent required to claim this offer'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitting(true)
    localStorage.setItem(STORAGE_KEY, '1')
    try {
      await fetch('/api/promo-lead', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
    } catch {
      // silently continue — user still gets the code
    }
    setSubmitting(false)
    setSubmitted(true)
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(PROMO_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-dark/60 backdrop-blur-sm animate-fade-in"
        onClick={dismiss}
        aria-hidden
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Exclusive welcome offer"
          className="pointer-events-auto relative w-full max-w-3xl bg-white rounded-3xl shadow-luxury-lg overflow-hidden animate-fade-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={dismiss}
            className="absolute top-5 right-5 z-20 size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={15} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr]">

            {/* ── Left panel – offer ── */}
            <div className="relative bg-dark flex flex-col justify-between p-8 md:p-10 min-h-[200px] md:min-h-[560px] overflow-hidden">
              {/* Subtle texture */}
              <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
              {/* Soft radial glow */}
              <div className="absolute -top-20 -left-20 size-72 rounded-full bg-mauve/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 right-0 size-48 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

              <div className="relative">
                <p className="eyebrow text-mauve-300 mb-6">Welcome Gift</p>

                {/* Large display number */}
                <div className="mb-4">
                  <span className="font-display text-[7rem] md:text-[8rem] font-light leading-none text-white">
                    $100
                  </span>
                </div>

                <div className="w-10 h-px bg-gold-400 mb-5" />

                <h2 className="font-display text-2xl md:text-3xl font-light text-white/90 leading-snug mb-4">
                  Off Your First<br />Treatment
                </h2>

                <p className="text-sm text-white/40 leading-relaxed max-w-[220px]">
                  Join our exclusive VIP list and receive a welcome credit toward any service.
                </p>
              </div>

              <div className="relative mt-8 md:mt-0">
                <div className="border-t border-white/10 pt-6 space-y-2">
                  {['No commitment required', 'Valid on any first service', 'Expires in 90 days'].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <div className="size-1 rounded-full bg-mauve-300 flex-shrink-0" />
                      <span className="text-xs text-white/40 tracking-wide">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right panel – form ── */}
            <div className="bg-cream p-8 md:p-10 flex flex-col justify-center">
              {!submitted ? (
                <>
                  <div className="mb-7">
                    <h3 className="font-display text-2xl md:text-3xl font-light text-dark-50 leading-snug mb-2">
                      Claim Your Offer
                    </h3>
                    <p className="text-sm text-dark-50/50 leading-relaxed">
                      Enter your details below and we'll send your code instantly.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                    {/* First Name */}
                    <div>
                      <input
                        type="text"
                        placeholder="First Name"
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                        className={cn(
                          'w-full px-4 py-3 rounded-xl border bg-white text-sm text-dark-50 placeholder:text-dark-50/30',
                          'focus:outline-none focus:ring-2 focus:ring-mauve/20 focus:border-mauve/40 transition-all',
                          errors.firstName ? 'border-red-300 bg-red-50/30' : 'border-cream-300'
                        )}
                      />
                      {errors.firstName && (
                        <p className="mt-1.5 text-xs text-red-500 pl-1">{errors.firstName}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className={cn(
                          'w-full px-4 py-3 rounded-xl border bg-white text-sm text-dark-50 placeholder:text-dark-50/30',
                          'focus:outline-none focus:ring-2 focus:ring-mauve/20 focus:border-mauve/40 transition-all',
                          errors.phone ? 'border-red-300 bg-red-50/30' : 'border-cream-300'
                        )}
                      />
                      {errors.phone && (
                        <p className="mt-1.5 text-xs text-red-500 pl-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address (optional)"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:ring-2 focus:ring-mauve/20 focus:border-mauve/40 transition-all"
                      />
                    </div>

                    {/* TCR SMS consent */}
                    <div
                      className={cn(
                        'rounded-xl border p-4 bg-white transition-colors',
                        errors.smsConsent ? 'border-red-300' : 'border-cream-300'
                      )}
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={smsConsent}
                          onClick={() => setSmsConsent((v) => !v)}
                          className={cn(
                            'flex-shrink-0 mt-0.5 size-5 rounded-md border-2 flex items-center justify-center transition-all',
                            smsConsent
                              ? 'bg-mauve border-mauve'
                              : 'bg-white border-cream-300 hover:border-mauve/50'
                          )}
                        >
                          {smsConsent && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                        <span className="text-xs text-dark-50/50 leading-relaxed">
                          I agree to receive recurring automated marketing text messages from Manhattan Laser Spa at the number provided. Consent is not required to purchase. Msg &amp; data rates may apply. Reply STOP to cancel.{' '}
                          <a href="/privacy" className="underline decoration-dotted hover:text-mauve transition-colors">Privacy</a>
                          {' '}&amp;{' '}
                          <a href="/terms" className="underline decoration-dotted hover:text-mauve transition-colors">Terms</a>.
                        </span>
                      </label>
                      {errors.smsConsent && (
                        <p className="mt-2 text-xs text-red-500 pl-8">{errors.smsConsent}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl bg-mauve hover:bg-mauve-600 text-white text-sm font-medium tracking-widest uppercase transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                    >
                      {submitting ? (
                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Claim $100 Off'
                      )}
                    </button>
                  </form>

                  <p className="mt-4 text-center text-2xs text-dark-50/25 leading-relaxed">
                    New clients only · One use per person
                  </p>
                </>
              ) : (
                /* ── Success ── */
                <div className="text-center">
                  <div className="w-12 h-px bg-gold-400 mx-auto mb-7" />

                  <p className="eyebrow mb-3">Your Code Is Ready</p>
                  <h3 className="font-display text-3xl md:text-4xl font-light text-dark-50 leading-snug mb-6">
                    Welcome to<br />Manhattan Laser Spa
                  </h3>

                  {/* Code block */}
                  <button
                    onClick={copyCode}
                    className="group w-full mb-6 rounded-2xl border-2 border-dashed border-mauve/25 hover:border-mauve/50 bg-white py-5 px-6 transition-colors"
                    title="Click to copy"
                  >
                    <p className="text-2xs font-semibold tracking-widest uppercase text-dark-50/30 mb-1.5">
                      Promo Code
                    </p>
                    <p className="font-display text-4xl font-light tracking-widest2 text-mauve group-hover:text-mauve-600 transition-colors">
                      {PROMO_CODE}
                    </p>
                    <p className="mt-2 text-2xs text-dark-50/30 tracking-wide">
                      {copied ? '✓ Copied!' : 'Tap to copy'}
                    </p>
                  </button>

                  <p className="text-xs text-dark-50/40 leading-relaxed mb-7">
                    Apply this code at checkout. A confirmation has been sent to your phone — watch out for exclusive offers.
                  </p>

                  <button
                    onClick={dismiss}
                    className="w-full py-3 rounded-xl border border-cream-300 hover:border-cream-400 text-sm text-dark-50/50 hover:text-dark-50 transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
