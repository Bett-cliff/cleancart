"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Vendor {
  id: string
  email: string
  businessName: string
  phone: string
  address: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}

interface VendorContextType {
  vendors: Vendor[]
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt' | 'status'>) => void
  approveVendor: (vendorId: string) => void
  getVendorByEmail: (email: string) => Vendor | undefined
  validateVendor: (email: string, password: string) => boolean
}

const VendorContext = createContext<VendorContextType | undefined>(undefined)

export function VendorProvider({ children }: { children: React.ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>([])

  // Load vendors from localStorage on mount
  useEffect(() => {
    const storedVendors = localStorage.getItem('cleanCartVendors')
    if (storedVendors) {
      const parsedVendors = JSON.parse(storedVendors).map((vendor: any) => ({
        ...vendor,
        createdAt: new Date(vendor.createdAt)
      }))
      setVendors(parsedVendors)
    }
  }, [])

  // Save vendors to localStorage whenever vendors change
  useEffect(() => {
    localStorage.setItem('cleanCartVendors', JSON.stringify(vendors))
  }, [vendors])

  const addVendor = (vendorData: Omit<Vendor, 'id' | 'createdAt' | 'status'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      status: 'pending' // All new vendors need approval
    }
    setVendors(prev => [...prev, newVendor])
    return newVendor
  }

  const approveVendor = (vendorId: string) => {
    setVendors(prev => 
      prev.map(vendor => 
        vendor.id === vendorId ? { ...vendor, status: 'approved' } : vendor
      )
    )
  }

  const getVendorByEmail = (email: string) => {
    return vendors.find(vendor => vendor.email === email)
  }

  const validateVendor = (email: string, password: string) => {
    const vendor = getVendorByEmail(email)
    // For demo, we'll accept any password for approved vendors
    // In real app, you'd hash and compare passwords
    return vendor?.status === 'approved'
  }

  return (
    <VendorContext.Provider value={{
      vendors,
      addVendor,
      approveVendor,
      getVendorByEmail,
      validateVendor
    }}>
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