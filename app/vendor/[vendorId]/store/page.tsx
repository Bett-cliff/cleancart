// app/vendor/[vendorId]/store/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2,
  MapPin,
  Calendar,
  Users,
  Package,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual API calls
const mockVendorData = {
  "eco-friendly-store": {
    id: "eco-friendly-store",
    name: "EcoFriendly Store",
    description: "Your one-stop shop for sustainable living products. We believe in making eco-friendly choices accessible to everyone.",
    avatar: "/api/placeholder/100/100",
    coverImage: "/api/placeholder/1200/400",
    rating: 4.8,
    reviewCount: 127,
    joinedDate: "2023-01-15",
    location: "Nairobi, Kenya",
    totalProducts: 45,
    categories: ["Bath & Body", "Home & Kitchen", "Personal Care", "Zero Waste"],
    social: {
      website: "https://ecofriendly.co.ke",
      instagram: "@ecofriendly_ke"
    }
  },
  "organic-harvest": {
    id: "organic-harvest",
    name: "Organic Harvest",
    description: "Pure, natural organic products straight from Kenyan farms. Supporting local farmers and sustainable agriculture.",
    avatar: "/api/placeholder/100/100",
    coverImage: "/api/placeholder/1200/400",
    rating: 4.9,
    reviewCount: 89,
    joinedDate: "2023-03-20",
    location: "Nakuru, Kenya",
    totalProducts: 32,
    categories: ["Food & Beverages", "Skincare", "Herbal Products"],
    social: {
      website: "https://organicharvest.co.ke",
      instagram: "@organicharvest"
    }
  }
}

const mockProducts = [
  {
    id: 1,
    vendorId: "eco-friendly-store",
    name: "Organic Lavender Soap",
    description: "Handmade lavender soap with organic ingredients, perfect for sensitive skin.",
    price: 450,
    originalPrice: 550,
    image: "/api/placeholder/300/300",
    category: "Bath & Body",
    rating: 4.8,
    reviewCount: 34,
    stock: 15,
    tags: ["Organic", "Handmade", "Vegan"],
    isFeatured: true
  },
  {
    id: 2,
    vendorId: "eco-friendly-store",
    name: "Bamboo Toothbrush Set",
    description: "Eco-friendly bamboo toothbrushes with charcoal-infused bristles. 4-pack.",
    price: 800,
    originalPrice: 1000,
    image: "/api/placeholder/300/300",
    category: "Personal Care",
    rating: 4.6,
    reviewCount: 28,
    stock: 22,
    tags: ["Biodegradable", "Charcoal", "4-pack"],
    isFeatured: true
  },
  {
    id: 3,
    vendorId: "eco-friendly-store",
    name: "Natural Deodorant",
    description: "Aluminum-free natural deodorant with coconut oil and shea butter.",
    price: 650,
    originalPrice: 750,
    image: "/api/placeholder/300/300",
    category: "Personal Care",
    rating: 4.4,
    reviewCount: 19,
    stock: 8,
    tags: ["Natural", "Aluminum-free", "Coconut"],
    isFeatured: false
  },
  {
    id: 4,
    vendorId: "eco-friendly-store",
    name: "Reusable Coffee Cup",
    description: "Insulated reusable coffee cup made from sustainable materials. Keeps drinks hot for hours.",
    price: 1200,
    originalPrice: 1500,
    image: "/api/placeholder/300/300",
    category: "Home & Kitchen",
    rating: 4.9,
    reviewCount: 42,
    stock: 30,
    tags: ["Reusable", "Insulated", "Eco-friendly"],
    isFeatured: true
  },
  {
    id: 5,
    vendorId: "eco-friendly-store",
    name: "Beeswax Food Wraps",
    description: "Sustainable alternative to plastic wrap. Set of 3 different sizes.",
    price: 950,
    originalPrice: 1100,
    image: "/api/placeholder/300/300",
    category: "Zero Waste",
    rating: 4.7,
    reviewCount: 31,
    stock: 12,
    tags: ["Beeswax", "Reusable", "Plastic-free"],
    isFeatured: false
  },
  {
    id: 6,
    vendorId: "eco-friendly-store",
    name: "Organic Cotton Tote Bag",
    description: "Spacious organic cotton tote bag with unique Kenyan design.",
    price: 750,
    originalPrice: 900,
    image: "/api/placeholder/300/300",
    category: "Zero Waste",
    rating: 4.5,
    reviewCount: 25,
    stock: 18,
    tags: ["Organic Cotton", "Reusable", "Local Design"],
    isFeatured: false
  }
]

// Product Card Component
const ProductCard = ({ product }: { product: any }) => {
  const [isLiked, setIsLiked] = useState(false)
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square bg-gray-200 relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              -{discount}%
            </Badge>
          )}
          
          {/* Like Button */}
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Heart 
              className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>

          {/* Featured Badge */}
          {product.isFeatured && (
            <Badge className="absolute bottom-2 left-2 bg-green-500 text-white">
              Featured
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <Badge variant="outline" className="mb-2 text-xs">
            {product.category}
          </Badge>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">KSh {product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                KSh {product.originalPrice}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <span className={`text-xs ${
              product.stock > 10 ? 'text-green-600' : 
              product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {product.stock > 10 ? 'In Stock' : 
               product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

// Vendor Profile Component
const VendorProfile = ({ vendor }: { vendor: any }) => {
  return (
    <Card className="overflow-hidden">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-green-400 to-green-600 relative">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Back Button */}
        <Link 
          href="/marketplace"
          className="absolute top-4 left-4 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {/* Share Button */}
        <Button 
          variant="secondary" 
          size="sm"
          className="absolute top-4 right-4 bg-white/90 hover:bg-white"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Store
        </Button>

        {/* Vendor Avatar */}
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-green-600">
                {vendor.name.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="pt-16 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Vendor Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{vendor.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-gray-900">{vendor.rating}</span>
                  </div>
                  <span className="text-gray-500">({vendor.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-4 leading-relaxed">{vendor.description}</p>

            {/* Vendor Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{vendor.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(vendor.joinedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>{vendor.totalProducts} products</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Verified Vendor</span>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mt-4">
              {vendor.categories.map((category: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Follow Button */}
          <Button className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap">
            Follow Store
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VendorStorePage({ params }: { params: { vendorId: string } }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  const vendor = mockVendorData[params.vendorId as keyof typeof mockVendorData]
  const vendorProducts = mockProducts.filter(product => product.vendorId === params.vendorId)

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-600 mb-4">The vendor store you're looking for doesn't exist.</p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Filter products based on search and category
  const filteredProducts = vendorProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories for filter
  const categories = ["all", ...new Set(vendorProducts.map(product => product.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vendor Profile */}
        <VendorProfile vendor={vendor} />

        {/* Store Content */}
        <div className="mt-8">
          {/* Store Header with Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              <p className="text-gray-600">
                {filteredProducts.length} products available
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedCategory !== "all" 
                  ? "Try adjusting your search or filters"
                  : "No products available in this store"
                }
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}