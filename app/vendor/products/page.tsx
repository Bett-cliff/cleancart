"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { HelpDesk } from "@/components/help-desk"
import {
  Package,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Upload,
  Download,
  Grid,
  List,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Eco-Friendly All-Purpose Cleaner',
    description: 'Natural cleaning solution safe for all surfaces',
    category: 'household-cleaners',
    price: 850,
    originalPrice: 1000,
    stock: 23,
    images: ['/placeholder-cleaner.jpg'],
    status: 'active',
    sales: 45,
    revenue: 38250,
    rating: 4.7,
    reviews: 28,
    variants: [
      { id: '1-500ml', name: '500ml Bottle', price: 850, stock: 15 },
      { id: '1-1l', name: '1L Refill', price: 1500, stock: 8 },
    ],
    badges: ['Eco-Friendly', 'Best Seller'],
    createdAt: '2024-01-15',
    updatedAt: '2024-06-10',
  },
  {
    id: 2,
    name: 'Professional Pressure Washer',
    description: 'Heavy-duty pressure washer for industrial use',
    category: 'industrial-equipment',
    price: 45000,
    originalPrice: 52000,
    stock: 8,
    images: ['/placeholder-pressure-washer.jpg'],
    status: 'active',
    sales: 12,
    revenue: 540000,
    rating: 4.8,
    reviews: 15,
    variants: [],
    badges: ['Professional', 'Heavy Duty'],
    createdAt: '2024-02-10',
    updatedAt: '2024-06-12',
  },
  {
    id: 3,
    name: 'Natural Floor Cleaner',
    description: 'Plant-based floor cleaning solution',
    category: 'household-cleaners',
    price: 750,
    originalPrice: 900,
    stock: 15,
    images: ['/placeholder-floor-cleaner.jpg'],
    status: 'active',
    sales: 38,
    revenue: 28500,
    rating: 4.5,
    reviews: 22,
    variants: [],
    badges: ['Eco-Friendly', 'Natural'],
    createdAt: '2024-03-05',
    updatedAt: '2024-06-08',
  },
  {
    id: 4,
    name: 'Glass Cleaning Solution',
    description: 'Streak-free glass cleaner for windows and mirrors',
    category: 'household-cleaners',
    price: 700,
    originalPrice: 850,
    stock: 42,
    images: ['/placeholder-glass-cleaner.jpg'],
    status: 'active',
    sales: 29,
    revenue: 20300,
    rating: 4.6,
    reviews: 18,
    variants: [],
    badges: ['Streak-Free'],
    createdAt: '2024-04-12',
    updatedAt: '2024-06-15',
  },
  {
    id: 5,
    name: 'Eco Dish Soap',
    description: 'Biodegradable dish washing liquid',
    category: 'household-cleaners',
    price: 700,
    originalPrice: 0,
    stock: 3,
    images: ['/placeholder-dish-soap.jpg'],
    status: 'low-stock',
    sales: 42,
    revenue: 29400,
    rating: 4.4,
    reviews: 31,
    variants: [],
    badges: ['Eco-Friendly', 'Biodegradable'],
    createdAt: '2024-05-20',
    updatedAt: '2024-06-14',
  },
  {
    id: 6,
    name: 'Industrial Floor Scrubber',
    description: 'Commercial-grade floor scrubbing machine',
    category: 'industrial-equipment',
    price: 120000,
    originalPrice: 0,
    stock: 0,
    images: ['/placeholder-scrubber.jpg'],
    status: 'out-of-stock',
    sales: 3,
    revenue: 360000,
    rating: 4.9,
    reviews: 3,
    variants: [],
    badges: ['Commercial', 'Heavy Duty'],
    createdAt: '2024-06-01',
    updatedAt: '2024-06-13',
  },
]

export default function VendorProductsPage() {
  const [products, setProducts] = useState(mockProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('name')

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'household-cleaners', name: 'Household Cleaners' },
    { id: 'industrial-equipment', name: 'Industrial Equipment' },
    { id: 'eco-friendly', name: 'Eco-Friendly' },
  ]

  const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'active', name: 'Active', color: 'green' },
    { id: 'low-stock', name: 'Low Stock', color: 'yellow' },
    { id: 'out-of-stock', name: 'Out of Stock', color: 'red' },
    { id: 'draft', name: 'Draft', color: 'gray' },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const, icon: CheckCircle },
      'low-stock': { label: 'Low Stock', variant: 'secondary' as const, icon: AlertTriangle },
      'out-of-stock': { label: 'Out of Stock', variant: 'destructive' as const, icon: AlertTriangle },
      draft: { label: 'Draft', variant: 'outline' as const, icon: MoreHorizontal },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const, icon: MoreHorizontal }
    const IconComponent = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'out-of-stock'
    if (stock <= 5) return 'low-stock'
    return 'active'
  }

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesStatus = selectedStatus === 'all' || getStockStatus(product.stock) === selectedStatus
      
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-high':
          return b.price - a.price
        case 'price-low':
          return a.price - b.price
        case 'sales-high':
          return b.sales - a.sales
        case 'stock-low':
          return a.stock - b.stock
        default:
          return 0
      }
    })

  const handleDeleteProduct = (productId: number) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  const handleBulkAction = (action: string, productIds: number[]) => {
    switch (action) {
      case 'delete':
        if (confirm(`Are you sure you want to delete ${productIds.length} products?`)) {
          setProducts(products.filter(p => !productIds.includes(p.id)))
        }
        break
      case 'activate':
        // In a real app, this would update the product status via API
        setProducts(products.map(p => 
          productIds.includes(p.id) ? { ...p, status: 'active' } : p
        ))
        break
      case 'deactivate':
        setProducts(products.map(p => 
          productIds.includes(p.id) ? { ...p, status: 'draft' } : p
        ))
        break
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Management</h1>
            <p className="text-muted-foreground">
              Manage your product catalog and inventory
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Bulk Upload
            </Button>
            <Link href="/vendor/products/add">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold">
                    {products.filter(p => getStockStatus(p.stock) === 'low-stock').length}
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold">
                    {products.filter(p => getStockStatus(p.stock) === 'out-of-stock').length}
                  </p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">
                    {products.reduce((sum, p) => sum + p.sales, 0)}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-600" />
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
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
                {/* Category Filter */}
                <select
                  className="border rounded-lg px-3 py-2 text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

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

                {/* Sort */}
                <select
                  className="border rounded-lg px-3 py-2 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="sales-high">Sales: High to Low</option>
                  <option value="stock-low">Stock: Low to High</option>
                </select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-9 w-9 p-0"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-9 w-9 p-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first product'
                }
              </p>
              <Link href="/vendor/products/add">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {product.badges.slice(0, 2).map((badge, index) => (
                        <Badge key={index} className="text-xs bg-primary/90">
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Link href={`/vendor/products/edit/${product.id}`}>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </Link>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Status Overlay */}
                    <div className="absolute bottom-2 left-2">
                      {getStatusBadge(getStockStatus(product.stock))}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="space-y-1">
                        <div className="font-bold text-primary">
                          KSh {product.price.toLocaleString()}
                        </div>
                        {product.originalPrice > 0 && (
                          <div className="text-sm text-muted-foreground line-through">
                            KSh {product.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {product.stock} in stock
                      </div>
                    </div>

                    {/* Sales & Rating */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{product.sales} sales</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>★ {product.rating}</span>
                        <span>({product.reviews})</span>
                      </div>
                    </div>

                    {/* Variants */}
                    {product.variants.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-2">
                          {product.variants.length} variant(s)
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // List View
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute -top-1 -right-1">
                          {getStatusBadge(getStockStatus(product.stock))}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold mb-1">{product.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <Link href={`/vendor/products/edit/${product.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm">
                            <div>
                              <span className="font-semibold text-primary">
                                KSh {product.price.toLocaleString()}
                              </span>
                              {product.originalPrice > 0 && (
                                <span className="text-muted-foreground line-through ml-2">
                                  KSh {product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              <span>{product.stock} in stock</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>{product.sales} sales</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>★ {product.rating}</span>
                              <span>({product.reviews})</span>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex gap-1">
                            {product.badges.slice(0, 2).map((badge, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex justify-between items-center mt-8">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
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