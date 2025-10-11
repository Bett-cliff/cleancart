"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, Mail, Clock, Home, Download } from "lucide-react"
import Link from "next/link"
import FixedNavbar from "@/app/components/FixedNavbar"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/app/contexts/CartContext"

// Order interface matching your checkout
interface OrderData {
  orderNumber: string
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    zipCode: string
  }
  paymentMethod: string
  paymentPhone?: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  subtotal: number
  deliveryFee: number
  tax: number
  grandTotal: number
  timestamp: Date
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const [order, setOrder] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { clearCart } = useCart()

  // Clear cart when success page loads and order is confirmed
  useEffect(() => {
    if (orderNumber) {
      clearCart()
    }
  }, [orderNumber, clearCart])

  // Fetch order details
  useEffect(() => {
    if (orderNumber) {
      const fetchOrder = async () => {
        setIsLoading(true)
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const storedOrders = JSON.parse(localStorage.getItem('vendorOrders') || '[]')
          const foundOrder = storedOrders.find((order: OrderData) => order.orderNumber === orderNumber)
          
          if (foundOrder) {
            setOrder(foundOrder)
          } else {
            console.warn('Order not found in localStorage:', orderNumber)
          }
        } catch (error) {
          console.error('Error fetching order:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchOrder()
    } else {
      setIsLoading(false)
    }
  }, [orderNumber])

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Generate and download PDF receipt
  const handleDownloadPDFReceipt = async () => {
    if (!order) return

    try {
      // Dynamically import jsPDF
      const { jsPDF } = await import('jspdf')
      
      // Create new PDF document
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      let yPosition = 20

      // Add company header
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(34, 197, 94) // Emerald color
      doc.text('CleanCart', pageWidth / 2, yPosition, { align: 'center' })
      
      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text('Smart Shopping Solutions', pageWidth / 2, yPosition + 7, { align: 'center' })
      doc.text('Nairobi, Kenya', pageWidth / 2, yPosition + 14, { align: 'center' })
      
      yPosition += 30

      // Receipt title
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')
      doc.text('ORDER RECEIPT', pageWidth / 2, yPosition, { align: 'center' })
      
      yPosition += 10

      // Order details
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Receipt Number: ${order.orderNumber}`, 20, yPosition)
      doc.text(`Date: ${formatDate(order.timestamp)}`, pageWidth - 20, yPosition, { align: 'right' })
      
      yPosition += 15

      // Customer information
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')
      doc.text('CUSTOMER INFORMATION', 20, yPosition)
      
      yPosition += 8
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(`Name: ${order.customerInfo.firstName} ${order.customerInfo.lastName}`, 20, yPosition)
      yPosition += 5
      doc.text(`Email: ${order.customerInfo.email}`, 20, yPosition)
      yPosition += 5
      doc.text(`Phone: ${order.customerInfo.phone}`, 20, yPosition)
      yPosition += 5
      doc.text(`Address: ${order.customerInfo.address}, ${order.customerInfo.city}`, 20, yPosition)
      if (order.customerInfo.zipCode) {
        yPosition += 5
        doc.text(`ZIP Code: ${order.customerInfo.zipCode}`, 20, yPosition)
      }
      
      yPosition += 15

      // Order items header
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('ITEMS ORDERED', 20, yPosition)
      
      yPosition += 8
      
      // Table headers
      doc.setFillColor(240, 240, 240)
      doc.rect(20, yPosition, pageWidth - 40, 8, 'F')
      doc.setTextColor(0, 0, 0)
      doc.text('Item', 25, yPosition + 6)
      doc.text('Qty', 120, yPosition + 6)
      doc.text('Price', 140, yPosition + 6)
      doc.text('Total', pageWidth - 25, yPosition + 6, { align: 'right' })
      
      yPosition += 15

      // Order items
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      
      order.items.forEach((item, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.text(item.name, 25, yPosition)
        doc.text(item.quantity.toString(), 120, yPosition)
        doc.text(`KSh ${item.price.toLocaleString()}`, 140, yPosition)
        doc.text(`KSh ${(item.price * item.quantity).toLocaleString()}`, pageWidth - 25, yPosition, { align: 'right' })
        yPosition += 8
      })

      yPosition += 10

      // Payment summary
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('PAYMENT SUMMARY', 20, yPosition)
      
      yPosition += 15

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text('Subtotal:', pageWidth - 60, yPosition, { align: 'right' })
      doc.text(`KSh ${order.subtotal.toLocaleString()}`, pageWidth - 20, yPosition, { align: 'right' })
      yPosition += 8

      doc.text('Delivery Fee:', pageWidth - 60, yPosition, { align: 'right' })
      doc.text(order.deliveryFee === 0 ? 'FREE' : `KSh ${order.deliveryFee.toLocaleString()}`, pageWidth - 20, yPosition, { align: 'right' })
      yPosition += 8

      doc.text('Tax (14%):', pageWidth - 60, yPosition, { align: 'right' })
      doc.text(`KSh ${order.tax.toLocaleString()}`, pageWidth - 20, yPosition, { align: 'right' })
      yPosition += 12

      // Total
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(34, 197, 94) // Emerald color
      doc.text('TOTAL:', pageWidth - 60, yPosition, { align: 'right' })
      doc.text(`KSh ${order.grandTotal.toLocaleString()}`, pageWidth - 20, yPosition, { align: 'right' })
      
      yPosition += 20

      // Payment method
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 20, yPosition)
      if (order.paymentPhone) {
        yPosition += 8
        doc.text(`Payment Phone: ${order.paymentPhone}`, 20, yPosition)
      }
      
      yPosition += 20

      // Footer
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('Thank you for choosing CleanCart!', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 5
      doc.text('This is an computer-generated receipt. No signature required.', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 5
      doc.text('For questions, contact: support@cleancart.com | +254 700 123 456', pageWidth / 2, yPosition, { align: 'center' })

      // Save the PDF
      doc.save(`receipt-${order.orderNumber}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF receipt. Please try again.')
    }
  }

  // Alternative simple receipt for fallback
  const handleDownloadTextReceipt = () => {
    if (!order) return
    
    const receiptContent = `
CleanCart - ORDER RECEIPT
=========================

Receipt Number: ${order.orderNumber}
Date: ${formatDate(order.timestamp)}

CUSTOMER INFORMATION
-------------------
Name: ${order.customerInfo.firstName} ${order.customerInfo.lastName}
Email: ${order.customerInfo.email}
Phone: ${order.customerInfo.phone}
Address: ${order.customerInfo.address}, ${order.customerInfo.city}${order.customerInfo.zipCode ? `, ${order.customerInfo.zipCode}` : ''}

ORDER ITEMS
-----------
${order.items.map(item => 
  `${item.name} 
   Quantity: ${item.quantity} 
   Price: KSh ${item.price.toLocaleString()} 
   Total: KSh ${(item.price * item.quantity).toLocaleString()}`
).join('\n\n')}

PAYMENT SUMMARY
---------------
Subtotal: KSh ${order.subtotal.toLocaleString()}
Delivery: ${order.deliveryFee === 0 ? 'FREE' : `KSh ${order.deliveryFee.toLocaleString()}`}
Tax (14%): KSh ${order.tax.toLocaleString()}
TOTAL: KSh ${order.grandTotal.toLocaleString()}

Payment Method: ${order.paymentMethod.toUpperCase()}
${order.paymentPhone ? `Payment Phone: ${order.paymentPhone}` : ''}

Thank you for your purchase!
============================
This is a computer-generated receipt.
For support: support@cleancart.com | +254 700 123 456
    `
    
    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${order.orderNumber}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={0} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Your Order</h3>
              <p className="text-gray-600">We're preparing your order details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={0} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
              <p className="text-gray-600 mb-6">
                {orderNumber 
                  ? `We couldn't find order #${orderNumber}. Please check your order number or contact support.`
                  : 'No order number provided. Please check your confirmation email or contact support.'
                }
              </p>
              <div className="space-y-3">
                <Link href="/marketplace">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <FixedNavbar cartItemsCount={0} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <Card className="border-emerald-200 bg-emerald-50 mb-8">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
              <p className="text-lg text-gray-600 mb-4">
                Thank you for your purchase, {order.customerInfo.firstName}! Your order has been successfully placed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Badge className="bg-emerald-600 text-white px-4 py-2 text-lg">
                  Order #: {order.orderNumber}
                </Badge>
                <span className="text-gray-500 text-sm">
                  Placed on {formatDate(order.timestamp)}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleDownloadPDFReceipt}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF Receipt
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                            <p className="text-emerald-600 font-medium text-sm">
                              KSh {item.price.toLocaleString()} each
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-gray-900">KSh {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">KSh {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className={order.deliveryFee === 0 ? "text-green-600 font-medium" : "text-gray-900"}>
                        {order.deliveryFee === 0 ? "FREE" : `KSh ${order.deliveryFee.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (14%)</span>
                      <span className="text-gray-900">KSh {order.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-3">
                      <span className="text-gray-900">Total Amount</span>
                      <span className="text-emerald-600">KSh {order.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery & Payment Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery Information */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Shipping Address</p>
                          <p className="text-gray-600 text-sm mt-1">
                            {order.customerInfo.address}<br />
                            {order.customerInfo.city}
                            {order.customerInfo.zipCode && `, ${order.customerInfo.zipCode}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Contact Information</p>
                          <p className="text-gray-600 text-sm mt-1">
                            {order.customerInfo.email}<br />
                            {order.customerInfo.phone}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Estimated Delivery</p>
                          <p className="text-gray-600 text-sm mt-1">2-3 business days</p>
                          <p className="text-xs text-gray-500 mt-1">
                            You will receive a tracking number once your order ships.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium text-gray-900">Payment Method</p>
                        <p className="text-gray-600 text-sm mt-1 capitalize">
                          {order.paymentMethod}
                          {order.paymentPhone && ` (${order.paymentPhone})`}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">Payment Status</p>
                        <Badge className="bg-green-100 text-green-800 border-green-200 mt-1">
                          Paid Successfully
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">Order Status</p>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 mt-1">
                          Processing
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Order Status & Actions */}
            <div className="space-y-6">
              {/* Order Progress */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-emerald-600">Order Confirmed</p>
                        <p className="text-sm text-gray-500">Your order has been received</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(order.timestamp)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">Processing</p>
                        <p className="text-sm text-gray-400">Preparing your items</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">Shipped</p>
                        <p className="text-sm text-gray-400">On the way to you</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">Delivered</p>
                        <p className="text-sm text-gray-400">Order complete</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Actions</h3>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-4">
                      You will receive an email confirmation with your order details and tracking information.
                    </p>
                    
                    <div className="space-y-2">
                      <Link href="/marketplace">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                          <Home className="w-4 h-4 mr-2" />
                          Continue Shopping
                        </Button>
                      </Link>
                      
                      <Button 
                        onClick={handleDownloadPDFReceipt}
                        variant="outline" 
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF Receipt
                      </Button>

                      <Button 
                        onClick={handleDownloadTextReceipt}
                        variant="outline" 
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Text Receipt
                      </Button>
                      
                      <Link href="/track-order">
                        <Button variant="outline" className="w-full">
                          <Truck className="w-4 h-4 mr-2" />
                          Track Order
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Card */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our customer support team is here to help with any questions about your order.
                  </p>
                  <div className="space-y-2">
                    <Link href="/contact">
                      <Button variant="outline" className="w-full bg-white">
                        Contact Support
                      </Button>
                    </Link>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Email: support@cleancart.com<br />
                        Phone: +254 700 123 456
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}