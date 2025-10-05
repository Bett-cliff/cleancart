"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Star,
  Settings,
  Truck,
  Tag,
  BarChart3,
  Eye,
  ArrowRight,
  Calendar,
  CreditCard,
  MessageSquare,
  MapPin,
  FileText,
  Shield,
  Bell,
  Heart,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock data
const mockDashboardData = {
  overview: {
    totalSales: 1250000,
    totalOrders: 156,
    pendingOrders: 12,
    totalProducts: 24,
    lowStockItems: 3,
    customerRating: 4.8,
    revenueGrowth: 15.2,
    activePromotions: 3
  },
  recentOrders: [
    { id: "ORD-4567", customer: "John Kamau", amount: 4500, status: "pending", date: "2024-06-14" },
    { id: "ORD-4566", customer: "Sarah Mwangi", amount: 12000, status: "delivered", date: "2024-06-13" },
    { id: "ORD-4565", customer: "James Mutiso", amount: 7800, status: "processing", date: "2024-06-13" },
    { id: "ORD-4564", customer: "Mary Wanjiku", amount: 3400, status: "delivered", date: "2024-06-12" },
  ],
  quickStats: [
    { label: "Today's Revenue", value: "KSh 45,800", change: "+12%", trend: "up" },
    { label: "This Week", value: "KSh 289,400", change: "+8%", trend: "up" },
    { label: "This Month", value: "KSh 1.25M", change: "+15%", trend: "up" },
    { label: "Active Customers", value: "1,248", change: "+5%", trend: "up" },
  ]
}

// Feature navigation cards
const featureCards = [
  {
    title: "Product Management",
    description: "Add, edit, and manage your products",
    icon: Package,
    href: "/vendor/products",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    status: "24 products"
  },
  {
    title: "Order Management",
    description: "Process and track customer orders",
    icon: ShoppingCart,
    href: "/vendor/orders",
    color: "text-green-600",
    bgColor: "bg-green-50",
    status: "12 pending"
  },
  {
    title: "Inventory",
    description: "Manage stock levels and alerts",
    icon: Package,
    href: "/vendor/inventory",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    status: "3 low stock"
  },
  {
    title: "Marketing Tools",
    description: "Create promotions and discounts",
    icon: Tag,
    href: "/vendor/marketing",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    status: "3 active"
  },
  {
    title: "Shipping & Logistics",
    description: "Manage deliveries and couriers",
    icon: Truck,
    href: "/vendor/shipping",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    status: "8 in transit"
  },
  {
    title: "Customer Reviews",
    description: "Respond to reviews and ratings",
    icon: Star,
    href: "/vendor/reviews",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    status: "4.8 rating"
  },
  {
    title: "Payment & Payouts",
    description: "Track revenue and M-PESA payouts",
    icon: DollarSign,
    href: "/vendor/payouts",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    status: "KSh 289K"
  },
  {
    title: "Vendor Profile",
    description: "Manage business settings",
    icon: Settings,
    href: "/vendor/profile",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    status: "Complete"
  },
  {
    title: "Subscription",
    description: "Manage your plan and billing",
    icon: CreditCard,
    href: "/vendor/subscription",
    color: "text-red-600",
    bgColor: "bg-red-50",
    status: "Pro Plan"
  },
]

export default function VendorDashboard() {
  const { toast } = useToast()
  const [dashboardData, setDashboardData] = useState(mockDashboardData)

  const stats = [
    {
      title: "Total Revenue",
      value: `KSh ${(dashboardData.overview.totalSales / 1000000).toFixed(2)}M`,
      description: "All time sales",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Orders",
      value: dashboardData.overview.totalOrders.toString(),
      description: "Completed orders",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Orders",
      value: dashboardData.overview.pendingOrders.toString(),
      description: "Need processing",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Products",
      value: dashboardData.overview.totalProducts.toString(),
      description: "Active listings",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Customer Rating",
      value: dashboardData.overview.customerRating.toString(),
      description: "Out of 5 stars",
      icon: Star,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const },
      processing: { label: "Processing", variant: "default" as const },
      delivered: { label: "Delivered", variant: "default" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "outline" as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Button>
            <Button>
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {mockDashboardData.quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold">{stat.value}</p>
                  <Badge variant={stat.trend === "up" ? "default" : "destructive"}>
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Recent Orders */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {stat.description}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                          <IconComponent className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest customer orders that need your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDashboardData.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(order.amount)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(order.status)}
                          <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/vendor/orders">
                    <Button variant="outline" className="w-full">
                      View All Orders
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Feature Navigation */}
          <div className="space-y-6">
            {/* Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>
                  Quickly navigate to different sections of your vendor portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {featureCards.slice(0, 4).map((feature, index) => {
                    const IconComponent = feature.icon
                    return (
                      <Link key={index} href={feature.href}>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary/20">
                          <CardContent className="p-4 text-center">
                            <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                              <IconComponent className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {feature.status}
                            </Badge>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* All Features Grid */}
            <Card>
              <CardHeader>
                <CardTitle>All Features</CardTitle>
                <CardDescription>
                  Complete access to all vendor tools and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {featureCards.map((feature, index) => {
                    const IconComponent = feature.icon
                    return (
                      <Link key={index} href={feature.href}>
                        <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                          <div className={`p-2 rounded-lg ${feature.bgColor} flex-shrink-0`}>
                            <IconComponent className={`w-4 h-4 ${feature.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                              {feature.title}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {feature.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {feature.status}
                            </Badge>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-blue-700">Our support team is here for you</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/cleancart-logo.png" alt="CleanCart Logo" width={32} height={32} className="w-8 h-8" />
                <span className="text-xl font-bold">CleanCart</span>
              </div>
              <p className="text-muted-foreground">Kenya's premier eco-friendly cleaning supplies marketplace</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Shop</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Household Cleaners</div>
                <div>Industrial Equipment</div>
                <div>Eco-Friendly Products</div>
                <div>Waste Management</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Vendors</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Become a Vendor</div>
                <div>Vendor Dashboard</div>
                <div>Pricing Plans</div>
                <div>Support</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>About Us</div>
                <div>Contact</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CleanCart. All rights reserved. Built for a cleaner Kenya.</p>
          </div>
        </div>
      </footer>

      {/* Floating Help Desk Widget */}
      <HelpDesk />
    </div>
  )
}