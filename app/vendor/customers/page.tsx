"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Calendar,
  Star,
  Download,
  Plus,
  User,
  TrendingUp,
  Home,
  Package,
  DollarSign,
  Warehouse,
  Megaphone,
  Crown,
  MessageSquare,
  Settings,
  Truck,
  Loader2,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// All the vendor sections for the sub-navbar
const vendorSections = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: Home,
    href: "/vendor/dashboard",
    description: "Business overview"
  },
  {
    id: "products",
    name: "Products",
    icon: Package,
    href: "/vendor/products",
    description: "Manage your products"
  },
  {
    id: "orders",
    name: "Orders",
    icon: ShoppingCart,
    href: "/vendor/orders",
    description: "Customer orders"
  },
  {
    id: "inventory",
    name: "Inventory",
    icon: Warehouse,
    href: "/vendor/inventory",
    description: "Stock management"
  },
  {
    id: "customers",
    name: "Customers",
    icon: Users,
    href: "/vendor/customers",
    description: "Customer database"
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: Megaphone,
    href: "/vendor/marketing",
    description: "Promotions & campaigns"
  },
  {
    id: "payouts",
    name: "Payouts",
    icon: DollarSign,
    href: "/vendor/payouts",
    description: "Earnings & payments"
  },
  {
    id: "shipping",
    name: "Shipping",
    icon: Truck,
    href: "/vendor/shipping",
    description: "Delivery & logistics"
  },
  {
    id: "reviews",
    name: "Reviews",
    icon: Star,
    href: "/vendor/reviews",
    description: "Customer feedback"
  },
  {
    id: "subscription",
    name: "Subscription",
    icon: Crown,
    href: "/vendor/subscription",
    description: "Plan & billing"
  },
  {
    id: "support",
    name: "Support",
    icon: MessageSquare,
    href: "/vendor/support",
    description: "Help & support"
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    href: "/vendor/settings",
    description: "Account settings"
  }
]

const statusConfig = {
  active: { label: "Active", variant: "default" as const, color: "text-green-600 bg-green-50 border-green-200" },
  new: { label: "New", variant: "secondary" as const, color: "text-blue-600 bg-blue-50 border-blue-200" },
  inactive: { label: "Inactive", variant: "outline" as const, color: "text-gray-600 bg-gray-50 border-gray-200" }
}

const loyaltyConfig = {
  gold: { label: "Gold", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  silver: { label: "Silver", color: "bg-gray-100 text-gray-800 border-gray-200" },
  bronze: { label: "Bronze", color: "bg-orange-100 text-orange-800 border-orange-200" },
  new: { label: "New", color: "bg-blue-100 text-blue-800 border-blue-200" }
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string | null;
  status: string;
  loyaltyTier: string;
  averageOrderValue: number;
}

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedLoyalty, setSelectedLoyalty] = useState("all")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    newCustomers: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const statuses = ["all", "active", "new", "inactive"]
  const loyaltyTiers = ["all", "gold", "silver", "bronze", "new"]

  // Fetch customers from database
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const params = new URLSearchParams()
        if (searchTerm) params.append('search', searchTerm)
        if (selectedStatus !== 'all') params.append('status', selectedStatus)
        if (selectedLoyalty !== 'all') params.append('loyalty', selectedLoyalty)

        // Get vendor token for authentication
        const token = typeof window !== 'undefined' ? localStorage.getItem('vendor_token') : null
        
        const response = await fetch(`/api/vendor/customers?${params}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch customers')
        }
        
        const result = await response.json()
        setCustomers(result.data.customers)
        setStats(result.data.stats)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching customers:', err)
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchCustomers()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedStatus, selectedLoyalty])

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getLoyaltyBadge = (tier: string) => {
    const config = loyaltyConfig[tier as keyof typeof loyaltyConfig]
    return (
      <Badge variant="outline" className={config.color}>
        <Star className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const handleRefresh = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.append('search', searchTerm)
    if (selectedStatus !== 'all') params.append('status', selectedStatus)
    if (selectedLoyalty !== 'all') params.append('loyalty', selectedLoyalty)

    // Get vendor token for authentication
    const token = typeof window !== 'undefined' ? localStorage.getItem('vendor_token') : null
    
    fetch(`/api/vendor/customers?${params}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })
      .then(response => response.json())
      .then(result => {
        setCustomers(result.data.customers)
        setStats(result.data.stats)
      })
      .catch(err => {
        console.error('Error refreshing customers:', err)
      })
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Customers</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Vendor Sections Sub-Navbar */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="px-4 py-3 border-b">
          <h3 className="text-sm font-medium text-gray-900">Quick Access</h3>
          <p className="text-xs text-gray-600">Navigate to different vendor sections</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {vendorSections.map((section) => {
              const Icon = section.icon
              return (
                <Link key={section.id} href={section.href}>
                  <Button
                    variant="outline"
                    className="w-full h-auto p-3 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-green-600" />
                    <span className="text-xs font-medium text-gray-900">{section.name}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats.newCustomers}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-2xl font-bold text-gray-900">KSh {stats.averageOrderValue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers by name, email, or location..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="sm:w-48">
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === "all" ? "All Status" : statusConfig[status as keyof typeof statusConfig]?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Loyalty Tier Filter */}
            <div className="sm:w-48">
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedLoyalty}
                onChange={(e) => setSelectedLoyalty(e.target.value)}
              >
                {loyaltyTiers.map(tier => (
                  <option key={tier} value={tier}>
                    {tier === "all" ? "All Tiers" : loyaltyConfig[tier as keyof typeof loyaltyConfig]?.label}
                  </option>
                ))}
              </select>
            </div>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading customers...</span>
        </div>
      )}

      {/* Customers Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <Card key={customer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{customer.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(customer.status)}
                        {getLoyaltyBadge(customer.loyaltyTier)}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        View Orders
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-2">
                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {customer.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Joined {customer.joinDate}
                  </div>
                </div>

                {/* Customer Stats */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{customer.totalOrders}</p>
                    <p className="text-xs text-gray-600">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">KSh {customer.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Total Spent</p>
                  </div>
                </div>

                {/* Last Order */}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Last Order</p>
                      <p className="text-xs text-blue-700">
                        {customer.lastOrder 
                          ? `On ${customer.lastOrder}` 
                          : 'No orders yet'
                        }
                      </p>
                    </div>
                    {customer.lastOrder && (
                      <Badge variant="outline" className="bg-white text-blue-700">
                        KSh {customer.averageOrderValue.toLocaleString()} avg
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && customers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedStatus !== "all" || selectedLoyalty !== "all" 
                ? "Try adjusting your search or filters"
                : "You haven't acquired any customers yet"
              }
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                <Download className="w-4 h-4 mr-2" />
                Import Customers
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add First Customer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Insights Section */}
      {!isLoading && customers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Customer Insights
            </CardTitle>
            <CardDescription>
              Key metrics about your customer base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Loyalty Distribution */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Loyalty Tier Distribution</h4>
                <div className="space-y-2">
                  {['gold', 'silver', 'bronze', 'new'].map(tier => {
                    const count = customers.filter(c => c.loyaltyTier === tier).length
                    const percentage = customers.length > 0 ? Math.round((count / customers.length) * 100) : 0
                    return (
                      <div key={tier} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            tier === 'gold' ? 'bg-yellow-400' :
                            tier === 'silver' ? 'bg-gray-400' :
                            tier === 'bronze' ? 'bg-orange-400' : 'bg-blue-400'
                          }`} />
                          <span className="text-sm text-gray-600 capitalize">{tier}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {count} ({percentage}%)
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Revenue by Tier */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Revenue by Tier</h4>
                <div className="space-y-2">
                  {['gold', 'silver', 'bronze'].map(tier => {
                    const revenue = customers
                      .filter(c => c.loyaltyTier === tier)
                      .reduce((sum, customer) => sum + customer.totalSpent, 0)
                    return (
                      <div key={tier} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            tier === 'gold' ? 'bg-yellow-400' :
                            tier === 'silver' ? 'bg-gray-400' : 'bg-orange-400'
                          }`} />
                          <span className="text-sm text-gray-600 capitalize">{tier}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          KSh {revenue.toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Top Customers */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Top Customers</h4>
                <div className="space-y-2">
                  {customers
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .slice(0, 3)
                    .map((customer, index) => (
                      <div key={customer.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-green-600">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600 truncate max-w-20">
                            {customer.name}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          KSh {customer.totalSpent.toLocaleString()}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}