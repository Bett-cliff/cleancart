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
  RefreshCw
} from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual API calls
const dashboardData = {
  stats: [
    {
      title: "Total Revenue",
      value: "KSh 245,231",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "Last 30 days"
    },
    {
      title: "Orders",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      description: "24 pending"
    },
    {
      title: "Products",
      value: "156",
      change: "+5.1%",
      trend: "up",
      icon: Package,
      description: "12 low stock"
    },
    {
      title: "Customers",
      value: "892",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      description: "Active buyers"
    }
  ],
  recentActivity: [
    {
      id: 1,
      type: "order",
      message: "New order #ORD-0012 received",
      time: "5 minutes ago",
      amount: "KSh 4,250"
    },
    {
      id: 2,
      type: "product",
      message: "Product 'Organic Soap' is low in stock",
      time: "1 hour ago",
      amount: null
    },
    {
      id: 3,
      type: "customer",
      message: "New customer registration",
      time: "2 hours ago",
      amount: null
    },
    {
      id: 4,
      type: "order",
      message: "Order #ORD-0011 marked as delivered",
      time: "3 hours ago",
      amount: "KSh 8,750"
    }
  ],
  quickStats: [
    { label: "Conversion Rate", value: "3.2%", change: "+0.5%" },
    { label: "Avg. Order Value", value: "KSh 2,450", change: "+KSh 120" },
    { label: "Returning Customers", value: "42%", change: "+3.2%" }
  ]
}

export default function VendorDashboard() {
  const { stats, recentActivity, quickStats } = dashboardData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
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
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${
                  isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`flex items-center gap-1 text-xs ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                  <span className="text-xs text-gray-500">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
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
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      activity.type === 'order' ? 'bg-blue-500' :
                      activity.type === 'product' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                  {activity.amount && (
                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                      {activity.amount}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-green-600 hover:text-green-700 hover:bg-green-50">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats & Actions */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance
              </CardTitle>
              <CardDescription>
                Key business metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {stat.change}
                  </Badge>
                </div>
              ))}
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
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  View Orders
                </Button>
              </Link>
              <Link href="/vendor/analytics">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Performance Overview
          </CardTitle>
          <CardDescription>
            Revenue and orders trend for the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Charts will be implemented with a charting library</p>
              <p className="text-sm text-gray-400 mt-1">(Chart.js, Recharts, etc.)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}