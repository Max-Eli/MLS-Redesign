'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-sans font-medium tracking-widest uppercase transition-all duration-300 ease-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none'

    const variants = {
      primary:
        'bg-mauve text-white hover:bg-mauve-600 focus-visible:ring-mauve shadow-sm hover:shadow-mauve-glow',
      secondary:
        'bg-dark text-white hover:bg-dark-50 focus-visible:ring-dark',
      outline:
        'border border-mauve text-mauve bg-transparent hover:bg-mauve hover:text-white focus-visible:ring-mauve',
      ghost:
        'text-dark-50 bg-transparent hover:bg-cream-100 focus-visible:ring-dark',
      gold:
        'bg-gold text-dark font-semibold hover:bg-gold-500 focus-visible:ring-gold shadow-sm hover:shadow-gold-glow',
    }

    const sizes = {
      sm:  'h-8 px-4 text-2xs',
      md:  'h-10 px-6 text-xs',
      lg:  'h-12 px-8 text-xs',
      xl:  'h-14 px-10 text-xs',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span>Loading…</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
