import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { CTABanner } from '@/components/home/CTABanner'
import { fetchActivePromotions } from '@/lib/promotions'
import type { Promotion } from '@/lib/promotions'

export const revalidate = 300 // refresh every 5 minutes

export const metadata: Metadata = {
  title: 'Special Offers & Promotions',
  description: 'Exclusive treatment packages and limited-time offers at Manhattan Laser Spa in Sunny Isles Beach, FL.',
  alternates: { canonical: 'https://manhattanlaserspa.com/promotions' },
}

function fmt(n: number | null) {
  if (!n) return null
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
}

function fmtDate(s: string | null) {
  if (!s) return null
  return new Date(s).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function PromotionCard({ promo }: { promo: Promotion }) {
  const savings = promo.original_price && promo.promo_price
    ? promo.original_price - promo.promo_price
    : null

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-500 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-56 bg-cream-200 overflow-hidden">
        {promo.image_url ? (
          <Image
            src={promo.image_url}
            alt={promo.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-mauve-50 via-cream-100 to-gold-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          {promo.badge && (
            <span className="bg-mauve/90 backdrop-blur-sm text-white text-2xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full">
              {promo.badge}
            </span>
          )}
          {savings && (
            <span className="bg-gold/90 backdrop-blur-sm text-dark text-2xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full">
              Save {fmt(savings)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl font-light text-dark-50 mb-2 leading-snug group-hover:text-mauve transition-colors">
          {promo.title}
        </h3>

        {promo.description && (
          <p className="text-sm text-dark-50/60 leading-relaxed mb-4 line-clamp-2">{promo.description}</p>
        )}

        {promo.services && (
          <div className="mb-4">
            <p className="text-2xs font-medium tracking-widest uppercase text-dark-50/30 mb-2">What&apos;s Included</p>
            <div className="flex flex-wrap gap-1.5">
              {promo.services.split(',').map(s => (
                <span key={s} className="text-xs bg-cream-100 text-dark-50/60 px-2.5 py-1 rounded-full">
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end justify-between pt-4 border-t border-cream-100">
          <div>
            {promo.promo_price != null ? (
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-light text-dark-50">{fmt(promo.promo_price)}</span>
                {promo.original_price != null && (
                  <span className="text-sm text-dark-50/30 line-through">{fmt(promo.original_price)}</span>
                )}
              </div>
            ) : (
              <span className="text-sm text-dark-50/40 italic">Call for pricing</span>
            )}
            {promo.ends_at && (
              <div className="flex items-center gap-1 mt-1">
                <Clock size={11} className="text-dark-50/30" />
                <p className="text-2xs text-dark-50/30">Ends {fmtDate(promo.ends_at)}</p>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-mauve hover:text-mauve-600 transition-colors"
          >
            Book Now
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function PromotionsPage() {
  const promotions = await fetchActivePromotions()

  return (
    <>
      <div className="min-h-screen bg-cream">
        <div className="bg-dark pt-32 pb-20">
          <Container>
            <p className="eyebrow mb-4 text-mauve-400">Special Offers</p>
            <h1 className="display-xl text-white max-w-2xl">
              Current Promotions
            </h1>
            <p className="mt-6 text-base text-white/50 max-w-lg leading-relaxed">
              Exclusive packages and limited-time deals on our most popular treatments — curated for maximum results and value.
            </p>
          </Container>
        </div>

        <Container className="py-16">
          {promotions.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-2xl font-light text-dark-50/40 mb-4">No active promotions right now</p>
              <p className="text-sm text-dark-50/30 mb-8">Check back soon or contact us to learn about current offers.</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-mauve hover:text-mauve-600 transition-colors"
              >
                Contact Us <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promotions.map(p => (
                <PromotionCard key={p.id} promo={p} />
              ))}
            </div>
          )}
        </Container>
      </div>
      <CTABanner />
    </>
  )
}
