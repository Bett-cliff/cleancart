"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { TrendingUp, TrendingDown, Users, Package, ShoppingCart, DollarSign, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const salesData = [
  { month: "Jan", sales: 45000, orders: 120, customers: 89 },
  { month: "Feb", sales: 52000, orders: 145, customers: 102 },
  { month: "Mar", sales: 48000, orders: 132, customers: 95 },
  { month: "Apr", sales: 61000, orders: 168, customers: 118 },
  { month: "May", sales: 55000, orders: 152, customers: 108 },
  { month: "Jun", sales: 67000, orders: 185, customers: 134 },
]

const categoryData = [
  { name: "Household", value: 35, color: "#10b981" },
  { name: "Industrial", value: 28, color: "#059669" },
  { name: "Kitchen", value: 20, color: "#047857" },
  { name: "Healthcare", value: 17, color: "#065f46" },
]

const topProducts = [
  { name: "Eco-Friendly All-Purpose Cleaner", sales: 245, revenue: 208250, growth: 12.5 },
  { name: "Industrial Floor Cleaner", sales: 89, revenue: 222500, growth: 8.3 },
  { name: "Biodegradable Dish Soap", sales: 312, revenue: 140400, growth: -2.1 },
  { name: "Heavy Duty Degreaser", sales: 67, revenue: 120600, growth: 15.7 },
  { name: "Organic Glass Cleaner", sales: 156, revenue: 101400, growth: 5.2 },
]

const vendorPerformance = [
  { name: "GreenClean Kenya", orders: 145, revenue: 312000, rating: 4.8, products: 12 },
  { name: "CleanPro Solutions", orders: 89, revenue: 245000, rating: 4.6, products: 8 },
  { name: "EcoWash Ltd", orders: 123, revenue: 189000, rating: 4.9, products: 15 },
  { name: "Industrial Clean Co", orders: 67, revenue: 156000, rating: 4.5, products: 6 },
  { name: "Pure Clean Kenya", orders: 98, revenue: 134000, rating: 4.7, products: 10 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")

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
              <Link href="/orders" className="text-muted-foreground hover:text-primary">
                Orders
              </Link>
              <Link href="/analytics" className="text-primary font-medium">
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
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">Business insights and performance metrics</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh 328,000</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">902</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">646</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15.3% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Listed</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="w-3 h-3 mr-1" />
                -2.1% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`KSh ${value.toLocaleString()}`, "Sales"]} />
                  <Area type="monotone" dataKey="sales" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">KSh {product.revenue.toLocaleString()}</p>
                      <div
                        className={`flex items-center text-xs ${product.growth > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {product.growth > 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(product.growth)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorPerformance.map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{vendor.name}</h4>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{vendor.orders} orders</span>
                        <span>{vendor.products} products</span>
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{vendor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">KSh {vendor.revenue.toLocaleString()}</p>
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
