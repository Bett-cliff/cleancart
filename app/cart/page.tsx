"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { CartItem } from "@/components/cart-item"
import { useCart } from "@/contexts/cart-context"
import { 
  ShoppingCart, 
  Truck, 
  Shield, 
  ArrowRight, 
  CreditCard, 
  Phone,
  Trash2,
  Sparkles 
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CartPage() {
  const { state, dispatch } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [deliveryOption, setDeliveryOption] = useState("standard")

  const deliveryOptions = {
    standard: { price: 200, days: "2-3", name: "Standard Delivery" },
    express: { price: 500, days: "1", name: "Express Delivery" },
    sameDay: { price: 800, days: "Same day", name: "Same Day Delivery" }
  }

  const subtotal = state.total
  const deliveryCost = deliveryOptions[deliveryOption as keyof typeof deliveryOptions].price
  const total = subtotal + deliveryCost

  const applyCoupon = () => {
    // Mock coupon logic
    if (couponCode.toUpperCase() === "CLEAN10") {
      // Apply 10% discount
      return subtotal * 0.1
    }
    if (couponCode.toUpperCase() === "GREEN20") {
      // Apply 20% discount
      return subtotal * 0.2
    }
    return 0
  }

  const discount = applyCoupon()
  const finalTotal = total - discount

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet. Start shopping to discover amazing eco-friendly cleaning supplies!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <Button size="lg" className="gap-2 hover:scale-105 transition-transform duration-200">
                  Start Shopping
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg">
                  Continue Browsing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 animate-in fade-in duration-300">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground mt-2">
              {state.itemCount} item{state.itemCount !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <Button
            variant="outline"
            onClick={clearCart}
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="animate-in slide-in-from-left duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Cart Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {state.items.map((item, index) => (
                    <div 
                      key={item.id}
                      className="animate-in fade-in duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <Card className="animate-in slide-in-from-left duration-500 delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Delivery Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(deliveryOptions).map(([key, option]) => (
                  <label
                    key={key}
                    className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={key}
                      checked={deliveryOption === key}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{option.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.days} business day{option.days === "1" ? "" : "s"}
                      </div>
                    </div>
                    <div className="font-bold text-primary">
                      KSh {option.price.toLocaleString()}
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 animate-in slide-in-from-right duration-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Coupon Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline"
                      onClick={() => applyCoupon()}
                      disabled={!couponCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                  {couponCode && !discount && (
                    <p className="text-sm text-destructive">Invalid coupon code</p>
                  )}
                  {discount > 0 && (
                    <p className="text-sm text-green-600">Coupon applied! Saved KSh {discount.toLocaleString()}</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({state.itemCount} items)</span>
                    <span>KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span>KSh {deliveryCost.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>- KSh {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>KSh {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-3">
                  <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 hover:scale-105 transition-transform duration-200">
                    <Phone className="w-4 h-4" />
                    Pay with M-PESA
                  </Button>
                  
                  <Button variant="outline" className="w-full gap-2 hover:scale-105 transition-transform duration-200">
                    <CreditCard className="w-4 h-4" />
                    Credit/Debit Card
                  </Button>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Secure payment processing</span>
                  </div>
                </div>

                {/* Continue Shopping */}
                <Link href="/marketplace">
                  <Button variant="ghost" className="w-full mt-4">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center animate-in fade-in duration-500 delay-300">
              <div className="space-y-1">
                <Truck className="w-6 h-6 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Fast Delivery</p>
              </div>
              <div className="space-y-1">
                <Shield className="w-6 h-6 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Secure Payment</p>
              </div>
              <div className="space-y-1">
                <Sparkles className="w-6 h-6 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">Eco-Friendly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}