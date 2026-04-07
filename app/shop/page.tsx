import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ServiceCard } from '@/components/shop/ServiceCard'
import { ShopSearch } from '@/components/shop/ShopSearch'
import { getServices, getServiceCategories } from '@/lib/services'

export const metadata: Metadata = {
  title: 'Shop Treatments & Services',
  description:
    'Book laser hair removal, CoolSculpting, Botox, HydraFacial and more at Manhattan Laser Spa in Sunny Isles Beach. Pay with Affirm or Klarna.',
}

interface Props {
  searchParams: { page?: string; category?: string; search?: string }
}

export default async function ShopPage({ searchParams }: Props) {
  const page         = parseInt(searchParams.page ?? '1')
  const categorySlug = searchParams.category
  const search       = searchParams.search

  const [{ services, total, totalPages }, categories] = await Promise.all([
    getServices({ page, perPage: 24, category: categorySlug, search }),
    getServiceCategories(),
  ])

  const activeCategory = categories.find(c => c.slug === categorySlug)

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-dark pt-40 pb-24">
        <Container>
          <p className="eyebrow mb-4">Treatments & Packages</p>
          <h1 className="display-xl text-white max-w-2xl">
            {activeCategory ? activeCategory.name : 'Shop Our Services'}
          </h1>
          <p className="mt-4 text-base text-white/50 max-w-xl leading-relaxed">
            Book individual treatments or save with packages. Pay in full or split
            into installments with Affirm or Klarna.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-md">
            <ShopSearch defaultValue={search} />
          </div>

          {/* Payment badges */}
          <div className="flex flex-wrap gap-2 mt-6">
            {['Visa & Mastercard', 'Affirm', 'Klarna', 'HSA / FSA'].map(p => (
              <span
                key={p}
                className="text-2xs font-medium tracking-wider bg-white/8 border border-white/12 text-white/60 px-3 py-1.5 rounded-full"
              >
                {p}
              </span>
            ))}
          </div>
        </Container>
      </div>

      {/* Category filters */}
      <div className="bg-white border-b border-cream-200 sticky top-16 md:top-20 z-30">
        <Container>
          <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
            <Link
              href="/shop"
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium tracking-widest uppercase transition-all duration-200 ${
                !categorySlug
                  ? 'bg-mauve text-white'
                  : 'bg-cream-100 text-dark-50/60 hover:bg-cream-200 hover:text-dark-50'
              }`}
            >
              All
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium tracking-widest uppercase transition-all duration-200 whitespace-nowrap ${
                  cat.slug === categorySlug
                    ? 'bg-mauve text-white'
                    : 'bg-cream-100 text-dark-50/60 hover:bg-cream-200 hover:text-dark-50'
                }`}
              >
                {cat.name}
                <span className="ml-1.5 text-2xs opacity-60">({cat.count})</span>
              </Link>
            ))}
          </div>
        </Container>
      </div>

      {/* Grid */}
      <Container className="py-12">
        {services.length > 0 ? (
          <>
            <p className="text-sm text-dark-50/40 mb-8">
              {total} treatment{total !== 1 ? 's' : ''}
              {activeCategory ? ` in ${activeCategory.name}` : ''}
              {search ? ` matching "${search}"` : ''}

            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14">
                {page > 1 && (
                  <Link
                    href={`/shop?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                    className="px-5 py-2.5 text-xs font-medium tracking-widest uppercase border border-cream-300 rounded-full text-dark-50/60 hover:text-mauve hover:border-mauve transition-colors"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Link
                    key={p}
                    href={`/shop?page=${p}${categorySlug ? `&category=${categorySlug}` : ''}`}
                    className={`size-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-mauve text-white'
                        : 'text-dark-50/50 hover:text-mauve border border-cream-300 hover:border-mauve'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link
                    href={`/shop?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                    className="px-5 py-2.5 text-xs font-medium tracking-widest uppercase border border-cream-300 rounded-full text-dark-50/60 hover:text-mauve hover:border-mauve transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <ShoppingBag size={48} strokeWidth={1} className="mx-auto text-dark-50/20 mb-4" />
            <p className="font-display text-2xl font-light text-dark-50/50">No services found</p>
            <Link href="/shop" className="text-sm text-mauve mt-3 inline-block hover:underline">
              View all treatments
            </Link>
          </div>
        )}
      </Container>
    </div>
  )
}
