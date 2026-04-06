'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'

const stats = [
  { value: '15+', label: 'Years of Excellence' },
  { value: '50,000+', label: 'Treatments Performed' },
  { value: '20+', label: 'Expert Clinicians' },
  { value: '4.9 ★', label: 'Average Google Rating' },
]

export function StatsBar() {
  return (
    <section className="bg-dark py-14">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <p className="font-display text-4xl md:text-5xl font-light text-mauve leading-none mb-2">
                {stat.value}
              </p>
              <p className="text-2xs font-medium tracking-widest uppercase text-white/40">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
