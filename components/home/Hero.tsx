'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/heroimagehome.jpg"
          alt="Manhattan Laser Spa — Luxury Medical Spa in Sunny Isles Beach"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlays to keep luxury dark theme */}
        <div className="absolute inset-0 bg-dark/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/65 via-dark/35 to-dark/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/55 via-transparent to-dark/20" />
      </div>

      {/* Decorative mauve glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-mauve/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full">
        <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12 pt-32 pb-20 md:pt-40">
          <div className="max-w-2xl">
            {/* Location badge */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-2 mb-8"
            >
              <div className="flex items-center gap-1.5 bg-white/8 backdrop-blur-sm border border-white/12 rounded-full px-4 py-1.5">
                <MapPin size={12} className="text-mauve" />
                <span className="text-2xs font-medium tracking-widest uppercase text-white/70">
                  Sunny Isles Beach, Florida
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-display font-light leading-none text-white mb-2"
            >
              <span className="block text-5xl md:text-7xl lg:text-8xl">Redefine</span>
              <span className="block text-5xl md:text-7xl lg:text-8xl text-mauve-300">
                Your Beauty.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-8 text-base md:text-lg text-white/60 leading-relaxed max-w-lg"
            >
              South Florida&apos;s premier luxury medical spa. Advanced laser treatments,
              body contouring, injectables, and transformative skincare — all under one roof
              on Collins Avenue.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4 mt-10"
            >
              <Button variant="primary" size="xl" asChild>
                <Link href="/contact" className="flex items-center gap-2">
                  Book Consultation
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="xl"
                asChild
                className="text-white/70 hover:text-white hover:bg-white/8 border border-white/15 hover:border-white/30"
              >
                <Link href="/services">Explore Treatments</Link>
              </Button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-6 mt-14"
            >
              {[
                { value: '15+', label: 'Years of Excellence' },
                { value: '50K+', label: 'Treatments Performed' },
                { value: '4.9★', label: 'Average Rating' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="font-display text-3xl font-light text-white leading-none">
                    {value}
                  </span>
                  <span className="text-2xs font-medium tracking-widest uppercase text-white/40 mt-1">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent" />
    </section>
  )
}
