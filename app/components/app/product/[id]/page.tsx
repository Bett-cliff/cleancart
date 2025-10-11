"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  Package,
  Truck,
  Shield,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Clock,
  Users,
  Award,
  Crown
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useCart } from "@/app/contexts/CartContext"
import FixedNavbar from "@/app/components/FixedNavbar"

interface ProductData {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  features: string[]
  type: string
  category: string
  rating: number
  reviewCount: number
  delivery: string
  vendor: string
  stock: string
  coupon: string | null
  sold: number
  total: number
  isAmazonChoice: boolean
  isBestSeller: boolean
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart, cartItemsCount } = useCart()
  const [product, setProduct] = useState<ProductData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const productId = params.id as string
    
    if (productId) {
      // Get product data from localStorage (set by marketplace)
      const productData = localStorage.getItem(`product-${productId}`)
      
      if (productData) {
        setProduct(JSON.parse(productData))
      } else {
        // If no data in localStorage, redirect back to marketplace
        router.push('/marketplace')
      }
      
      setIsLoading(false)
    }
  }, [params.id, router])

  const handleAddToCart = () => {
    if (!product) return
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      vendor: product.vendor,
      delivery: product.delivery,
      image: "/api/placeholder/200/200"
    })
    
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading product details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
              <p className="text-gray-600 mb-6">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/marketplace">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const progress = (product.sold / product.total) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <FixedNavbar cartItemsCount={cartItemsCount} />
      
      {/* Add to Cart Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <CheckCircle className="w-5 h-5 inline mr-2" />
          Added to Cart!
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/marketplace">
            <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Product Image */}
          <Card className="overflow-hidden border-emerald-200">
            <CardContent className="p-0">
              <div className="aspect-square bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <Sparkles className="w-20 h-20 text-white" />
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-red-500 text-white">
                  -{product.discount}% OFF
                </Badge>
                {product.isAmazonChoice && (
                  <Badge className="bg-blue-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    CleanCart's Choice
                  </Badge>
                )}
                {product.isBestSeller && (
                  <Badge className="bg-orange-500 text-white">
                    <Award className="w-3 h-3 mr-1" />
                    Best Seller
                  </Badge>
                )}
                {product.coupon && (
                  <Badge className="bg-purple-500 text-white">
                    Save {product.coupon}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
                <span className="text-gray-600">•</span>
                <span className="text-green-600 font-semibold">{product.stock}</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl font-bold text-gray-900">KSh {product.price}</span>
                <span className="text-2xl text-gray-500 line-through">KSh {product.originalPrice}</span>
                <span className="text-lg text-red-500 font-semibold">
                  Save KSh {product.originalPrice - product.price}
                </span>
              </div>

              {/* Vendor */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <Users className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">
                  Sold by <span className="font-semibold">{product.vendor}</span>
                </span>
              </div>
            </div>

            {/* Features */}
            <Card className="border-emerald-100">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Product Features</h3>
                <div className="space-y-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress Bar */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <span>Sold: {product.sold}</span>
                  <span>Left: {product.total - product.sold}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Hurry! {product.total - product.sold} items left at this price
                </p>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Delivery {product.delivery}</p>
                    <p className="text-sm text-gray-600">Free shipping on orders over KSh 5,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 text-lg font-semibold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart - KSh {product.price}
              </Button>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Quality Assured</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-gray-200">
                <Clock className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Fast Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}