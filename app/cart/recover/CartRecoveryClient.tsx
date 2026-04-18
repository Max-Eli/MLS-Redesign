'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import type { CartItem } from '@/types/cart'

interface Props {
  items:     CartItem[]
  firstName: string
  lastName:  string
  email:     string
  phone:     string
}

export function CartRecoveryClient({ items, firstName, lastName, email, phone }: Props) {
  const router = useRouter()
  const { loadCart } = useCart()
  const didRun = useRef(false)

  useEffect(() => {
    if (didRun.current) return
    didRun.current = true

    loadCart(items)

    try {
      sessionStorage.setItem(
        'mls-cart-prefill',
        JSON.stringify({ firstName, lastName, email, phone }),
      )
    } catch {}

    const t = setTimeout(() => router.replace('/checkout'), 700)
    return () => clearTimeout(t)
  }, [items, firstName, lastName, email, phone, loadCart, router])

  return (
    <div className="flex items-center justify-center gap-3 text-sm text-dark-50/50">
      <span className="inline-block size-2 rounded-full bg-mauve animate-pulse" />
      Redirecting to checkout…
    </div>
  )
}
