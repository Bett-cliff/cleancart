// app/vendor/dashboard/page.tsx - COMPLETE VERSION
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Package, 
  ShoppingCart, 
  BarChart3,
  Users, 
  DollarSign,
  ArrowLeft,
  Target,
  TrendingUp,
  Star,
  Eye,
  Plus,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useVendorDashboard, useRefreshDashboard } from "@/hooks/useVendorDashboard"

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

// Revenue chart component
const RevenueChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No sales data available
      </div>
    )
  }

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

// Loading skeleton for chart
const ChartSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-end justify-between h-48 gap-2 pt-4">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <Skeleton className="h-3 w-8 mb-2" />
          <Skeleton className="w-full h-32 rounded-t-lg" />
          <Skeleton className="h-3 w-12 mt-2" />
        </div>
      ))}
    </div>
  </div>
)

export default function VendorDashboard() {
  const router = useRouter()
  const { data: dashboardData, isLoading, error } = useVendorDashboard()
  const { refresh } = useRefreshDashboard()

  const handleBack = () => {
    router.push("/")
  }

  const handleRefresh = () => {
    refresh()
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export dashboard data")
  }

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-KE').format(num)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">Failed to load dashboard data. Please try again.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  // Prepare stats data for display
  const statsData = dashboardData ? [
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardData.stats.totalRevenue),
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      description: "Last 30 days",
      color: "text-green-600",
      bgColor: "bg-green-50",
      progress: 75
    },
    {
      title: "Total Orders",
      value: formatNumber(dashboardData.stats.totalOrders),
      change: "+8.2%",
      trend: "up" as const,
      icon: ShoppingCart,
      description: `${dashboardData.stats.pendingOrders} pending`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      progress: 60
    },
    {
      title: "Products Sold",
      value: formatNumber(dashboardData.stats.productsSold),
      change: "+15.3%",
      trend: "up" as const,
      icon: Package,
      description: `${dashboardData.stats.lowStockProducts} low stock`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      progress: 85
    },
    {
      title: "New Customers",
      value: formatNumber(dashboardData.stats.newCustomers),
      change: "+22.1%",
      trend: "up" as const,
      icon: Users,
      description: "42% returning",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      progress: 90
    }
  ] : []

  // Prepare performance metrics for display
  const performanceMetricsData = dashboardData ? [
    { 
      label: "Conversion Rate", 
      value: `${dashboardData.performanceMetrics.conversionRate}%`, 
      change: "+0.5%",
      target: "4.0%",
      progress: (dashboardData.performanceMetrics.conversionRate / 4.0) * 100,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    { 
      label: "Avg. Order Value", 
      value: formatCurrency(dashboardData.performanceMetrics.averageOrderValue), 
      change: "+KSh 120",
      target: "KSh 3,000",
      progress: (dashboardData.performanceMetrics.averageOrderValue / 3000) * 100,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      label: "Customer Satisfaction", 
      value: `${dashboardData.performanceMetrics.customerSatisfaction}/5`, 
      change: "+0.2",
      target: "5.0/5",
      progress: (dashboardData.performanceMetrics.customerSatisfaction / 5) * 100,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ] : []

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Button>
          <div className="border-l border-gray-300 h-6"></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your performance overview.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
            disabled={isLoading}
          >
            <Download className="w-4 h-4" />
            Export Report
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
        </div>
      </div>

      {/* Main Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-32 mb-2" />
                <Skeleton className="h-3 w-full mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon
            const isPositive = stat.trend === "up"
            
            return (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className={`absolute top-0 left-0 w-1 h-full ${stat.bgColor}`} />
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
                        {isPositive ? '↗' : '↘'}
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
      )}

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
            {isLoading ? (
              <ChartSkeleton />
            ) : dashboardData ? (
              <>
                <RevenueChart data={dashboardData.salesData} />
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {dashboardData.salesData ? Math.round(dashboardData.salesData.reduce((acc, day) => acc + day.sales, 0) / dashboardData.salesData.length) : 0}
                    </div>
                    <div className="text-sm text-green-700">Avg. Daily Sales</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardData.salesData ? formatCurrency(Math.round(dashboardData.salesData.reduce((acc, day) => acc + day.revenue, 0) / dashboardData.salesData.length)) : formatCurrency(0)}
                    </div>
                    <div className="text-sm text-blue-700">Avg. Daily Revenue</div>
                  </div>
                </div>
              </>
            ) : null}
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
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))
            ) : (
              performanceMetricsData.map((metric, index) => {
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
              })
            )}
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
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-start justify-between p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div>
                        <Skeleton className="h-4 w-48 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            ) : dashboardData ? (
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => {
                  const getActivityConfig = (status: string) => {
                    const config = {
                      success: { color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", icon: CheckCircle },
                      warning: { color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200", icon: Package },
                      info: { color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200", icon: Users }
                    }
                    return config[status as keyof typeof config] || config.info
                  }
                  
                  const config = getActivityConfig(activity.status)
                  const Icon = config.icon
                  
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
                          {formatCurrency(activity.amount)}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : null}
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
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : dashboardData ? (
                <div className="space-y-4">
                  {dashboardData.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sales} units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-sm">{formatCurrency(product.revenue)}</p>
                        <p className="text-xs text-green-600">+{Math.floor(Math.random() * 20) + 5}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
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