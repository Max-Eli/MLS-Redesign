'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { PromoPopup } from '@/components/ui/PromoPopup'
import { MothersDayPopup } from '@/components/ui/MothersDayPopup'
import { IndependenceDayPopup } from '@/components/ui/IndependenceDayPopup'
import { AnniversaryPopup } from '@/components/ui/AnniversaryPopup'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin  = pathname?.startsWith('/admin')
  // Don't run the anniversary promo on the anniversary page itself — the
  // whole page IS the promo, no need to popup or announce over the top of it.
  const isAnniversary = pathname === '/anniversary'

  if (isAdmin) return <>{children}</>

  return (
    <>
      {!isAnniversary && <AnnouncementBar />}
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <MothersDayPopup />
      <IndependenceDayPopup />
      {!isAnniversary && <AnniversaryPopup />}
      <PromoPopup />
    </>
  )
}
