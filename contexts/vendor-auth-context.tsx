// contexts/vendor-auth-context.tsx
"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useVendorAuth } from '@/hooks/use-vendor-auth'

const VendorAuthContext = createContext<ReturnType<typeof useVendorAuth> | null>(null)

export function VendorAuthProvider({ children }: { children: ReactNode }) {
  const auth = useVendorAuth()
  
  // ADD DETAILED DEBUG LOGS
  console.log('🔧 VendorAuthProvider RENDERED:', { 
    isAuthenticated: auth.isAuthenticated, 
    isLoading: auth.isLoading,
    vendor: auth.vendor?.businessName
  })
  
  return (
    <VendorAuthContext.Provider value={auth}>
      {children}
    </VendorAuthContext.Provider>
  )
}

export function useVendorAuthContext() {
  const context = useContext(VendorAuthContext)
  if (!context) {
    throw new Error('useVendorAuthContext must be used within a VendorAuthProvider')
  }
  
  // ADD DEBUG LOG
  console.log('🔧 useVendorAuthContext ACCESSED:', { 
    isAuthenticated: context.isAuthenticated, 
    isLoading: context.isLoading,
    vendor: context.vendor?.businessName
  })
  
  return context
}