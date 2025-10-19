"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  ShoppingCart,
  User,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  Mail,
  Phone,
  Package
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import toast from 'react-hot-toast'

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
}

interface OrderDetails {
  id: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  date: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items: OrderItem[];
  shippingInfo: {
    method: string;
    cost: number;
    estimatedDelivery: string;
    trackingNumber: string | null;
  };
  notes: string;
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" }
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/vendor/orders/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details')
        }
        
        const result = await response.json()
        setOrder(result.data)
      } catch (error) {
        console.error('Error fetching order details:', error)
        toast.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrderDetails()
    }
  }, [params.id])

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return
    
    try {
      setUpdating(true)
      const response = await fetch('/api/vendor/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateStatus',
          orderId: order.id,
          updates: { status: newStatus }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      setOrder(prev => prev ? { ...prev, status: newStatus } : null)
      toast.success(`Order marked as ${newStatus}`)
    } catch (err) {
      console.error('Error updating order status:', err)
      toast.error('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Link href="/vendor/orders">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/vendor/orders">
            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order {order.orderId}</h1>
            <p className="text-gray-600 mt-1">Placed on {order.date}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            onClick={() => {
              const newStatus = order.status === 'pending' ? 'processing' : 
                               order.status === 'processing' ? 'shipped' : 
                               order.status === 'shipped' ? 'delivered' : 'processing'
              handleUpdateStatus(newStatus)
            }}
            disabled={updating || order.status === 'delivered' || order.status === 'cancelled'}
          >
            <Truck className="w-4 h-4" />
            {updating ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status as keyof typeof statusConfig]?.color}`}>
                    {statusConfig[order.status as keyof typeof statusConfig]?.label}
                  </span>
                </div>
                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                </Badge>
              </div>
              
              {/* Status Timeline */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    order.status !== 'pending' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {order.status !== 'pending' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-500">
                      {order.status !== 'pending' ? 'Confirmed' : 'Pending confirmation'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['shipped', 'delivered'].includes(order.status) ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {['shipped', 'delivered'].includes(order.status) ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Shipped</p>
                    <p className="text-sm text-gray-500">
                      {order.status === 'shipped' ? `Shipped - Est. ${order.shippingInfo.estimatedDelivery}` :
                       order.status === 'delivered' ? 'Delivered successfully' :
                       'Preparing for shipment'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Order Items
              </CardTitle>
              <CardDescription>
                {order.items.length} items in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">KSh {item.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">KSh {item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">KSh {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">KSh {order.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">KSh {order.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-3">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">KSh {order.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-gray-900">{order.customer.name}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {order.customer.email}
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {order.customer.phone}
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-900">{order.customer.name}</p>
                <p className="text-gray-600">{order.customer.shippingAddress.street}</p>
                <p className="text-gray-600">
                  {order.customer.shippingAddress.city}, {order.customer.shippingAddress.state} {order.customer.shippingAddress.zipCode}
                </p>
                <p className="text-gray-600">{order.customer.shippingAddress.country}</p>
              </div>
              
              {order.notes && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Customer Note:</strong> {order.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{order.shippingInfo.method}</p>
                <p className="text-sm text-gray-600">Cost: KSh {order.shippingInfo.cost.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  Estimated delivery: {order.shippingInfo.estimatedDelivery}
                </p>
                {order.shippingInfo.trackingNumber && (
                  <p className="text-sm text-blue-600">
                    Tracking: {order.shippingInfo.trackingNumber}
                  </p>
                )}
              </div>
              
              {!order.shippingInfo.trackingNumber && order.status === 'shipped' && (
                <Button variant="outline" className="w-full mt-4">
                  <Truck className="w-4 h-4 mr-2" />
                  Add Tracking
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Method:</span>
                <span className="text-sm font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleUpdateStatus('processing')}
                disabled={order.status !== 'pending' || updating}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Processing
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleUpdateStatus('shipped')}
                disabled={order.status !== 'processing' || updating}
              >
                <Truck className="w-4 h-4 mr-2" />
                Mark as Shipped
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleUpdateStatus('delivered')}
                disabled={order.status !== 'shipped' || updating}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Delivered
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}