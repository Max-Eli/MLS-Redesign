'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { PromoPopup } from '@/components/ui/PromoPopup'
import { MothersDayPopup } from '@/components/ui/MothersDayPopup'
import { IndependenceDayPopup } from '@/components/ui/IndependenceDayPopup'
import { BotoxEventPopup } from '@/components/ui/BotoxEventPopup'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'

// Current campaign: The Botox Event (Oct 15, 2026) — AnnouncementBar +
// BotoxEventPopup. AnniversaryPopup stays unmounted (event ended 2026-08-07);
// kept in the codebase for reuse.

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin  = pathname?.startsWith('/admin')
  // Don't run the campaign promo on the event page itself — the whole page
  // IS the promo, no need to popup or announce over the top of it.
  const isBotoxEvent = pathname === '/botox-event'

  if (isAdmin) return <>{children}</>

  return (
    <>
      {!isBotoxEvent && <AnnouncementBar />}
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <MothersDayPopup />
      <IndependenceDayPopup />
      {!isBotoxEvent && <BotoxEventPopup />}
      <PromoPopup />
    </>
  )
}
