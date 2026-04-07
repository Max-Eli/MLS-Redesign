'use client'

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import { getServiceImage, getServiceCategories_fromPost, safeMeta } from '@/lib/services'
import type { MLSService } from '@/types/services'

interface Props {
  service: MLSService
  compact?: boolean
}

export function AddToCartButton({ service, compact = false }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const meta      = safeMeta(service)
  const price     = parseFloat(meta.mls_sale_price || meta.mls_price)
  const image     = getServiceImage(service)
  const category  = getServiceCategories_fromPost(service)[0]

  if (!price || isNaN(price)) {
    return (
      <Button variant="outline" size={compact ? 'sm' : 'lg'} asChild className={compact ? '' : 'w-full'}>
        <a href="/contact">Book Now</a>
      </Button>
    )
  }

  function handleAdd() {
    addItem({
      productId: service.id,
      name:      service.title.rendered.replace(/<[^>]*>/g, ''),
      slug:      service.slug,
      price,
      quantity:  1,
      image:     image?.src,
      category:  category?.name,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button
      variant={added ? 'gold' : 'primary'}
      size={compact ? 'sm' : 'lg'}
      onClick={handleAdd}
      className={compact ? 'flex-shrink-0' : 'w-full'}
    >
      {added ? (
        <>
          <Check size={14} />
          Added
        </>
      ) : (
        <>
          <ShoppingBag size={14} />
          {compact ? 'Add' : 'Add to Cart'}
        </>
      )}
    </Button>
  )
}
