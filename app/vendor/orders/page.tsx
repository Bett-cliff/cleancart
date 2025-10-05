"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { HelpDesk } from "@/components/help-desk"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Calendar,
  Package,
  User,
  MapPin,
  Phone,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock order data
const mockOrders = [
  {
    id: 'ORD-001',
    customer: {
      name: 'John Mwangi',
      email: 'john.mwangi@email.com',
      phone: '+254712345678',
      location: 'Nairobi'
    },
    products: [
      { id: 1, name: 'Eco-Friendly All-Purpose Cleaner', quantity: 2, price: 850, image: '/placeholder-cleaner.jpg' },
      { id: 3, name: 'Natural Floor Cleaner', quantity: 1, price: 750, image: '/placeholder-floor-cleaner.jpg' }
    ],
    total: 2450,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'mpesa',
    orderDate: '2024-06-15T10:30:00Z',
    estimatedDelivery: '2024-06-17',
    shippingAddress: {
      street: '123 Main Street',
      city: 'Nairobi',
      county: 'Nairobi',
      postalCode: '00100'
    },
    notes: 'Please deliver before 5 PM'
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Sarah Wanjiku',
      email: 'sarah.w@email.com',
      phone: '+254723456789',
      location: 'Mombasa'
    },
    products: [
      { id: 2, name: 'Professional Pressure Washer', quantity: 1, price: 45000, image: '/placeholder-pressure-washer.jpg' }
    ],
    total: 45000,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    orderDate: '2024-06-14T14:20:00Z',
    estimatedDelivery: '2024-06-18',
    shippingAddress: {
      street: '456 Beach Road',
      city: 'Mombasa',
      county: 'Mombasa',
      postalCode: '80100'
    },
    trackingNumber: 'TRK-789456123'
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'David Kimani',
      email: 'david.kimani@email.com',
      phone: '+254734567890',
      location: 'Kisumu'
    },
    products: [
      { id: 4, name: 'Glass Cleaning Solution', quantity: 3, price: 700, image: '/placeholder-glass-cleaner.jpg' },
      { id: 5, name: 'Eco Dish Soap', quantity: 2, price: 700, image: '/placeholder-dish-soap.jpg' }
    ],
    total: 3500,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'mpesa',
    orderDate: '2024-06-14T09:15:00Z',
    deliveredDate: '2024-06-16',
    shippingAddress: {
      street: '789 Lake View',
      city: 'Kisumu',
      county: 'Kisumu',
      postalCode: '40100'
    },
    customerRating: 5
  },
  {
    id: 'ORD-004',
    customer: {
      name: 'Grace Achieng',
      email: 'grace.achieng@email.com',
      phone: '+254745678901',
      location: 'Nakuru'
    },
    products: [
      { id: 1, name: 'Eco-Friendly All-Purpose Cleaner', quantity: 1, price: 850, image: '/placeholder-cleaner.jpg' }
    ],
    total: 850,
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'mpesa',
    orderDate: '2024-06-13T16:45:00Z',
    cancelledDate: '2024-06-14',
    cancellationReason: 'Changed mind'
  },
  {
    id: 'ORD-005',
    customer: {
      name: 'Michael Ochieng',
      email: 'm.ochieng@email.com',
      phone: '+254756789012',
      location: 'Eldoret'
    },
    products: [
      { id: 3, name: 'Natural Floor Cleaner', quantity: 2, price: 750, image: '/placeholder-floor-cleaner.jpg' },
      { id: 5, name: 'Eco Dish Soap', quantity: 1, price: 700, image: '/placeholder-dish-soap.jpg' }
    ],
    total: 2200,
    status: 'processing',
    paymentStatus: 'pending',
    paymentMethod: 'mpesa',
    orderDate: '2024-06-15T11:20:00Z',
    estimatedDelivery: '2024-06-19',
    shippingAddress: {
      street: '321 Highland Road',
      city: 'Eldoret',
      county: 'Uasin Gishu',
      postalCode: '30100'
    }
  }
]

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'processing', name: 'Processing', color: 'blue' },
    { id: 'shipped', name: 'Shipped', color: 'yellow' },
    { id: 'delivered', name: 'Delivered', color: 'green' },
    { id: 'cancelled', name: 'Cancelled', color: 'red' },
  ]

  const paymentStatuses = [
    { id: 'all', name: 'All Payments' },
    { id: 'paid', name: 'Paid', color: 'green' },
    { id: 'pending', name: 'Pending', color: 'yellow' },
    { id: 'refunded', name: 'Refunded', color: 'red' },
    { id: 'failed', name: 'Failed', color: 'red' },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      processing: { label: 'Processing', variant: 'secondary' as const, icon: Clock },
      shipped: { label: 'Shipped', variant: 'default' as const, icon: Truck },
      delivered: { label: 'Delivered', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const, icon: Clock }
    const IconComponent = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'Paid', variant: 'default' as const },
      pending: { label: 'Pending', variant: 'secondary' as const },
      refunded: { label: 'Refunded', variant: 'destructive' as const },
      failed: { label: 'Failed', variant: 'destructive' as const },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPaymentMethodBadge = (method: string) => {
    return (
      <Badge variant="outline" className="text-xs">
        {method === 'mpesa' ? 'M-PESA' : 'Card'}
      </Badge>
    )
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
      const matchesPaymentStatus = selectedPaymentStatus === 'all' || order.paymentStatus === selectedPaymentStatus
      
      return matchesSearch && matchesStatus && matchesPaymentStatus
    })
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order Management</h1>
            <p className="text-muted-foreground">
              Manage and track your customer orders
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold">{stats.processing}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shipped</p>
                  <p className="text-2xl font-bold">{stats.shipped}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Truck className="w-4 h-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">{stats.delivered}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">KSh {stats.revenue.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-lg">₦</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search orders..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
                {/* Status Filter */}
                <select
                  className="border rounded-lg px-3 py-2 text-sm"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>

                {/* Payment Status Filter */}
                <select
                  className="border rounded-lg px-3 py-2 text-sm"
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                >
                  {paymentStatuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search criteria' : 'You have no orders yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div className="flex items-center gap-4 mb-4 lg:mb-0">
                      <div>
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.orderDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        KSh {order.total.toLocaleString()}
                      </span>
                      {getPaymentMethodBadge(order.paymentMethod)}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{order.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{order.customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{order.customer.location}</span>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Products</h4>
                    <div className="space-y-2">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {product.quantity} × KSh {product.price.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">KSh {(product.quantity * product.price).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {order.status === 'shipped' && order.trackingNumber && (
                        <span>Tracking: {order.trackingNumber}</span>
                      )}
                      {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <span>Est. Delivery: {order.estimatedDelivery}</span>
                      )}
                      {order.deliveredDate && (
                        <span>Delivered: {order.deliveredDate}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'processing' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            Mark as Shipped
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {order.status === 'shipped' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Delivered
                        </Button>
                      )}

                      <Link href={`/vendor/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {order.notes && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Customer Note: </span>
                        {order.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex justify-between items-center mt-8">
            <p className="text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        )}
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