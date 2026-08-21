'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { PromoPopup } from '@/components/ui/PromoPopup'
import { MothersDayPopup } from '@/components/ui/MothersDayPopup'
import { IndependenceDayPopup } from '@/components/ui/IndependenceDayPopup'

// Anniversary promo (AnniversaryPopup + AnnouncementBar) unmounted after the
// event on 2026-08-07 stopped accepting RSVPs. Files kept in the codebase
// for reuse — re-mount here for future anniversary campaigns.

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin  = pathname?.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <MothersDayPopup />
      <IndependenceDayPopup />
      <PromoPopup />
    </>
  )
}
