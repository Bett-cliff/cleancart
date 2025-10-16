"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  Star,
  CheckCircle,
  Sparkles,
  Leaf,
  Store,
  MapPin,
  Clock,
  Award,
  Crown,
  Users,
  Package,
  Eye,
  Plus,
  Minus,
  MessageCircle,
  Phone,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCart } from "@/app/contexts/CartContext"
import FixedNavbar from "@/app/components/FixedNavbar"
import { fetchProductById, type Product as ApiProduct } from "@/lib/api"

// Sample reviews data
const reviews = [
  {
    id: 1,
    user: "Sarah K.",
    rating: 5,
    date: "2024-01-15",
    comment: "This cleaner is amazing! My floors have never been this shiny. The lemon scent is refreshing and not overwhelming.",
    verified: true
  },
  {
    id: 2,
    user: "Mike T.",
    rating: 4,
    date: "2024-01-12",
    comment: "Great value for money. The 5L bottle lasts forever. Only giving 4 stars because the cap is a bit hard to open.",
    verified: true
  },
  {
    id: 3,
    user: "Grace W.",
    rating: 5,
    date: "2024-01-10",
    comment: "Eco-friendly and effective! I love that it's safe for my kids and pets. Will definitely buy again.",
    verified: false
  }
]

// Related products - will be fetched from database
const relatedProducts = [
  {
    id: "2",
    name: "Hospital-Grade Disinfectant Spray",
    price: 2299,
    originalPrice: 3200,
    image: "/api/placeholder/200/200",
    vendor: "Eco Clean Solutions",
    rating: 4.9,
    type: "Disinfectant",
    features: ["Kills 99.9% Germs", "5L Bottle", "Fast Acting"],
    delivery: "Today",
    stock: "Only 5 left"
  },
  {
    id: "3",
    name: "Professional Microfiber Cloth Set",
    price: 1299,
    originalPrice: 1800,
    image: "/api/placeholder/200/200",
    vendor: "Industrial Clean KE",
    rating: 4.7,
    type: "Equipment",
    features: ["24 Pieces", "Lint-Free", "Machine Washable"],
    delivery: "Tomorrow",
    stock: "In stock"
  },
  {
    id: "4",
    name: "Glass Cleaner Spray",
    price: 850,
    image: "/api/placeholder/200/200",
    vendor: "Sparkle Pro Clean",
    rating: 4.6,
    type: "Cleaner",
    features: ["Streak-Free", "Quick Dry", "All Glass Surfaces"],
    delivery: "Tomorrow",
    stock: "In stock"
  }
]

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  features: string[];
  vendor: string;
  inStock: boolean;
  sold?: number;
  delivery?: string;
  coupon?: string;
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const { cartItemsCount, addToCart } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [showNotification, setShowNotification] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProductData()
  }, [params.id])

  const loadProductData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Loading product data for ID:', params.id)
      
      // Try to fetch from localStorage first (for backward compatibility)
      const localStorageData = localStorage.getItem('currentProduct')
      if (localStorageData) {
        console.log('📦 Found product in localStorage')
        const parsedProduct = JSON.parse(localStorageData)
        setProduct(parsedProduct)
        setLoading(false)
        return
      }

      // Fetch from MongoDB database
      console.log('🗄️ Fetching from MongoDB database...')
      const response = await fetchProductById(params.id)
      
      if (response.success && response.product) {
        console.log('✅ Product fetched from database:', response.product)
        
        // Transform MongoDB product to frontend format
        const transformedProduct: Product = {
          id: response.product._id,
          name: response.product.name,
          price: response.product.price,
          originalPrice: response.product.originalPrice || Math.round(response.product.price * 1.3), // Add 30% as original price
          description: response.product.description || "Professional-grade cleaning product that effectively removes dirt, grime, and stains. Eco-certified and safe for families and pets.",
          image: response.product.image || "/api/placeholder/400/400",
          category: response.product.category,
          rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5-5.0
          reviewCount: Math.floor(Math.random() * 300) + 50, // Random reviews 50-350
          features: getFeaturesForCategory(response.product.category),
          vendor: getVendorForProduct(response.product),
          inStock: response.product.inStock !== false, // Default to true if not specified
          sold: Math.floor(Math.random() * 200) + 50, // Random sold count
          delivery: getRandomDelivery(),
          coupon: Math.random() > 0.7 ? "SAVE100" : undefined // 30% chance of coupon
        }
        
        setProduct(transformedProduct)
        
        // Also store in localStorage for quick access
        localStorage.setItem('currentProduct', JSON.stringify(transformedProduct))
      } else {
        throw new Error('Product not found in database')
      }
    } catch (err) {
      console.error('❌ Error loading product data:', err)
      setError('Failed to load product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Helper functions
  const getFeaturesForCategory = (category: string): string[] => {
    const featuresMap: { [key: string]: string[] } = {
      "industrial-equipment": [
        "Professional Grade", 
        "Heavy Duty", 
        "Commercial Use", 
        "Durable Construction",
        "High Performance"
      ],
      "household-cleaners": [
        "All-Purpose Cleaning", 
        "Safe for Families", 
        "Effective Formula", 
        "Easy to Use",
        "Pleasant Scent"
      ],
      "eco-friendly": [
        "Eco-Friendly Formula", 
        "Biodegradable", 
        "Natural Ingredients", 
        "Sustainable",
        "Non-Toxic"
      ]
    }
    return featuresMap[category] || ["Quality", "Reliable", "Effective"]
  }

  const getVendorForProduct = (product: ApiProduct): string => {
    const vendors = [
      'CleanTech Solutions', 'PowerClean Kenya', 'FloorMaster Pro', 
      'EcoSteam Ltd', 'CarpetCare Pro', 'WindowShine Co',
      'RoboClean Africa', 'IndustrialClean Ltd', 'UltraClean Tech'
    ]
    return vendors[Math.floor(Math.random() * vendors.length)]
  }

  const getRandomDelivery = (): string => {
    const options = ["Today", "Tomorrow", "2-3 days"]
    return options[Math.floor(Math.random() * options.length)]
  }

  const handleAddToCart = () => {
    if (!product) return

    // Create product object with all necessary details for cart
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      vendor: product.vendor,
      type: product.category,
      features: product.features,
      delivery: product.delivery || "Tomorrow",
      stock: product.inStock ? "In stock" : "Out of stock"
    }

    // Add to cart with the specified quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(productToAdd)
    }
    
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? "text-yellow-400 fill-yellow-400" 
            : "text-gray-300"
        }`}
      />
    ))
  }

  // Default vendor data
  const defaultVendor = {
    id: "default-vendor",
    name: "EcoClean Supplies",
    rating: 4.8,
    reviewCount: 342,
    location: "Nairobi, Kenya",
    isVerified: true,
    isPremium: true
  }

  // Default specifications
  const defaultSpecifications = {
    volume: "5 Liters",
    coverage: "Up to 2500 sq ft",
    dilution: "1:4 ratio with water",
    scent: "Fresh Lemon",
    packaging: "HDPE Plastic Bottle",
    shelfLife: "24 months"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Product</h2>
            <p className="text-gray-600">Fetching product details from database...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">
              {error || "The product you're looking for doesn't exist in our database."}
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/marketplace" 
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Back to Marketplace
              </Link>
              <Button 
                onClick={loadProductData}
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const vendor = {
    ...defaultVendor,
    name: product.vendor || defaultVendor.name
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <FixedNavbar cartItemsCount={cartItemsCount} />
      
      {/* Add to Cart Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 bg-white border border-emerald-200 rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-right-5 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">Added to Cart!</p>
              <p className="text-gray-600 text-xs truncate">{product.name}</p>
              <p className="text-emerald-600 font-bold text-sm">Qty: {quantity} • KSh {(product.price * quantity).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Marketplace Button */}
        <div className="mb-6">
          <Link href="/marketplace">
            <Button variant="ghost" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Button>
          </Link>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/marketplace" className="hover:text-emerald-600 transition-colors">
            Marketplace
          </Link>
          <span>›</span>
          <Link href={`/marketplace?category=${product.category}`} className="hover:text-emerald-600 transition-colors">
            {product.category}
          </Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl overflow-hidden border border-emerald-200">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === index 
                      ? "border-emerald-500 ring-2 ring-emerald-200" 
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-emerald-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  {product.category}
                </Badge>
                <Badge className="bg-blue-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  CleanCart's Choice
                </Badge>
                {product.coupon && (
                  <Badge className="bg-purple-500 text-white">
                    Save {product.coupon}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600 ml-1">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-green-600 font-semibold">
                  {product.sold || 78} sold
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{product.inStock ? "In stock" : "Out of stock"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>Delivery {product.delivery || "Tomorrow"}</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-emerald-600">
                KSh {product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-2xl text-gray-500 line-through">
                    KSh {product.originalPrice.toLocaleString()}
                  </span>
                  <Badge className="bg-red-500 text-white text-lg">
                    Save {discount}%
                  </Badge>
                </>
              )}
            </div>

            {/* Vendor Info */}
            <Card className="border-emerald-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link 
                        href={`/vendor/${vendor.id}/store`}
                        className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                      >
                        {vendor.name}
                      </Link>
                      {vendor.isVerified && (
                        <Badge className="bg-emerald-500 text-white text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {vendor.isPremium && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span>{vendor.rating} ({vendor.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{vendor.location}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features && product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={decreaseQuantity}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={increaseQuantity}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <span className="text-sm text-gray-600">
                  Total: <span className="font-semibold text-emerald-600">KSh {(product.price * quantity).toLocaleString()}</span>
                </span>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.inStock ? `Add to Cart (${quantity})` : 'Out of Stock'}
                </Button>
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs text-gray-600">1 Year Warranty</div>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs text-gray-600">30-Day Returns</div>
              </div>
              <div className="text-center">
                <Leaf className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs text-gray-600">Eco Certified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: "description", name: "Description" },
                { id: "specifications", name: "Specifications" },
                { id: "reviews", name: `Reviews (${reviews.length})` },
                { id: "vendor", name: "Vendor Info" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.features && product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(defaultSpecifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-1">{product.rating}</div>
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(product.rating)}
                    </div>
                    <div className="text-sm text-gray-600">{product.reviewCount} reviews</div>
                  </div>
                  <div className="flex-1">
                    {/* Rating breakdown would go here */}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="font-semibold text-gray-900">{review.user}</span>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{review.comment}</p>
                        <div className="text-sm text-gray-500">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "vendor" && (
              <div className="space-y-6">
                <Card className="border-emerald-100">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                        <Store className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{vendor.name}</h3>
                          {vendor.isVerified && (
                            <Badge className="bg-emerald-500 text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified Supplier
                            </Badge>
                          )}
                          {vendor.isPremium && (
                            <Badge className="bg-yellow-500 text-white">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{vendor.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span>{vendor.rating} ({vendor.reviewCount} reviews)</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Professional cleaning supplies supplier with over 5 years of experience. 
                          Specialized in eco-friendly and commercial-grade cleaning products.
                        </p>
                        <div className="flex gap-3">
                          <Link href={`/vendor/${vendor.id}/store`}>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                              Visit Store
                            </Button>
                          </Link>
                          <Button variant="outline">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact Vendor
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
            <Link href="/marketplace">
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                View All <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group hover:shadow-lg transition-all cursor-pointer border-emerald-100">
                <CardContent className="p-4">
                  <Link href={`/product/${relatedProduct.id}`}>
                    <div className="w-full h-40 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center mb-3">
                      <Sparkles className="w-8 h-8 text-emerald-600" />
                    </div>
                  </Link>
                  <Link href={`/product/${relatedProduct.id}`}>
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors mb-1">
                      {relatedProduct.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <Store className="w-3 h-3" />
                    {relatedProduct.vendor}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(relatedProduct.rating)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-emerald-600">KSh {relatedProduct.price.toLocaleString()}</span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">KSh {relatedProduct.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <Link href={`/product/${relatedProduct.id}`}>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}