"use client"

import { useEffect, useState } from "react"
import { useVendorAuth } from "@/hooks/use-vendor-auth"
import { vendorApi } from "@/lib/vendor-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Package, Users, DollarSign, Loader2 } from "lucide-react"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
}

export default function VendorDashboard() {
  const { vendor, logout } = useVendorAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch fresh dashboard data from database
        const statsData = await vendorApi.getDashboardStats()
        setStats(statsData)
        
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {vendor?.businessName || 'Vendor'}!
            </p>
            <p className="text-sm text-green-600 mt-1">
              Status: <span className="font-medium capitalize">{vendor?.status}</span>
            </p>
          </div>
          <Button 
            onClick={logout}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalRevenue || 0}</div>
              <p className="text-xs text-muted-foreground">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Building className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingOrders || 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting fulfillment</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">New order received</p>
                  <p className="text-sm text-gray-600">Order #1001 - 5 minutes ago</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">Product review submitted</p>
                  <p className="text-sm text-gray-600">Floor Scrubber - 2 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  View Earnings Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}