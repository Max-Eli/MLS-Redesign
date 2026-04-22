'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/orders')
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="size-14 rounded-2xl bg-white border border-cream-200 shadow-luxury flex items-center justify-center mb-4">
            <Image src="/mlsfavicon.png" alt="Manhattan Laser Spa" width={32} height={32} />
          </div>
          <h1 className="font-display text-3xl font-light text-dark-50">Admin Portal</h1>
          <p className="text-xs tracking-widest uppercase text-dark-50/40 mt-2">Manhattan Laser Spa</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-cream-200 rounded-2xl shadow-luxury p-8 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-2xs font-medium tracking-widest uppercase text-dark-50/50 mb-2">
              <Lock size={11} />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full h-11 px-4 bg-cream-50 border border-cream-200 rounded-xl text-sm text-dark-50 placeholder:text-dark-50/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 transition-all"
              placeholder="Enter admin password"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-mauve hover:bg-mauve-600 text-white text-xs font-semibold tracking-widest uppercase rounded-xl shadow-luxury transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-2xs tracking-widest uppercase text-dark-50/30 mt-6">
          Staff access only
        </p>
      </div>
    </div>
  )
}
