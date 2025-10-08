"use client"

import { useState } from "react"
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
  Plus
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock orders data
const mockOrders = [
  {
    id: "ORD-0012",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+254 712 345 678"
    },
    date: "2024-01-20",
    status: "pending",
    paymentStatus: "paid",
    total: 4250,
    items: 3,
    shipping: {
      method: "Standard",
      address: "Nairobi, Kenya"
    }
  },
  {
    id: "ORD-0011",
    customer: {
      name: "Mike Otieno",
      email: "mike.o@email.com",
      phone: "+254 723 456 789"
    },
    date: "2024-01-19",
    status: "processing",
    paymentStatus: "paid",
    total: 8750,
    items: 5,
    shipping: {
      method: "Express",
      address: "Mombasa, Kenya"
    }
  },
  {
    id: "ORD-0010",
    customer: {
      name: "Grace Wambui",
      email: "grace.w@email.com",
      phone: "+254 734 567 890"
    },
    date: "2024-01-18",
    status: "shipped",
    paymentStatus: "paid",
    total: 3200,
    items: 2,
    shipping: {
      method: "Standard",
      address: "Kisumu, Kenya"
    },
    trackingNumber: "TRK-789456123"
  },
  {
    id: "ORD-0009",
    customer: {
      name: "David Kimani",
      email: "david.k@email.com",
      phone: "+254 745 678 901"
    },
    date: "2024-01-17",
    status: "delivered",
    paymentStatus: "paid",
    total: 15600,
    items: 8,
    shipping: {
      method: "Express",
      address: "Nakuru, Kenya"
    }
  },
  {
    id: "ORD-0008",
    customer: {
      name: "Lisa Adhiambo",
      email: "lisa.a@email.com",
      phone: "+254 756 789 012"
    },
    date: "2024-01-16",
    status: "cancelled",
    paymentStatus: "refunded",
    total: 5400,
    items: 4,
    shipping: {
      method: "Standard",
      address: "Eldoret, Kenya"
    }
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

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all")

  const statuses = ["all", "pending", "processing", "shipped", "delivered", "cancelled"]
  const paymentStatuses = ["all", "paid", "pending", "failed", "refunded"]

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    const matchesPaymentStatus = selectedPaymentStatus === "all" || order.paymentStatus === selectedPaymentStatus
    
    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

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

  const getTotalRevenue = () => {
    return filteredOrders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0)
  }

  const getOrdersCountByStatus = (status: string) => {
    return filteredOrders.filter(order => order.status === status).length
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
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">KSh {getTotalRevenue().toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-gray-900">{getOrdersCountByStatus('pending')}</p>
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
                <p className="text-2xl font-bold text-gray-900">{getOrdersCountByStatus('processing')}</p>
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
                <p className="text-2xl font-bold text-gray-900">{getOrdersCountByStatus('shipped')}</p>
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

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>
            {filteredOrders.length} orders found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
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
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            Update Shipping
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-red-600">
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
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedStatus !== "all" || selectedPaymentStatus !== "all" 
                  ? "Try adjusting your search or filters"
                  : "You haven't received any orders yet"
                }
              </p>
              <Button variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Orders
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}