'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingBag, Tag, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin/orders', label: 'Orders',     icon: ShoppingBag },
  { href: '/admin/promos', label: 'Promo Codes', icon: Tag },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

  if (pathname === '/admin/login') return <>{children}</>

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0f0f14] flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-dark border-r border-white/8 flex flex-col">
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/8">
          <Image src="/mlsfavicon.png" alt="MLS" width={28} height={28} />
          <div>
            <p className="text-xs font-semibold text-white leading-tight">MLS Admin</p>
            <p className="text-2xs text-white/30 leading-tight">Manhattan Laser Spa</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                pathname.startsWith(href)
                  ? 'bg-mauve/15 text-mauve'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/8">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
