import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, Heart, Shield, Star } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { CTABanner } from '@/components/home/CTABanner'

export const metadata: Metadata = {
  title: 'About Us | Sunny Isles Beach Medical Spa',
  description:
    "Learn about Manhattan Laser Spa — Sunny Isles Beach's premier luxury medical spa at 16850 Collins Ave. 15+ years of aesthetic excellence.",
  alternates: { canonical: 'https://manhattanlaserspa.com/about' },
}

const values = [
  {
    icon: Award,
    title: 'Medical Excellence',
    description:
      'Every treatment is performed or overseen by our board-certified medical professionals with deep expertise in aesthetic medicine.',
  },
  {
    icon: Shield,
    title: 'Safety First',
    description:
      'We use only FDA-cleared, clinically proven technologies. Your safety and wellbeing are our highest priority at every step.',
  },
  {
    icon: Heart,
    title: 'Personalized Care',
    description:
      'No two clients are the same. We create individualized treatment plans tailored to your unique anatomy, goals, and lifestyle.',
  },
  {
    icon: Star,
    title: 'Luxury Experience',
    description:
      'From the moment you walk in, you experience a level of care and attention that sets us apart from any other spa in South Florida.',
  },
]

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-cream">
        {/* Hero */}
        <div className="relative bg-dark pt-32 pb-0 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/about-hero.jpg"
              alt="Manhattan Laser Spa interior"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-dark/50 to-dark" />
          </div>
          <Container className="relative z-10 pb-20">
            <p className="eyebrow mb-4 text-mauve-400">Our Story</p>
            <h1 className="display-xl text-white max-w-2xl leading-tight">
              Redefining Luxury
              <br />
              Medical Aesthetics
              <br />
              <em className="not-italic text-mauve">in South Florida</em>
            </h1>
          </Container>
        </div>

        {/* Story section */}
        <Container className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="eyebrow mb-6">Who We Are</p>
              <h2 className="display-md text-dark-50 mb-6">
                15+ Years of Aesthetic Excellence
              </h2>
              <div className="space-y-4 text-dark-50/70 leading-relaxed">
                <p>
                  Manhattan Laser Spa was built on a single vision: to deliver world-class
                  medical aesthetic treatments in an environment that feels as luxurious as
                  the results we create. What started as a commitment to excellence has grown
                  into Sunny Isles Beach&apos;s most trusted medical spa.
                </p>
                <p>
                  Our team of board-certified physicians, nurse practitioners, and licensed
                  aestheticians brings together decades of combined experience across laser
                  medicine, body contouring, injectable aesthetics, and advanced skincare.
                </p>
                <p>
                  Located at 16850 Collins Ave in the heart of Sunny Isles Beach, we serve
                  clients from throughout South Florida — from Miami Beach and Aventura to
                  Bal Harbour and beyond.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 text-xs font-semibold tracking-widest uppercase text-mauve hover:text-mauve-600 transition-colors group"
              >
                Meet Our Team
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative">
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-luxury-lg">
                <Image
                  src="/images/about-team.jpg"
                  alt="Manhattan Laser Spa team in Sunny Isles Beach"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-luxury-lg p-6">
                <p className="font-display text-4xl font-light text-mauve leading-none">50K+</p>
                <p className="text-2xs font-medium tracking-widest uppercase text-dark-50/50 mt-1">
                  Treatments Performed
                </p>
              </div>
            </div>
          </div>
        </Container>

        {/* Values */}
        <section className="section bg-dark">
          <Container>
            <div className="text-center mb-16">
              <p className="eyebrow mb-4 text-mauve-400">Our Values</p>
              <h2 className="display-lg text-white">
                What Sets Us Apart
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div
                  key={v.title}
                  className="bg-white/5 border border-white/8 rounded-2xl p-7 hover:bg-white/8 transition-colors"
                >
                  <div className="size-12 rounded-full bg-mauve/10 flex items-center justify-center mb-5">
                    <v.icon size={22} className="text-mauve" />
                  </div>
                  <h3 className="font-display text-xl font-light text-white mb-3">{v.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Location focus */}
        <section className="section bg-white">
          <Container size="md">
            <div className="text-center">
              <p className="eyebrow mb-4">Where to Find Us</p>
              <h2 className="display-md text-dark-50 mb-6">
                Sunny Isles Beach, Florida
              </h2>
              <p className="text-base text-dark-50/60 leading-relaxed mb-8 max-w-xl mx-auto">
                Our only location is at 16850 Collins Ave, Suite 105 — right in the
                heart of Sunny Isles Beach on the iconic Collins Avenue. Convenient
                parking is available.
              </p>
              <div className="inline-flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-mauve text-white text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-mauve-600 transition-colors"
                >
                  Book a Consultation
                  <ArrowRight size={14} />
                </Link>
                <a
                  href="https://maps.google.com/?q=16850+Collins+Ave+Suite+105+Sunny+Isles+Beach+FL+33160"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-cream-300 text-dark-50/60 hover:text-mauve hover:border-mauve text-xs font-semibold tracking-widest uppercase px-8 py-4 transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </Container>
        </section>
      </div>

      <CTABanner />
    </>
  )
}
