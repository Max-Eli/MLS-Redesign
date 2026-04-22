import type { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string
  icon:  LucideIcon
  hint?: string
  tint?: 'mauve' | 'gold' | 'emerald' | 'slate'
}

const TINTS = {
  mauve:   'bg-mauve-50 text-mauve-600',
  gold:    'bg-gold-50 text-gold-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  slate:   'bg-cream-100 text-dark-50',
} as const

export function StatCard({ label, value, icon: Icon, hint, tint = 'mauve' }: Props) {
  return (
    <div className="bg-white border border-cream-200 rounded-2xl p-5 shadow-luxury">
      <div className="flex items-start justify-between mb-4">
        <p className="text-2xs font-medium tracking-widest uppercase text-dark-50/40">{label}</p>
        <span className={`inline-flex items-center justify-center size-8 rounded-lg ${TINTS[tint]}`}>
          <Icon size={15} strokeWidth={2} />
        </span>
      </div>
      <p className="font-display text-3xl font-light text-dark-50 leading-none">{value}</p>
      {hint && <p className="text-xs text-dark-50/40 mt-2">{hint}</p>}
    </div>
  )
}
