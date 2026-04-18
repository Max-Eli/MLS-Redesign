'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import {
  buildBrandProductUrl,
  formatSkincarePrice,
  BRANDS,
  type SkincareProductRow,
} from '@/lib/skincare'

export function SkincarePreviewGrid({ products }: { products: SkincareProductRow[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, i) => {
        const price = formatSkincarePrice(product.price)
        const href  = buildBrandProductUrl(product.brand, product.external_path)
        const brand = BRANDS[product.brand]?.name ?? product.brand

        return (
          <motion.a
            key={product.id}
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-shadow duration-500"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-cream-50 to-white">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-6 md:p-8 transition-transform duration-[900ms] ease-luxury group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-mauve-50 via-cream-100 to-gold-50" />
              )}

              {/* Hover shimmer */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-mauve/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              {/* External link badge — appears on hover */}
              <div className="absolute top-3 right-3 size-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                <ExternalLink size={13} className="text-mauve" />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 md:p-5">
              <p className="text-2xs font-semibold tracking-widest uppercase text-mauve mb-1.5">
                {brand}
              </p>
              <h3 className="font-display text-base md:text-lg font-light text-dark-50 leading-snug mb-3 line-clamp-2 flex-1 group-hover:text-mauve transition-colors duration-300">
                {product.name}
              </h3>

              <div className="flex items-center justify-between pt-3 border-t border-cream-100">
                {price ? (
                  <span className="font-display text-lg font-light text-dark-50">
                    {price}
                  </span>
                ) : (
                  <span className="text-xs text-dark-50/40 italic">View price</span>
                )}
                <span className="text-2xs font-semibold tracking-widest uppercase text-mauve/60 group-hover:text-mauve transition-colors">
                  Shop
                </span>
              </div>
            </div>
          </motion.a>
        )
      })}
    </div>
  )
}
