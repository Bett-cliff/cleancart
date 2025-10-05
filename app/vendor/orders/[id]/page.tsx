"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
import {
  ArrowLeft,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Printer,
  Download,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

// Mock order data - in real app, this would come from API
const mockOrder = {
  id: 'ORD-001',
  customer: {
    name: 'John Mwangi',
    email: 'john.mwangi@email.com',
    phone: '+254712345678',
    location: 'Nairobi'
  },
  products: [
    { 
      id: 1, 
      name: 'Eco-Friendly All-Purpose Cleaner', 
      quantity: 2, 
      price: 850, 
      image: '/placeholder-cleaner.jpg',
      sku: 'EC-500-001',
      category: 'Household Cleaners'
    },
    { 
      id: 3, 
      name: 'Natural Floor Cleaner', 
      quantity: 1, 
      price: 750, 
      image: '/placeholder-floor-cleaner.jpg',
      sku: 'NF-750-001',
      category: 'Household Cleaners'
    }
  ],
  total: 2450,
  subtotal: 2450,
  shipping: 0,
  tax: 0,
  status: 'processing',
  paymentStatus: 'paid',
  paymentMethod: 'mpesa',
  orderDate: '2024-06-15T10:30:00Z',
  estimatedDelivery: '2024-06-17',
  shippingAddress: {
    street: '123 Main Street',
    city: 'Nairobi',
    county: 'Nairobi',
    postalCode: '00100',
    instructions: 'Please deliver before 5 PM'
  },
  billingAddress: {
    street: '123 Main Street',
    city: 'Nairobi',
    county: 'Nairobi',
    postalCode: '00100'
  },
  notes: 'Customer requested eco-friendly packaging if possible',
  trackingNumber: null
}

export default function OrderDetailsPage() {
  const { toast } = useToast()
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState(mockOrder)
  const [isUpdating, setIsUpdating] = useState(false)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      processing: { label: 'Processing', variant: 'secondary' as const, icon: Clock, color: 'text-blue-600 bg-blue-50' },
      shipped: { label: 'Shipped', variant: 'default' as const, icon: Truck, color: 'text-orange-600 bg-orange-50' },
      delivered: { label: 'Delivered', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600 bg-red-50' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const, icon: Clock, color: '' }
    const IconComponent = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 text-sm py-1 px-3">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'Paid', variant: 'default' as const, color: 'text-green-600 bg-green-50' },
      pending: { label: 'Pending', variant: 'secondary' as const, color: 'text-yellow-600 bg-yellow-50' },
      refunded: { label: 'Refunded', variant: 'destructive' as const, color: 'text-red-600 bg-red-50' },
      failed: { label: 'Failed', variant: 'destructive' as const, color: 'text-red-600 bg-red-50' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const, color: '' }
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>
  }

  const updateOrderStatus = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrder(prev => ({ ...prev, status: newStatus }))
      
      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const addTrackingNumber = async (trackingNumber: string) => {
    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrder(prev => ({ ...prev, trackingNumber }))
      
      toast({
        title: "Tracking Number Added",
        description: "Tracking number has been updated",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to add tracking number",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const printOrder = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/vendor/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Order {order.id}</h1>
              <p className="text-muted-foreground">
                Placed on {new Date(order.orderDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" onClick={printOrder}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>
                  Current order status and next actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">KSh {order.total.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="space-y-3">
                  {order.status === 'processing' && (
                    <>
                      <Button 
                        className="w-full" 
                        onClick={() => updateOrderStatus('shipped')}
                        disabled={isUpdating}
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Mark as Shipped
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => updateOrderStatus('cancelled')}
                        disabled={isUpdating}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel Order
                      </Button>
                    </>
                  )}

                  {order.status === 'shipped' && (
                    <Button 
                      className="w-full"
                      onClick={() => updateOrderStatus('delivered')}
                      disabled={isUpdating}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Delivered
                    </Button>
                  )}

                  {/* Tracking Number Input */}
                  {order.status === 'shipped' && !order.trackingNumber && (
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <label className="block text-sm font-medium mb-2">
                        Add Tracking Number
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter tracking number"
                          className="flex-1 border rounded-lg px-3 py-2 text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addTrackingNumber((e.target as HTMLInputElement).value)
                            }
                          }}
                        />
                        <Button 
                          size="sm"
                          onClick={() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement
                            if (input.value) {
                              addTrackingNumber(input.value)
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}

                  {order.trackingNumber && (
                    <div className="p-4 border rounded-lg bg-green-50">
                      <p className="font-medium text-green-800">Tracking Number</p>
                      <p className="text-green-700">{order.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Products Card */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  Products included in this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{product.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>SKU: {product.sku}</span>
                          <span>Category: {product.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">KSh {product.price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                        <p className="font-bold text-primary">
                          KSh {(product.quantity * product.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>KSh {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>KSh {order.shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>KSh {order.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>KSh {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">{order.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-sm text-muted-foreground">Customer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.customer.email}</p>
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.customer.phone}</p>
                    <p className="text-sm text-muted-foreground">Phone</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.customer.location}</p>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Customer
                </Button>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{order.customer.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.county}</p>
                  <p>{order.shippingAddress.postalCode}</p>
                  {order.shippingAddress.instructions && (
                    <div className="mt-3 p-2 bg-blue-50 rounded">
                      <p className="text-xs text-blue-700">
                        <strong>Delivery Instructions:</strong> {order.shippingAddress.instructions}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="w-0.5 h-8 bg-green-500 mt-1"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Order Placed</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        order.status !== 'processing' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <div className={`w-0.5 h-8 mt-1 ${
                        order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Order Confirmed</p>
                      <p className="text-xs text-muted-foreground">
                        {order.status !== 'processing' ? 'Confirmed' : 'Pending'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <div className={`w-0.5 h-8 mt-1 ${
                        order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Shipped</p>
                      <p className="text-xs text-muted-foreground">
                        {order.status === 'shipped' || order.status === 'delivered' ? 'Shipped' : 'Pending'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Delivered</p>
                      <p className="text-xs text-muted-foreground">
                        {order.status === 'delivered' ? 'Delivered' : 'Pending'}
                      </p>
                    </div>
                  </div>
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