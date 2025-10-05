"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { ComparisonItem } from '@/lib/product-types'

interface ComparisonContextType {
  comparisonItems: ComparisonItem[]
  addToComparison: (productId: string) => void
  removeFromComparison: (productId: string) => void
  isInComparison: (productId: string) => boolean
  clearComparison: () => void
  comparisonCount: number
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>([])
  const { toast } = useToast()

  // Load comparison from localStorage on mount
  useEffect(() => {
    const savedComparison = localStorage.getItem('cleancart-comparison')
    if (savedComparison) {
      try {
        setComparisonItems(JSON.parse(savedComparison))
      } catch (error) {
        console.error('Error loading comparison:', error)
      }
    }
  }, [])

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cleancart-comparison', JSON.stringify(comparisonItems))
  }, [comparisonItems])

  const addToComparison = (productId: string) => {
    setComparisonItems(prev => {
      // Check if product is already in comparison
      if (prev.find(item => item.productId === productId)) {
        toast({
          title: "Already in comparison",
          description: "This product is already in your comparison list.",
        })
        return prev
      }

      // Limit to 4 products for comparison
      if (prev.length >= 4) {
        toast({
          title: "Comparison limit reached",
          description: "You can compare up to 4 products at a time.",
          variant: "destructive"
        })
        return prev
      }

      const newItem: ComparisonItem = {
        productId,
        addedAt: new Date().toISOString()
      }

      toast({
        title: "Added to comparison!",
        description: "Product has been added to comparison.",
      })

      return [...prev, newItem]
    })
  }

  const removeFromComparison = (productId: string) => {
    setComparisonItems(prev => prev.filter(item => item.productId !== productId))
    toast({
      title: "Removed from comparison",
      description: "Product has been removed from comparison.",
    })
  }

  const isInComparison = (productId: string) => {
    return comparisonItems.some(item => item.productId === productId)
  }

  const clearComparison = () => {
    setComparisonItems([])
    toast({
      title: "Comparison cleared",
      description: "All items have been removed from comparison.",
    })
  }

  const comparisonCount = comparisonItems.length

  return (
    <ComparisonContext.Provider value={{
      comparisonItems,
      addToComparison,
      removeFromComparison,
      isInComparison,
      clearComparison,
      comparisonCount
    }}>
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
}