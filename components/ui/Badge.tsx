import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'mauve' | 'gold' | 'dark' | 'outline'
}

export function Badge({ children, className, variant = 'mauve' }: BadgeProps) {
  const variants = {
    mauve:   'bg-mauve-50 text-mauve-700 border border-mauve-100',
    gold:    'bg-gold-50 text-gold-600 border border-gold-100',
    dark:    'bg-dark text-white border border-dark',
    outline: 'bg-transparent text-dark-50 border border-cream-300',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-2xs font-medium tracking-widest2 uppercase rounded-full',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
