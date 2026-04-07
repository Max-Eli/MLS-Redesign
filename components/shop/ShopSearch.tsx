'use client'

import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface Props {
  defaultValue?: string
}

export function ShopSearch({ defaultValue = '' }: Props) {
  const [value, setValue] = useState(defaultValue)
  const router = useRouter()
  const searchParams = useSearchParams()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(val: string) {
    setValue(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (val.trim()) {
        params.set('search', val.trim())
        params.delete('page')
        params.delete('category')
      } else {
        params.delete('search')
      }
      router.push(`/shop?${params.toString()}`)
    }, 400)
  }

  function handleClear() {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="relative">
      <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => handleChange(e.target.value)}
        placeholder="Search treatments..."
        className="w-full bg-white/10 border border-white/15 text-white placeholder-white/30 text-sm pl-10 pr-10 py-3 rounded-full focus:outline-none focus:border-mauve-300 focus:bg-white/15 transition-all"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
