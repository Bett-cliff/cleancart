"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { HelpDesk } from "@/components/help-desk"
import {
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Star,
  ShoppingCart,
  Eye,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download,
  Filter,
  MapPin,
  PieChart,
  BarChart3,
  LineChart,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock detailed analytics data
const mockAnalyticsData = {
  salesTrend: [
    { date: '2024-06-01', sales: 12500, orders: 8 },
    { date: '2024-06-02', sales: 18400, orders: 12 },
    { date: '2024-06-03', sales: 15200, orders: 10 },
    { date: '2024-06-04', sales: 21800, orders: 14 },
    { date: '2024-06-05', sales: 19500, orders: 13 },
    { date: '2024-06-06', sales: 24100, orders: 16 },
    { date: '2024-06-07', sales: 27600, orders: 18 },
  ],
  productPerformance: [
    { id: 1, name: 'Eco-Friendly All-Purpose Cleaner', sales: 45, revenue: 38250, views: 320, conversion: 14.1 },
    { id: 2, name: 'Professional Pressure Washer', sales: 12, revenue: 540000, views: 85, conversion: 14.1 },
    { id: 3, name: 'Natural Floor Cleaner', sales: 38, revenue: 28500, views: 280, conversion: 13.6 },
    { id: 4, name: 'Glass Cleaning Solution', sales: 29, revenue: 20300, views: 210, conversion: 13.8 },
    { id: 5, name: 'Eco Dish Soap', sales: 42, revenue: 29400, views: 350, conversion: 12.0 },
  ],
  customerDemographics: {
    locations: [
      { location: 'Nairobi', customers: 45, revenue: 156800 },
      { location: 'Mombasa', customers: 18, revenue: 45200 },
      { location: 'Kisumu', customers: 12, revenue: 28400 },
      { location: 'Nakuru', customers: 8, revenue: 15600 },
      { location: 'Eldoret', customers: 6, revenue: 9800 },
    ],
    repeatRate: 38.2,
    averageOrderValue: 1575,
    customerAcquisition: {
      new: 55,
      returning: 34
    }
  },
  inventoryMetrics: {
    totalProducts: 24,
    lowStock: 3,
    outOfStock: 1,
    bestSellers: 5,
    slowMoving: 2
  }
}

export default function VendorAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [activeView, setActiveView] = useState('sales')

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ]

  const views = [
    { id: 'sales', label: 'Sales', icon: DollarSign },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: PieChart },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Advanced Analytics</h1>
            <p className="text-muted-foreground">
              Deep insights into your store performance and customer behavior
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <div className="flex border rounded-lg">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-3 py-2 text-sm ${
                    timeRange === range.value
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b mb-8">
          {views.map((view) => {
            const IconComponent = view.icon
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors ${
                  activeView === view.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {view.label}
              </button>
            )
          })}
        </div>

        {/* Sales View */}
        {activeView === 'sales' && (
          <div className="space-y-8">
            {/* Sales Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>
                  Daily sales and order volume for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-end justify-between gap-1">
                  {mockAnalyticsData.salesTrend.map((day, index) => (
                    <div key={day.date} className="flex flex-col items-center flex-1">
                      <div className="flex items-end gap-1 w-full justify-center">
                        <div 
                          className="w-3/4 bg-primary rounded-t transition-all hover:bg-primary/80 cursor-pointer"
                          style={{ 
                            height: `${(day.sales / 30000) * 100}%`,
                            minHeight: '20px'
                          }}
                          title={`Sales: KSh ${day.sales.toLocaleString()}`}
                        />
                        <div 
                          className="w-3/4 bg-blue-500 rounded-t transition-all hover:bg-blue-400 cursor-pointer"
                          style={{ 
                            height: `${(day.orders / 20) * 100}%`,
                            minHeight: '20px'
                          }}
                          title={`Orders: ${day.orders}`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground mt-2">
                        {new Date(day.date).getDate()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span className="text-sm text-muted-foreground">Sales (KSh)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm text-muted-foreground">Orders</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sales Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">KSh 245,800</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-2">+12.5% from last period</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Order Value</p>
                      <p className="text-2xl font-bold">KSh 1,575</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-2">+5.2% from last period</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                      <p className="text-2xl font-bold">3.2%</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-green-600 mt-2">+0.8% from last period</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Return Rate</p>
                      <p className="text-2xl font-bold">2.1%</p>
                    </div>
                    <div className="p-2 bg-red-100 rounded-lg">
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                  <p className="text-sm text-red-600 mt-2">+0.3% from last period</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Products View */}
        {activeView === 'products' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>
                  Detailed analysis of your product sales and conversion rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.productPerformance.map((product) => (
                    <div key={product.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                      <div className="md:col-span-2">
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {product.sales} sales
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {product.views} views
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold">KSh {product.revenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                      <div>
                        <p className="font-bold">{product.conversion}%</p>
                        <p className="text-xs text-muted-foreground">Conversion</p>
                      </div>
                      <div>
                        <Badge variant={
                          product.conversion > 14 ? "default" :
                          product.conversion > 12 ? "secondary" : "outline"
                        }>
                          {product.conversion > 14 ? "High" :
                           product.conversion > 12 ? "Medium" : "Low"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: 'Eco-Friendly Cleaners', revenue: 96750, growth: '+15%' },
                      { category: 'Industrial Equipment', revenue: 540000, growth: '+8%' },
                      { category: 'Household Cleaners', revenue: 74200, growth: '+12%' },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{item.category}</span>
                        <div className="text-right">
                          <p className="font-medium">KSh {item.revenue.toLocaleString()}</p>
                          <p className="text-xs text-green-600">{item.growth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Products</span>
                      <Badge variant="outline">{mockAnalyticsData.inventoryMetrics.totalProducts}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Low Stock Items</span>
                      <Badge variant="secondary">{mockAnalyticsData.inventoryMetrics.lowStock}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Out of Stock</span>
                      <Badge variant="destructive">{mockAnalyticsData.inventoryMetrics.outOfStock}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Best Sellers</span>
                      <Badge variant="default">{mockAnalyticsData.inventoryMetrics.bestSellers}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Customers View */}
        {activeView === 'customers' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Customer Geographic Distribution</CardTitle>
                  <CardDescription>
                    Where your customers are located
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalyticsData.customerDemographics.locations.map((location, index) => (
                      <div key={location.location} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{location.location}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{location.customers} customers</p>
                          <p className="text-sm text-muted-foreground">
                            KSh {location.revenue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {mockAnalyticsData.customerDemographics.repeatRate}%
                    </p>
                    <p className="text-sm text-muted-foreground">Repeat Customer Rate</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">New Customers</span>
                      <span className="font-medium">
                        {mockAnalyticsData.customerDemographics.customerAcquisition.new}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Returning Customers</span>
                      <span className="font-medium">
                        {mockAnalyticsData.customerDemographics.customerAcquisition.returning}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-lg font-bold text-center">
                      KSh {mockAnalyticsData.customerDemographics.averageOrderValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground text-center">Average Order Value</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Inventory View */}
        {activeView === 'inventory' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm">In Stock</span>
                      <Badge variant="default">20 items</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm">Low Stock</span>
                      <Badge variant="secondary">3 items</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-sm">Out of Stock</span>
                      <Badge variant="destructive">1 item</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-3xl font-bold text-primary">KSh 1.2M</p>
                    <p className="text-sm text-muted-foreground">Total Inventory Value</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Turnover Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-3xl font-bold text-primary">4.2</p>
                    <p className="text-sm text-muted-foreground">Inventory Turns/Year</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Stock Alerts</CardTitle>
                <CardDescription>
                  Products that need your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Eco Dish Soap', currentStock: 3, minStock: 10, status: 'low' },
                    { name: 'Glass Cleaner Refill', currentStock: 5, minStock: 15, status: 'low' },
                    { name: 'Pressure Washer Nozzles', currentStock: 0, minStock: 5, status: 'out' },
                  ].map((product, index) => (
                    <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${
                      product.status === 'out' ? 'bg-red-50' : 'bg-yellow-50'
                    }`}>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.currentStock} • Min: {product.minStock}
                        </p>
                      </div>
                      <Button size="sm">
                        Restock
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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