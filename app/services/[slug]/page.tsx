import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { getServiceData, getAllServicePageSlugs } from '@/lib/servicesData'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllServicePageSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getServiceData(params.slug)
  if (!service) return { title: 'Service Not Found' }
  return {
    title: `${service.name} | Manhattan Laser Spa`,
    description: service.tagline,
    alternates: { canonical: `https://manhattanlaserspa.com/services/${service.slug}` },
  }
}

export default function ServicePage({ params }: Props) {
  const service = getServiceData(params.slug)
  if (!service) notFound()

  const shopHref = service.categorySlug
    ? `/treatments/${service.categorySlug}`
    : '/shop'

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-dark pt-36 pb-20 relative overflow-hidden">
        {service.image && (
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-dark/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent pointer-events-none" />
        <Container className="relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-2xs font-medium tracking-widest uppercase text-white/40 mb-8">
            <Link href="/shop" className="hover:text-white/70 transition-colors">Services</Link>
            <ChevronRight size={10} />
            <Link href={`/treatments/${service.categorySlug}`} className="hover:text-white/70 transition-colors">
              {service.category}
            </Link>
            <ChevronRight size={10} />
            <span className="text-white/60">{service.name}</span>
          </div>

          <p className="eyebrow mb-4 text-mauve-300">{service.category}</p>
          <h1 className="display-xl text-white max-w-3xl leading-tight mb-4">
            {service.name}
          </h1>
          <p className="text-lg text-white/50 max-w-xl leading-relaxed mb-10">
            {service.tagline}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg" asChild>
              <Link href={shopHref}>Book This Treatment</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Free Consultation</Link>
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-20">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-16">

            {/* Overview */}
            <section>
              <h2 className="display-sm text-dark-50 mb-6">What is {service.name}?</h2>
              <p className="text-base text-dark-50/70 leading-relaxed">{service.overview}</p>
            </section>

            {/* Benefits */}
            <section>
              <h2 className="display-sm text-dark-50 mb-6">Benefits</h2>
              <ul className="space-y-3">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-mauve flex-shrink-0 mt-0.5" />
                    <span className="text-base text-dark-50/70 leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* How it works */}
            <section>
              <h2 className="display-sm text-dark-50 mb-8">How It Works</h2>
              <div className="space-y-0">
                {service.howItWorks.map((step, i) => (
                  <div key={i} className="flex gap-6 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="size-9 rounded-full bg-mauve/10 border border-mauve/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-mauve">{i + 1}</span>
                      </div>
                      {i < service.howItWorks.length - 1 && (
                        <div className="w-px flex-1 bg-mauve/10 mt-3" />
                      )}
                    </div>
                    <div className="pt-1.5 pb-8 last:pb-0">
                      <h3 className="font-medium text-dark-50 mb-1">{step.step}</h3>
                      <p className="text-sm text-dark-50/60 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Who is it for */}
            <section>
              <h2 className="display-sm text-dark-50 mb-4">Who Is It For?</h2>
              <p className="text-base text-dark-50/70 leading-relaxed">{service.whoIsItFor}</p>
            </section>

            {/* FAQs */}
            {service.faqs.length > 0 && (
              <section>
                <h2 className="display-sm text-dark-50 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {service.faqs.map((faq, i) => (
                    <div key={i} className="border border-cream-200 rounded-2xl p-6 bg-white">
                      <h3 className="font-medium text-dark-50 mb-2">{faq.question}</h3>
                      <p className="text-sm text-dark-50/60 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Machine card */}
            {service.machine && (
              <div className="bg-white border border-cream-200 rounded-2xl p-6">
                <p className="text-2xs font-semibold tracking-widest uppercase text-mauve mb-3">
                  Technology We Use
                </p>
                <h3 className="font-display text-xl font-light text-dark-50 mb-3">
                  {service.machine}
                </h3>
                {service.machineDescription && (
                  <p className="text-sm text-dark-50/60 leading-relaxed">
                    {service.machineDescription}
                  </p>
                )}
              </div>
            )}

            {/* CTA card */}
            <div className="bg-mauve rounded-2xl p-6 text-white sticky top-28">
              <h3 className="font-display text-xl font-light mb-2">
                Ready to Get Started?
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Book your {service.name} session online or contact us for a free consultation.
              </p>
              <div className="space-y-3">
                <Button variant="gold" size="lg" className="w-full" asChild>
                  <Link href={shopHref}>Book Now</Link>
                </Button>
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full py-3 text-xs font-medium tracking-widest uppercase text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-sm transition-colors"
                >
                  Free Consultation
                </Link>
                <a
                  href="tel:+13057053997"
                  className="flex items-center justify-center w-full py-3 text-xs font-medium tracking-widest uppercase text-white/70 hover:text-white transition-colors"
                >
                  Call 305-705-3997
                </a>
              </div>
            </div>
          </div>

        </div>
      </Container>

      {/* Bottom CTA */}
      <div className="bg-dark py-16 mt-8">
        <Container className="text-center">
          <p className="eyebrow mb-4 text-mauve-300">Manhattan Laser Spa</p>
          <h2 className="display-md text-white mb-4">Sunny Isles Beach, Florida</h2>
          <p className="text-white/50 mb-8">16850 Collins Ave, Suite 105 · 305-705-3997</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="lg" asChild>
              <Link href={shopHref}>Book {service.name}</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop">View All Services</Link>
            </Button>
          </div>
        </Container>
      </div>
    </div>
  )
}
