"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { RecentlyViewedItem } from '@/lib/product-types'

interface RecentlyViewedContextType {
  recentlyViewed: RecentlyViewedItem[]
  addToRecentlyViewed: (productId: string) => void
  clearRecentlyViewed: () => void
  getRecentProducts: (limit?: number) => RecentlyViewedItem[]
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined)

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([])

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    const savedRecentlyViewed = localStorage.getItem('cleancart-recently-viewed')
    if (savedRecentlyViewed) {
      try {
        setRecentlyViewed(JSON.parse(savedRecentlyViewed))
      } catch (error) {
        console.error('Error loading recently viewed:', error)
      }
    }
  }, [])

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cleancart-recently-viewed', JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter(item => item.productId !== productId)
      
      // Add to beginning of array
      const newItem: RecentlyViewedItem = {
        productId,
        viewedAt: new Date().toISOString()
      }

      // Keep only last 20 items
      return [newItem, ...filtered].slice(0, 20)
    })
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
  }

  const getRecentProducts = (limit: number = 10) => {
    return recentlyViewed.slice(0, limit)
  }

  return (
    <RecentlyViewedContext.Provider value={{
      recentlyViewed,
      addToRecentlyViewed,
      clearRecentlyViewed,
      getRecentProducts
    }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext)
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider')
  }
  return context
}