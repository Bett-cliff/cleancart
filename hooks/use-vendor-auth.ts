"use client"

import { useState, useEffect } from 'react'
import { useVendorStore } from '@/contexts/vendor-context'

interface Vendor {
  id: string
  email: string
  name: string
  businessName: string
}

export function useVendorAuth() {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { validateVendor, getVendorByEmail } = useVendorStore()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('vendorToken')
    const email = localStorage.getItem('vendorEmail')
    const name = localStorage.getItem('vendorName')

    if (token && email && name) {
      setVendor({
        id: '1',
        email,
        name,
        businessName: name
      })
    }
    setIsLoading(false)
  }

  const login = (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = validateVendor(email, password)
        
        if (isValid) {
          const vendorData = getVendorByEmail(email)
          if (vendorData) {
            localStorage.setItem('vendorToken', 'mock-vendor-token')
            localStorage.setItem('vendorEmail', email)
            localStorage.setItem('vendorName', vendorData.businessName)
            setVendor({
              id: vendorData.id,
              email,
              name: vendorData.businessName,
              businessName: vendorData.businessName
            })
            resolve(true)
          } else {
            resolve(false)
          }
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const logout = () => {
    localStorage.removeItem('vendorToken')
    localStorage.removeItem('vendorEmail')
    localStorage.removeItem('vendorName')
    setVendor(null)
  }

  const isAuthenticated = !!vendor

  return {
    vendor,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  }
}