'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'

const services = [
  {
    title: 'Laser Hair Removal',
    description: 'Permanent hair reduction on all skin types using the Candela GentleMax Pro — safe, fast, and virtually painless.',
    href: '/treatments/laser-hair-removal',
    image: '/laserhairremoval.jpg',
    accent: 'mauve',
  },
  {
    title: 'Laser Skin Treatments',
    description: 'CO2 Helix resurfacing, Laser Genesis, Clear + Brilliant, and IPL for dramatic skin renewal.',
    href: '/treatments/laser-skin-treatments',
    image: '/laserskintreatments.png',
    accent: 'mauve',
  },
  {
    title: 'Facial Treatments',
    description: 'HydraFacial, JetPeel, microneedling, and PRX-T33 peel for a luminous, refreshed complexion.',
    href: '/treatments/facial-treatments',
    image: '/facialtreaments.png',
    accent: 'gold',
  },
  {
    title: 'Body Treatments',
    description: 'CoolSculpting, EMSculpt, Endosphere, and LPG — non-surgical body sculpting and contouring.',
    href: '/treatments/body-treatments',
    image: '/bodytreatments.png',
    accent: 'gold',
  },
  {
    title: 'Injectables',
    description: 'Botox, dermal fillers, Kybella, PDO thread lifts, and PRP facelifts by our medical professionals.',
    href: '/treatments/injectables',
    image: '/injectables.png',
    accent: 'mauve',
  },
  {
    title: 'IV Wellness Therapy',
    description: 'Custom IV vitamin drips, hair restoration PRP, and hormonal replacement therapy.',
    href: '/treatments/iv-wellness-therapy',
    image: '/IVtherapy.png',
    accent: 'gold',
  },
]

const accentMap = {
  mauve: 'group-hover:text-mauve border-mauve/20 group-hover:border-mauve/60',
  gold:  'group-hover:text-gold border-gold/20 group-hover:border-gold/60',
}

const iconAccentMap = {
  mauve: 'bg-mauve/10 text-mauve',
  gold:  'bg-gold/10 text-gold-500',
}

export function ServicesSection() {
  return (
    <section className="section bg-cream">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="eyebrow mb-4">Our Treatments</p>
          <h2 className="display-lg text-dark-50 mb-6">
            A Complete Range of
            <br />
            <em className="not-italic text-mauve">Luxury Aesthetics</em>
          </h2>
          <p className="text-base text-dark-50/60 max-w-xl mx-auto leading-relaxed">
            From transformative laser treatments to sculpting body contouring, every
            service is delivered with medical-grade precision and a luxury experience.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                href={service.href}
                className={`group block bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-500 ease-luxury hover:-translate-y-1.5 border ${accentMap[service.accent as keyof typeof accentMap]}`}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-cream-200">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-light text-dark-50 mb-2 group-hover:text-mauve transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-sm text-dark-50/60 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-2xs font-semibold tracking-widest uppercase text-dark-50/40 group-hover:text-mauve transition-colors duration-300">
                    Explore
                    <ArrowRight
                      size={12}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
