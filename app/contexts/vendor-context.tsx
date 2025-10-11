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
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data - replace with actual API call
      const mockVendors: Vendor[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@cleaningsupplies.com",
          businessName: "Eco Cleaning Supplies",
          phone: "+254700000001",
          address: "Nairobi, Kenya",
          businessDescription: "Premium eco-friendly cleaning supplies",
          status: 'pending',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: "2", 
          name: "Jane Smith",
          email: "jane@greenproducts.co.ke",
          businessName: "Green Products Ltd",
          phone: "+254700000002",
          address: "Mombasa, Kenya",
          businessDescription: "Sustainable cleaning products and equipment",
          status: 'approved',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-12')
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike@ecoclean.co.ke", 
          businessName: "Eco Clean Solutions",
          phone: "+254700000003",
          address: "Kisumu, Kenya",
          businessDescription: "Organic cleaning solutions for homes and businesses",
          status: 'rejected',
          createdAt: new Date('2024-01-08'),
          updatedAt: new Date('2024-01-09')
        }
      ]
      
      setVendors(mockVendors)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateVendorStatus = async (vendorId: string, status: 'approved' | 'rejected') => {
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setVendors(prevVendors => 
        prevVendors.map(vendor => 
          vendor.id === vendorId 
            ? { ...vendor, status, updatedAt: new Date() }
            : vendor
        )
      )
      
      return { success: true }
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