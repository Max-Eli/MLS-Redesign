import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock } from 'lucide-react'
import { AddToCartButton } from './AddToCartButton'
import {
  getServiceImage,
  getServiceCategories_fromPost,
  formatServicePrice,
  affirmMonthly,
  isOnSale,
  safeMeta,
  stripHtml,
} from '@/lib/services'
import type { MLSService } from '@/types/services'

export function ServiceCard({ service, href }: { service: MLSService; href?: string }) {
  const image      = getServiceImage(service)
  const categories = getServiceCategories_fromPost(service)
  const meta       = safeMeta(service)
  const onSale     = isOnSale(service)
  const price      = formatServicePrice(meta.mls_sale_price || meta.mls_price)
  const origPrice  = onSale ? formatServicePrice(meta.mls_price) : null
  const monthly    = affirmMonthly(meta.mls_sale_price || meta.mls_price)
  const badge      = meta.mls_badge
  const duration   = meta.mls_duration
  const category   = categories[0]
  const isGiftCard = category?.slug === 'gift-cards'

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-500 ease-luxury hover:-translate-y-1">
      {/* Image */}
      <Link href={href ?? `/product/${service.slug}`} className="relative block h-56 overflow-hidden bg-cream-200 flex-shrink-0">
        {isGiftCard ? (
          <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-50 to-mauve flex flex-col items-center justify-center gap-2 px-6">
            <p className="text-gold/60 text-2xs font-medium tracking-[0.3em] uppercase">Manhattan Laser Spa</p>
            <p className="font-display text-5xl font-light text-white">{price || 'Gift Card'}</p>
            <p className="text-white/40 text-2xs tracking-widest uppercase">Gift Card</p>
          </div>
        ) : image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-mauve-50 via-cream-100 to-gold-50" />
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3">
            <span className="bg-mauve/90 backdrop-blur-sm text-white text-2xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
              {badge}
            </span>
          </div>
        )}

        {/* Sale badge */}
        {onSale && !badge && (
          <div className="absolute top-3 left-3">
            <span className="bg-gold/90 backdrop-blur-sm text-dark text-2xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
              Sale
            </span>
          </div>
        )}

        {/* Quick view arrow */}
        <div className="absolute bottom-3 right-3 size-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <ArrowRight size={14} className="text-dark" />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {category && (
          <p className="text-2xs font-medium tracking-widest uppercase text-mauve mb-2">
            {category.name}
          </p>
        )}

        <Link href={href ?? `/product/${service.slug}`}>
          <h3
            className="font-display text-lg font-light text-dark-50 leading-snug mb-2 group-hover:text-mauve transition-colors duration-300 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: service.title.rendered }}
          />
        </Link>

        {service.excerpt.rendered && (
          <p className="text-xs text-dark-50/60 leading-relaxed line-clamp-2 mb-3 flex-1">
            {stripHtml(service.excerpt.rendered)}
          </p>
        )}

        {duration && (
          <div className="flex items-center gap-1.5 text-2xs text-dark-50/40 mb-4">
            <Clock size={11} />
            <span>{duration}</span>
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-cream-100 mt-auto">
          <div>
            {price ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-xl font-light text-dark-50">{price}</span>
                  {origPrice && (
                    <span className="text-xs text-dark-50/30 line-through">{origPrice}</span>
                  )}
                </div>
                {monthly && (
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-mauve-50 border border-mauve-100">
                    <span className="text-2xs font-semibold text-mauve-700">${monthly}/mo</span>
                    <span className="text-2xs text-mauve-600/70">· Affirm</span>
                  </div>
                )}
              </>
            ) : (
              <span className="text-xs text-dark-50/40 italic">Contact for pricing</span>
            )}
          </div>
          <AddToCartButton service={service} compact />
        </div>
      </div>
    </div>
  )
}
