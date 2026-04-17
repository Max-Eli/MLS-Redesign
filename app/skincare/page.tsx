import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, ShieldCheck, Stethoscope } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { CTABanner } from '@/components/home/CTABanner'
import { BRANDS, fetchFeaturedSkincare, buildBrandProductUrl, formatSkincarePrice } from '@/lib/skincare'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Medical-Grade Skincare | AlumierMD & Epicutis',
  description:
    'Curated medical-grade skincare from AlumierMD and Epicutis, prescribed by the licensed specialists at Manhattan Laser Spa in Sunny Isles Beach, FL.',
  alternates: { canonical: 'https://manhattanlaserspa.com/skincare' },
}

export default async function SkincareLandingPage() {
  const featured = await fetchFeaturedSkincare(4)

  return (
    <main className="bg-cream">
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <Container>
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Medical-Grade Skincare</p>
            <h1 className="display-lg text-dark-50 mb-6">
              Results-Driven Skincare,<br />
              <span className="italic font-cormorant text-mauve">Professionally Prescribed.</span>
            </h1>
            <p className="text-lg text-dark-50/60 leading-relaxed max-w-2xl">
              The treatments you receive in our spa work best when supported by the right
              home regimen. We've curated two medical-grade brands — AlumierMD and Epicutis —
              that our specialists trust to help our clients maintain and extend their results.
            </p>
          </div>
        </Container>

        {/* Decorative accent */}
        <div className="absolute -top-24 -right-24 size-[500px] rounded-full bg-mauve-50/50 blur-3xl pointer-events-none" />
      </section>

      {/* Why medical-grade */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center px-4">
              <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-mauve-50 mb-4">
                <Stethoscope size={22} className="text-mauve" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-light text-dark-50 mb-2">
                Professionally Curated
              </h3>
              <p className="text-sm text-dark-50/60 leading-relaxed">
                Our specialists select every product personally — these are the same
                regimens we use on our most demanding clients.
              </p>
            </div>
            <div className="text-center px-4">
              <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-mauve-50 mb-4">
                <ShieldCheck size={22} className="text-mauve" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-light text-dark-50 mb-2">
                Clinical-Strength
              </h3>
              <p className="text-sm text-dark-50/60 leading-relaxed">
                Medical-grade formulations sold only through licensed professionals —
                higher active concentrations than retail skincare.
              </p>
            </div>
            <div className="text-center px-4">
              <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-mauve-50 mb-4">
                <Sparkles size={22} className="text-mauve" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-light text-dark-50 mb-2">
                Extends Your Results
              </h3>
              <p className="text-sm text-dark-50/60 leading-relaxed">
                The right home care protects the investment of your in-spa treatments
                and keeps your skin looking its best between visits.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Brand cards */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="eyebrow mb-3">Our Brands</p>
            <h2 className="display-md text-dark-50 mb-4">Two Brands We Trust</h2>
            <p className="text-base text-dark-50/60 leading-relaxed">
              Each brand complements the other — AlumierMD for comprehensive regimens,
              Epicutis for advanced barrier repair and lipid science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* AlumierMD */}
            <Link
              href="/skincare/alumiermd"
              className="group relative bg-white rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-500 ease-luxury hover:-translate-y-1"
            >
              <div className="p-10">
                <p className="eyebrow mb-4">Brand 01</p>
                <h3 className="font-display text-4xl md:text-5xl font-light text-dark-50 mb-4 group-hover:text-mauve transition-colors">
                  AlumierMD
                </h3>
                <p className="text-base text-dark-50/60 leading-relaxed mb-8">
                  {BRANDS.alumiermd.tagline} Over 40 results-driven formulations
                  spanning serums, moisturizers, sunscreen, and targeted regimens for
                  anti-aging, brightening, sensitivity, and blemish-prone skin.
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-mauve group-hover:text-mauve-700 transition-colors">
                  Browse AlumierMD
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Epicutis (coming soon placeholder) */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-luxury">
              <div className="p-10 opacity-70">
                <p className="eyebrow mb-4">Brand 02</p>
                <h3 className="font-display text-4xl md:text-5xl font-light text-dark-50 mb-4">
                  Epicutis
                </h3>
                <p className="text-base text-dark-50/60 leading-relaxed mb-8">
                  {BRANDS.epicutis.tagline} Coming soon — our Epicutis catalog is
                  currently being curated. In the meantime, ask any of our specialists
                  for a recommendation during your next visit.
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-dark-50/40">
                  Available In-Spa
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured picks */}
      {featured.length > 0 && (
        <section className="py-20 bg-white">
          <Container>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow mb-3">Editor's Picks</p>
                <h2 className="display-sm text-dark-50">Our Specialists' Favorites</h2>
              </div>
              <Link
                href="/skincare/alumiermd"
                className="hidden md:inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-mauve hover:text-mauve-700 transition-colors"
              >
                View All
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
              {featured.map(product => {
                const price = formatSkincarePrice(product.price)
                const href  = buildBrandProductUrl(product.brand, product.external_path)
                return (
                  <a
                    key={product.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="group flex flex-col bg-cream-50 rounded-2xl overflow-hidden hover:shadow-luxury transition-all duration-500 ease-luxury hover:-translate-y-1"
                  >
                    <div className="relative h-48 bg-white overflow-hidden">
                      {product.image_url && (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-contain p-5 transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-2xs font-medium tracking-widest uppercase text-mauve mb-1">
                        AlumierMD
                      </p>
                      <h4 className="font-display text-base font-light text-dark-50 leading-snug mb-2 line-clamp-2">
                        {product.name}
                      </h4>
                      {price && (
                        <span className="text-sm font-medium text-dark-50 mt-auto">{price}</span>
                      )}
                    </div>
                  </a>
                )
              })}
            </div>
          </Container>
        </section>
      )}

      <CTABanner />
    </main>
  )
}
