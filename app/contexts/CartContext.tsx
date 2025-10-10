"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

export interface CartItem {
  id: string | number
  name: string
  price: number
  quantity: number
  image?: string
  vendor: string
  delivery: string
  maxQuantity?: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string | number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string | number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartContextType {
  state: CartState
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  cartItemsCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        
        return {
          items: updatedItems,
          total,
          itemCount
        }
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }]
        const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
        
        return {
          items: newItems,
          total,
          itemCount
        }
      }

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload)
      const totalAfterRemove = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCountAfterRemove = filteredItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        items: filteredItems,
        total: totalAfterRemove,
        itemCount: itemCountAfterRemove
      }

    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        const filteredItems = state.items.filter(item => item.id !== action.payload.id)
        const totalAfterRemove = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const itemCountAfterRemove = filteredItems.reduce((sum, item) => sum + item.quantity, 0)
        
        return {
          items: filteredItems,
          total: totalAfterRemove,
          itemCount: itemCountAfterRemove
        }
      }

      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      const totalAfterUpdate = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCountAfterUpdate = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        items: updatedItems,
        total: totalAfterUpdate,
        itemCount: itemCountAfterUpdate
      }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      }

    case 'LOAD_CART':
      const loadedTotal = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const loadedItemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        items: action.payload,
        total: loadedTotal,
        itemCount: loadedItemCount
      }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ecoclean-cart')
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        // Only load if we have actual items and we're not already loaded
        if (cartData.length > 0 && state.items.length === 0) {
          dispatch({ type: 'LOAD_CART', payload: cartData })
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, []) // Empty dependency array - only run once on mount

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.items.length > 0 || localStorage.getItem('ecoclean-cart')) {
      localStorage.setItem('ecoclean-cart', JSON.stringify(state.items))
    }
  }, [state.items])

  // Use useCallback to prevent unnecessary re-renders
  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } })
  }, [])

  const removeFromCart = useCallback((id: string | number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }, [])

  const updateQuantity = useCallback((id: string | number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    console.log('Clearing cart...')
    dispatch({ type: 'CLEAR_CART' })
    // Also clear localStorage
    localStorage.removeItem('ecoclean-cart')
  }, [])

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemsCount: state.itemCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}