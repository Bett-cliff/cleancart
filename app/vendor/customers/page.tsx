"use client"

import { useState } from "react"
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
  Truck
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock customers data
const mockCustomers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+254 712 345 678",
    location: "Nairobi, Kenya",
    joinDate: "2023-11-15",
    totalOrders: 12,
    totalSpent: 45200,
    lastOrder: "2024-01-20",
    status: "active",
    loyaltyTier: "gold",
    averageOrderValue: 3767
  },
  {
    id: 2,
    name: "Mike Otieno",
    email: "mike.o@email.com",
    phone: "+254 723 456 789",
    location: "Mombasa, Kenya",
    joinDate: "2023-12-01",
    totalOrders: 8,
    totalSpent: 28750,
    lastOrder: "2024-01-19",
    status: "active",
    loyaltyTier: "silver",
    averageOrderValue: 3594
  },
  {
    id: 3,
    name: "Grace Wambui",
    email: "grace.w@email.com",
    phone: "+254 734 567 890",
    location: "Kisumu, Kenya",
    joinDate: "2024-01-05",
    totalOrders: 3,
    totalSpent: 9600,
    lastOrder: "2024-01-18",
    status: "active",
    loyaltyTier: "bronze",
    averageOrderValue: 3200
  },
  {
    id: 4,
    name: "David Kimani",
    email: "david.k@email.com",
    phone: "+254 745 678 901",
    location: "Nakuru, Kenya",
    joinDate: "2023-10-20",
    totalOrders: 15,
    totalSpent: 67800,
    lastOrder: "2024-01-17",
    status: "active",
    loyaltyTier: "gold",
    averageOrderValue: 4520
  },
  {
    id: 5,
    name: "Lisa Adhiambo",
    email: "lisa.a@email.com",
    phone: "+254 756 789 012",
    location: "Eldoret, Kenya",
    joinDate: "2024-01-10",
    totalOrders: 1,
    totalSpent: 5400,
    lastOrder: "2024-01-16",
    status: "new",
    loyaltyTier: "bronze",
    averageOrderValue: 5400
  },
  {
    id: 6,
    name: "James Mwangi",
    email: "james.m@email.com",
    phone: "+254 767 890 123",
    location: "Thika, Kenya",
    joinDate: "2023-09-15",
    totalOrders: 0,
    totalSpent: 0,
    lastOrder: null,
    status: "inactive",
    loyaltyTier: "new",
    averageOrderValue: 0
  }
]

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

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedLoyalty, setSelectedLoyalty] = useState("all")

  const statuses = ["all", "active", "new", "inactive"]
  const loyaltyTiers = ["all", "gold", "silver", "bronze", "new"]

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus
    const matchesLoyalty = selectedLoyalty === "all" || customer.loyaltyTier === selectedLoyalty
    
    return matchesSearch && matchesStatus && matchesLoyalty
  })

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

  // Calculate customer statistics
  const totalCustomers = filteredCustomers.length
  const activeCustomers = filteredCustomers.filter(c => c.status === 'active').length
  const newCustomers = filteredCustomers.filter(c => c.status === 'new').length
  const totalRevenue = filteredCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0)
  const averageOrderValue = filteredCustomers.length > 0 
    ? Math.round(filteredCustomers.reduce((sum, customer) => sum + customer.averageOrderValue, 0) / filteredCustomers.length)
    : 0

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
          <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Vendor Sections Sub-Navbar - ADDED THIS SECTION */}
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
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
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
                <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
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
                <p className="text-2xl font-bold text-gray-900">{newCustomers}</p>
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
                <p className="text-2xl font-bold text-gray-900">KSh {averageOrderValue.toLocaleString()}</p>
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

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
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

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
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
      {filteredCustomers.length > 0 && (
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
                    const count = filteredCustomers.filter(c => c.loyaltyTier === tier).length
                    const percentage = totalCustomers > 0 ? Math.round((count / totalCustomers) * 100) : 0
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
                    const revenue = filteredCustomers
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
                  {filteredCustomers
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