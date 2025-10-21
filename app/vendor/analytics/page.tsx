"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package,
  Download,
  Calendar,
  Eye,
  Share2,
  RefreshCw,
  Star,
  ArrowUp,
  ArrowDown,
  Warehouse,
  Megaphone,
  Crown,
  MessageSquare,
  Settings,
  Truck,
  FileText,
  Home
} from "lucide-react"
import Link from "next/link"

// Empty analytics data structure
const emptyAnalyticsData = {
  overview: {
    revenue: {
      current: 0,
      previous: 0,
      change: 0
    },
    orders: {
      current: 0,
      previous: 0,
      change: 0
    },
    customers: {
      current: 0,
      previous: 0,
      change: 0
    },
    conversion: {
      current: 0,
      previous: 0,
      change: 0
    }
  },
  revenueData: [
    { month: "Jan", revenue: 0, orders: 0 },
    { month: "Feb", revenue: 0, orders: 0 },
    { month: "Mar", revenue: 0, orders: 0 },
    { month: "Apr", revenue: 0, orders: 0 },
    { month: "May", revenue: 0, orders: 0 },
    { month: "Jun", revenue: 0, orders: 0 }
  ],
  topProducts: [],
  customerMetrics: {
    newCustomers: 0,
    returningCustomers: 0,
    retentionRate: 0,
    averageLifetime: 0
  },
  salesByCategory: []
}

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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("monthly")
  const [activeTab, setActiveTab] = useState("overview")
  const [analyticsData, setAnalyticsData] = useState(emptyAnalyticsData)
  const [isLoading, setIsLoading] = useState(true)

  const timeRanges = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" }
  ]

  const analyticsTabs = [
    { id: "overview", label: "Overview" },
    { id: "products", label: "Products" },
    { id: "customers", label: "Customers" },
    { id: "sales", label: "Sales" }
  ]

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
  }

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true)
        
        // Get vendor token from localStorage
        const token = localStorage.getItem('vendor_token')
        if (!token) {
          console.log('No vendor token found')
          setAnalyticsData(emptyAnalyticsData)
          return
        }

        // Fetch dashboard data which contains analytics
        const response = await fetch('/api/vendor/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            // Transform dashboard data to analytics format
            const dashboardData = data.data
            setAnalyticsData({
              overview: {
                revenue: {
                  current: dashboardData.stats?.totalRevenue || 0,
                  previous: 0, // Would need historical data
                  change: 0
                },
                orders: {
                  current: dashboardData.stats?.totalOrders || 0,
                  previous: 0,
                  change: 0
                },
                customers: {
                  current: dashboardData.stats?.newCustomers || 0,
                  previous: 0,
                  change: 0
                },
                conversion: {
                  current: dashboardData.performanceMetrics?.conversionRate || 0,
                  previous: 0,
                  change: 0
                }
              },
              revenueData: dashboardData.salesData || emptyAnalyticsData.revenueData,
              topProducts: dashboardData.topProducts || [],
              customerMetrics: {
                newCustomers: dashboardData.stats?.newCustomers || 0,
                returningCustomers: 0, // Would need historical data
                retentionRate: 0,
                averageLifetime: 0
              },
              salesByCategory: [] // Would need category breakdown
            })
          }
        } else {
          console.log('Failed to fetch analytics data')
          setAnalyticsData(emptyAnalyticsData)
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error)
        setAnalyticsData(emptyAnalyticsData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [timeRange])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your business performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
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

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(analyticsData.overview).map(([key, data]) => {
          const titles = {
            revenue: "Total Revenue",
            orders: "Total Orders",
            customers: "Total Customers",
            conversion: "Conversion Rate"
          }
          
          const icons = {
            revenue: DollarSign,
            orders: ShoppingCart,
            customers: Users,
            conversion: TrendingUp
          }
          
          const Icon = icons[key as keyof typeof icons]
          const isPositive = data.change >= 0
          
          return (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {titles[key as keyof typeof titles]}
                </CardTitle>
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {key === 'conversion' ? `${data.current}%` : 
                   key === 'revenue' ? formatCurrency(data.current) : 
                   data.current.toLocaleString()}
                </div>
                <div className={`flex items-center gap-1 text-xs mt-1 ${getChangeColor(data.change)}`}>
                  {getChangeIcon(data.change)}
                  {Math.abs(data.change)}% from previous period
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Analytics Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {analyticsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Revenue Overview
              </CardTitle>
              <CardDescription>
                Monthly revenue and order trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Revenue chart visualization</p>
                  <p className="text-sm text-gray-400 mt-1">(Chart.js, Recharts, etc.)</p>
                </div>
              </div>
              
              {/* Revenue Summary */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    KSh 1,079,230
                  </p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    1454
                  </p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sales by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>
                Revenue distribution across categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.salesByCategory.map((category, index) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {category.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {category.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatCurrency(category.revenue)}</span>
                      <span>{category.percentage}% of total</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Top Performing Products
              </CardTitle>
              <CardDescription>
                Products with highest revenue and growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-green-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(product.revenue)}
                      </p>
                      <div className={`flex items-center gap-1 text-xs ${getChangeColor(product.growth)}`}>
                        {getChangeIcon(product.growth)}
                        {product.growth}% growth
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === "customers" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customer Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-900">
                    {analyticsData.customerMetrics.newCustomers}
                  </p>
                  <p className="text-sm text-blue-700">New Customers</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-900">
                    {analyticsData.customerMetrics.returningCustomers}
                  </p>
                  <p className="text-sm text-green-700">Returning Customers</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-900">
                    {analyticsData.customerMetrics.retentionRate}%
                  </p>
                  <p className="text-sm text-purple-700">Retention Rate</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-900">
                    {analyticsData.customerMetrics.averageLifetime}
                  </p>
                  <p className="text-sm text-orange-700">Avg. Lifetime (months)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Acquisition */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Acquisition</CardTitle>
              <CardDescription>
                New vs returning customer trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Customer acquisition chart</p>
                  <p className="text-sm text-gray-400 mt-1">(Line chart visualization)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === "sales" && (
        <div className="space-y-6">
          {/* Sales Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>
                Detailed sales metrics and comparisons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">KSh 2,450</p>
                  <p className="text-sm text-gray-600">Average Order Value</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">3.2%</p>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">2.3</p>
                  <p className="text-sm text-gray-600">Items per Order</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">18.6</p>
                  <p className="text-sm text-gray-600">Days to Convert</p>
                </div>
              </div>

              <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Sales performance dashboard</p>
                  <p className="text-sm text-gray-400 mt-1">(Multiple chart visualizations)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Actionable insights based on your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">📈 Growth Opportunity</h4>
              <p className="text-sm text-blue-700">
                Your conversion rate increased by 14.3%. Consider increasing ad spend to capitalize on this trend.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">⭐ Top Product</h4>
              <p className="text-sm text-green-700">
                "Reusable Coffee Cup" shows 22.1% growth. Consider featuring it in marketing campaigns.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">👥 Customer Retention</h4>
              <p className="text-sm text-purple-700">
                72.4% customer retention rate is strong. Focus on loyalty programs to maintain this.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}