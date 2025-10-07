"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { vendorApi, type Vendor } from '@/lib/vendor-api'

interface VendorAuthContextType {
  vendor: Vendor | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; vendor?: Vendor | null; error?: string }>
  logout: () => void
}

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined)

export function VendorAuthProvider({ children }: { children: ReactNode }) {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      console.log('🔐 VendorAuthProvider: Checking authentication...')
      
      if (vendorApi.hasToken()) {
        console.log('✅ VendorAuthProvider: Token exists, user is authenticated')
        setIsAuthenticated(true)
      } else {
        console.log('❌ VendorAuthProvider: No token found')
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.log('⚠️ VendorAuthProvider: Auth check failed:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      console.log('🔐 VendorAuthProvider: Starting login process...')
      
      const data = await vendorApi.login(email, password)
      console.log('✅ VendorAuthProvider: Login API success, token received')
      
      vendorApi.setToken(data.token)
      console.log('🔑 VendorAuthProvider: Token stored in vendorApi')
      
      if (data.vendor) {
        console.log('📊 VendorAuthProvider: Using vendor data from login response:', data.vendor.businessName)
        setVendor(data.vendor)
        setIsAuthenticated(true)
        console.log('🎯 VendorAuthProvider: Auth state updated - isAuthenticated: true')
        return { success: true, vendor: data.vendor }
      } else {
        console.warn('⚠️ VendorAuthProvider: No vendor data in login response')
        setIsAuthenticated(true)
        return { success: true, vendor: null }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      console.error('❌ VendorAuthProvider: Login failed:', message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log('🚪 VendorAuthProvider: Logging out...')
    vendorApi.clearToken()
    setVendor(null)
    setIsAuthenticated(false)
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    
    router.push('/vendor/login')
  }

  return (
    <VendorAuthContext.Provider value={{
      vendor,
      isLoading,
      isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </VendorAuthContext.Provider>
  )
}

export const useVendorAuth = () => {
  const context = useContext(VendorAuthContext)
  if (context === undefined) {
    throw new Error('useVendorAuth must be used within a VendorAuthProvider')
  }
  return context
}