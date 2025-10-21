"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { vendorApi, type Vendor } from '@/lib/vendor-api'

export function useVendorAuth() {
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
      console.log('🔐 useVendorAuth: Checking authentication...')
      
      // Simple token existence check - no backend call needed
      if (vendorApi.hasToken()) {
        console.log('✅ useVendorAuth: Token exists, user is authenticated')
        const currentVendor = vendorApi.getCurrentVendor()
        if (currentVendor) {
          setVendor(currentVendor)
          console.log('📊 useVendorAuth: Loaded vendor data from storage:', currentVendor.businessName)
        }
        setIsAuthenticated(true)
      } else {
        console.log('❌ useVendorAuth: No token found')
        setIsAuthenticated(false)
        setVendor(null)
      }
    } catch (error) {
      console.log('⚠️ useVendorAuth: Auth check failed:', error)
      setIsAuthenticated(false)
      setVendor(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      console.log('🔐 useVendorAuth: Starting login process...')
      
      const data = await vendorApi.login(email, password)
      console.log('✅ useVendorAuth: Login API success, token received')
      
      vendorApi.setToken(data.token)
      console.log('🔑 useVendorAuth: Token stored in vendorApi')
      
      if (data.vendor) {
        console.log('📊 useVendorAuth: Using vendor data from login response:', data.vendor.businessName)
        setVendor(data.vendor)
        vendorApi.setCurrentVendor(data.vendor) // Store vendor data in localStorage
        setIsAuthenticated(true)
        console.log('🎯 useVendorAuth: Auth state updated - isAuthenticated: true')
        return { success: true, vendor: data.vendor }
      } else {
        console.warn('⚠️ useVendorAuth: No vendor data in login response')
        setIsAuthenticated(true)
        return { success: true, vendor: null }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      console.error('❌ useVendorAuth: Login failed:', message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log('🚪 useVendorAuth: Logging out...')
    vendorApi.clearToken()
    setVendor(null)
    setIsAuthenticated(false)
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    
    router.push('/vendor/login')
  }

  return {
    vendor,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  }
}