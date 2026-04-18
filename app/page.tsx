import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { StatsBar } from '@/components/home/StatsBar'
import { ServicesSection } from '@/components/home/ServicesSection'
import { FeaturedTreatments } from '@/components/home/FeaturedTreatments'
import { SkincarePreview } from '@/components/home/SkincarePreview'
import { Testimonials } from '@/components/home/Testimonials'
import { BlogPreview } from '@/components/home/BlogPreview'
import { CTABanner } from '@/components/home/CTABanner'
import { InstagramFeed } from '@/components/home/InstagramFeed'

export const metadata: Metadata = {
  title: 'Manhattan Laser Spa | Luxury Medical Spa in Sunny Isles Beach, FL',
  description:
    "Sunny Isles Beach's premier luxury medical spa at 16850 Collins Ave. Laser hair removal, CoolSculpting, Botox, fillers, EMSculpt, HydraFacial and more.",
  alternates: { canonical: 'https://manhattanlaserspa.com' },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesSection />
      <FeaturedTreatments />
      <SkincarePreview />
      <Testimonials />
      <BlogPreview />
      <InstagramFeed />
      <CTABanner />
    </>
  )
}
