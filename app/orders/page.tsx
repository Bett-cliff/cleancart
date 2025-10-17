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
  MapPin,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import FixedNavbar from "@/app/components/FixedNavbar"
import { useCart } from "@/app/contexts/CartContext"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

// Order interface matching MongoDB schema
interface OrderItem {
  productId: {
    _id: string
    name: string
    price: number
    images: string[]
  }
  name: string
  price: number
  quantity: number
  vendorId: string
}

interface Order {
  _id: string
  orderNumber: string
  customerId: string
  orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  subtotal: number
  shippingFee: number
  taxAmount: number
  totalAmount: number
  items: OrderItem[]
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state?: string
    zipCode?: string
    country: string
  }
  paymentMethod: string
  vendorOrders: any[]
  notes?: string
  createdAt: string
  updatedAt: string
}

const OrderCard = ({ order }: { order: Order }) => {
  const statusConfig = {
    delivered: { 
      color: "bg-green-100 text-green-800 border-green-200", 
      icon: CheckCircle, 
      label: "Delivered" 
    },
    shipped: { 
      color: "bg-orange-100 text-orange-800 border-orange-200", 
      icon: Truck, 
      label: "Shipped" 
    },
    confirmed: { 
      color: "bg-blue-100 text-blue-800 border-blue-200", 
      icon: Clock, 
      label: "Confirmed" 
    },
    pending: { 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      icon: Clock, 
      label: "Pending" 
    },
    cancelled: { 
      color: "bg-red-100 text-red-800 border-red-200", 
      icon: Clock, 
      label: "Cancelled" 
    }
  }

  const config = statusConfig[order.orderStatus] || statusConfig.pending
  const StatusIcon = config.icon

  // Calculate total items count
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get estimated delivery date (7 days from order date for demo)
  const getDeliveryDate = (orderDate: string) => {
    const date = new Date(orderDate)
    date.setDate(date.getDate() + 7)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Order Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}</h3>
              <Badge className={config.color}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {config.label}
              </Badge>
              {order.paymentStatus === 'paid' && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Paid
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Placed on {formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">KSh {order.totalAmount.toLocaleString()}</p>
            {order.orderStatus === 'delivered' && (
              <p className="text-sm text-gray-500">Delivered on {formatDate(order.updatedAt)}</p>
            )}
            {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed') && (
              <p className="text-sm text-gray-500">Est. delivery: {getDeliveryDate(order.createdAt)}</p>
            )}
            {order.orderStatus === 'shipped' && (
              <p className="text-sm text-gray-500">Shipped - Arriving soon</p>
            )}
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Items</span>
            <span className="text-sm text-gray-500">Total: KSh {order.totalAmount.toLocaleString()}</span>
          </div>
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">KSh {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="text-sm text-gray-500">
                +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
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
                {order.shippingAddress.address}, {order.shippingAddress.city}
                {order.shippingAddress.zipCode && `, ${order.shippingAddress.zipCode}`}
              </p>
            </div>
          </div>
          
          {order.orderStatus === 'shipped' && (
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Tracking</p>
                <p className="text-sm text-gray-600">Available when shipped</p>
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
          
          {order.orderStatus === 'delivered' && (
            <Button variant="outline" size="sm" className="flex-1 min-w-[120px]">
              <Package className="w-4 h-4 mr-2" />
              Reorder
            </Button>
          )}
          
          {(order.orderStatus === 'shipped' || order.orderStatus === 'confirmed') && (
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
        <Link href="/marketplace">
          <Button variant="outline">
            Browse Marketplace
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
)

const LoadingOrders = () => (
  <Card className="border-gray-200">
    <CardContent className="p-8 text-center">
      <div className="flex justify-center mb-4">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Orders</h3>
      <p className="text-gray-600">Fetching your order history from database...</p>
    </CardContent>
  </Card>
)

export default function OrdersPage() {
  const { cartItemsCount } = useCart()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get customer ID from localStorage or use demo customer
  const getCustomerId = () => {
    // In a real app, you'd get this from authentication context
    const storedCustomerId = localStorage.getItem('customerId')
    return storedCustomerId || '65f8a1b4c8d9e8a1b4c8d9e8' // Demo customer ID
  }

  // Fetch orders from MongoDB using customer ID - FIXED URL
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const customerId = getCustomerId()
        console.log('🔄 Fetching orders for customer:', customerId)
        
        // FIXED: Using correct backend URL
        const response = await fetch(`http://localhost:5000/api/orders/customer/${customerId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`)
        }

        const result = await response.json()
        
        if (result.success && result.data) {
          console.log(`✅ Loaded ${result.data.length} orders from database`)
          setOrders(result.data)
        } else {
          throw new Error('No orders found in response')
        }
      } catch (err) {
        console.error('❌ Error fetching orders:', err)
        setError('Failed to load orders. Please try again.')
        // Fallback to localStorage orders if available
        const localOrders = localStorage.getItem('customerOrders')
        if (localOrders) {
          console.log('📦 Using localStorage orders as fallback')
          setOrders(JSON.parse(localOrders))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const orderNumber = order.orderNumber || order._id.slice(-8).toUpperCase()
    const matchesSearch = orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => 
                           item.name.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate order statistics
  const orderStats = {
    total: orders.length,
    delivered: orders.filter(order => order.orderStatus === 'delivered').length,
    processing: orders.filter(order => order.orderStatus === 'pending' || order.orderStatus === 'confirmed').length,
    shipped: orders.filter(order => order.orderStatus === 'shipped').length,
    totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0)
  }

  const refreshOrders = () => {
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <LoadingOrders />
        </div>
      </div>
    )
  }

  if (error && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Orders</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={refreshOrders} className="bg-emerald-600 hover:bg-emerald-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
              Track and manage your cleaning supplies orders from database
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshOrders} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link href="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
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
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            </div>
            {filteredOrders.length > 0 && (
              <p className="text-sm text-gray-600 mt-3">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            )}
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
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