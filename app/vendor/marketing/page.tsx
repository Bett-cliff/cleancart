"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
import {
  Tag,
  Star,
  TrendingUp,
  Calendar,
  Users,
  Percent,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Copy,
  BarChart3,
  ShoppingCart,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Upload,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock marketing data
const mockMarketingData = {
  overview: {
    activePromotions: 3,
    totalDiscounts: 12,
    featuredProducts: 4,
    conversionRate: 4.2,
    revenueFromPromotions: 450000,
    customersReached: 1250
  },
  promotions: [
    {
      id: 1,
      name: "Summer Cleaning Sale",
      type: "percentage",
      value: 15,
      code: "SUMMER15",
      description: "Get 15% off on all eco-friendly cleaning products",
      status: "active",
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      usageLimit: 1000,
      usedCount: 342,
      minOrderAmount: 1000,
      featured: true,
      products: [1, 2, 3, 4],
      createdAt: "2024-05-25"
    },
    {
      id: 2,
      name: "First Order Discount",
      type: "fixed",
      value: 500,
      code: "WELCOME500",
      description: "KSh 500 off on your first order",
      status: "active",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      usageLimit: null,
      usedCount: 189,
      minOrderAmount: 2000,
      featured: false,
      products: [],
      createdAt: "2024-01-01"
    },
    {
      id: 3,
      name: "Pressure Washer Bundle",
      type: "percentage",
      value: 10,
      code: "POWER10",
      description: "10% off when you buy any pressure washer with accessories",
      status: "active",
      startDate: "2024-06-10",
      endDate: "2024-07-10",
      usageLimit: 200,
      usedCount: 45,
      minOrderAmount: 15000,
      featured: true,
      products: [2, 7],
      createdAt: "2024-06-05"
    },
    {
      id: 4,
      name: "Flash Sale - Floor Cleaners",
      type: "percentage",
      value: 20,
      code: "FLASH20",
      description: "20% off on all floor cleaning products for 48 hours",
      status: "expired",
      startDate: "2024-05-15",
      endDate: "2024-05-17",
      usageLimit: 500,
      usedCount: 487,
      minOrderAmount: 800,
      featured: false,
      products: [1, 3],
      createdAt: "2024-05-10"
    },
    {
      id: 5,
      name: "Bulk Order Discount",
      type: "percentage",
      value: 25,
      code: "BULK25",
      description: "25% off on orders above KSh 10,000",
      status: "scheduled",
      startDate: "2024-07-01",
      endDate: "2024-07-31",
      usageLimit: 100,
      usedCount: 0,
      minOrderAmount: 10000,
      featured: false,
      products: [],
      createdAt: "2024-06-12"
    }
  ],
  featuredProducts: [
    {
      id: 1,
      name: "Eco-Friendly All-Purpose Cleaner",
      sku: "EC-500-001",
      category: "Household Cleaners",
      price: 850,
      currentStock: 23,
      featuredSince: "2024-06-01",
      clicks: 156,
      conversions: 23,
      revenue: 19550
    },
    {
      id: 2,
      name: "Professional Pressure Washer",
      sku: "PC-2000-001",
      category: "Industrial Equipment",
      price: 45000,
      currentStock: 8,
      featuredSince: "2024-06-10",
      clicks: 89,
      conversions: 5,
      revenue: 225000
    },
    {
      id: 3,
      name: "Natural Floor Cleaner",
      sku: "NF-750-001",
      category: "Household Cleaners",
      price: 750,
      currentStock: 15,
      featuredSince: "2024-05-20",
      clicks: 203,
      conversions: 34,
      revenue: 25500
    },
    {
      id: 4,
      name: "Glass Cleaning Solution",
      sku: "GC-500-001",
      category: "Household Cleaners",
      price: 700,
      currentStock: 42,
      featuredSince: "2024-06-05",
      clicks: 134,
      conversions: 19,
      revenue: 13300
    }
  ],
  analytics: {
    promotionPerformance: [
      { name: "SUMMER15", usage: 342, revenue: 128000, conversion: 14.2 },
      { name: "WELCOME500", usage: 189, revenue: 94500, conversion: 8.5 },
      { name: "POWER10", usage: 45, revenue: 202500, conversion: 22.1 },
      { name: "FLASH20", usage: 487, revenue: 194800, conversion: 18.7 }
    ],
    topPerformingProducts: [
      { name: "Pressure Washer", revenue: 225000, orders: 5 },
      { name: "Floor Cleaner", revenue: 25500, orders: 34 },
      { name: "All-Purpose Cleaner", revenue: 19550, orders: 23 },
      { name: "Glass Cleaner", revenue: 13300, orders: 19 }
    ]
  }
}

export default function VendorMarketingPage() {
  const { toast } = useToast()
  const [marketingData, setMarketingData] = useState(mockMarketingData)
  const [activeTab, setActiveTab] = useState("promotions")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const stats = [
    {
      title: "Active Promotions",
      value: marketingData.overview.activePromotions.toString(),
      description: "Currently running",
      icon: Tag,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Discounts",
      value: marketingData.overview.totalDiscounts.toString(),
      description: "All time created",
      icon: Percent,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Featured Products",
      value: marketingData.overview.featuredProducts.toString(),
      description: "Currently featured",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Conversion Rate",
      value: `${marketingData.overview.conversionRate}%`,
      description: "From promotions",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Promotion Revenue",
      value: `KSh ${(marketingData.overview.revenueFromPromotions / 1000).toFixed(0)}K`,
      description: "Total from discounts",
      icon: BarChart3,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ]

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "scheduled", label: "Scheduled" },
    { value: "expired", label: "Expired" },
    { value: "draft", label: "Draft" }
  ]

  const promotionTypes = [
    { value: "percentage", label: "Percentage Off" },
    { value: "fixed", label: "Fixed Amount" },
    { value: "free_shipping", label: "Free Shipping" },
    { value: "bundle", label: "Bundle Deal" }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Active", variant: "default" as const, icon: CheckCircle2 },
      scheduled: { label: "Scheduled", variant: "secondary" as const, icon: Clock },
      expired: { label: "Expired", variant: "outline" as const, icon: XCircle },
      draft: { label: "Draft", variant: "outline" as const, icon: Edit }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "outline" as const, icon: Tag }
    const IconComponent = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getPromotionTypeBadge = (type: string) => {
    const typeConfig = {
      percentage: { label: "% Off", variant: "default" as const },
      fixed: { label: "Fixed", variant: "secondary" as const },
      free_shipping: { label: "Free Shipping", variant: "outline" as const },
      bundle: { label: "Bundle", variant: "outline" as const }
    }
    const config = typeConfig[type as keyof typeof typeConfig] || { label: type, variant: "outline" as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleCreatePromotion = () => {
    toast({
      title: "Create New Promotion",
      description: "Opening promotion creation form...",
    })
    // In a real app, this would open a modal or navigate to a form
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code Copied!",
      description: `Discount code ${code} copied to clipboard.`,
    })
  }

  const handleToggleFeatured = (productId: number) => {
    setMarketingData(prev => ({
      ...prev,
      featuredProducts: prev.featuredProducts.filter(p => p.id !== productId)
    }))
    
    toast({
      title: "Product Unfeatured",
      description: "Product removed from featured section.",
    })
  }

  const handleDeletePromotion = (promotionId: number) => {
    setMarketingData(prev => ({
      ...prev,
      promotions: prev.promotions.filter(p => p.id !== promotionId)
    }))
    
    toast({
      title: "Promotion Deleted",
      description: "Promotion has been removed successfully.",
    })
  }

  const filteredPromotions = marketingData.promotions.filter(promotion => {
    const matchesSearch = 
      promotion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promotion.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || promotion.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Marketing Tools</h1>
            <p className="text-muted-foreground">
              Create promotions, discounts, and featured products to boost sales
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button onClick={handleCreatePromotion} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Promotion
            </Button>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="promotions">Promotions & Discounts</TabsTrigger>
            <TabsTrigger value="featured">Featured Products</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          </TabsList>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-8">
            {/* Quick Promotion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Percent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Percentage Discount</h3>
                  <p className="text-sm text-muted-foreground">% off products</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Tag className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Fixed Amount</h3>
                  <p className="text-sm text-muted-foreground">Fixed price discount</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <ShoppingCart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Free Shipping</h3>
                  <p className="text-sm text-muted-foreground">Waive delivery fees</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Bundle Deal</h3>
                  <p className="text-sm text-muted-foreground">Product combinations</p>
                </CardContent>
              </Card>
            </div>

            {/* Promotions List */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>All Promotions</CardTitle>
                    <CardDescription>
                      Manage your discount codes and promotions
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-48">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search promotions..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPromotions.map((promotion) => (
                    <div key={promotion.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{promotion.name}</h3>
                          {promotion.featured && (
                            <Badge variant="default" className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{promotion.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-muted-foreground" />
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                              {promotion.code}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyCode(promotion.code)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{promotion.usedCount} / {promotion.usageLimit || "∞"} used</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-3 lg:mt-0">
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(promotion.status)}
                            {getPromotionTypeBadge(promotion.type)}
                          </div>
                          <p className="text-lg font-bold">
                            {promotion.type === "percentage" 
                              ? `${promotion.value}% OFF` 
                              : `${formatCurrency(promotion.value)} OFF`
                            }
                          </p>
                          {promotion.minOrderAmount > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Min. order: {formatCurrency(promotion.minOrderAmount)}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeletePromotion(promotion.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredPromotions.length === 0 && (
                    <div className="text-center py-12">
                      <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No promotions found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery ? "Try adjusting your search criteria" : "No promotions match your current filters"}
                      </p>
                      <Button onClick={handleCreatePromotion}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Promotion
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Featured Products Tab */}
          <TabsContent value="featured" className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Featured Products</CardTitle>
                    <CardDescription>
                      Showcase your best products to increase visibility and sales
                    </CardDescription>
                  </div>
                  <Link href="/vendor/products">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Featured Product
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {marketingData.featuredProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-6 h-6 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.sku} • {product.category}</p>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div>
                            <span className="font-semibold">{formatCurrency(product.price)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Stock: </span>
                            <span className={product.currentStock < 10 ? "text-red-600 font-semibold" : "font-semibold"}>
                              {product.currentStock}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Featured since: {formatDate(product.featuredSince)}</span>
                          <span>•</span>
                          <span>{product.clicks} clicks</span>
                          <span>•</span>
                          <span>{product.conversions} sales</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(product.revenue)}
                          </p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeatured(product.id)}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {marketingData.featuredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No featured products</h3>
                    <p className="text-muted-foreground mb-4">
                      Feature your best products to increase their visibility
                    </p>
                    <Link href="/vendor/products">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Featured Products
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Promotion Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Promotion Performance</CardTitle>
                  <CardDescription>
                    How your discounts are performing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketingData.analytics.promotionPerformance.map((promo, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-semibold">{promo.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {promo.usage} uses • {promo.conversion}% conversion
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {formatCurrency(promo.revenue)}
                          </p>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                  <CardDescription>
                    Best sellers from promotions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketingData.analytics.topPerformingProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.orders} orders
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {formatCurrency(product.revenue)}
                          </p>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Marketing Overview</CardTitle>
                <CardDescription>
                  Key metrics from your marketing efforts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{marketingData.overview.customersReached}</p>
                    <p className="text-sm text-muted-foreground">Customers Reached</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{marketingData.overview.conversionRate}%</p>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {marketingData.promotions.reduce((acc, promo) => acc + promo.usedCount, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Discount Uses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(marketingData.overview.revenueFromPromotions)}
                    </p>
                    <p className="text-sm text-muted-foreground">Promotion Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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