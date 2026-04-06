'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    name: 'Sofia M.',
    location: 'Sunny Isles Beach, FL',
    treatment: 'Laser Hair Removal',
    rating: 5,
    text: 'I\'ve been coming to Manhattan Laser Spa for years and the results are incredible. The staff is professional, the facility is immaculate, and my skin has never looked better. Worth every penny.',
  },
  {
    name: 'Elena R.',
    location: 'Bal Harbour, FL',
    treatment: 'CoolSculpting Elite',
    rating: 5,
    text: 'After my CoolSculpting treatment I finally got the results I was looking for. The team was extremely knowledgeable and made me feel completely at ease throughout the entire process.',
  },
  {
    name: 'Daniela K.',
    location: 'Aventura, FL',
    treatment: 'Botox & Fillers',
    rating: 5,
    text: 'The best injectable results I\'ve ever had. Natural, subtle, and exactly what I asked for. The medical team here truly understands facial aesthetics. I won\'t go anywhere else.',
  },
  {
    name: 'Rachel T.',
    location: 'Miami Beach, FL',
    treatment: 'HydraFacial + Microneedling',
    rating: 5,
    text: 'My skin has completely transformed. I started with a HydraFacial and have since done a microneedling series. People ask me what my secret is — it\'s Manhattan Laser Spa.',
  },
  {
    name: 'Marcus L.',
    location: 'North Miami Beach, FL',
    treatment: 'EMSculpt',
    rating: 5,
    text: 'I was skeptical about EMSculpt at first but the results after 4 sessions were undeniable. My core is stronger and more defined than it\'s ever been. The team was professional and made the sessions comfortable.',
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1))

  return (
    <section className="section bg-dark overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="eyebrow mb-4 text-mauve-400">Client Stories</p>
          <h2 className="display-lg text-white">
            What Our Clients Say
          </h2>
        </motion.div>

        {/* Testimonial card */}
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute -top-6 left-0 text-mauve/20">
            <Quote size={80} strokeWidth={1} />
          </div>

          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/8 rounded-3xl p-8 md:p-12"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} size={16} className="fill-gold text-gold" />
              ))}
            </div>

            <p className="font-display text-xl md:text-2xl font-light text-white leading-relaxed mb-8 italic">
              &ldquo;{testimonials[current].text}&rdquo;
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-medium text-white text-sm">{testimonials[current].name}</p>
                <p className="text-2xs text-white/40 tracking-wider mt-0.5">
                  {testimonials[current].location}
                </p>
              </div>
              <span className="text-2xs font-medium tracking-widest uppercase text-mauve bg-mauve/10 px-3 py-1.5 rounded-full">
                {testimonials[current].treatment}
              </span>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === current ? 'w-6 bg-mauve' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="size-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="size-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
