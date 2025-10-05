"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  Edit,
  RefreshCw,
  BarChart3,
  Truck,
  Eye,
  Trash2,
  FileText,
  ShoppingCart,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock inventory data
const mockInventory = {
  overview: {
    totalProducts: 24,
    inStock: 20,
    lowStock: 3,
    outOfStock: 1,
    inventoryValue: 1200000,
    totalSales: 169,
    turnoverRate: 4.2
  },
  products: [
    {
      id: 1,
      name: 'Eco-Friendly All-Purpose Cleaner',
      sku: 'EC-500-001',
      category: 'Household Cleaners',
      currentStock: 23,
      minStock: 10,
      maxStock: 100,
      cost: 450,
      price: 850,
      status: 'in-stock',
      sales: 45,
      lastRestocked: '2024-06-10',
      nextRestock: '2024-06-24',
      supplier: 'EcoSupplies Ltd',
      location: 'A1-01'
    },
    {
      id: 2,
      name: 'Professional Pressure Washer',
      sku: 'PC-2000-001',
      category: 'Industrial Equipment',
      currentStock: 8,
      minStock: 5,
      maxStock: 25,
      cost: 35000,
      price: 45000,
      status: 'in-stock',
      sales: 12,
      lastRestocked: '2024-06-05',
      nextRestock: '2024-07-05',
      supplier: 'PowerClean Pro',
      location: 'B2-15'
    },
    {
      id: 3,
      name: 'Natural Floor Cleaner',
      sku: 'NF-750-001',
      category: 'Household Cleaners',
      currentStock: 15,
      minStock: 15,
      maxStock: 80,
      cost: 400,
      price: 750,
      status: 'in-stock',
      sales: 38,
      lastRestocked: '2024-06-12',
      nextRestock: '2024-06-26',
      supplier: 'Green Solutions',
      location: 'A1-05'
    },
    {
      id: 4,
      name: 'Glass Cleaning Solution',
      sku: 'GC-500-001',
      category: 'Household Cleaners',
      currentStock: 42,
      minStock: 15,
      maxStock: 100,
      cost: 350,
      price: 700,
      status: 'in-stock',
      sales: 29,
      lastRestocked: '2024-06-08',
      nextRestock: '2024-07-08',
      supplier: 'ClearView Supplies',
      location: 'A1-08'
    },
    {
      id: 5,
      name: 'Eco Dish Soap',
      sku: 'ED-500-001',
      category: 'Household Cleaners',
      currentStock: 3,
      minStock: 10,
      maxStock: 50,
      cost: 350,
      price: 700,
      status: 'low-stock',
      sales: 42,
      lastRestocked: '2024-05-20',
      nextRestock: '2024-06-20',
      supplier: 'EcoSupplies Ltd',
      location: 'A1-12'
    },
    {
      id: 6,
      name: 'Industrial Floor Scrubber',
      sku: 'IFS-3000-001',
      category: 'Industrial Equipment',
      currentStock: 0,
      minStock: 2,
      maxStock: 10,
      cost: 80000,
      price: 120000,
      status: 'out-of-stock',
      sales: 3,
      lastRestocked: '2024-05-15',
      nextRestock: '2024-06-25',
      supplier: 'IndustrialClean Ltd',
      location: 'B2-20'
    },
    {
      id: 7,
      name: 'Pressure Washer Nozzles',
      sku: 'PWN-001',
      category: 'Accessories',
      currentStock: 5,
      minStock: 10,
      maxStock: 50,
      cost: 500,
      price: 1200,
      status: 'low-stock',
      sales: 8,
      lastRestocked: '2024-06-01',
      nextRestock: '2024-06-29',
      supplier: 'PowerClean Pro',
      location: 'C3-05'
    },
    {
      id: 8,
      name: 'Glass Cleaner Refill',
      sku: 'GCR-1000-001',
      category: 'Household Cleaners',
      currentStock: 7,
      minStock: 15,
      maxStock: 60,
      cost: 250,
      price: 450,
      status: 'low-stock',
      sales: 25,
      lastRestocked: '2024-06-05',
      nextRestock: '2024-06-25',
      supplier: 'ClearView Supplies',
      location: 'A1-09'
    }
  ],
  alerts: [
    {
      id: 1,
      productId: 5,
      productName: 'Eco Dish Soap',
      type: 'low-stock',
      message: 'Stock level critical (3 remaining)',
      priority: 'high',
      date: '2024-06-14'
    },
    {
      id: 2,
      productId: 6,
      productName: 'Industrial Floor Scrubber',
      type: 'out-of-stock',
      message: 'Product out of stock',
      priority: 'critical',
      date: '2024-06-13'
    },
    {
      id: 3,
      productId: 7,
      productName: 'Pressure Washer Nozzles',
      type: 'low-stock',
      message: 'Stock level low (5 remaining)',
      priority: 'medium',
      date: '2024-06-14'
    },
    {
      id: 4,
      productId: 8,
      productName: 'Glass Cleaner Refill',
      type: 'low-stock',
      message: 'Stock level low (7 remaining)',
      priority: 'medium',
      date: '2024-06-14'
    }
  ]
}

export default function VendorInventoryPage() {
  const { toast } = useToast()
  const [inventory, setInventory] = useState(mockInventory)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isBulkEditing, setIsBulkEditing] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])

  const stats = [
    {
      title: "Total Products",
      value: inventory.overview.totalProducts.toString(),
      description: "Active products",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "In Stock",
      value: inventory.overview.inStock.toString(),
      description: "Available for sale",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Low Stock",
      value: inventory.overview.lowStock.toString(),
      description: "Need restocking",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Out of Stock",
      value: inventory.overview.outOfStock.toString(),
      description: "Not available",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Inventory Value",
      value: `KSh ${(inventory.overview.inventoryValue / 1000).toFixed(0)}K`,
      description: "Total stock value",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ]

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Household Cleaners', label: 'Household Cleaners' },
    { value: 'Industrial Equipment', label: 'Industrial Equipment' },
    { value: 'Accessories', label: 'Accessories' },
  ]

  const getStockStatus = (product: typeof inventory.products[0]) => {
    if (product.currentStock === 0) return 'out-of-stock'
    if (product.currentStock <= product.minStock) return 'low-stock'
    return 'in-stock'
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'in-stock': { label: 'In Stock', variant: 'default' as const, icon: CheckCircle2 },
      'low-stock': { label: 'Low Stock', variant: 'secondary' as const, icon: AlertTriangle },
      'out-of-stock': { label: 'Out of Stock', variant: 'destructive' as const, icon: XCircle },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const, icon: Package }
    const IconComponent = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getAlertPriorityBadge = (priority: string) => {
    const priorityConfig = {
      critical: { label: 'Critical', variant: 'destructive' as const },
      high: { label: 'High', variant: 'destructive' as const },
      medium: { label: 'Medium', variant: 'secondary' as const },
      low: { label: 'Low', variant: 'outline' as const },
    }
    const config = priorityConfig[priority as keyof typeof priorityConfig] || { label: priority, variant: 'outline' as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleStockUpdate = (productId: number, newStock: number) => {
    setInventory(prev => ({
      ...prev,
      products: prev.products.map(product =>
        product.id === productId
          ? { ...product, currentStock: newStock }
          : product
      )
    }))
  }

  const handleBulkStockUpdate = (newStock: number) => {
    setInventory(prev => ({
      ...prev,
      products: prev.products.map(product =>
        selectedProducts.includes(product.id)
          ? { ...product, currentStock: newStock }
          : product
      )
    }))
    setSelectedProducts([])
    setIsBulkEditing(false)
    
    toast({
      title: "Stock Updated!",
      description: `Updated stock for ${selectedProducts.length} products.`,
    })
  }

  const handleRestock = (productId: number, quantity: number) => {
    const product = inventory.products.find(p => p.id === productId)
    if (product) {
      handleStockUpdate(productId, product.currentStock + quantity)
      
      toast({
        title: "Restocked!",
        description: `Added ${quantity} units to ${product.name}.`,
      })
    }
  }

  const toggleProductSelection = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const selectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Simulate CSV processing
      toast({
        title: "CSV Import Started",
        description: "Processing your inventory file...",
      })
      
      setTimeout(() => {
        toast({
          title: "Import Successful!",
          description: "Inventory updated from CSV file.",
        })
      }, 2000)
    }
  }

  const filteredProducts = inventory.products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || getStockStatus(product) === selectedStatus
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
            <p className="text-muted-foreground">
              Track and manage your product stock levels
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-muted">
              <Upload className="w-4 h-4" />
              Import CSV
              <Input
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="hidden"
              />
            </label>
            <Link href="/vendor/products/add">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stock Alerts */}
            {inventory.alerts.length > 0 && (
              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Stock Alerts
                  </CardTitle>
                  <CardDescription>
                    Products that need your attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inventory.alerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm">{alert.productName}</p>
                            <p className="text-sm text-red-700">{alert.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getAlertPriorityBadge(alert.priority)}
                          <Link href={`/vendor/products/edit/${alert.productId}`}>
                            <Button variant="outline" size="sm">
                              Restock
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Inventory List */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Product Inventory</CardTitle>
                    <CardDescription>
                      Manage stock levels and track inventory
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedProducts.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsBulkEditing(true)}
                      >
                        Bulk Edit ({selectedProducts.length})
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
                  {/* Search */}
                  <div className="relative w-full lg:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search products..."
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
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>

                    {/* Category Filter */}
                    <select
                      className="border rounded-lg px-3 py-2 text-sm"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>

                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </div>

                {/* Bulk Edit Form */}
                {isBulkEditing && (
                  <div className="p-4 border rounded-lg bg-blue-50 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Bulk Stock Update</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsBulkEditing(false)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        placeholder="New stock quantity"
                        className="flex-1"
                        min="0"
                      />
                      <Button
                        onClick={() => {
                          const input = document.querySelector('input[type="number"]') as HTMLInputElement
                          if (input.value) {
                            handleBulkStockUpdate(parseInt(input.value))
                          }
                        }}
                      >
                        Update All
                      </Button>
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      Updating {selectedProducts.length} products
                    </p>
                  </div>
                )}

                {/* Products Table */}
                <div className="border rounded-lg">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={selectAllProducts}
                        className="rounded"
                      />
                    </div>
                    <div className="col-span-4">Product</div>
                    <div className="col-span-2">Stock Level</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-3 text-right">Actions</div>
                  </div>

                  <div className="divide-y">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="rounded"
                          />
                        </div>
                        
                        <div className="col-span-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.sku}</p>
                              <p className="text-xs text-muted-foreground">{product.category}</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div className="space-y-1">
                            <p className="font-semibold">
                              {product.currentStock} / {product.maxStock}
                            </p>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  getStockStatus(product) === 'out-of-stock' ? 'bg-red-500' :
                                  getStockStatus(product) === 'low-stock' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ 
                                  width: `${(product.currentStock / product.maxStock) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Min: {product.minStock}
                            </p>
                          </div>
                        </div>

                        <div className="col-span-2">
                          {getStatusBadge(getStockStatus(product))}
                        </div>

                        <div className="col-span-3">
                          <div className="flex items-center gap-2 justify-end">
                            {/* Quick Stock Update */}
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => handleStockUpdate(product.id, Math.max(0, product.currentStock - 1))}
                                className="px-2 py-1 hover:bg-muted"
                                disabled={product.currentStock === 0}
                              >
                                -
                              </button>
                              <Input
                                type="number"
                                value={product.currentStock}
                                onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                                className="w-16 text-center border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min="0"
                              />
                              <button
                                onClick={() => handleStockUpdate(product.id, product.currentStock + 1)}
                                className="px-2 py-1 hover:bg-muted"
                              >
                                +
                              </button>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestock(product.id, product.maxStock - product.currentStock)}
                            >
                              <Truck className="w-3 h-3 mr-1" />
                              Restock
                            </Button>

                            <Link href={`/vendor/products/edit/${product.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Try adjusting your search criteria' : 'No products match your current filters'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Stock Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase Orders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Stock Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Set Stock Alerts
                </Button>
              </CardContent>
            </Card>

            {/* Inventory Health */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Stock Turnover Rate</span>
                      <span className="font-semibold">{inventory.overview.turnoverRate}x/year</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(inventory.overview.turnoverRate / 6) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Stock Coverage</span>
                      <span className="font-semibold">45 days</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Inventory Accuracy</span>
                      <span className="font-semibold">98.5%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: '98.5%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Stock Movements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Movements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { product: 'Eco Dish Soap', change: -5, type: 'sale', date: '2 hours ago' },
                    { product: 'Pressure Washer', change: +10, type: 'restock', date: '5 hours ago' },
                    { product: 'Glass Cleaner', change: -2, type: 'sale', date: '1 day ago' },
                    { product: 'Floor Cleaner', change: +25, type: 'restock', date: '2 days ago' },
                  ].map((movement, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{movement.product}</p>
                        <p className="text-xs text-muted-foreground">{movement.date}</p>
                      </div>
                      <Badge variant={movement.change > 0 ? 'default' : 'secondary'}>
                        {movement.change > 0 ? '+' : ''}{movement.change}
                      </Badge>
                    </div>
                  ))}
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