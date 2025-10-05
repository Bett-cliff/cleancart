"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { useAddToCart } from "@/hooks/use-add-to-cart"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Heart,
  ShoppingCart,
  MapPin,
  CheckCircle,
  Scale,
  Eye,
  Truck,
  ShieldCheck,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useWishlist } from "@/contexts/wishlist-context"
import { useRecentlyViewed } from "@/contexts/recently-viewed-context"
import { useComparison } from "@/contexts/comparison-context"
import { mockProducts, formatPrice, getProductById } from "@/lib/product-utils"
import { Product } from "@/lib/product-types"

export default function MarketplacePage() {
  const { toast } = useToast()
  const { addToCart } = useAddToCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToRecentlyViewed, getRecentProducts } = useRecentlyViewed()
  const { addToComparison, removeFromComparison, isInComparison, comparisonItems } = useComparison()

  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVendor, setSelectedVendor] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedVariants, setSelectedVariants] = useState<{[key: string]: string}>({})
  const [showComparisonBar, setShowComparisonBar] = useState(false)

  // Filter and sort products
  useEffect(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by vendor
    if (selectedVendor !== "all") {
      filtered = filtered.filter(product => product.vendor === selectedVendor)
    }

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = product.variants[0]?.price || product.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => 
          (a.variants[0]?.price || a.price) - (b.variants[0]?.price || b.price)
        )
        break
      case "price-high":
        filtered = [...filtered].sort((a, b) => 
          (b.variants[0]?.price || b.price) - (a.variants[0]?.price || a.price)
        )
        break
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered = [...filtered].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case "popular":
      default:
        filtered = [...filtered].sort((a, b) => b.reviews - a.reviews)
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, selectedVendor, priceRange, sortBy])

  // Show comparison bar when items are added
  useEffect(() => {
    setShowComparisonBar(comparisonItems.length > 0)
  }, [comparisonItems])

  const handleAddToWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product.id)
    }
  }

  const handleAddToComparison = (product: Product) => {
    if (isInComparison(product.id)) {
      removeFromComparison(product.id)
    } else {
      addToComparison(product.id)
      toast({
        title: "Added to comparison!",
        description: `You can compare up to 4 products. Currently ${comparisonItems.length + 1}/4`,
      })
    }
  }

  const handleProductClick = (productId: string) => {
    addToRecentlyViewed(productId)
    // Navigate to product detail page would go here
  }

  const handleVariantSelect = (productId: string, variantId: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantId
    }))
  }

  const getSelectedVariant = (product: Product) => {
    const variantId = selectedVariants[product.id]
    return product.variants.find(v => v.id === variantId) || product.variants[0]
  }

  const categories = [
    { id: "all", name: "All Products", count: mockProducts.length },
    { id: "industrial-equipment", name: "Industrial Equipment", count: mockProducts.filter(p => p.category === 'industrial-equipment').length },
    { id: "household-cleaners", name: "Household Cleaners", count: mockProducts.filter(p => p.category === 'household-cleaners').length },
    { id: "eco-friendly", name: "Eco-Friendly", count: mockProducts.filter(p => p.isEcoFriendly).length },
  ]

  const vendors = Array.from(new Set(mockProducts.map(p => p.vendor))).map(vendor => ({
    id: vendor,
    name: vendor,
    count: mockProducts.filter(p => p.vendor === vendor).length
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Comparison Bar */}
      {showComparisonBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground py-3 px-4 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Scale className="w-5 h-5" />
              <span className="font-medium">
                {comparisonItems.length} product(s) selected for comparison
              </span>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => {
                // Navigate to comparison page
                toast({
                  title: "Compare Products",
                  description: "Comparison feature coming soon!",
                })
              }}
            >
              Compare Now
            </Button>
          </div>
        </div>
      )}

      {/* Marketplace Header */}
      <section className="bg-primary/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover sustainable cleaning supplies from trusted vendors across Kenya
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for products, vendors, or categories..."
              className="pl-12 h-14 text-lg shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={`flex items-center justify-between w-full text-sm p-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vendors */}
                <div>
                  <h3 className="font-semibold mb-3">Vendors</h3>
                  <div className="space-y-2">
                    <button
                      className={`flex items-center justify-between w-full text-sm p-2 rounded-lg transition-colors ${
                        selectedVendor === "all"
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedVendor("all")}
                    >
                      <span>All Vendors</span>
                      <Badge variant="secondary" className="text-xs">
                        {vendors.reduce((sum, v) => sum + v.count, 0)}
                      </Badge>
                    </button>
                    {vendors.map((vendor) => (
                      <button
                        key={vendor.id}
                        className={`flex items-center justify-between w-full text-sm p-2 rounded-lg transition-colors ${
                          selectedVendor === vendor.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedVendor(vendor.id)}
                      >
                        <span>{vendor.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {vendor.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">KSh {priceRange[0].toLocaleString()}</span>
                      <span className="text-sm">KSh {priceRange[1].toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold mb-3">Features</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Eco-Friendly</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Free Shipping</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Verified Vendor</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recently Viewed */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Recently Viewed
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getRecentProducts(3).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recently viewed items</p>
                ) : (
                  <div className="space-y-3">
                    {getRecentProducts(3).map((item) => {
                      const product = getProductById(item.productId)
                      return product ? (
                        <div key={item.productId} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  className="border rounded-lg px-3 py-2 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
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

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setSelectedVendor("all")
                    setPriceRange([0, 100000])
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-6"
              }>
                {filteredProducts.map((product) => {
                  const selectedVariant = getSelectedVariant(product)
                  const finalPrice = selectedVariant?.price || product.price
                  const finalOriginalPrice = selectedVariant?.originalPrice || product.originalPrice

                  return (
                    <Card
                      key={product.id}
                      className={
                        viewMode === "grid" 
                          ? "group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                          : "group hover:shadow-lg transition-all duration-300 cursor-pointer"
                      }
                    >
                      <div className={viewMode === "list" ? "flex" : ""}>
                        {/* Product Image */}
                        <div className={viewMode === "list" ? "w-48 flex-shrink-0" : ""}>
                          <div 
                            className="relative overflow-hidden rounded-t-lg cursor-pointer"
                            onClick={() => handleProductClick(product.id)}
                          >
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              width={viewMode === "list" ? 200 : 300}
                              height={viewMode === "list" ? 200 : 250}
                              className={
                                viewMode === "list" 
                                  ? "w-48 h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                  : "w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                              }
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                              {product.badges.slice(0, 2).map((badge, index) => (
                                <Badge key={index} className="text-xs bg-primary/90">
                                  {badge}
                                </Badge>
                              ))}
                              {product.isEcoFriendly && (
                                <Badge className="text-xs bg-green-500">Eco</Badge>
                              )}
                              {product.shipping.freeShipping && (
                                <Badge className="text-xs bg-blue-500">
                                  <Truck className="w-3 h-3 mr-1" />
                                  Free Shipping
                                </Badge>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-2 right-2 flex flex-col gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAddToWishlist(product)
                                }}
                              >
                                <Heart 
                                  className={`w-4 h-4 ${
                                    isInWishlist(product.id) 
                                      ? "fill-red-500 text-red-500" 
                                      : ""
                                  }`} 
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAddToComparison(product)
                                }}
                              >
                                <Scale 
                                  className={`w-4 h-4 ${
                                    isInComparison(product.id) 
                                      ? "text-primary" 
                                      : ""
                                  }`} 
                                />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Product Info */}
                        <CardContent className={viewMode === "list" ? "p-6 flex-1" : "p-4"}>
                          <div className="flex justify-between items-start mb-2">
                            <h3 
                              className="font-semibold text-sm mb-2 line-clamp-2 flex-1 cursor-pointer hover:text-primary"
                              onClick={() => handleProductClick(product.id)}
                            >
                              {product.name}
                            </h3>
                            {viewMode === "list" && (
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-primary text-lg">
                                  {formatPrice(finalPrice)}
                                </span>
                                {finalOriginalPrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(finalOriginalPrice)}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Vendor Info */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-muted-foreground">{product.vendor}</span>
                            {product.vendorVerified && (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            )}
                          </div>

                          {/* Location & Shipping */}
                          <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{product.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              <span>{product.shipping.deliveryTime}</span>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(product.rating) 
                                      ? "fill-yellow-400 text-yellow-400" 
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({product.reviews})
                            </span>
                          </div>

                          {/* Product Variants */}
                          {product.variants.length > 1 && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1">
                                {product.variants.map((variant) => (
                                  <button
                                    key={variant.id}
                                    className={`text-xs px-2 py-1 rounded border transition-colors ${
                                      selectedVariants[product.id] === variant.id
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background hover:bg-muted"
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleVariantSelect(product.id, variant.id)
                                    }}
                                  >
                                    {variant.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Description (only in list view) */}
                          {viewMode === "list" && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {product.description}
                            </p>
                          )}

                          {/* Price and Add to Cart */}
                          <div className="flex items-center justify-between">
                            {viewMode === "grid" && (
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-primary">
                                  {formatPrice(finalPrice)}
                                </span>
                                {finalOriginalPrice && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    {formatPrice(finalOriginalPrice)}
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                className="text-xs hover:scale-105 transition-transform duration-200"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  addToCart({
                                    id: product.id,
                                    name: product.name,
                                    price: finalPrice,
                                    image: product.images[0],
                                    vendor: product.vendor,
                                    category: product.category,
                                    variantId: selectedVariants[product.id]
                                  })
                                }}
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Load More Button */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Shop With Confidence?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">M-PESA & Card payments protected</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">Across Kenya in 1-3 days</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Verified Vendors</h3>
              <p className="text-sm text-muted-foreground">All vendors thoroughly vetted</p>
            </div>
            <div className="flex flex-col items-center">
              <Scale className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">7-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4 sm:px-6 lg:px-8">
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