'use client'

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/hooks/useCart'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Lock, ShieldCheck } from 'lucide-react'

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

function CheckoutForm({ finalTotal }: { finalTotal: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const { items, total, clearCart } = useCart()
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

function CheckoutPageInner() {
  const { items, total, itemCount } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    if (!items.length) return

    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, promoCode: promoApplied?.code }),
    })
      .then((r) => r.json())
      .then(({ clientSecret }) => {
        setClientSecret(clientSecret)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  // Re-fetch payment intent when promo changes so Stripe reflects the new amount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, promoApplied])

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
                  onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-cream-300 bg-cream text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:ring-2 focus:ring-mauve/20 focus:border-mauve/40 transition-all"
                />
                <button
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

      {/* Payment form */}
      <div className="bg-white rounded-3xl shadow-luxury p-8">
        <h2 className="font-display text-2xl font-light text-dark-50 mb-6">Payment</h2>
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
            <CheckoutForm finalTotal={finalTotal} />
          </Elements>
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
