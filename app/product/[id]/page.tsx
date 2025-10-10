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
import { useState } from "react"
import { useCart } from "@/app/contexts/CartContext"
import FixedNavbar from "@/app/components/FixedNavbar"

// Sample product data - in real app, this would come from API
const productData = {
  id: 1,
  name: "Multi-Surface Cleaner 5L - Professional Grade",
  description: "Professional-grade multi-surface cleaner that effectively removes dirt, grime, and stains from all surfaces. Eco-certified and safe for families and pets.",
  price: 1899,
  originalPrice: 2500,
  discount: 24,
  images: [
    "/api/placeholder/600/600",
    "/api/placeholder/600/600",
    "/api/placeholder/600/600",
    "/api/placeholder/600/600"
  ],
  vendor: {
    id: "sparkle-pro-clean",
    name: "Sparkle Pro Clean",
    rating: 4.8,
    reviewCount: 342,
    location: "Nairobi, Kenya",
    isVerified: true,
    isPremium: true
  },
  category: "Cleaner",
  features: [
    "5L Concentrate - Makes 25L of cleaning solution",
    "All Surfaces - Safe for tiles, wood, glass, and stainless steel",
    "Professional Grade - Commercial cleaning strength",
    "Eco Certified - Environmentally friendly formula",
    "Streak-Free - Leaves surfaces sparkling clean",
    "Quick Dry - No residue left behind"
  ],
  specifications: {
    volume: "5 Liters",
    coverage: "Up to 2500 sq ft",
    dilution: "1:4 ratio with water",
    scent: "Fresh Lemon",
    packaging: "HDPE Plastic Bottle",
    shelfLife: "24 months"
  },
  rating: 4.8,
  reviewCount: 124,
  sold: 78,
  stock: "In stock",
  delivery: "Tomorrow",
  isAmazonChoice: true,
  isBestSeller: false,
  coupon: "SAVE100"
}

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

// Related products
const relatedProducts = [
  {
    id: 2,
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
    id: 3,
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
    id: 4,
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

export default function ProductPage({ params }: { params: { id: string } }) {
  const { cartItemsCount, addToCart } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [showNotification, setShowNotification] = useState(false)

  const product = productData // In real app, fetch by params.id

  const handleAddToCart = () => {
    // Create product object with all necessary details for cart
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      vendor: product.vendor.name,
      type: product.category,
      features: product.features,
      delivery: product.delivery,
      stock: product.stock
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
              <p className="text-emerald-600 font-bold text-sm">Qty: {quantity} • KSh {product.price * quantity}</p>
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
          <Link href="/categories/cleaners" className="hover:text-emerald-600 transition-colors">
            Cleaners
          </Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl overflow-hidden border border-emerald-200">
              <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === index 
                      ? "border-emerald-500 ring-2 ring-emerald-200" 
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                  </div>
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
                {product.isAmazonChoice && (
                  <Badge className="bg-blue-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    EcoClean's Choice
                  </Badge>
                )}
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
                  {product.sold} sold
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{product.stock}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>Delivery {product.delivery}</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-emerald-600">
                KSh {product.price}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-2xl text-gray-500 line-through">
                    KSh {product.originalPrice}
                  </span>
                  <Badge className="bg-red-500 text-white text-lg">
                    Save {product.discount}%
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
                        href={`/vendor/${product.vendor.id}/store`}
                        className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                      >
                        {product.vendor.name}
                      </Link>
                      {product.vendor.isVerified && (
                        <Badge className="bg-emerald-500 text-white text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {product.vendor.isPremium && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span>{product.vendor.rating} ({product.vendor.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{product.vendor.location}</span>
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
                {product.features.map((feature, index) => (
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
                  Total: <span className="font-semibold text-emerald-600">KSh {product.price * quantity}</span>
                </span>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 text-lg font-semibold"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart ({quantity})
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
                  {product.features.map((feature, index) => (
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
                {Object.entries(product.specifications).map(([key, value]) => (
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
                          <h3 className="text-xl font-bold text-gray-900">{product.vendor.name}</h3>
                          {product.vendor.isVerified && (
                            <Badge className="bg-emerald-500 text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified Supplier
                            </Badge>
                          )}
                          {product.vendor.isPremium && (
                            <Badge className="bg-yellow-500 text-white">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{product.vendor.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span>{product.vendor.rating} ({product.vendor.reviewCount} reviews)</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Professional cleaning supplies supplier with over 5 years of experience. 
                          Specialized in eco-friendly and commercial-grade cleaning products.
                        </p>
                        <div className="flex gap-3">
                          <Link href={`/vendor/${product.vendor.id}/store`}>
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
                      <span className="text-lg font-bold text-emerald-600">KSh {relatedProduct.price}</span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">KSh {relatedProduct.originalPrice}</span>
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