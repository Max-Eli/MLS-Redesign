export interface CartItem {
  id: string
  productId: number
  variationId?: number
  name: string
  slug: string
  price: number
  quantity: number
  image?: string
  category?: string
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export interface CartContextValue extends CartState {
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  loadCart: (items: CartItem[]) => void
  total: number
  itemCount: number
}
