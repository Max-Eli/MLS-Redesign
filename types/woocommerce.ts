export interface WCImage {
  id: number
  src: string
  name: string
  alt: string
}

export interface WCCategory {
  id: number
  name: string
  slug: string
}

export interface WCAttribute {
  id: number
  name: string
  position: number
  visible: boolean
  variation: boolean
  options: string[]
}

export interface WCProduct {
  id: number
  name: string
  slug: string
  permalink: string
  date_created: string
  type: 'simple' | 'variable' | 'grouped' | 'external'
  status: string
  featured: boolean
  description: string
  short_description: string
  sku: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  purchasable: boolean
  stock_status: 'instock' | 'outofstock' | 'onbackorder'
  categories: WCCategory[]
  tags: WCCategory[]
  images: WCImage[]
  attributes: WCAttribute[]
  variations: number[]
  meta_data: Array<{ id: number; key: string; value: unknown }>
  average_rating: string
  rating_count: number
}

export interface WCProductVariation {
  id: number
  price: string
  regular_price: string
  sale_price: string
  stock_status: string
  attributes: Array<{ id: number; name: string; option: string }>
  image: WCImage | null
}

export interface WCOrderLineItem {
  product_id: number
  variation_id?: number
  quantity: number
  name: string
  price: number
  total: string
  image?: { src: string }
}

export interface WCOrderBilling {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  state: string
  postcode: string
  country: string
  email: string
  phone: string
}

export interface WCOrder {
  id: number
  number: string
  status: string
  currency: string
  total: string
  subtotal: string
  billing: WCOrderBilling
  shipping: WCOrderBilling
  line_items: WCOrderLineItem[]
  payment_method: string
  payment_method_title: string
  transaction_id?: string
  meta_data: Array<{ key: string; value: unknown }>
}

export interface WCCreateOrderPayload {
  payment_method: string
  payment_method_title: string
  set_paid: boolean
  billing: WCOrderBilling
  shipping?: Partial<WCOrderBilling>
  line_items: Array<{
    product_id: number
    variation_id?: number
    quantity: number
  }>
  meta_data?: Array<{ key: string; value: unknown }>
}
