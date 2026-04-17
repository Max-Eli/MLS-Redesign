'use client'

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/hooks/useCart'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Lock, ShieldCheck, User, Mail, Phone, ChevronRight, Check } from 'lucide-react'

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

type Contact = {
  firstName: string
  lastName:  string
  email:     string
  phone:     string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10
}

function CheckoutForm({ finalTotal, contact }: { finalTotal: number; contact: Contact }) {
  const stripe = useStripe()
  const elements = useElements()
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setStatus('processing')
    setErrorMsg(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: {
            name:  `${contact.firstName} ${contact.lastName}`.trim(),
            email: contact.email.trim(),
            phone: contact.phone.trim(),
          },
        },
      },
    })

    if (error) {
      setStatus('error')
      setErrorMsg(error.message ?? 'Payment failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card', 'affirm', 'klarna'],
          fields: {
            billingDetails: {
              name:  'never',
              email: 'never',
              phone: 'never',
            },
          },
        }}
      />

      {errorMsg && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="xl"
        className="w-full"
        isLoading={status === 'processing'}
        disabled={!stripe || status === 'processing'}
      >
        <Lock size={16} />
        Pay ${finalTotal.toFixed(2)}
      </Button>

      <div className="flex items-center justify-center gap-2 text-2xs text-dark-50/40">
        <ShieldCheck size={13} className="text-mauve" />
        Secured by Stripe · Affirm · Klarna accepted
      </div>
    </form>
  )
}

function ContactStep({
  contact,
  setContact,
  onContinue,
}: {
  contact: Contact
  setContact: (c: Contact) => void
  onContinue: () => void
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>({})

  function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    const next: Partial<Record<keyof Contact, string>> = {}
    if (!contact.firstName.trim()) next.firstName = 'Required'
    if (!contact.lastName.trim())  next.lastName  = 'Required'
    if (!isValidEmail(contact.email)) next.email = 'Enter a valid email'
    if (!isValidPhone(contact.phone)) next.phone = 'Enter a valid phone number'
    setErrors(next)
    if (Object.keys(next).length === 0) onContinue()
  }

  return (
    <form onSubmit={handleContinue} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
            First Name
          </label>
          <input
            type="text"
            autoComplete="given-name"
            value={contact.firstName}
            onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
            className="w-full h-12 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors"
            placeholder="Sofia"
          />
          {errors.firstName && <p className="mt-1.5 text-2xs text-red-500 pl-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
            Last Name
          </label>
          <input
            type="text"
            autoComplete="family-name"
            value={contact.lastName}
            onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
            className="w-full h-12 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors"
            placeholder="Martinez"
          />
          {errors.lastName && <p className="mt-1.5 text-2xs text-red-500 pl-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
          Email Address
        </label>
        <input
          type="email"
          autoComplete="email"
          value={contact.email}
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
          className="w-full h-12 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors"
          placeholder="sofia@example.com"
        />
        {errors.email && <p className="mt-1.5 text-2xs text-red-500 pl-1">{errors.email}</p>}
        <p className="mt-1.5 text-2xs text-dark-50/40 pl-1">We'll send your receipt here.</p>
      </div>

      <div>
        <label className="block text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          autoComplete="tel"
          value={contact.phone}
          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          className="w-full h-12 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-1 focus:ring-mauve transition-colors"
          placeholder="(305) 000-0000"
        />
        {errors.phone && <p className="mt-1.5 text-2xs text-red-500 pl-1">{errors.phone}</p>}
        <p className="mt-1.5 text-2xs text-dark-50/40 pl-1">So our team can reach you to schedule.</p>
      </div>

      <Button type="submit" variant="primary" size="xl" className="w-full">
        Continue to Payment
        <ChevronRight size={16} />
      </Button>
    </form>
  )
}

function ContactSummary({ contact, onEdit }: { contact: Contact; onEdit: () => void }) {
  return (
    <div className="rounded-2xl bg-cream-50 border border-cream-200 p-5 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 text-sm text-dark-50">
            <User size={14} className="text-mauve flex-shrink-0" />
            <span className="font-medium truncate">{contact.firstName} {contact.lastName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-dark-50/70">
            <Mail size={14} className="text-mauve flex-shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-dark-50/70">
            <Phone size={14} className="text-mauve flex-shrink-0" />
            <span>{contact.phone}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-2xs font-medium tracking-widest uppercase text-mauve-700 hover:text-mauve-800 transition-colors flex-shrink-0"
        >
          Edit
        </button>
      </div>
    </div>
  )
}

function CheckoutPageInner() {
  const { items, total, itemCount } = useCart()
  const [step, setStep] = useState<'contact' | 'payment'>('contact')
  const [contact, setContact] = useState<Contact>({ firstName: '', lastName: '', email: '', phone: '' })
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState<{ code: string; discountCents: number; label: string } | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)

  const discountDollars = promoApplied ? promoApplied.discountCents / 100 : 0
  const finalTotal = Math.max(0, total - discountDollars)

  async function applyPromo() {
    if (!promoInput.trim()) return
    setPromoLoading(true)
    setPromoError(null)
    try {
      const res = await fetch('/api/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoInput.trim() }),
      })
      const data = await res.json()
      if (data.valid) {
        setPromoApplied({ code: promoInput.trim().toUpperCase(), discountCents: data.discountCents, label: data.label })
        setPromoInput('')
      } else {
        setPromoError(data.error ?? 'Invalid promo code')
      }
    } catch {
      setPromoError('Could not validate code. Please try again.')
    } finally {
      setPromoLoading(false)
    }
  }

  // Only create the PaymentIntent after the customer has submitted contact info —
  // re-runs if the promo changes so Stripe reflects the new amount.
  useEffect(() => {
    if (step !== 'payment' || !items.length) return

    setLoading(true)
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        promoCode: promoApplied?.code,
        firstName: contact.firstName,
        lastName:  contact.lastName,
        email:     contact.email,
        phone:     contact.phone,
      }),
    })
      .then((r) => r.json())
      .then(({ clientSecret }) => {
        setClientSecret(clientSecret)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, items, promoApplied])

  if (!itemCount) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-2xl font-light text-dark-50/50">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Order summary */}
      <div className="bg-white rounded-3xl shadow-luxury p-8">
        <h2 className="font-display text-2xl font-light text-dark-50 mb-6">Order Summary</h2>
        <ul className="space-y-4 mb-6">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-dark-50/70">
                {item.name}
                {item.quantity > 1 && (
                  <span className="text-dark-50/40"> × {item.quantity}</span>
                )}
              </span>
              <span className="font-medium text-dark-50">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        {/* Promo code input */}
        <div className="border-t border-cream-200 pt-4 mb-2">
          {promoApplied ? (
            <div className="flex items-center justify-between bg-mauve-50 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-mauve tracking-wide">{promoApplied.code}</p>
                <p className="text-xs text-mauve/70">{promoApplied.label}</p>
              </div>
              <button
                onClick={() => setPromoApplied(null)}
                className="text-xs text-dark-50/40 hover:text-dark-50 underline transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoInput}
                  onChange={(e) => { setPromoInput(e.target.value); setPromoError(null) }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyPromo())}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-cream-300 bg-cream text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:ring-2 focus:ring-mauve/20 focus:border-mauve/40 transition-all"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  disabled={promoLoading || !promoInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-dark-50 hover:bg-dark text-white text-xs font-medium tracking-widest uppercase transition-colors disabled:opacity-40"
                >
                  {promoLoading ? '...' : 'Apply'}
                </button>
              </div>
              {promoError && (
                <p className="mt-1.5 text-xs text-red-500 pl-1">{promoError}</p>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-cream-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-dark-50/60">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-sm text-mauve font-medium">
              <span>Discount ({promoApplied.code})</span>
              <span>−${discountDollars.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-cream-200">
            <span className="font-medium text-dark-50">Total</span>
            <span className="font-display text-3xl font-light text-dark-50">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 bg-mauve-50 rounded-xl p-4">
          <p className="text-xs text-mauve-700 leading-relaxed">
            <strong>Buy now, pay later</strong> — choose Affirm or Klarna at payment to split
            your purchase into interest-free installments.
          </p>
        </div>
      </div>

      {/* Right column — contact + payment */}
      <div className="bg-white rounded-3xl shadow-luxury p-8">
        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className={`size-7 rounded-full flex items-center justify-center text-2xs font-semibold transition-colors ${
              step === 'contact' ? 'bg-mauve text-white' : 'bg-mauve-100 text-mauve-700'
            }`}>
              {step === 'payment' ? <Check size={14} /> : '1'}
            </div>
            <span className={`text-xs tracking-widest uppercase transition-colors ${
              step === 'contact' ? 'text-dark-50 font-semibold' : 'text-dark-50/50'
            }`}>
              Your Info
            </span>
          </div>
          <div className="flex-1 h-px bg-cream-200" />
          <div className="flex items-center gap-2">
            <div className={`size-7 rounded-full flex items-center justify-center text-2xs font-semibold transition-colors ${
              step === 'payment' ? 'bg-mauve text-white' : 'bg-cream-200 text-dark-50/40'
            }`}>
              2
            </div>
            <span className={`text-xs tracking-widest uppercase transition-colors ${
              step === 'payment' ? 'text-dark-50 font-semibold' : 'text-dark-50/50'
            }`}>
              Payment
            </span>
          </div>
        </div>

        {step === 'contact' ? (
          <>
            <h2 className="font-display text-2xl font-light text-dark-50 mb-2">Your Information</h2>
            <p className="text-sm text-dark-50/50 mb-6">
              We'll use this to send your receipt and schedule your appointment.
            </p>
            <ContactStep
              contact={contact}
              setContact={setContact}
              onContinue={() => setStep('payment')}
            />
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl font-light text-dark-50 mb-6">Payment</h2>

            <ContactSummary contact={contact} onEdit={() => setStep('contact')} />

            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 rounded-xl bg-cream-200 animate-pulse" />
                ))}
              </div>
            )}
            {!stripeKey && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                Payment is not configured yet. Please contact us at 305-705-3997 to book.
              </div>
            )}
            {clientSecret && stripePromise && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'flat',
                    variables: {
                      colorPrimary: '#BA7587',
                      colorBackground: '#FAFAF8',
                      colorText: '#1A1A1A',
                      colorDanger: '#ef4444',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      borderRadius: '12px',
                      spacingUnit: '4px',
                    },
                  },
                }}
              >
                <CheckoutForm finalTotal={finalTotal} contact={contact} />
              </Elements>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-cream pt-32 pb-20">
      <Container size="lg">
        <div className="mb-10">
          <p className="eyebrow mb-3">Secure Checkout</p>
          <h1 className="display-md text-dark-50">Complete Your Order</h1>
        </div>
        <CheckoutPageInner />
      </Container>
    </div>
  )
}
