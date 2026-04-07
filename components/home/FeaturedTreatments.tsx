'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

const featured = [
  {
    name: 'Laser Hair Removal',
    tagline: 'Permanent smoothness, redefined.',
    description:
      'The Candela GentleMax Pro delivers permanent hair reduction on all skin types — safe, fast, and virtually painless.',
    href: '/services/laser-hair-removal',
    shopHref: '/treatments/laser-hair-removal',
    image: '/laserhairremoval.jpg',
    badge: 'Most Popular',
  },
  {
    name: 'CoolSculpting Elite',
    tagline: 'Sculpt your ideal shape — no surgery.',
    description:
      'FDA-cleared fat-freezing technology that permanently eliminates stubborn fat cells. Two applicators, double the results.',
    href: '/services/coolsculpting',
    shopHref: '/treatments/body-treatments',
    image: '/bodytreatments.png',
    badge: 'Body Treatments',
  },
  {
    name: 'Botox & Fillers',
    tagline: 'Natural results, expertly crafted.',
    description:
      'Precision injectable treatments by our board-certified medical professionals for subtle, beautiful enhancement.',
    href: '/services/botox',
    shopHref: '/treatments/injectables',
    image: '/injectables.png',
    badge: 'Injectables',
  },
]

export function FeaturedTreatments() {
  return (
    <section className="section bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-end justify-between mb-14 gap-4"
        >
          <div>
            <p className="eyebrow mb-4">Signature Treatments</p>
            <h2 className="display-lg text-dark-50">
              Our Most Sought-After
              <br />
              <em className="not-italic text-mauve">Procedures</em>
            </h2>
          </div>
          <Link
            href="/services"
            className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-dark-50/50 hover:text-mauve transition-colors group flex-shrink-0"
          >
            View All Services
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
          {featured.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative bg-dark rounded-3xl overflow-hidden aspect-[3/4]"
            >
              {/* Background image */}
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover opacity-60 group-hover:opacity-70 transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />

              {/* Badge */}
              <div className="absolute top-5 left-5">
                <span className="bg-mauve/90 backdrop-blur-sm text-white text-2xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
                  {item.badge}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-2xs font-medium tracking-widest uppercase text-mauve-300 mb-2">
                  {item.tagline}
                </p>
                <h3 className="font-display text-2xl font-light text-white mb-3 leading-snug">
                  {item.name}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-6 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex gap-3">
                  <Button variant="primary" size="sm" asChild>
                    <Link href={item.shopHref}>Book Now</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-white/60 hover:text-white hover:bg-white/10 border border-white/15"
                  >
                    <Link href={item.href}>Learn More</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
