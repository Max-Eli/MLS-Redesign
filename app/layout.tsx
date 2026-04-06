import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartProvider } from '@/components/providers/CartProvider'
import { CartDrawer } from '@/components/shop/CartDrawer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://manhattanlaserspa.com'),
  title: {
    default: 'Manhattan Laser Spa | Luxury Medical Spa in Sunny Isles Beach, FL',
    template: '%s | Manhattan Laser Spa',
  },
  description:
    'Sunny Isles Beach\'s premier luxury medical spa. Laser hair removal, body contouring, injectables, and advanced skin treatments at 16850 Collins Ave.',
  keywords: [
    'medical spa Sunny Isles Beach',
    'laser hair removal Sunny Isles Beach',
    'CoolSculpting Sunny Isles',
    'Botox Sunny Isles Beach FL',
    'medspa Collins Ave',
    'luxury medical spa Florida',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://manhattanlaserspa.com',
    siteName: 'Manhattan Laser Spa',
    title: 'Manhattan Laser Spa | Luxury Medical Spa in Sunny Isles Beach, FL',
    description:
      'Sunny Isles Beach\'s premier luxury medical spa. Advanced aesthetic treatments on Collins Ave.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Manhattan Laser Spa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manhattan Laser Spa | Sunny Isles Beach, FL',
    description: 'Luxury medical spa & aesthetics in Sunny Isles Beach, Florida.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://manhattanlaserspa.com' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>

        {/* LocalBusiness Schema — Sunny Isles Beach only */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MedSpa',
              name: 'Manhattan Laser Spa',
              url: 'https://manhattanlaserspa.com',
              telephone: '+1-305-705-3997',
              priceRange: '$$$',
              image: 'https://manhattanlaserspa.com/og-image.jpg',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '16850 Collins Ave, Suite 105',
                addressLocality: 'Sunny Isles Beach',
                addressRegion: 'FL',
                postalCode: '33160',
                addressCountry: 'US',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 25.9340,
                longitude: -80.1228,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '09:00',
                  closes: '18:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Saturday'],
                  opens: '10:00',
                  closes: '16:00',
                },
              ],
              sameAs: [
                'https://www.instagram.com/manhattanlaserspa',
                'https://www.facebook.com/manhattanlaserspa',
              ],
            }),
          }}
        />
      </body>
    </html>
  )
}
