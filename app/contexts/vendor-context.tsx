// app/contexts/vendor-context.tsx
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Vendor {
  id: string
  name: string
  email: string
  businessName: string
  phone: string
  address: string
  businessDescription: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

interface VendorContextType {
  vendors: Vendor[]
  pendingVendors: Vendor[]
  approvedVendors: Vendor[]
  isLoading: boolean
  fetchVendors: () => Promise<void>
  updateVendorStatus: (vendorId: string, status: 'approved' | 'rejected') => Promise<void>
}

const VendorContext = createContext<VendorContextType | undefined>(undefined)

export function VendorProvider({ children }: { children: ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchVendors = async () => {
    try {
      setIsLoading(true)
      
      // Fetch real vendors from backend
      const response = await fetch('http://localhost:5000/api/auth/vendors')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.vendors) {
          // Transform backend vendor data to frontend format
          const vendors: Vendor[] = data.vendors.map((vendor: any) => ({
            id: vendor._id,
            name: vendor.name || vendor.businessName,
            email: vendor.email,
            businessName: vendor.businessName,
            phone: vendor.phone || vendor.phoneNumber,
            address: vendor.address || vendor.location,
            businessDescription: vendor.businessDescription || vendor.description,
            status: vendor.status,
            createdAt: new Date(vendor.createdAt),
            updatedAt: new Date(vendor.updatedAt)
          }))
          setVendors(vendors)
        } else {
          setVendors([])
        }
      } else {
        console.error('Failed to fetch vendors')
        setVendors([])
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
      setVendors([])
    } finally {
      setIsLoading(false)
    }
  }

  const updateVendorStatus = async (vendorId: string, status: 'approved' | 'rejected') => {
    try {
      // Update vendor status via backend API
      const response = await fetch(`http://localhost:5000/api/auth/vendors/${vendorId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        setVendors(prevVendors => 
          prevVendors.map(vendor => 
            vendor.id === vendorId 
              ? { ...vendor, status, updatedAt: new Date() }
              : vendor
          )
        )
        return { success: true }
      } else {
        console.error('Failed to update vendor status')
        return { success: false, error: 'Failed to update vendor status' }
      }
    } catch (error) {
      console.error('Error updating vendor status:', error)
      return { success: false, error: 'Failed to update vendor status' }
    }
  }

  // Filter vendors by status
  const pendingVendors = vendors.filter(vendor => vendor.status === 'pending')
  const approvedVendors = vendors.filter(vendor => vendor.status === 'approved')

  // Fetch vendors on component mount
  useEffect(() => {
    fetchVendors()
  }, [])

  const value = {
    vendors,
    pendingVendors,
    approvedVendors,
    isLoading,
    fetchVendors,
    updateVendorStatus
  }

  return (
    <VendorContext.Provider value={value}>
      {children}
    </VendorContext.Provider>
  )
}

export function useVendorStore() {
  const context = useContext(VendorContext)
  if (context === undefined) {
    throw new Error('useVendorStore must be used within a VendorProvider')
  }
  return context
}