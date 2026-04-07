'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'

interface Review {
  name:      string
  text:      string
  time?:     string
  avatar?:   string | null
  rating:    number
  treatment?: string
  location?:  string
  source?:   'google' | 'manual'
}

const fallbackReviews: Review[] = [
  {
    name:      'Sofia M.',
    location:  'Sunny Isles Beach, FL',
    treatment: 'Laser Hair Removal',
    rating:    5,
    text:      'I\'ve been coming to Manhattan Laser Spa for years and the results are incredible. The staff is professional, the facility is immaculate, and my skin has never looked better. Worth every penny.',
    source:    'manual',
  },
  {
    name:      'Elena R.',
    location:  'Bal Harbour, FL',
    treatment: 'CoolSculpting Elite',
    rating:    5,
    text:      'After my CoolSculpting treatment I finally got the results I was looking for. The team was extremely knowledgeable and made me feel completely at ease throughout the entire process.',
    source:    'manual',
  },
  {
    name:      'Daniela K.',
    location:  'Aventura, FL',
    treatment: 'Botox & Fillers',
    rating:    5,
    text:      'The best injectable results I\'ve ever had. Natural, subtle, and exactly what I asked for. The medical team here truly understands facial aesthetics. I won\'t go anywhere else.',
    source:    'manual',
  },
  {
    name:      'Rachel T.',
    location:  'Miami Beach, FL',
    treatment: 'HydraFacial + Microneedling',
    rating:    5,
    text:      'My skin has completely transformed. I started with a HydraFacial and have since done a microneedling series. People ask me what my secret is — it\'s Manhattan Laser Spa.',
    source:    'manual',
  },
  {
    name:      'Marcus L.',
    location:  'North Miami Beach, FL',
    treatment: 'EMSculpt',
    rating:    5,
    text:      'I was skeptical about EMSculpt at first but the results after 4 sessions were undeniable. My core is stronger and more defined than it\'s ever been. The team was professional and made the sessions comfortable.',
    source:    'manual',
  },
]

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-label="Google">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export function Testimonials() {
  const [reviews, setReviews]           = useState<Review[]>(fallbackReviews)
  const [totalRating, setTotalRating]   = useState<number | null>(null)
  const [totalCount, setTotalCount]     = useState<number | null>(null)
  const [current, setCurrent]           = useState(0)
  const [isGoogle, setIsGoogle]         = useState(false)

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => {
        if (data.reviews?.length > 0) {
          setReviews(data.reviews)
          setIsGoogle(true)
        }
        if (data.totalRating)  setTotalRating(data.totalRating)
        if (data.totalReviews) setTotalCount(data.totalReviews)
      })
      .catch(() => {/* keep fallback */})
  }, [])

  const prev = () => setCurrent(c => (c === 0 ? reviews.length - 1 : c - 1))
  const next = () => setCurrent(c => (c === reviews.length - 1 ? 0 : c + 1))

  const review = reviews[current]

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
          <h2 className="display-lg text-white">What Our Clients Say</h2>

          {/* Google rating badge */}
          {totalRating && totalCount && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <GoogleLogo />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className="fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-white font-semibold text-sm">{totalRating.toFixed(1)}</span>
                <span className="text-white/40 text-xs">({totalCount.toLocaleString()} reviews)</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Testimonial card */}
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute -top-6 left-0 text-mauve/20">
            <Quote size={80} strokeWidth={1} />
          </div>

          <AnimatePresence mode="wait">
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
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-gold text-gold" />
                ))}
              </div>

              <p className="font-display text-xl md:text-2xl font-light text-white leading-relaxed mb-8 italic">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="size-9 rounded-full object-cover ring-1 ring-white/10"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="size-9 rounded-full bg-mauve/20 flex items-center justify-center text-mauve text-sm font-medium">
                      {review.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white text-sm">{review.name}</p>
                    <p className="text-2xs text-white/40 tracking-wider mt-0.5">
                      {review.location ?? review.time ?? ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {review.treatment && (
                    <span className="text-2xs font-medium tracking-widest uppercase text-mauve bg-mauve/10 px-3 py-1.5 rounded-full">
                      {review.treatment}
                    </span>
                  )}
                  {review.source === 'google' && (
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                      <GoogleLogo />
                      <span className="text-2xs text-white/40">Google</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === current ? 'w-6 bg-mauve' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  )}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

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
