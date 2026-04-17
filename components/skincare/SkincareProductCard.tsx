import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { buildBrandProductUrl, formatSkincarePrice, type SkincareProductRow } from '@/lib/skincare'

export function SkincareProductCard({ product }: { product: SkincareProductRow }) {
  const price = formatSkincarePrice(product.price)
  const href  = buildBrandProductUrl(product.brand, product.external_path)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-500 ease-luxury hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-cream-50 flex-shrink-0">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-6 transition-transform duration-700 ease-luxury group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-mauve-50 via-cream-100 to-gold-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {product.category && (
          <p className="text-2xs font-medium tracking-widest uppercase text-mauve mb-2">
            {product.category}
          </p>
        )}

        <h3 className="font-display text-lg font-light text-dark-50 leading-snug mb-2 group-hover:text-mauve transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-dark-50/60 leading-relaxed line-clamp-3 mb-4 flex-1">
            {product.description}
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-cream-100 mt-auto">
          {price ? (
            <span className="font-display text-xl font-light text-dark-50">{price}</span>
          ) : (
            <span className="text-xs text-dark-50/40 italic">View price</span>
          )}
          <span className="inline-flex items-center gap-1.5 text-2xs font-semibold tracking-widest uppercase text-mauve group-hover:text-mauve-700 transition-colors">
            Shop
            <ExternalLink size={11} />
          </span>
        </div>
      </div>
    </a>
  )
}
