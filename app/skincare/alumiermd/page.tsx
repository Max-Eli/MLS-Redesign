import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { CTABanner } from '@/components/home/CTABanner'
import { SkincareProductCard } from '@/components/skincare/SkincareProductCard'
import { BRANDS, fetchSkincareProducts, buildBrandProductUrl, getUniqueCategories } from '@/lib/skincare'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'AlumierMD Skincare',
  description:
    'Shop the full AlumierMD catalog curated by the specialists at Manhattan Laser Spa — clinical-strength serums, moisturizers, sunscreen, and regimens for every skin concern.',
  alternates: { canonical: 'https://manhattanlaserspa.com/skincare/alumiermd' },
}

export default async function AlumierMDPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const allProducts = await fetchSkincareProducts('alumiermd')
  const categories  = getUniqueCategories(allProducts)
  const active      = searchParams.category ?? 'all'
  const products    = active === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === active)

  const brand    = BRANDS.alumiermd
  const shopAll  = buildBrandProductUrl('alumiermd', '/collections/all')

  return (
    <main className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14">
        <Container>
          <Link
            href="/skincare"
            className="inline-flex items-center gap-1.5 text-2xs font-medium tracking-widest uppercase text-dark-50/50 hover:text-mauve transition-colors mb-8"
          >
            <ChevronLeft size={14} />
            All Skincare
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-2">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">Brand · Medical-Grade</p>
              <h1 className="display-lg text-dark-50 mb-4">{brand.name}</h1>
              <p className="text-base text-dark-50/60 leading-relaxed">
                {brand.tagline} Our full curated catalog — every product purchased through
                these links is credited to Manhattan Laser Spa, so your order helps support
                the specialists who recommended it to you.
              </p>
            </div>
            <a
              href={shopAll}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-dark-50 hover:bg-dark text-white text-xs font-semibold tracking-widest uppercase transition-colors whitespace-nowrap self-start md:self-auto"
            >
              Visit {brand.name}
              <ExternalLink size={13} />
            </a>
          </div>
        </Container>
      </section>

      {/* Category filter */}
      {categories.length > 0 && (
        <section className="pb-6 sticky top-20 z-20 bg-cream/95 backdrop-blur-sm">
          <Container>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              <Link
                href="/skincare/alumiermd"
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-colors ${
                  active === 'all'
                    ? 'bg-mauve text-white'
                    : 'bg-white text-dark-50/60 hover:text-dark-50 border border-cream-200'
                }`}
              >
                All ({allProducts.length})
              </Link>
              {categories.map(cat => {
                const count = allProducts.filter(p => p.category === cat).length
                return (
                  <Link
                    key={cat}
                    href={`/skincare/alumiermd?category=${encodeURIComponent(cat)}`}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-colors ${
                      active === cat
                        ? 'bg-mauve text-white'
                        : 'bg-white text-dark-50/60 hover:text-dark-50 border border-cream-200'
                    }`}
                  >
                    {cat} ({count})
                  </Link>
                )
              })}
            </div>
          </Container>
        </section>
      )}

      {/* Grid */}
      <section className="pb-20 md:pb-28">
        <Container>
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl font-light text-dark-50/50">
                No products in this category.
              </p>
              <Link href="/skincare/alumiermd" className="mt-4 inline-block text-xs font-medium tracking-widest uppercase text-mauve hover:text-mauve-700">
                View All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {products.map(product => (
                <SkincareProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Trust note */}
          <div className="mt-16 max-w-2xl mx-auto text-center">
            <p className="text-xs text-dark-50/40 leading-relaxed">
              Purchases are completed on {brand.name}'s secure website. Manhattan Laser Spa
              is an authorized professional partner — your order is credited to our practice
              when you shop through these links.
            </p>
          </div>
        </Container>
      </section>

      <CTABanner />
    </main>
  )
}
