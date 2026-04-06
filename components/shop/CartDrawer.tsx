'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-dark/50 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-luxury-lg flex flex-col transition-transform duration-500 ease-luxury',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-mauve" />
            <h2 className="font-display text-xl font-light text-dark-50">
              Cart{' '}
              {itemCount > 0 && (
                <span className="text-sm text-dark-50/40">({itemCount})</span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-dark-50/40 hover:text-dark-50 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
              <ShoppingBag size={48} strokeWidth={1} className="text-dark-50/20" />
              <p className="font-display text-lg font-light text-dark-50/50">
                Your cart is empty
              </p>
              <p className="text-sm text-dark-50/40">
                Browse our treatments and book your session.
              </p>
              <Button variant="primary" size="md" onClick={closeCart} asChild>
                <Link href="/shop">Explore Treatments</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4 border-b border-cream-100">
                  {/* Image */}
                  <div className="relative size-16 flex-shrink-0 rounded-xl overflow-hidden bg-cream-200">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-mauve-50 to-cream-200" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-50 leading-tight line-clamp-2">
                      {item.name}
                    </p>
                    {item.category && (
                      <p className="text-2xs text-mauve tracking-wider uppercase mt-0.5">
                        {item.category}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="size-6 rounded-full border border-cream-300 flex items-center justify-center text-dark-50/50 hover:text-dark-50 hover:border-dark-50/30 transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="size-6 rounded-full border border-cream-300 flex items-center justify-center text-dark-50/50 hover:text-dark-50 hover:border-dark-50/30 transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-dark-50">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-dark-50/30 hover:text-mauve transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-cream-200 space-y-4">
            {/* Affirm/Klarna note */}
            <p className="text-2xs text-dark-50/40 text-center">
              Pay in installments with Affirm or Klarna at checkout
            </p>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-dark-50/60">Subtotal</span>
              <span className="font-display text-2xl font-light text-dark-50">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Checkout CTA */}
            <Button variant="primary" size="lg" className="w-full" asChild>
              <Link href="/checkout" onClick={closeCart}>
                Proceed to Checkout
              </Link>
            </Button>
            <Button variant="ghost" size="md" className="w-full" asChild>
              <Link href="/shop" onClick={closeCart}>
                Continue Shopping
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
