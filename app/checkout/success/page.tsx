'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen bg-cream flex items-center">
      <Container size="sm">
        <div className="text-center py-20">
          <div className="flex justify-center mb-8">
            <div className="size-20 rounded-full bg-mauve-50 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-mauve" />
            </div>
          </div>
          <p className="eyebrow mb-4">Order Confirmed</p>
          <h1 className="display-md text-dark-50 mb-4">
            Thank You for Your Purchase
          </h1>
          <p className="text-base text-dark-50/60 leading-relaxed mb-10 max-w-md mx-auto">
            We&apos;ve received your order and will be in touch shortly to schedule your appointment
            at our Sunny Isles Beach location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/contact">Schedule Appointment</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
