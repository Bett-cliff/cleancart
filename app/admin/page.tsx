// app/admin/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Store, Package, TrendingUp, ArrowRight, DollarSign, ShoppingCart, UserCheck, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useAdmin } from "@/app/contexts/admin-context"

// Types for better type safety
interface Vendor {
  id: string;
  businessName: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  products: number;
  revenue: number;
}

interface AdminData {
  stats: {
    totalVendors: number;
    pendingVendors: number;
    approvedVendors: number;
    totalRevenue: number;
    totalProducts: number;
    totalOrders: number;
    activeCustomers: number;
  };
  recentVendors: Vendor[];
  platformStats: {
    monthlyRevenue: number;
    growthRate: number;
    topCategories: string[];
    vendorDistribution: {
      approved: number;
      pending: number;
      rejected: number;
    };
  };
}

// Fallback data in case API fails
const fallbackAdminData: AdminData = {
  stats: {
    totalVendors: 24,
    pendingVendors: 5,
    approvedVendors: 18,
    totalRevenue: 1245000,
    totalProducts: 156,
    totalOrders: 892,
    activeCustomers: 2341
  },
  recentVendors: [
    {
      id: "1",
      businessName: "EcoClean Supplies",
      email: "contact@ecoclean.com",
      status: "approved",
      createdAt: "2024-01-20",
      products: 12,
      revenue: 245000
    },
    {
      id: "2", 
      businessName: "Green Home Solutions",
      email: "info@greenhome.com",
      status: "pending",
      createdAt: "2024-01-19",
      products: 8,
      revenue: 0
    },
    {
      id: "3",
      businessName: "Organic Foods Co.",
      email: "hello@organicfoods.co.ke",
      status: "pending",
      createdAt: "2024-01-18",
      products: 15,
      revenue: 0
    },
    {
      id: "4",
      businessName: "Tech Gadgets Ltd",
      email: "sales@techgadgets.co.ke",
      status: "approved",
      createdAt: "2024-01-17",
      products: 23,
      revenue: 567000
    }
  ],
  platformStats: {
    monthlyRevenue: 245000,
    growthRate: 12.5,
    topCategories: ["Personal Care", "Home Cleaning", "Kitchen", "Fashion", "Electronics"],
    vendorDistribution: {
      approved: 18,
      pending: 5,
      rejected: 1
    }
  }
}

export default function AdminDashboard() {
  const { adminData, isLoading, error, refreshData } = useAdmin()
  
  // Use fallback data if API fails
  const data: AdminData = adminData || fallbackAdminData
  const { stats, recentVendors, platformStats } = data

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadge = (status: Vendor['status']) => {
    const statusConfig = {
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200'
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200'
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200'
      }
    }

    const config = statusConfig[status]
    return `px-3 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text} ${config.border}`
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error && !adminData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Data</h3>
          <p className="text-red-600 mb-2">Error: {error}</p>
          <p className="text-gray-600 mb-4">Showing demo data for preview purposes</p>
          <Button onClick={refreshData} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your marketplace platform</p>
        </div>
        <div className="flex items-center gap-3">
          {error && adminData && (
            <span className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              Using cached data
            </span>
          )}
          <Button 
            onClick={refreshData} 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVendors}</p>
                <p className="text-xs text-green-600 mt-1">
                  {platformStats.vendorDistribution.approved} approved • {platformStats.vendorDistribution.pending} pending
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingVendors}</p>
                <p className="text-xs text-yellow-600 mt-1">Requires attention</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Store className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{platformStats.growthRate}% growth
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">Platform users</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your marketplace platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/vendors">
              <Button className="w-full justify-between bg-green-600 hover:bg-green-700 text-white transition-colors">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Vendors
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <Link href="/admin/products">
              <Button variant="outline" className="w-full justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Manage Products
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/admin/orders">
              <Button variant="outline" className="w-full justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Manage Orders
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Vendor Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Vendor Applications</CardTitle>
            <CardDescription>Latest vendor signups requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVendors.slice(0, 4).map((vendor) => (
                <div 
                  key={vendor.id} 
                  className="flex justify-between items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/admin/vendors/${vendor.id}`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{vendor.businessName}</p>
                    <p className="text-sm text-gray-500">{vendor.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(vendor.createdAt).toLocaleDateString()} • {vendor.products} products
                      {vendor.revenue > 0 && ` • ${formatCurrency(vendor.revenue)}`}
                    </p>
                  </div>
                  <span className={getStatusBadge(vendor.status)}>
                    {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                  </span>
                </div>
              ))}
              
              {recentVendors.length === 0 && (
                <div className="text-center py-8">
                  <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No vendor applications yet.</p>
                  <p className="text-sm text-gray-400 mt-1">New vendor signups will appear here</p>
                </div>
              )}

              {recentVendors.length > 0 && (
                <Link href="/admin/vendors">
                  <Button variant="outline" className="w-full hover:bg-gray-50 transition-colors">
                    View All Vendors ({recentVendors.length})
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Platform Insights
          </CardTitle>
          <CardDescription>
            Key metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{stats.totalProducts.toLocaleString()}</p>
              <p className="text-sm text-blue-700 font-medium">Total Products</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
              <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.totalOrders.toLocaleString()}</p>
              <p className="text-sm text-green-700 font-medium">Total Orders</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-100">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(platformStats.monthlyRevenue)}</p>
              <p className="text-sm text-purple-700 font-medium">Monthly Revenue</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Top Categories</h4>
            <div className="flex flex-wrap gap-2">
              {platformStats.topCategories.map((category, index) => (
                <span 
                  key={category}
                  className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 shadow-sm"
                >
                  #{category}
                </span>
              ))}
            </div>
          </div>

          {/* Vendor Distribution */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Vendor Distribution</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-lg font-bold text-green-600">{platformStats.vendorDistribution.approved}</p>
                <p className="text-xs text-green-700">Approved</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-lg font-bold text-yellow-600">{platformStats.vendorDistribution.pending}</p>
                <p className="text-xs text-yellow-700">Pending</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-lg font-bold text-red-600">{platformStats.vendorDistribution.rejected}</p>
                <p className="text-xs text-red-700">Rejected</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}