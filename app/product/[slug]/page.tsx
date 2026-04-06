import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, CreditCard, Clock, Phone } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { ServiceCard } from '@/components/shop/ServiceCard'
import { CTABanner } from '@/components/home/CTABanner'
import {
  getServiceBySlug,
  getAllServiceSlugs,
  getServices,
  getServiceImage,
  getServiceCategories_fromPost,
  formatServicePrice,
  isOnSale,
  safeMeta,
  stripHtml,
} from '@/lib/services'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug)
  if (!service) return { title: 'Service Not Found' }

  const image = getServiceImage(service)
  const desc  = stripHtml(service.excerpt.rendered || service.content.rendered).slice(0, 160)

  return {
    title: stripHtml(service.title.rendered),
    description: desc || `Book ${stripHtml(service.title.rendered)} at Manhattan Laser Spa in Sunny Isles Beach, FL`,
    alternates: { canonical: `https://manhattanlaserspa.com/product/${service.slug}` },
    openGraph: {
      title: stripHtml(service.title.rendered),
      description: desc,
      ...(image ? { images: [{ url: image.src, alt: image.alt }] } : {}),
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const service = await getServiceBySlug(params.slug)
  if (!service) notFound()

  const image      = getServiceImage(service)
  const categories = getServiceCategories_fromPost(service)
  const category   = categories[0]
  const onSale     = isOnSale(service)
  const price      = formatServicePrice(safeMeta(service).mls_sale_price || safeMeta(service).mls_price)
  const origPrice  = onSale ? formatServicePrice(safeMeta(service).mls_price) : null
  const badge      = safeMeta(service).mls_badge
  const duration   = safeMeta(service).mls_duration
  const hasPrice   = !!safeMeta(service).mls_price

  // Related services from same category
  const { services: related } = category
    ? await getServices({ category: category.id, perPage: 4 })
    : { services: [] }

  const relatedFiltered = related.filter(s => s.slug !== service.slug).slice(0, 3)

  return (
    <>
      <div className="min-h-screen bg-cream">
        <div className="pt-24 md:pt-32" />

        <Container className="py-10">
          {/* Back */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-2xs font-medium tracking-widest uppercase text-dark-50/40 hover:text-mauve transition-colors mb-10"
          >
            <ArrowLeft size={12} />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
            {/* Image */}
            <div className="relative aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden bg-cream-200 shadow-luxury">
              {image ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-mauve-50 via-cream-100 to-gold-50" />
              )}

              {badge && (
                <div className="absolute top-5 left-5">
                  <span className="bg-mauve/90 backdrop-blur-sm text-white text-2xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full">
                    {badge}
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:sticky lg:top-32">
              {category && (
                <p className="eyebrow mb-4">{category.name}</p>
              )}

              <h1
                className="display-md text-dark-50 mb-3 leading-tight"
                dangerouslySetInnerHTML={{ __html: service.title.rendered }}
              />

              {duration && (
                <div className="flex items-center gap-1.5 text-sm text-dark-50/50 mb-5">
                  <Clock size={14} className="text-mauve" />
                  {duration}
                </div>
              )}

              {/* Excerpt */}
              {service.excerpt.rendered && (
                <p className="text-sm text-dark-50/70 leading-relaxed mb-6">
                  {stripHtml(service.excerpt.rendered)}
                </p>
              )}

              {/* Price */}
              {hasPrice && (
                <div className="flex items-baseline gap-3 mb-8">
                  <span className="font-display text-4xl font-light text-dark-50">{price}</span>
                  {origPrice && (
                    <>
                      <span className="text-xl text-dark-50/30 line-through">{origPrice}</span>
                      <Badge variant="gold">Sale</Badge>
                    </>
                  )}
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-3 mb-8">
                <AddToCartButton service={service} />
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full border border-cream-300 text-dark-50/60 hover:text-mauve hover:border-mauve text-xs font-medium tracking-widest uppercase py-3.5 transition-colors rounded-sm"
                >
                  Book a Free Consultation
                </Link>
              </div>

              {/* Trust signals */}
              <div className="border border-cream-200 rounded-2xl divide-y divide-cream-100 overflow-hidden bg-white">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Secure Checkout',
                    desc:  'All payments secured by Stripe. Your data is never stored.',
                  },
                  {
                    icon: CreditCard,
                    title: 'Buy Now, Pay Later',
                    desc:  'Split into interest-free installments with Affirm or Klarna.',
                  },
                  {
                    icon: Clock,
                    title: 'Valid for 12 Months',
                    desc:  'Schedule your appointment any time within 12 months of purchase.',
                  },
                  {
                    icon: Phone,
                    title: 'Questions?',
                    desc:  'Call us at 305-705-3997 — we\'re happy to help.',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4 px-5 py-4">
                    <Icon size={17} className="text-mauve flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-dark-50">{title}</p>
                      <p className="text-xs text-dark-50/50 leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full description */}
          {service.content.rendered && service.content.rendered.trim() !== '' && (
            <div className="mt-20 max-w-3xl">
              <div className="h-px bg-gradient-to-r from-transparent via-mauve/20 to-transparent mb-12" />
              <h2 className="display-sm text-dark-50 mb-8">About This Treatment</h2>
              <div
                className="wp-content"
                dangerouslySetInnerHTML={{ __html: service.content.rendered }}
              />
            </div>
          )}
        </Container>

        {/* Related services */}
        {relatedFiltered.length > 0 && (
          <div className="bg-white py-16 mt-8">
            <Container>
              <h2 className="display-sm text-dark-50 mb-10">
                More in {category?.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedFiltered.map(s => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </div>
            </Container>
          </div>
        )}
      </div>

      <CTABanner />
    </>
  )
}
