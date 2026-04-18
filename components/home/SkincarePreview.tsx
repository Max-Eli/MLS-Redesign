import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { fetchFeaturedSkincare } from '@/lib/skincare'
import { SkincarePreviewGrid } from './SkincarePreviewGrid'

export async function SkincarePreview() {
  const products = await fetchFeaturedSkincare(4)

  if (!products.length) return null

  return (
    <section className="section relative overflow-hidden bg-gradient-to-b from-cream via-cream-50 to-white">
      {/* Decorative accents */}
      <div
        aria-hidden
        className="absolute -top-24 -left-24 size-[420px] rounded-full bg-mauve-50/60 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute top-1/3 -right-24 size-[380px] rounded-full bg-gold-50/40 blur-3xl pointer-events-none"
      />

      <Container className="relative">
        <div className="flex flex-col md:flex-row items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-mauve-100 mb-5">
              <Sparkles size={12} className="text-mauve" strokeWidth={2} />
              <p className="text-2xs font-semibold tracking-widest uppercase text-mauve">
                Medical-Grade Skincare
              </p>
            </div>
            <h2 className="display-lg text-dark-50">
              Extend Your Results
              <br />
              <em className="not-italic text-mauve">at Home.</em>
            </h2>
            <p className="mt-5 text-base text-dark-50/60 leading-relaxed max-w-lg">
              Curated AlumierMD regimens our specialists personally trust —
              clinical-strength formulations sold only through licensed professionals.
            </p>
          </div>

          <Link
            href="/skincare"
            className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-dark-50/50 hover:text-mauve transition-colors group flex-shrink-0"
          >
            Shop All Skincare
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <SkincarePreviewGrid products={products} />
      </Container>
    </section>
  )
}
