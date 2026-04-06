'use client'

import { createContext, useCallback, useEffect, useReducer } from 'react'
import type { CartContextValue, CartItem, CartState } from '@/types/cart'

type Action =
  | { type: 'ADD_ITEM'; item: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD'; items: CartItem[] }

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, items: action.items }

    case 'ADD_ITEM': {
      const id = `${action.item.productId}-${action.item.variationId ?? 0}`
      const existing = state.items.find((i) => i.id === id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + (action.item.quantity ?? 1) } : i
          ),
          isOpen: true,
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.item, id }],
        isOpen: true,
      }
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }

    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.id) }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    default:
      return state
  }
}

export const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mls-cart')
      if (saved) dispatch({ type: 'LOAD', items: JSON.parse(saved) })
    } catch {}
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mls-cart', JSON.stringify(state.items))
    } catch {}
  }, [state.items])

  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', item })
  }, [])

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', id })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity })
  }, [])

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), [])

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ ...state, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  )
}
