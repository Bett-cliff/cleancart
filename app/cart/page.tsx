// app/cart/page.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Heart, 
  Shield, 
  Truck, 
  RotateCcw,
  ArrowRight,
  ChevronRight,
  MapPin,
  Clock,
  Package,
  CreditCard,
  Lock,
  Sparkles,
  Crown,
  Zap,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock cart data
const cartItems = [
  {
    id: 1,
    productId: "commercial-multi-surface-cleaner",
    name: "Commercial Multi-Surface Cleaner Concentrate - 5L",
    price: 1899,
    originalPrice: 2500,
    quantity: 2,
    image: "/api/placeholder/100/100",
    vendor: "Sparkle Pro Clean",
    delivery: "1-2 days",
    stock: 15,
    maxQuantity: 5,
    isEcoFriendly: true,
    isBestSeller: true
  },
  {
    id: 2,
    productId: "professional-microfiber-cloths",
    name: "Professional Microfiber Cloth Set - 24pcs",
    price: 1299,
    originalPrice: 1800,
    quantity: 1,
    image: "/api/placeholder/100/100",
    vendor: "Sparkle Pro Clean",
    delivery: "Tomorrow",
    stock: 25,
    maxQuantity: 10,
    isEcoFriendly: true,
    isBestSeller: true
  },
  {
    id: 3,
    productId: "spray-bottle-set",
    name: "Professional Spray Bottle Set - 3pcs",
    price: 899,
    originalPrice: 1200,
    quantity: 1,
    image: "/api/placeholder/100/100",
    vendor: "Eco Clean Solutions",
    delivery: "2-3 days",
    stock: 8,
    maxQuantity: 5,
    isEcoFriendly: true,
    isBestSeller: false
  }
]

// Recommended products
const recommendedProducts = [
  {
    id: 4,
    name: "Heavy-Duty Degreaser Concentrate",
    price: 2199,
    image: "/api/placeholder/120/120",
    rating: 4.5,
    delivery: "Tomorrow"
  },
  {
    id: 5,
    name: "Glass Cleaner Concentrate",
    price: 1499,
    image: "/api/placeholder/120/120",
    rating: 4.7,
    delivery: "1-2 days"
  },
  {
    id: 6,
    name: "Floor Polish & Cleaner",
    price: 1599,
    image: "/api/placeholder/120/120",
    rating: 4.6,
    delivery: "2-3 days"
  }
]

export default function CartPage() {
  const [items, setItems] = useState(cartItems)
  const [couponCode, setCouponCode] = useState("")

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = items.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0)
  const shipping = subtotal > 10000 ? 0 : 300
  const tax = subtotal * 0.16 // 16% VAT
  const total = subtotal + shipping + tax

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) }
        : item
    ))
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const applyCoupon = () => {
    // Coupon logic would go here
    alert(`Coupon code "${couponCode}" applied!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Link href="/marketplace" className="hover:text-emerald-600">Marketplace</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900">Cart ({items.length} items)</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {items.length} items
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any cleaning supplies to your cart yet. Explore our marketplace to find professional cleaning products.
            </p>
            <Link href="/marketplace">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Cart Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Cart Items ({items.length})</h2>
                <Button variant="outline" className="text-emerald-600 border-emerald-600 hover:bg-emerald-50">
                  Save for Later
                </Button>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="border-l-4 border-l-emerald-500">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg border flex items-center justify-center relative">
                            <Sparkles className="w-8 h-8 text-emerald-500" />
                            {item.isBestSeller && (
                              <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs">
                                <Crown className="w-3 h-3 mr-1" />
                                Best Seller
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex-1">
                              <Link 
                                href={`/product/${item.productId}`}
                                className="font-semibold text-gray-900 hover:text-emerald-600 line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-gray-600">Sold by:</span>
                                <Link 
                                  href={`/vendor/${item.vendor.toLowerCase().replace(/\s+/g, '-')}/store`}
                                  className="text-sm text-emerald-600 hover:underline"
                                >
                                  {item.vendor}
                                </Link>
                              </div>
                              
                              {/* Badges */}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.isEcoFriendly && (
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Eco Friendly
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  <Truck className="w-3 h-3 mr-1" />
                                  Delivery {item.delivery}
                                </Badge>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-xl font-bold text-emerald-600">KSh {item.price}</div>
                              <div className="text-sm text-gray-500 line-through">KSh {item.originalPrice}</div>
                              <div className="text-sm text-red-500 font-semibold">
                                Save KSh {item.originalPrice - item.price}
                              </div>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-gray-700">Quantity:</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.maxQuantity}
                                  className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="text-sm text-gray-500">
                                Max: {item.maxQuantity}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Heart className="w-4 h-4 mr-1" />
                                Save
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="flex justify-between items-center mt-3 pt-3 border-t">
                            <span className="text-sm text-gray-600">Item total:</span>
                            <span className="text-lg font-bold text-emerald-600">
                              KSh {item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link href="/marketplace">
                  <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    ← Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Order Summary Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    
                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal ({items.length} items)</span>
                        <span>KSh {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Discount</span>
                        <span className="text-green-600">-KSh {discount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span>{shipping === 0 ? 'FREE' : `KSh ${shipping}`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax (16% VAT)</span>
                        <span>KSh {tax.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center border-t pt-3 mb-4">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        KSh {total.toLocaleString()}
                      </span>
                    </div>

                    {/* Free Shipping Progress */}
                    {subtotal < 10000 && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-700">
                            Add KSh {(10000 - subtotal).toLocaleString()} for FREE shipping!
                          </span>
                        </div>
                        <div className="w-full bg-emerald-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(subtotal / 10000) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Checkout Button */}
                    <Link href="/checkout">
                      <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 text-lg font-semibold mb-4">
                        Proceed to Checkout
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>

                    {/* Security Badges */}
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span>Secure</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Lock className="w-4 h-4" />
                        <span>Encrypted</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <RotateCcw className="w-4 h-4" />
                        <span>Returns</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Coupon Code */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">Apply Coupon Code</h4>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={applyCoupon}
                        variant="outline"
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Features */}
                <Card className="border-emerald-200 bg-emerald-50">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="font-medium">Free Shipping</div>
                          <div className="text-sm text-emerald-700">On orders over KSh 10,000</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <RotateCcw className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="font-medium">Easy Returns</div>
                          <div className="text-sm text-emerald-700">30-day return policy</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div className="font-medium">Secure Payment</div>
                          <div className="text-sm text-emerald-700">Your data is protected</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Products */}
        {items.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Frequently Bought Together</h2>
              <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs font-medium">{product.rating}</span>
                          </div>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            <Truck className="w-3 h-3 mr-1" />
                            {product.delivery}
                          </Badge>
                        </div>
                        <div className="text-lg font-bold text-emerald-600 mb-3">
                          KSh {product.price}
                        </div>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
