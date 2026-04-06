'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden bg-mauve">
      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 rounded-full bg-dark/5" />

      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <p className="text-2xs font-semibold tracking-widest2 uppercase text-white/60 mb-6">
            Sunny Isles Beach, Florida
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight">
            Begin Your Transformation
            <br />
            <em className="not-italic text-dark/70">Today</em>
          </h2>
          <p className="text-base text-white/70 max-w-lg mx-auto leading-relaxed mb-10">
            Book a complimentary consultation with our expert team at 16850 Collins Ave.
            We&apos;ll create a personalized treatment plan tailored to your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="xl"
              asChild
              className="bg-white text-mauve hover:bg-cream font-semibold"
            >
              <Link href="/contact" className="flex items-center gap-2">
                Book Free Consultation
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="xl"
              asChild
              className="text-white border-white/30 hover:bg-white/10 hover:border-white/60"
            >
              <a href="tel:+13057053997" className="flex items-center gap-2">
                <Phone size={16} />
                305-705-3997
              </a>
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
