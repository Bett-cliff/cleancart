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
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  CreditCard,
  Lock,
  Package,
  Flame  // ← ADD THIS IMPORT
} from "lucide-react"
import Link from "next/link"
import { useCart } from "@/app/contexts/CartContext"
import FixedNavbar from "@/app/components/FixedNavbar"
import { useState } from "react"

// Cart Item Component
const CartItem = ({ item }: { item: any }) => {
  const { updateQuantity, removeFromCart } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(item.id, newQuantity)
  }

  const increment = () => handleQuantityChange(item.quantity + 1)
  const decrement = () => handleQuantityChange(item.quantity - 1)

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Product Image */}
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-8 h-8 text-emerald-600" />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Sold by: {item.vendor}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(item.id)}
                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrement}
                  disabled={item.quantity <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 h-8 text-center text-sm"
                  min="1"
                />
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={increment}
                  className="h-8 w-8"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">
                  KSh {(item.price * item.quantity).toLocaleString()}
                </p>
                {item.quantity > 1 && (
                  <p className="text-xs text-gray-500">
                    KSh {item.price.toLocaleString()} each
                  </p>
                )}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Truck className="w-3 h-3" />
              <span>Delivery {item.delivery}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Empty Cart State
const EmptyCart = () => (
  <Card className="border-emerald-100 bg-emerald-50">
    <CardContent className="p-8 text-center">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingCart className="w-8 h-8 text-emerald-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        Start shopping for eco-friendly cleaning supplies and add items to your cart
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline">
            Browse All Products
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
)

export default function CartPage() {
  const { state, clearCart, cartItemsCount } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  // Add safe access to state properties
  const items = state?.items || []
  const total = state?.total || 0
  const itemCount = state?.itemCount || 0

  const deliveryFee = total > 5000 ? 0 : 300 // Free delivery over KSh 5000
  const tax = total * 0.14 // 14% VAT
  const grandTotal = total + deliveryFee + tax

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    
    setIsApplyingCoupon(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsApplyingCoupon(false)
    // Coupon logic would go here
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <EmptyCart />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <FixedNavbar cartItemsCount={cartItemsCount} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">
              {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            {/* Trust Badges */}
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <Truck className="w-8 h-8 text-emerald-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Free Delivery</span>
                    <span className="text-xs text-gray-600">Over KSh 5,000</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Shield className="w-8 h-8 text-emerald-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Secure Payment</span>
                    <span className="text-xs text-gray-600">100% Protected</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <RotateCcw className="w-8 h-8 text-emerald-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">Easy Returns</span>
                    <span className="text-xs text-gray-600">30 Day Policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-gray-200 sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-medium">KSh {total.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className={deliveryFee === 0 ? "text-green-600 font-medium" : "font-medium"}>
                      {deliveryFee === 0 ? "FREE" : `KSh ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (14% VAT)</span>
                    <span className="font-medium">KSh {tax.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="text-emerald-600">KSh {grandTotal.toLocaleString()}</span>
                  </div>

                  {deliveryFee > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                      <p className="text-xs text-amber-800">
                        Add KSh {(5000 - total).toLocaleString()} more for FREE delivery!
                      </p>
                    </div>
                  )}
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      variant="outline"
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-semibold">
                    <Lock className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  <span>Secure SSL Encryption</span>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Continue Shopping</h4>
                <div className="space-y-2">
                  <Link href="/">
                    <Button variant="outline" className="w-full justify-start">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Homepage
                    </Button>
                  </Link>
                  <Link href="/deals">
                    <Button variant="outline" className="w-full justify-start">
                      <Flame className="w-4 h-4 mr-2" />
                      View Hot Deals
                    </Button>
                  </Link>
                  <Link href="/categories">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Browse Categories
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}