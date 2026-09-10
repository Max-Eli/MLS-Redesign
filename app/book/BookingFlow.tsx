'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Droplets,
  HeartPulse,
  Loader2,
  ScanFace,
  Snowflake,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

/* ─── Types ──────────────────────────────────────────────────────────── */

interface InterestMeta {
  id: string
  duration_minutes: number
  price_cents: number
}

interface Slot {
  start: string
  end: string
  provider_id: number
}

interface BookingConfig {
  cancellation_policy: string
  booking_window_days: number
  location: { id: number; name: string; timezone: string } | null
  interests: InterestMeta[]
}

/* ─── Interests ──────────────────────────────────────────────────────────
   Concern-first choices shown to new clients. The mapping to CRM services
   and eligible providers lives server-side in lib/bookingRules.ts — ids
   here must match the rule ids there. */

const INTERESTS = [
  {
    id: 'injectables',
    title: 'Injectables',
    blurb: 'Botox, dermal filler, lips & facial balancing',
    icon: Droplets,
  },
  {
    id: 'skin',
    title: 'Skin Analysis',
    blurb: 'Texture, tone, acne, melasma & anti-aging',
    icon: ScanFace,
  },
  {
    id: 'laser',
    title: 'Laser Hair Removal',
    blurb: 'Smooth, lasting results for any area',
    icon: Zap,
  },
  {
    id: 'coolsculpting',
    title: 'Body Contouring',
    blurb: 'CoolSculpting fat reduction',
    icon: Snowflake,
  },
  {
    id: 'emsculpt',
    title: 'Muscle Toning',
    blurb: 'Emsculpt muscle building & sculpting',
    icon: HeartPulse,
  },
  {
    id: 'other',
    title: 'Something Else',
    blurb: 'Not sure where to start? We’ll guide you',
    icon: Sparkles,
  },
] as const

type Interest = (typeof INTERESTS)[number]

/* ─── Date helpers (spa-local) ───────────────────────────────────────── */

function toDateKey(d: Date, tz: string): string {
  return d.toLocaleDateString('en-CA', { timeZone: tz }) // YYYY-MM-DD
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

function fmtTime(iso: string, tz: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: tz,
  })
}

/* ─── Component ──────────────────────────────────────────────────────── */

type Step = 'interest' | 'time' | 'details' | 'done'

export function BookingFlow({ portalLoginUrl }: { portalLoginUrl: string }) {
  const [config, setConfig] = useState<BookingConfig | null>(null)
  const [configError, setConfigError] = useState(false)
  const [step, setStep] = useState<Step>('interest')

  const [interest, setInterest] = useState<Interest | null>(null)
  const [dateOffset, setDateOffset] = useState(0) // paging for the date strip
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notes: '',
    email_opt_in: false,
    sms_opt_in: false,
    company: '', // honeypot
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<{ token?: string } | null>(null)

  const tz = config?.location?.timezone ?? 'America/New_York'
  const interestMeta = useMemo(
    () => (interest && config ? config.interests.find(i => i.id === interest.id) ?? null : null),
    [interest, config],
  )

  useEffect(() => {
    fetch('/api/book/services')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(setConfig)
      .catch(() => setConfigError(true))
  }, [])

  const loadSlots = useCallback(async (date: string, interestId: string) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    setSlotsLoading(true)
    try {
      const res = await fetch(`/api/book/slots?interest=${interestId}&date=${date}`)
      const data = res.ok ? await res.json() : { slots: [] }
      setSlots(data.slots ?? [])
    } catch {
      setSlots([])
    } finally {
      setSlotsLoading(false)
    }
  }, [])

  function chooseInterest(i: Interest) {
    setInterest(i)
    setStep('time')
    setSlots(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    setDateOffset(0)
  }

  async function submit() {
    if (!interest || !selectedSlot || !config?.location) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          interest: interest.id,
          provider_id: selectedSlot.provider_id,
          location_id: config.location.id,
          start_time: selectedSlot.start,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 201) {
        setConfirmation({ token: data.booking_token })
        setStep('done')
      } else if (res.status === 409) {
        setSubmitError(data.error)
        setStep('time')
        if (selectedDate && interest) loadSlots(selectedDate, interest.id)
      } else {
        setSubmitError(data.error ?? 'Something went wrong — please try again.')
      }
    } catch {
      setSubmitError('Something went wrong — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Date strip ── */
  const DAYS_PER_PAGE = 7
  const windowDays = config?.booking_window_days ?? 60
  const stripDates = useMemo(() => {
    const today = new Date()
    return Array.from({ length: DAYS_PER_PAGE }, (_, i) => addDays(today, dateOffset + i)).filter(
      (_, i) => dateOffset + i < windowDays,
    )
  }, [dateOffset, windowDays])

  /* ── Slot grouping ── */
  const grouped = useMemo(() => {
    if (!slots) return null
    const buckets: Record<'Morning' | 'Afternoon' | 'Evening', Slot[]> = {
      Morning: [],
      Afternoon: [],
      Evening: [],
    }
    for (const s of slots) {
      const hour = Number(
        new Date(s.start).toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: tz }),
      )
      buckets[hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'].push(s)
    }
    return buckets
  }, [slots, tz])

  const steps: { key: Step; label: string }[] = [
    { key: 'interest', label: 'Concern' },
    { key: 'time', label: 'Time' },
    { key: 'details', label: 'Details' },
  ]
  const stepIndex = steps.findIndex(s => s.key === step)

  return (
    <section className="min-h-screen bg-cream pt-32 pb-20 md:pt-40">
      <Container size="md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-medium text-dark-50 mb-4">
            Book Your <span className="italic">Consultation</span>
          </h1>
          <p className="text-dark-50/60 max-w-xl mx-auto">
            New to Manhattan Laser Spa? Every journey begins with a complimentary consultation —
            choose your concern and pick a time that suits you.
          </p>
        </div>

        {/* Existing client strip */}
        {step !== 'done' && (
          <div className="mb-10 rounded-2xl border border-mauve/15 bg-mauve-50/50 px-5 py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
            <p className="text-sm text-dark-50/70">
              Already a client? Book any treatment through your client portal.
            </p>
            <a
              href={portalLoginUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium tracking-widest uppercase text-mauve hover:text-mauve-700 transition-colors whitespace-nowrap"
            >
              Sign In →
            </a>
          </div>
        )}

        {/* Progress */}
        {step !== 'done' && (
          <div className="flex items-center justify-center gap-2 mb-10" aria-label="Booking progress">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex items-center gap-2 text-2xs tracking-widest uppercase',
                    i <= stepIndex ? 'text-mauve' : 'text-dark-50/30',
                  )}
                >
                  <span
                    className={cn(
                      'size-6 rounded-full border flex items-center justify-center text-2xs',
                      i <= stepIndex ? 'border-mauve bg-mauve text-white' : 'border-dark-50/20',
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && <span className="h-px w-8 bg-dark-50/15" />}
              </div>
            ))}
          </div>
        )}

        {/* Loading / error states */}
        {!config && !configError && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-mauve" size={28} />
          </div>
        )}
        {configError && (
          <div className="text-center py-16 max-w-md mx-auto">
            <p className="text-dark-50/70 mb-4">
              Online booking is temporarily unavailable. Please call us and we’ll be happy to
              schedule your consultation.
            </p>
            <a href="tel:+13057053997" className="font-display text-2xl text-mauve">
              (305) 705-3997
            </a>
          </div>
        )}

        {/* Step 1 — interest */}
        {config && step === 'interest' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INTERESTS.map(i => {
              const Icon = i.icon
              return (
                <button
                  key={i.id}
                  onClick={() => chooseInterest(i)}
                  className="group text-left bg-white rounded-2xl border border-cream-200 p-6 shadow-sm hover:border-mauve/40 hover:shadow-mauve-glow transition-all duration-300 ease-luxury"
                >
                  <div className="size-11 rounded-xl bg-gradient-to-br from-mauve-50 to-mauve-100 flex items-center justify-center ring-1 ring-mauve/10 mb-4 group-hover:scale-105 transition-transform ease-luxury">
                    <Icon size={20} className="text-mauve-700" strokeWidth={1.8} />
                  </div>
                  <p className="font-display text-xl text-dark-50 mb-1">{i.title}</p>
                  <p className="text-sm text-dark-50/50 leading-relaxed">{i.blurb}</p>
                </button>
              )
            })}
          </div>
        )}

        {/* Step 2 — date & time */}
        {config && step === 'time' && interest && interestMeta && (
          <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStep('interest')}
                className="flex items-center gap-1.5 text-2xs tracking-widest uppercase text-dark-50/50 hover:text-dark-50 transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <p className="text-2xs tracking-widest uppercase text-dark-50/40">
                {interest.title} · {interestMeta.duration_minutes} min · Complimentary
              </p>
            </div>

            {submitError && (
              <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {submitError}
              </p>
            )}

            {/* Date strip */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setDateOffset(Math.max(0, dateOffset - DAYS_PER_PAGE))}
                disabled={dateOffset === 0}
                aria-label="Earlier dates"
                className="size-9 flex-shrink-0 rounded-full border border-cream-200 flex items-center justify-center text-dark-50/60 hover:border-mauve/40 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {/* Horizontal scroll on narrow screens; equal columns when space allows */}
              <div className="flex-1 flex gap-1.5 overflow-x-auto pb-1 -mb-1">
                {stripDates.map(d => {
                  const key = toDateKey(d, tz)
                  const active = key === selectedDate
                  return (
                    <button
                      key={key}
                      onClick={() => loadSlots(key, interest.id)}
                      className={cn(
                        'flex-1 min-w-[3.25rem] rounded-xl py-2.5 flex flex-col items-center transition-all ease-luxury border',
                        active
                          ? 'bg-mauve text-white border-mauve shadow-mauve-glow'
                          : 'bg-cream-100/60 border-transparent text-dark-50/70 hover:border-mauve/30',
                      )}
                    >
                      <span className="text-2xs uppercase tracking-wider opacity-70">
                        {d.toLocaleDateString('en-US', { weekday: 'short', timeZone: tz })}
                      </span>
                      <span className="font-display text-lg leading-tight">
                        {d.toLocaleDateString('en-US', { day: 'numeric', timeZone: tz })}
                      </span>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setDateOffset(dateOffset + DAYS_PER_PAGE)}
                disabled={dateOffset + DAYS_PER_PAGE >= windowDays}
                aria-label="Later dates"
                className="size-9 flex-shrink-0 rounded-full border border-cream-200 flex items-center justify-center text-dark-50/60 hover:border-mauve/40 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Slots */}
            {!selectedDate && (
              <p className="text-center text-sm text-dark-50/40 py-10">
                Select a date to see available times
              </p>
            )}
            {slotsLoading && (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-mauve" size={22} />
              </div>
            )}
            {selectedDate && !slotsLoading && slots && slots.length === 0 && (
              <p className="text-center text-sm text-dark-50/40 py-10">
                No availability this day — please try another date.
              </p>
            )}
            {selectedDate && !slotsLoading && grouped && slots && slots.length > 0 && (
              <div className="space-y-6">
                {(['Morning', 'Afternoon', 'Evening'] as const).map(
                  period =>
                    grouped[period].length > 0 && (
                      <div key={period}>
                        <p className="text-2xs tracking-widest uppercase text-dark-50/40 mb-3">
                          {period}
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                          {grouped[period].map(s => (
                            <button
                              key={s.start}
                              onClick={() => {
                                setSelectedSlot(s)
                                setSubmitError(null)
                                setStep('details')
                              }}
                              className="rounded-xl border border-cream-200 bg-cream-100/40 py-2.5 text-sm text-dark-50/80 hover:border-mauve hover:bg-mauve hover:text-white transition-all duration-200 ease-luxury"
                            >
                              {fmtTime(s.start, tz)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ),
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3 — details */}
        {config && step === 'details' && interestMeta && selectedSlot && (
          <div className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8 shadow-sm max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStep('time')}
                className="flex items-center gap-1.5 text-2xs tracking-widest uppercase text-dark-50/50 hover:text-dark-50 transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>
            </div>

            {/* Summary */}
            <div className="rounded-xl bg-mauve-50/50 border border-mauve/15 px-5 py-4 mb-8">
              <p className="font-display text-lg text-dark-50">
                {interest?.title} Consultation
              </p>
              <p className="text-sm text-dark-50/60 mt-0.5">
                {new Date(selectedSlot.start).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  timeZone: tz,
                })}{' '}
                at {fmtTime(selectedSlot.start, tz)} · {interestMeta.duration_minutes} min ·
                Complimentary
              </p>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault()
                submit()
              }}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="First name"
                  value={form.first_name}
                  onChange={e => setForm({ ...form, first_name: e.target.value })}
                  className="w-full rounded-xl border border-cream-200 bg-cream-100/40 px-4 py-3 text-base sm:text-sm text-dark-50 placeholder:text-dark-50/35 focus:outline-none focus:border-mauve/50 focus:ring-2 focus:ring-mauve/15 transition-all"
                />
                <input
                  required
                  placeholder="Last name"
                  value={form.last_name}
                  onChange={e => setForm({ ...form, last_name: e.target.value })}
                  className="w-full rounded-xl border border-cream-200 bg-cream-100/40 px-4 py-3 text-base sm:text-sm text-dark-50 placeholder:text-dark-50/35 focus:outline-none focus:border-mauve/50 focus:ring-2 focus:ring-mauve/15 transition-all"
                />
              </div>
              <input
                required
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-cream-200 bg-cream-100/40 px-4 py-3 text-base sm:text-sm text-dark-50 placeholder:text-dark-50/35 focus:outline-none focus:border-mauve/50 focus:ring-2 focus:ring-mauve/15 transition-all"
              />
              <input
                required
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-cream-200 bg-cream-100/40 px-4 py-3 text-base sm:text-sm text-dark-50 placeholder:text-dark-50/35 focus:outline-none focus:border-mauve/50 focus:ring-2 focus:ring-mauve/15 transition-all"
              />
              <textarea
                rows={3}
                placeholder="Anything we should know? (optional)"
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="w-full rounded-xl border border-cream-200 bg-cream-100/40 px-4 py-3 text-base sm:text-sm text-dark-50 placeholder:text-dark-50/35 focus:outline-none focus:border-mauve/50 focus:ring-2 focus:ring-mauve/15 transition-all resize-none"
              />
              {/* Honeypot */}
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
              />

              <div className="space-y-2 pt-1">
                <label className="flex items-start gap-2.5 text-xs text-dark-50/55 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.email_opt_in}
                    onChange={e => setForm({ ...form, email_opt_in: e.target.checked })}
                    className="mt-0.5 accent-mauve"
                  />
                  Email me exclusive offers and skincare tips
                </label>
                <label className="flex items-start gap-2.5 text-xs text-dark-50/55 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.sms_opt_in}
                    onChange={e => setForm({ ...form, sms_opt_in: e.target.checked })}
                    className="mt-0.5 accent-mauve"
                  />
                  Text me appointment reminders and offers
                </label>
              </div>

              {submitError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {submitError}
                </p>
              )}

              <Button type="submit" size="lg" isLoading={submitting} className="w-full">
                Confirm Booking
              </Button>

              {config.cancellation_policy && (
                <p className="text-2xs text-dark-50/35 leading-relaxed pt-2">
                  {config.cancellation_policy}
                </p>
              )}
            </form>
          </div>
        )}

        {/* Step 4 — confirmed */}
        {step === 'done' && selectedSlot && (
          <div className="text-center max-w-lg mx-auto py-8">
            <div className="size-16 mx-auto rounded-full bg-gradient-to-br from-mauve-50 to-mauve-100 flex items-center justify-center ring-1 ring-mauve/15 mb-6">
              <CalendarCheck size={28} className="text-mauve-700" strokeWidth={1.6} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-dark-50 mb-3">
              You’re <span className="italic">Booked</span>
            </h2>
            <p className="text-dark-50/60 mb-2">
              {interest?.title} Consultation ·{' '}
              {new Date(selectedSlot.start).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                timeZone: tz,
              })}{' '}
              at {fmtTime(selectedSlot.start, tz)}
            </p>
            <p className="text-sm text-dark-50/45 mb-8">
              A confirmation is on its way to {form.email}. We look forward to meeting you at 16850
              Collins Ave, Sunny Isles Beach.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {confirmation?.token && (
                <a
                  href={`https://manhattan-laser-spa.xn--lumcrm-5ua.com/book/manage/${confirmation.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-11 px-7 bg-mauve text-white text-xs font-medium tracking-widest uppercase hover:bg-mauve-600 transition-all ease-luxury"
                >
                  Manage Appointment
                </a>
              )}
              <a
                href={portalLoginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-11 px-7 border border-mauve text-mauve text-xs font-medium tracking-widest uppercase hover:bg-mauve hover:text-white transition-all ease-luxury"
              >
                Client Portal
              </a>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
}
