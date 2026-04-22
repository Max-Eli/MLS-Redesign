'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingBag, Tag, Sparkles, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin/orders',     label: 'Orders',      icon: ShoppingBag },
  { href: '/admin/promos',     label: 'Promo Codes', icon: Tag },
  { href: '/admin/promotions', label: 'Promotions',  icon: Sparkles },
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
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-cream-200 flex flex-col">
        <div className="flex items-center gap-3 px-5 py-6 border-b border-cream-200">
          <div className="size-9 rounded-xl bg-gradient-to-br from-mauve-50 to-mauve-100 flex items-center justify-center ring-1 ring-mauve/10">
            <Image src="/mlsfavicon.png" alt="MLS" width={22} height={22} />
          </div>
          <div>
            <p className="font-display text-base font-medium text-dark-50 leading-tight">MLS Admin</p>
            <p className="text-2xs tracking-widest uppercase text-dark-50/40 leading-tight mt-0.5">Manhattan Laser Spa</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ease-luxury',
                  active
                    ? 'bg-mauve-50 text-mauve-700 font-medium'
                    : 'text-dark-50/60 hover:text-dark-50 hover:bg-cream-100'
                )}
              >
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-cream-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-dark-50/50 hover:text-dark-50 hover:bg-cream-100 transition-colors"
          >
            <LogOut size={16} />
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
