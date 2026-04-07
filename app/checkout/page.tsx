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

function CheckoutForm() {
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
        Pay ${total.toFixed(2)}
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

  useEffect(() => {
    if (!items.length) return

    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
      .then((r) => r.json())
      .then(({ clientSecret }) => {
        setClientSecret(clientSecret)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [items])

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
        <div className="border-t border-cream-200 pt-4 flex justify-between">
          <span className="font-medium text-dark-50">Total</span>
          <span className="font-display text-3xl font-light text-dark-50">${total.toFixed(2)}</span>
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
            <CheckoutForm />
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
