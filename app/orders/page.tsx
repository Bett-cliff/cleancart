"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Eye, Truck, CheckCircle, Clock, Package, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

const orders = [
  {
    id: "ORD-2024-001",
    customer: "Jane Wanjiku",
    email: "jane.wanjiku@email.com",
    phone: "+254 712 345 678",
    date: "2024-01-15",
    status: "delivered",
    total: 3250,
    items: 4,
    address: "Westlands, Nairobi",
    trackingNumber: "TRK-001-2024",
    progress: 100,
    products: [
      { name: "Eco-Friendly All-Purpose Cleaner", quantity: 2, price: 850 },
      { name: "Biodegradable Dish Soap", quantity: 3, price: 450 },
    ],
  },
  {
    id: "ORD-2024-002",
    customer: "David Kimani",
    email: "david.kimani@email.com",
    phone: "+254 722 456 789",
    date: "2024-01-16",
    status: "shipped",
    total: 5800,
    items: 2,
    address: "Karen, Nairobi",
    trackingNumber: "TRK-002-2024",
    progress: 75,
    products: [
      { name: "Industrial Floor Cleaner", quantity: 1, price: 2500 },
      { name: "Heavy Duty Degreaser", quantity: 1, price: 1800 },
    ],
  },
  {
    id: "ORD-2024-003",
    customer: "Sarah Muthoni",
    email: "sarah.muthoni@email.com",
    phone: "+254 733 567 890",
    date: "2024-01-17",
    status: "processing",
    total: 1970,
    items: 5,
    address: "Kileleshwa, Nairobi",
    trackingNumber: "TRK-003-2024",
    progress: 25,
    products: [
      { name: "Organic Glass Cleaner", quantity: 2, price: 650 },
      { name: "Antibacterial Wipes", quantity: 2, price: 320 },
    ],
  },
  {
    id: "ORD-2024-004",
    customer: "Michael Ochieng",
    email: "michael.ochieng@email.com",
    phone: "+254 744 678 901",
    date: "2024-01-18",
    status: "pending",
    total: 1300,
    items: 3,
    address: "Kilimani, Nairobi",
    trackingNumber: "TRK-004-2024",
    progress: 0,
    products: [
      { name: "Eco-Friendly All-Purpose Cleaner", quantity: 1, price: 850 },
      { name: "Biodegradable Dish Soap", quantity: 1, price: 450 },
    ],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    case "pending":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="w-4 h-4" />
    case "shipped":
      return <Truck className="w-4 h-4" />
    case "processing":
      return <Package className="w-4 h-4" />
    case "pending":
      return <Clock className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/cleancart-logo.png" alt="CleanCart Logo" width={40} height={40} className="rounded-lg" />
              <span className="text-xl font-bold text-primary">CleanCart</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-muted-foreground hover:text-primary">
                Home
              </Link>
              <Link href="/marketplace" className="text-muted-foreground hover:text-primary">
                Marketplace
              </Link>
              <Link href="/products" className="text-muted-foreground hover:text-primary">
                Products
              </Link>
              <Link href="/orders" className="text-primary font-medium">
                Orders
              </Link>
              <Link href="/analytics" className="text-muted-foreground hover:text-primary">
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
            <p className="text-muted-foreground mt-2">Track and manage customer orders</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Export Orders</Button>
            <Button className="bg-primary hover:bg-primary/90">Create Order</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search orders or customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{order.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">KSh {order.total.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{order.items} items</p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.id}</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              {/* Customer Info */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Customer Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <p>
                                      <strong>Name:</strong> {selectedOrder.customer}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                      <Mail className="w-4 h-4" />
                                      <span>{selectedOrder.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Phone className="w-4 h-4" />
                                      <span>{selectedOrder.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="w-4 h-4" />
                                      <span>{selectedOrder.address}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Order Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <p>
                                      <strong>Order Date:</strong> {selectedOrder.date}
                                    </p>
                                    <p>
                                      <strong>Tracking:</strong> {selectedOrder.trackingNumber}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                      <span>
                                        <strong>Status:</strong>
                                      </span>
                                      <Badge className={getStatusColor(selectedOrder.status)}>
                                        {getStatusIcon(selectedOrder.status)}
                                        <span className="ml-1 capitalize">{selectedOrder.status}</span>
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Progress Tracking */}
                              <div>
                                <h4 className="font-semibold mb-2">Order Progress</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Progress</span>
                                    <span>{selectedOrder.progress}%</span>
                                  </div>
                                  <Progress value={selectedOrder.progress} className="h-2" />
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Pending</span>
                                    <span>Processing</span>
                                    <span>Shipped</span>
                                    <span>Delivered</span>
                                  </div>
                                </div>
                              </div>

                              {/* Products */}
                              <div>
                                <h4 className="font-semibold mb-2">Products</h4>
                                <div className="space-y-2">
                                  {selectedOrder.products.map((product, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                      <div>
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">Quantity: {product.quantity}</p>
                                      </div>
                                      <p className="font-semibold">
                                        KSh {(product.price * product.quantity).toLocaleString()}
                                      </p>
                                    </div>
                                  ))}
                                  <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between items-center font-semibold">
                                      <span>Total</span>
                                      <span>KSh {selectedOrder.total.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
