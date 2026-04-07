'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image src="/mlsfavicon.png" alt="Manhattan Laser Spa" width={56} height={56} />
        </div>
        <h1 className="text-center font-display text-2xl font-light text-white mb-1">Admin Portal</h1>
        <p className="text-center text-sm text-white/30 mb-8">Manhattan Laser Spa</p>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
          <div>
            <label className="block text-xs font-medium tracking-widest uppercase text-white/40 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-mauve/50 focus:ring-1 focus:ring-mauve/30 transition-colors"
              placeholder="Enter admin password"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-mauve hover:bg-mauve-600 text-white text-xs font-semibold tracking-widest uppercase rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
