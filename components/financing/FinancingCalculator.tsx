'use client'

import { useState, useMemo } from 'react'
import { Calculator, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const CHERRY_URL = 'https://pay.withcherry.com/manhattanlaserspa?utm_source=merchant&utm_medium=website'

const plans = [
  { months: 3,  apr: 0,     label: '3 Months',  tag: '0% APR' },
  { months: 6,  apr: 0,     label: '6 Months',  tag: '0% APR' },
  { months: 12, apr: 9.99,  label: '12 Months', tag: 'Low APR' },
  { months: 18, apr: 14.99, label: '18 Months', tag: 'Low APR' },
  { months: 24, apr: 19.99, label: '24 Months', tag: 'Extended' },
]

function calcMonthly(amount: number, apr: number, months: number): number {
  if (apr === 0) return amount / months
  const r = apr / 100 / 12
  return (amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

export function FinancingCalculator() {
  const [amount, setAmount] = useState('500')
  const [selectedPlan, setSelectedPlan] = useState(0)

  const numAmount = useMemo(() => {
    const n = parseFloat(amount.replace(/[^0-9.]/g, ''))
    return isNaN(n) ? 0 : Math.min(n, 25000)
  }, [amount])

  const plan = plans[selectedPlan]
  const monthly = numAmount > 0 ? calcMonthly(numAmount, plan.apr, plan.months) : 0
  const total   = monthly * plan.months

  function handleAmountChange(val: string) {
    const cleaned = val.replace(/[^0-9.]/g, '')
    setAmount(cleaned)
  }

  const presets = [250, 500, 1000, 1500, 2500, 5000]

  return (
    <div className="bg-white rounded-3xl border border-cream-200 shadow-luxury overflow-hidden">
      {/* Header */}
      <div className="bg-dark px-8 py-6 flex items-center gap-3">
        <div className="size-9 rounded-full bg-mauve/20 flex items-center justify-center">
          <Calculator size={18} className="text-mauve-300" />
        </div>
        <div>
          <h3 className="font-display text-xl font-light text-white">Payment Calculator</h3>
          <p className="text-xs text-white/40">Estimate your monthly payments</p>
        </div>
      </div>

      <div className="p-8">
        {/* Amount input */}
        <div className="mb-6">
          <label className="block text-2xs font-semibold tracking-widest uppercase text-dark-50/50 mb-3">
            Treatment Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-light text-dark-50/40">$</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={e => handleAmountChange(e.target.value)}
              className="w-full pl-8 pr-4 py-4 text-2xl font-display font-light text-dark-50 border border-cream-200 rounded-xl focus:outline-none focus:border-mauve transition-colors bg-cream-50"
              placeholder="0"
            />
          </div>
          {/* Presets */}
          <div className="flex flex-wrap gap-2 mt-3">
            {presets.map(p => (
              <button
                key={p}
                onClick={() => setAmount(String(p))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  numAmount === p
                    ? 'bg-mauve text-white'
                    : 'bg-cream-100 text-dark-50/50 hover:bg-cream-200'
                }`}
              >
                ${p.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Plan selector */}
        <div className="mb-8">
          <label className="block text-2xs font-semibold tracking-widest uppercase text-dark-50/50 mb-3">
            Payment Plan
          </label>
          <div className="grid grid-cols-5 gap-2">
            {plans.map((p, i) => (
              <button
                key={p.months}
                onClick={() => setSelectedPlan(i)}
                className={`flex flex-col items-center py-3 px-1 rounded-xl border text-center transition-all ${
                  selectedPlan === i
                    ? 'border-mauve bg-mauve/5 shadow-sm'
                    : 'border-cream-200 hover:border-mauve/40'
                }`}
              >
                <span className={`text-sm font-semibold ${selectedPlan === i ? 'text-mauve' : 'text-dark-50'}`}>
                  {p.months}
                </span>
                <span className="text-2xs text-dark-50/40">mo</span>
                <span className={`text-2xs font-medium mt-1 ${p.apr === 0 ? 'text-green-600' : 'text-dark-50/50'}`}>
                  {p.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className={`rounded-2xl p-6 mb-6 transition-colors ${numAmount > 0 ? 'bg-mauve/5 border border-mauve/15' : 'bg-cream-50 border border-cream-200'}`}>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-2xs font-semibold tracking-widest uppercase text-dark-50/40 mb-1">
                Est. Monthly Payment
              </p>
              <p className="font-display text-5xl font-light text-dark-50">
                {numAmount > 0
                  ? `$${monthly.toFixed(2)}`
                  : <span className="text-dark-50/20">—</span>
                }
              </p>
            </div>
            {plan.apr === 0 && numAmount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-full px-3 py-1">
                <span className="text-xs font-semibold text-green-700">0% Interest</span>
              </div>
            )}
          </div>
          {numAmount > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-mauve/10">
              <div>
                <p className="text-2xs text-dark-50/40 mb-0.5">Purchase</p>
                <p className="text-sm font-medium text-dark-50">${numAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-2xs text-dark-50/40 mb-0.5">Term</p>
                <p className="text-sm font-medium text-dark-50">{plan.months} months</p>
              </div>
              <div>
                <p className="text-2xs text-dark-50/40 mb-0.5">Total Cost</p>
                <p className="text-sm font-medium text-dark-50">${total.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        <a
          href={CHERRY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-mauve text-white py-4 rounded-xl text-sm font-semibold tracking-wider hover:bg-mauve-600 transition-colors"
        >
          Apply Now with Cherry
          <ChevronRight size={16} />
        </a>

        <p className="text-center text-2xs text-dark-50/30 mt-4 leading-relaxed">
          Estimated payments are for illustrative purposes only. Actual rates and terms are subject to credit approval by Cherry. APR ranges from 0%–29.99%.
        </p>
      </div>
    </div>
  )
}
