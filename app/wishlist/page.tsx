"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Trash2, 
  ShoppingCart, 
  Star, 
  Heart, 
  Scale,
  Package,
  RefreshCw
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCart } from "@/app/contexts/CartContext"
import FixedNavbar from "@/app/components/FixedNavbar"
import { fetchProducts, type Product as ApiProduct } from "@/lib/api"

// Product interface matching our API
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  vendor: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  inStock: boolean;
  features: string[];
}

export default function WishlistPage() {
  const { cartItemsCount, addToCart } = useCart()
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load wishlist from localStorage and fetch product details from MongoDB
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get wishlist product IDs from localStorage
        const wishlistData = localStorage.getItem('cleancart-wishlist')
        const wishlistProductIds = wishlistData ? JSON.parse(wishlistData) : []
        
        if (wishlistProductIds.length === 0) {
          setWishlistItems([])
          setLoading(false)
          return
        }

        console.log('🔄 Loading wishlist products from MongoDB...')
        
        // Fetch all products from MongoDB
        const response = await fetchProducts()
        
        if (response.success && response.products) {
          // Filter products to only include wishlist items
          const wishlistProducts = response.products
            .filter((product: ApiProduct) => wishlistProductIds.includes(product._id))
            .map((product: ApiProduct): Product => ({
              id: product._id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice || Math.round(product.price * 1.3),
              image: product.image || "/api/placeholder/300/300",
              vendor: getVendorForProduct(product),
              category: product.category,
              rating: 4.5 + (Math.random() * 0.5), // Random rating 4.5-5.0
              reviews: Math.floor(Math.random() * 300) + 50, // Random reviews 50-350
              description: product.description || "Professional cleaning product",
              inStock: product.inStock !== false,
              features: getFeaturesForCategory(product.category)
            }))
          
          console.log(`✅ Loaded ${wishlistProducts.length} wishlist items from database`)
          setWishlistItems(wishlistProducts)
        } else {
          throw new Error('Failed to fetch products from database')
        }
      } catch (err) {
        console.error('❌ Error loading wishlist:', err)
        setError('Failed to load wishlist. Please try again.')
        // Fallback to localStorage data if available
        const localWishlist = localStorage.getItem('cleancart-wishlist-data')
        if (localWishlist) {
          console.log('📦 Using localStorage wishlist as fallback')
          setWishlistItems(JSON.parse(localWishlist))
        }
      } finally {
        setLoading(false)
      }
    }

    loadWishlist()
  }, [])

  // Helper functions
  const getVendorForProduct = (product: ApiProduct): string => {
    const vendors = [
      'CleanTech Solutions', 'PowerClean Kenya', 'FloorMaster Pro', 
      'EcoSteam Ltd', 'CarpetCare Pro', 'WindowShine Co',
      'RoboClean Africa', 'IndustrialClean Ltd', 'UltraClean Tech'
    ]
    return vendors[Math.floor(Math.random() * vendors.length)]
  }

  const getFeaturesForCategory = (category: string): string[] => {
    const featuresMap: { [key: string]: string[] } = {
      "industrial-equipment": [
        "Professional Grade", "Heavy Duty", "Commercial Use", "Durable Construction"
      ],
      "household-cleaners": [
        "All-Purpose Cleaning", "Safe for Families", "Effective Formula", "Easy to Use"
      ],
      "eco-friendly": [
        "Eco-Friendly Formula", "Biodegradable", "Natural Ingredients", "Sustainable"
      ]
    }
    return featuresMap[category] || ["Quality", "Reliable", "Effective"]
  }

  const formatPrice = (price: number): string => {
    return `KSh ${price.toLocaleString()}`
  }

  const removeFromWishlist = (productId: string) => {
    try {
      // Remove from localStorage
      const wishlistData = localStorage.getItem('cleancart-wishlist')
      const wishlistProductIds = wishlistData ? JSON.parse(wishlistData) : []
      const updatedWishlist = wishlistProductIds.filter((id: string) => id !== productId)
      localStorage.setItem('cleancart-wishlist', JSON.stringify(updatedWishlist))
      
      // Remove from state
      setWishlistItems(prev => prev.filter(item => item.id !== productId))
      
      console.log('✅ Removed product from wishlist:', productId)
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  const clearWishlist = () => {
    try {
      localStorage.removeItem('cleancart-wishlist')
      localStorage.removeItem('cleancart-wishlist-data')
      setWishlistItems([])
      console.log('✅ Cleared wishlist')
    } catch (error) {
      console.error('Error clearing wishlist:', error)
    }
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      vendor: product.vendor,
      delivery: "Tomorrow",
      image: product.image
    })
  }

  const refreshWishlist = () => {
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 py-8 pt-24">
          <Card className="border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Wishlist</h3>
              <p className="text-gray-600">Fetching your saved items from database...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error && wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 py-8 pt-24">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Wishlist</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={refreshWishlist} className="bg-emerald-600 hover:bg-emerald-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-6">
              Save your favorite eco-friendly cleaning products here to easily find them later.
            </p>
            <Link href="/marketplace">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <FixedNavbar cartItemsCount={cartItemsCount} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {wishlistItems.length} eco-friendly product{wishlistItems.length !== 1 ? 's' : ''} saved for later
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button onClick={refreshWishlist} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={clearWishlist}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border border-gray-200">
              <CardContent className="p-4">
                <div className="relative">
                  {/* Product Image */}
                  <Link href={`/product/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                        <Package className="w-12 h-12 text-emerald-600" />
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        <Badge className="text-xs bg-emerald-500 text-white">
                          {product.category}
                        </Badge>
                        {product.inStock && (
                          <Badge className="text-xs bg-green-500 text-white">
                            In Stock
                          </Badge>
                        )}
                      </div>

                      {/* Remove from Wishlist */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          removeFromWishlist(product.id)
                        }}
                        className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm"
                      >
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </button>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{product.vendor}</span>
                    </div>

                    <div className="flex items-center gap-1">
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
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-bold text-emerald-600">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300"
                      >
                        <Scale className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="/marketplace">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <Button 
            onClick={clearWishlist}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Wishlist
          </Button>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help With Your Wishlist?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Save your favorite eco-friendly cleaning products and compare them later. 
              Your wishlist helps you keep track of products you're interested in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Contact Support
                </Button>
              </Link>
              <Link href="/help">
                <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  View Help Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}