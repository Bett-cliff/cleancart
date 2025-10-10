"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ArrowRight,
  Home,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  MapPin
} from "lucide-react"
import Link from "next/link"
import FixedNavbar from "@/app/components/FixedNavbar"
import { useCart } from "@/app/contexts/CartContext"
import { Input } from "@/components/ui/input"
import { useState } from "react"

// Mock orders data
const mockOrders = [
  {
    id: "EC-ABC123XYZ",
    date: "2024-01-15",
    status: "delivered",
    total: 5897,
    items: 3,
    deliveryDate: "2024-01-18",
    itemsList: [
      { name: "Multi-Surface Cleaner 5L", quantity: 1, price: 1899 },
      { name: "Professional Microfiber Cloth Set", quantity: 2, price: 1299 }
    ],
    trackingNumber: "TRK789456123KE",
    address: {
      name: "John Doe",
      street: "123 Green Valley Apartments",
      city: "Nairobi",
      zipCode: "00100"
    }
  },
  {
    id: "EC-DEF456UVW", 
    date: "2024-01-10",
    status: "processing",
    total: 3299,
    items: 2,
    deliveryDate: "2024-01-17",
    itemsList: [
      { name: "Hospital-Grade Disinfectant Spray", quantity: 1, price: 2299 },
      { name: "Natural Glass Cleaner", quantity: 1, price: 899 }
    ],
    trackingNumber: "TRK123456789KE",
    address: {
      name: "John Doe",
      street: "123 Green Valley Apartments", 
      city: "Nairobi",
      zipCode: "00100"
    }
  },
  {
    id: "EC-GHI789RST",
    date: "2024-01-05",
    status: "delivered",
    total: 1599,
    items: 1,
    deliveryDate: "2024-01-08",
    itemsList: [
      { name: "Floor Polish & Cleaner Concentrate", quantity: 1, price: 1599 }
    ],
    trackingNumber: "TRK456789123KE",
    address: {
      name: "John Doe",
      street: "123 Green Valley Apartments",
      city: "Nairobi", 
      zipCode: "00100"
    }
  }
]

const OrderCard = ({ order }: { order: any }) => {
  const statusConfig = {
    delivered: { 
      color: "bg-green-100 text-green-800 border-green-200", 
      icon: CheckCircle, 
      label: "Delivered" 
    },
    processing: { 
      color: "bg-blue-100 text-blue-800 border-blue-200", 
      icon: Clock, 
      label: "Processing" 
    },
    shipped: { 
      color: "bg-orange-100 text-orange-800 border-orange-200", 
      icon: Truck, 
      label: "Shipped" 
    }
  }

  const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.processing
  const StatusIcon = config.icon

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Order Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
              <Badge className={config.color}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {config.label}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Placed on {order.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>{order.items} item{order.items !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">KSh {order.total.toLocaleString()}</p>
            {order.status === 'delivered' && (
              <p className="text-sm text-gray-500">Delivered on {order.deliveryDate}</p>
            )}
            {order.status === 'processing' && (
              <p className="text-sm text-gray-500">Est. delivery: {order.deliveryDate}</p>
            )}
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Items</span>
            <span className="text-sm text-gray-500">Total: KSh {order.total.toLocaleString()}</span>
          </div>
          <div className="space-y-1">
            {order.itemsList.slice(0, 2).map((item: any, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">KSh {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            {order.itemsList.length > 2 && (
              <div className="text-sm text-gray-500">
                +{order.itemsList.length - 2} more item{order.itemsList.length - 2 !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Delivery Address & Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Delivery Address</p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {order.address.street}, {order.address.city}
              </p>
            </div>
          </div>
          
          {order.trackingNumber && (
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Tracking Number</p>
                <p className="text-sm text-gray-600">{order.trackingNumber}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex-1 min-w-[120px]">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          
          <Button variant="outline" size="sm" className="flex-1 min-w-[120px]">
            <Download className="w-4 h-4 mr-2" />
            Invoice
          </Button>
          
          {order.status === 'delivered' && (
            <Button variant="outline" size="sm" className="flex-1 min-w-[120px]">
              <Package className="w-4 h-4 mr-2" />
              Reorder
            </Button>
          )}
          
          {order.status === 'processing' && (
            <Button variant="outline" size="sm" className="flex-1 min-w-[120px]">
              <Truck className="w-4 h-4 mr-2" />
              Track Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const EmptyOrders = () => (
  <Card className="border-emerald-100 bg-emerald-50">
    <CardContent className="p-8 text-center">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-8 h-8 text-emerald-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        You haven't placed any orders yet. Start shopping for eco-friendly cleaning supplies!
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Home className="w-4 h-4 mr-2" />
            Start Shopping
          </Button>
        </Link>
        <Link href="/deals">
          <Button variant="outline">
            View Hot Deals
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
)

export default function OrdersPage() {
  const { cartItemsCount } = useCart()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter orders based on search and status
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.itemsList.some((item: any) => 
                           item.name.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const orderStats = {
    total: mockOrders.length,
    delivered: mockOrders.filter(order => order.status === 'delivered').length,
    processing: mockOrders.filter(order => order.status === 'processing').length,
    totalSpent: mockOrders.reduce((sum, order) => sum + order.total, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <FixedNavbar cartItemsCount={cartItemsCount} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">
              Track and manage your cleaning supplies orders
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">{orderStats.total}</div>
              <div className="text-sm text-emerald-700">Total Orders</div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{orderStats.delivered}</div>
              <div className="text-sm text-green-700">Delivered</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{orderStats.processing}</div>
              <div className="text-sm text-blue-700">Processing</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">KSh {orderStats.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-purple-700">Total Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Status</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyOrders />
        )}

        {/* Support Section */}
        <Card className="mt-12 border-blue-200 bg-blue-50">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Need Help With Your Orders?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our customer support team is here to help with order tracking, returns, or any questions about your cleaning supplies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Contact Support
                </Button>
                <Button variant="outline">
                  View Help Center
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}