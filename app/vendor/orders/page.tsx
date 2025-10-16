"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCart, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  Plus,
  Home,
  Package,
  Users,
  DollarSign,
  Warehouse,
  Megaphone,
  Crown,
  MessageSquare,
  Settings,
  Star,
  Loader2
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
  pending: { label: "Pending", variant: "secondary" as const, icon: Clock, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  processing: { label: "Processing", variant: "secondary" as const, icon: RefreshCw, color: "text-blue-600 bg-blue-50 border-blue-200" },
  shipped: { label: "Shipped", variant: "secondary" as const, icon: Truck, color: "text-purple-600 bg-purple-50 border-purple-200" },
  delivered: { label: "Delivered", variant: "default" as const, icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-200" },
  cancelled: { label: "Cancelled", variant: "destructive" as const, icon: XCircle, color: "text-red-600 bg-red-50 border-red-200" }
}

const paymentStatusConfig = {
  paid: { label: "Paid", variant: "default" as const, color: "text-green-600 bg-green-50 border-green-200" },
  pending: { label: "Pending", variant: "secondary" as const, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  failed: { label: "Failed", variant: "destructive" as const, color: "text-red-600 bg-red-50 border-red-200" },
  refunded: { label: "Refunded", variant: "outline" as const, color: "text-gray-600 bg-gray-50 border-gray-200" }
}

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  status: string;
  paymentStatus: string;
  total: number;
  items: number;
  shipping: {
    method: string;
    address: string;
  };
  trackingNumber?: string;
}

interface OrdersStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all")
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrdersStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const statuses = ["all", "pending", "processing", "shipped", "delivered", "cancelled"]
  const paymentStatuses = ["all", "paid", "pending", "failed", "refunded"]

  // Fetch orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const params = new URLSearchParams()
        if (searchTerm) params.append('search', searchTerm)
        if (selectedStatus !== 'all') params.append('status', selectedStatus)
        if (selectedPaymentStatus !== 'all') params.append('paymentStatus', selectedPaymentStatus)

        const response = await fetch(`/api/vendor/orders?${params}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }
        
        const result = await response.json()
        setOrders(result.data.orders)
        setStats(result.data.stats)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching orders:', err)
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchOrders()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedStatus, selectedPaymentStatus])

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const config = paymentStatusConfig[status as keyof typeof paymentStatusConfig]
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const handleRefresh = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.append('search', searchTerm)
    if (selectedStatus !== 'all') params.append('status', selectedStatus)
    if (selectedPaymentStatus !== 'all') params.append('paymentStatus', selectedPaymentStatus)

    fetch(`/api/vendor/orders?${params}`)
      .then(response => response.json())
      .then(result => {
        setOrders(result.data.orders)
        setStats(result.data.stats)
      })
      .catch(err => {
        console.error('Error refreshing orders:', err)
      })
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/vendor/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateStatus',
          orderId,
          updates: { status: newStatus }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      handleRefresh() // Refresh the orders list
    } catch (err) {
      console.error('Error updating order status:', err)
      alert('Failed to update order status')
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return

    try {
      const response = await fetch('/api/vendor/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel',
          orderId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel order')
      }

      handleRefresh() // Refresh the orders list
    } catch (err) {
      console.error('Error cancelling order:', err)
      alert('Failed to cancel order')
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Orders</h2>
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
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track customer orders</p>
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">KSh {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">{stats.processingOrders}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shippedOrders}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Truck className="w-5 h-5 text-orange-600" />
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
                  placeholder="Search orders, customers..."
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

            {/* Payment Status Filter */}
            <div className="sm:w-48">
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              >
                {paymentStatuses.map(status => (
                  <option key={status} value={status}>
                    {status === "all" ? "All Payments" : paymentStatusConfig[status as keyof typeof paymentStatusConfig]?.label}
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
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Order List</CardTitle>
            <CardDescription>
              {orders.length} orders found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 space-y-3 sm:space-y-2">
                    {/* Order ID and Customer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <Link href={`/vendor/orders/${order.id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-green-600 cursor-pointer">
                              {order.id}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600">{order.customer.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">KSh {order.total.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Items:</span>
                        <span>{order.items} products</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Shipping:</span>
                        <span>{order.shipping.method}</span>
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>
                        <p className="text-gray-500">{order.shipping.address}</p>
                      </div>
                      {order.trackingNumber && (
                        <div>
                          <span className="font-medium">Tracking:</span>
                          <p className="text-blue-600">{order.trackingNumber}</p>
                        </div>
                      )}
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {getStatusBadge(order.status)}
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link href={`/vendor/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                        </Link>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="flex items-center gap-2"
                              onClick={() => handleUpdateStatus(order.id, 'processing')}
                            >
                              <RefreshCw className="w-4 h-4" />
                              Mark as Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center gap-2"
                              onClick={() => handleUpdateStatus(order.id, 'shipped')}
                            >
                              <Truck className="w-4 h-4" />
                              Mark as Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center gap-2"
                              onClick={() => handleUpdateStatus(order.id, 'delivered')}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Mark as Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 text-red-600"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {orders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedStatus !== "all" || selectedPaymentStatus !== "all" 
                    ? "Try adjusting your search or filters"
                    : "You haven't received any orders yet"
                  }
                </p>
                <Button 
                  variant="outline" 
                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Orders
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}