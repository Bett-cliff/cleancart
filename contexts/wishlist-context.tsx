"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { WishlistItem } from '@/lib/product-types'

interface WishlistContextType {
  wishlist: WishlistItem[]
  addToWishlist: (productId: string, variantId?: string) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const { toast } = useToast()

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('cleancart-wishlist')
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist))
      } catch (error) {
        console.error('Error loading wishlist:', error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cleancart-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (productId: string, variantId?: string) => {
    setWishlist(prev => {
      // Check if product is already in wishlist
      if (prev.find(item => item.productId === productId)) {
        toast({
          title: "Already in wishlist",
          description: "This product is already in your wishlist.",
        })
        return prev
      }

      const newItem: WishlistItem = {
        productId,
        variantId,
        addedAt: new Date().toISOString()
      }

      toast({
        title: "Added to wishlist!",
        description: "Product has been saved to your wishlist.",
      })

      return [...prev, newItem]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.productId !== productId))
    toast({
      title: "Removed from wishlist",
      description: "Product has been removed from your wishlist.",
    })
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId)
  }

  const clearWishlist = () => {
    setWishlist([])
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    })
  }

  const wishlistCount = wishlist.length

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      wishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}