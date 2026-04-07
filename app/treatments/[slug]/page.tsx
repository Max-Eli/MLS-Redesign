import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ServiceCard } from '@/components/shop/ServiceCard'
import { getServices } from '@/lib/services'
import { getAllServicePageSlugs } from '@/lib/servicesData'

interface Props {
  params: { slug: string }
}

// ── Static category metadata ──────────────────────────────────────────────────

const categoryMeta: Record<string, {
  name:        string
  tagline:     string
  description: string
  image?:      string
}> = {
  'laser-hair-removal': {
    name:        'Laser Hair Removal',
    tagline:     'Permanent hair reduction with the gold-standard in laser technology',
    description: 'Say goodbye to unwanted hair for good. We use the Candela GentleMax Pro — the most trusted laser platform for permanent hair reduction on all skin types and tones. Choose from individual area sessions or save with packages of 6.',
    image:       '/laserhairremoval.jpg',
  },
  'laser-skin-treatments': {
    name:        'Laser Skin Treatments',
    tagline:     'Medical-grade lasers for dramatic skin renewal',
    description: 'From the Helix CO2 fractional laser to Laser Genesis and Clear + Brilliant, our laser skin treatments address fine lines, wrinkles, scarring, pigmentation, redness, and uneven texture — with options for every skin type and downtime preference.',
    image:       '/laserskintreatments.png',
  },
  'facial-treatments': {
    name:        'Facial Treatments',
    tagline:     'Customized facials for every skin type and concern',
    description: 'Our facial treatments go far beyond a standard spa facial. From the HydraFacial and JetPeel to RF Microneedling, PRX-T33 peel, and VI Peel, every treatment is performed by trained medical professionals for real, lasting results.',
    image:       '/facialtreaments.png',
  },
  'body-treatments': {
    name:        'Body Treatments',
    tagline:     'Non-surgical body sculpting, contouring, and relaxation',
    description: 'CoolSculpting eliminates stubborn fat, EMSculpt builds muscle and burns fat simultaneously, Endosphere and LPG reduce cellulite and firm the skin. All non-invasive, all with zero downtime.',
    image:       '/bodytreatments.png',
  },
  'injectables': {
    name:        'Injectables',
    tagline:     'Natural-looking results, expertly administered',
    description: 'Our board-certified medical team administers Botox, Juvederm, Radiesse, Sculptra, Kybella, and PRP facelifts with an artistic eye and a commitment to natural, beautiful results.',
    image:       '/injectables.png',
  },
  'iv-wellness-therapy': {
    name:        'IV Wellness Therapy',
    tagline:     'Direct nutrient delivery for energy, immunity, and glow',
    description: 'IV therapy delivers vitamins, minerals, and antioxidants directly into your bloodstream for 100% absorption. Choose from our curated drip menu — from the Myers Cocktail and NAD therapy to Semaglutide weight loss injections.',
    image:       '/IVtherapy.png',
  },
  'hair-restoration': {
    name:        'Hair Restoration',
    tagline:     'Stimulate natural hair regrowth with advanced PRP therapy',
    description: 'Our hair restoration treatments use platelet-rich plasma (PRP) — your own growth factors — to reactivate dormant follicles and stimulate new hair growth. Available as injections, microneedling, JetCare, or combination protocols.',
    image:       'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
  },
  'hormonal-replacement-therapy': {
    name:        'Hormonal Replacement Therapy',
    tagline:     'Personalized hormonal optimization programs',
    description: 'Our HRT programs are tailored to your individual hormone profile and health goals. Consultations are required to determine the right protocol. Contact us or call 305-705-3997 to get started.',
    image:       'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80',
  },
  'memberships': {
    name:        'Memberships',
    tagline:     'Unlimited access to the treatments you love',
    description: 'Our membership programs give you unlimited access to select treatments at a flat monthly rate — the smartest way to maintain your results year-round. Ask us about available plans.',
    image:       'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
  },
  'gift-cards': {
    name:        'Gift Cards',
    tagline:     'The gift of luxury — never expires',
    description: 'Give the gift of Manhattan Laser Spa. Our gift cards are valid for any treatment or product and never expire. Available in denominations from $50 to $1,000.',
    image:       'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80',
  },
  'promotions': {
    name:        'Current Promotions',
    tagline:     'Special offers and seasonal deals',
    description: 'Check back regularly for our latest promotions, seasonal specials, and limited-time packages. Follow us on Instagram @manhattanlaserspa_sunnyisles so you never miss a deal.',
    image:       'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
  },
}

// Slugs that have rich content pages at /services/[slug]
const SERVICE_DETAIL_SLUGS = new Set(getAllServicePageSlugs())

export async function generateStaticParams() {
  return Object.keys(categoryMeta).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = categoryMeta[params.slug]
  if (!meta) return { title: 'Not Found' }
  return {
    title:       `${meta.name} | Manhattan Laser Spa`,
    description: meta.tagline,
    alternates:  { canonical: `https://manhattanlaserspa.com/treatments/${params.slug}` },
  }
}

export default async function TreatmentCategoryPage({ params }: Props) {
  const meta = categoryMeta[params.slug]
  if (!meta) notFound()

  const { services } = await getServices({ category: params.slug })

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <div className="bg-dark pt-36 pb-20 relative overflow-hidden">
        {meta.image && (
          <Image
            src={meta.image}
            alt={meta.name}
            fill
            priority
            className="object-cover opacity-20"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-dark/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent pointer-events-none" />

        <Container className="relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-2xs font-medium tracking-widest uppercase text-white/40 mb-8">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link href="/shop" className="hover:text-white/70 transition-colors">Treatments</Link>
            <ChevronRight size={10} />
            <span className="text-white/60">{meta.name}</span>
          </div>

          <p className="eyebrow mb-4 text-mauve-300">Treatments</p>
          <h1 className="display-xl text-white max-w-3xl leading-tight mb-4">
            {meta.name}
          </h1>
          <p className="text-lg text-white/50 max-w-2xl leading-relaxed mb-10">
            {meta.tagline}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg" asChild>
              <Link href="/contact">Book a Free Consultation</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop">View All Treatments</Link>
            </Button>
          </div>
        </Container>
      </div>

      {/* Description */}
      <div className="bg-white border-b border-cream-200">
        <Container className="py-10">
          <p className="text-base text-dark-50/70 leading-relaxed max-w-3xl">
            {meta.description}
          </p>
        </Container>
      </div>

      {/* Services grid */}
      <Container className="py-14">
        {services.length > 0 ? (
          <>
            <p className="text-sm text-dark-50/40 mb-8">
              {services.length} treatment{services.length !== 1 ? 's' : ''} in {meta.name}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  href={SERVICE_DETAIL_SLUGS.has(service.slug)
                    ? `/services/${service.slug}`
                    : `/product/${service.slug}`
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <p className="font-display text-2xl font-light text-dark-50/40 mb-3">
              Coming soon
            </p>
            <p className="text-sm text-dark-50/30 mb-8">
              We&apos;re adding services to this category shortly.
            </p>
            <Button variant="primary" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        )}
      </Container>

      {/* Bottom CTA */}
      <div className="bg-dark py-16">
        <Container className="text-center">
          <p className="eyebrow mb-4 text-mauve-300">Ready to Start?</p>
          <h2 className="display-md text-white mb-4">{meta.name} at Manhattan Laser Spa</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">
            Sunny Isles Beach · 16850 Collins Ave, Suite 105 · 305-705-3997
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="lg" asChild>
              <Link href="/contact">Book a Free Consultation</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop">
                All Treatments
                <ArrowRight size={14} className="ml-2" />
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    </div>
  )
}
