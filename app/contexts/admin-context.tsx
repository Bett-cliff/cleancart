// app/contexts/admin-context.tsx
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Vendor {
  id: string
  businessName: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  products: number
  revenue: number
}

interface AdminStats {
  totalVendors: number
  pendingVendors: number
  approvedVendors: number
  totalRevenue: number
  totalProducts: number
  totalOrders: number
  activeCustomers: number
}

interface PlatformStats {
  monthlyRevenue: number
  growthRate: number
  topCategories: string[]
  vendorDistribution: {
    approved: number
    pending: number
    rejected: number
  }
}

interface AdminData {
  stats: AdminStats
  recentVendors: Vendor[]
  platformStats: PlatformStats
}

interface AdminContextType {
  adminData: AdminData | null
  isLoading: boolean
  error: string | null
  refreshData: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAdminData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Call your local Next.js API route instead of the backend server
      const response = await fetch('/api/admin/dashboard')
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      setAdminData(result.data) // Your API returns { data: ... }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch admin data')
      console.error('Error fetching admin data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = () => {
    fetchAdminData()
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  return (
    <AdminContext.Provider value={{
      adminData,
      isLoading,
      error,
      refreshData
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}