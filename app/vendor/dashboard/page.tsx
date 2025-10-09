"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown,
  Eye,
  Plus,
  Download,
  RefreshCw,
  Star,
  Target,
  Zap,
  CheckCircle,
  Clock
} from "lucide-react"
import Link from "next/link"

// Enhanced mock data with more metrics
const dashboardData = {
  stats: [
    {
      title: "Total Revenue",
      value: "KSh 245,231",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "Last 30 days",
      color: "text-green-600",
      bgColor: "bg-green-50",
      progress: 75
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      description: "24 pending",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      progress: 60
    },
    {
      title: "Products Sold",
      value: "892",
      change: "+15.3%",
      trend: "up",
      icon: Package,
      description: "156 in stock",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      progress: 85
    },
    {
      title: "New Customers",
      value: "156",
      change: "+22.1%",
      trend: "up",
      icon: Users,
      description: "42% returning",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      progress: 90
    }
  ],
  performanceMetrics: [
    { 
      label: "Conversion Rate", 
      value: "3.2%", 
      change: "+0.5%",
      target: "4.0%",
      progress: 80,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      label: "Avg. Order Value", 
      value: "KSh 2,450", 
      change: "+KSh 120",
      target: "KSh 3,000",
      progress: 82,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      label: "Customer Satisfaction", 
      value: "4.8/5", 
      change: "+0.2",
      target: "5.0/5",
      progress: 96,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ],
  recentActivity: [
    {
      id: 1,
      type: "order",
      message: "New order #ORD-0012 received",
      time: "5 minutes ago",
      amount: "KSh 4,250",
      status: "success",
      icon: ShoppingCart
    },
    {
      id: 2,
      type: "product",
      message: "Product 'Organic Soap' is low in stock",
      time: "1 hour ago",
      amount: null,
      status: "warning",
      icon: Package
    },
    {
      id: 3,
      type: "customer",
      message: "New customer registration - Sarah M.",
      time: "2 hours ago",
      amount: null,
      status: "info",
      icon: Users
    },
    {
      id: 4,
      type: "order",
      message: "Order #ORD-0011 marked as delivered",
      time: "3 hours ago",
      amount: "KSh 8,750",
      status: "success",
      icon: CheckCircle
    },
    {
      id: 5,
      type: "review",
      message: "New 5-star review received",
      time: "4 hours ago",
      amount: null,
      status: "success",
      icon: Star
    }
  ],
  topProducts: [
    { name: "Organic Lavender Soap", sales: 45, revenue: "KSh 67,500" },
    { name: "Bamboo Toothbrush Set", sales: 32, revenue: "KSh 25,600" },
    { name: "Natural Deodorant", sales: 28, revenue: "KSh 22,400" },
    { name: "Reusable Coffee Cup", sales: 21, revenue: "KSh 31,500" }
  ],
  salesData: [
    { day: "Mon", sales: 12, revenue: 18500 },
    { day: "Tue", sales: 18, revenue: 26700 },
    { day: "Wed", sales: 15, revenue: 22500 },
    { day: "Thu", sales: 22, revenue: 34100 },
    { day: "Fri", sales: 25, revenue: 41200 },
    { day: "Sat", sales: 30, revenue: 49500 },
    { day: "Sun", sales: 24, revenue: 37800 }
  ]
}

// Simple bar chart component for revenue visualization
const RevenueChart = ({ data }: { data: any[] }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue))
  
  return (
    <div className="flex items-end justify-between h-48 gap-2 pt-4">
      {data.map((item, index) => {
        const height = (item.revenue / maxRevenue) * 100
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="text-xs text-gray-500 mb-2">{item.day}</div>
            <div
              className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-300 hover:from-green-600 hover:to-green-500"
              style={{ height: `${height}%` }}
            />
            <div className="text-xs text-gray-600 mt-2">
              KSh {(item.revenue / 1000).toFixed(0)}K
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Progress bar component
const ProgressBar = ({ percentage, color = "bg-green-500" }: { percentage: number; color?: string }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color} transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export default function VendorDashboard() {
  const { stats, performanceMetrics, recentActivity, topProducts, salesData } = dashboardData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your performance overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isPositive = stat.trend === "up"
          
          return (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className={`absolute top-0 left-0 w-1 h-full ${stat.bgColor.replace('bg-', 'bg-')}`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {stat.change}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{stat.description}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar percentage={stat.progress} color={stat.bgColor.replace('bg-', 'bg-').replace('-50', '-500')} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Revenue Overview
            </CardTitle>
            <CardDescription>
              Weekly sales performance and revenue trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={salesData} />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">28</div>
                <div className="text-sm text-green-700">Avg. Daily Sales</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">KSh 32,400</div>
                <div className="text-sm text-blue-700">Avg. Daily Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Key business indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${metric.bgColor} ${metric.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{metric.label}</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                    <div className="text-sm text-gray-500">Target: {metric.target}</div>
                  </div>
                  <ProgressBar percentage={metric.progress} />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest events and notifications from your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                const statusConfig = {
                  success: { color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
                  warning: { color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
                  info: { color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" }
                }
                const config = statusConfig[activity.status as keyof typeof statusConfig]
                
                return (
                  <div key={activity.id} className={`flex items-start justify-between p-4 rounded-lg border ${config.borderColor} ${config.bgColor} hover:shadow-sm transition-all`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${config.bgColor} ${config.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.message}</p>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                    {activity.amount && (
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                        {activity.amount}
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-green-600 hover:text-green-700 hover:bg-green-50">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Top Products & Quick Actions */}
        <div className="space-y-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top Products
              </CardTitle>
              <CardDescription>
                Best performing products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm">{product.revenue}</p>
                      <p className="text-xs text-green-600">+{Math.floor(Math.random() * 20) + 5}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/vendor/products/add">
                <Button className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4" />
                  Add New Product
                </Button>
              </Link>
              <Link href="/vendor/orders">
                <Button variant="outline" className="w-full justify-start gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                  <ShoppingCart className="w-4 h-4" />
                  View Orders
                </Button>
              </Link>
              <Link href="/vendor/analytics">
                <Button variant="outline" className="w-full justify-start gap-2 border-purple-200 text-purple-700 hover:bg-purple-50">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}