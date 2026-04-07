'use client'

import { useState, useEffect } from 'react'
import { X, Gift, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'mls_popup_shown'
const PROMO_CODE = 'MLS100OFF'

export function PromoPopup() {
  const [visible, setVisible] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ firstName: '', phone: '', email: '' })
  const [smsConsent, setSmsConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const shown = localStorage.getItem(STORAGE_KEY)
    if (shown) return
    const timer = setTimeout(() => setVisible(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.firstName.trim()) errs.firstName = 'Required'
    if (!form.phone.trim()) {
      errs.phone = 'Required'
    } else if (!/^\+?[\d\s\-().]{7,15}$/.test(form.phone)) {
      errs.phone = 'Enter a valid phone number'
    }
    if (!smsConsent) errs.smsConsent = 'You must agree to receive messages to claim your offer'
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
    // Persist to localStorage so we don't show again
    localStorage.setItem(STORAGE_KEY, '1')
    // TODO: POST to your CRM / SMS platform here
    await new Promise((r) => setTimeout(r, 600))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-dark/70 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Exclusive offer"
        className={cn(
          'fixed z-[101] inset-0 flex items-center justify-center p-4',
          'pointer-events-none'
        )}
      >
        <div
          className="pointer-events-auto relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-dark-50/40 hover:text-dark-50 hover:bg-cream transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-mauve via-mauve-400 to-mauve-300" />

          <div className="p-8 md:p-10">
            {!submitted ? (
              <>
                {/* Header */}
                <div className="flex items-start gap-4 mb-7">
                  <div className="flex-shrink-0 size-12 rounded-2xl bg-mauve/10 flex items-center justify-center">
                    <Sparkles size={22} className="text-mauve" />
                  </div>
                  <div>
                    <p className="eyebrow text-mauve mb-1">Welcome Gift</p>
                    <h2 className="font-display text-3xl font-light text-dark-50 leading-tight">
                      $100 Off Your First Treatment
                    </h2>
                    <p className="text-sm text-dark-50/50 mt-1.5 leading-relaxed">
                      Join our VIP list and receive an exclusive discount toward any service at Manhattan Laser Spa.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* First Name */}
                  <div>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border text-sm text-dark-50 placeholder:text-dark-50/35 bg-cream focus:outline-none focus:ring-2 focus:ring-mauve/30 transition',
                        errors.firstName ? 'border-red-300' : 'border-cream-300'
                      )}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <input
                      type="tel"
                      placeholder="Mobile Phone Number"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border text-sm text-dark-50 placeholder:text-dark-50/35 bg-cream focus:outline-none focus:ring-2 focus:ring-mauve/30 transition',
                        errors.phone ? 'border-red-300' : 'border-cream-300'
                      )}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* Email (optional) */}
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address (optional)"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 text-sm text-dark-50 placeholder:text-dark-50/35 bg-cream focus:outline-none focus:ring-2 focus:ring-mauve/30 transition"
                    />
                  </div>

                  {/* TCR SMS consent */}
                  <div
                    className={cn(
                      'rounded-xl border p-4 bg-cream/50',
                      errors.smsConsent ? 'border-red-300' : 'border-cream-300'
                    )}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={smsConsent}
                          onChange={(e) => setSmsConsent(e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={cn(
                            'size-5 rounded-md border-2 flex items-center justify-center transition-colors',
                            smsConsent
                              ? 'bg-mauve border-mauve'
                              : 'bg-white border-cream-300'
                          )}
                        >
                          {smsConsent && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                              <path
                                d="M2 6l3 3 5-5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-dark-50/60 leading-relaxed">
                        I agree to receive recurring automated marketing text messages (e.g. promotions, appointment reminders) from Manhattan Laser Spa at the phone number provided. Consent is not a condition of purchase. Msg &amp; data rates may apply. Msg frequency varies. Reply STOP to unsubscribe or HELP for help.{' '}
                        <a href="/privacy" className="underline hover:text-mauve transition-colors">
                          Privacy Policy
                        </a>{' '}
                        &amp;{' '}
                        <a href="/terms" className="underline hover:text-mauve transition-colors">
                          Terms
                        </a>
                        .
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
                    className="w-full py-3.5 rounded-xl bg-mauve hover:bg-mauve-600 text-white text-sm font-semibold tracking-wide transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Gift size={16} />
                        Claim My $100 Off
                      </>
                    )}
                  </button>

                  <p className="text-center text-2xs text-dark-50/30">
                    No spam. Unsubscribe anytime. Valid for new clients only.
                  </p>
                </form>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-4">
                <div className="size-16 rounded-full bg-mauve/10 flex items-center justify-center mx-auto mb-5">
                  <Gift size={28} className="text-mauve" />
                </div>
                <h2 className="font-display text-3xl font-light text-dark-50 mb-2">
                  You're In!
                </h2>
                <p className="text-sm text-dark-50/60 leading-relaxed mb-6">
                  Welcome to the Manhattan Laser Spa family. Use the code below at checkout for{' '}
                  <strong className="text-dark-50">$100 off</strong> your first treatment.
                </p>

                <div className="bg-cream border-2 border-dashed border-mauve/30 rounded-2xl py-5 px-8 mb-6">
                  <p className="text-2xs font-semibold tracking-widest uppercase text-dark-50/40 mb-1">
                    Your Promo Code
                  </p>
                  <p className="font-display text-4xl font-light tracking-widest text-mauve">
                    {PROMO_CODE}
                  </p>
                </div>

                <p className="text-xs text-dark-50/40 mb-6">
                  We've also sent a confirmation to your phone. Look out for exclusive offers!
                </p>

                <button
                  onClick={dismiss}
                  className="w-full py-3 rounded-xl border border-cream-300 text-sm font-medium text-dark-50/60 hover:text-dark-50 hover:border-cream-400 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
