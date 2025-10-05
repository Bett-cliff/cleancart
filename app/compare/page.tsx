"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { useAddToCart } from "@/hooks/use-add-to-cart"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
import {
  ArrowLeft,
  Trash2,
  ShoppingCart,
  Star,
  CheckCircle,
  X,
  Scale,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useComparison } from "@/contexts/comparison-context"
import { mockProducts, formatPrice, getProductById } from "@/lib/product-utils"
import { Product } from "@/lib/product-types"

export default function ComparePage() {
  const { toast } = useToast()
  const { addToCart } = useAddToCart()
  const { comparisonItems, removeFromComparison, clearComparison } = useComparison()

  const comparisonProducts = comparisonItems
    .map(item => getProductById(item.productId))
    .filter((product): product is Product => product !== undefined)

  if (comparisonProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Scale className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">No Products to Compare</h1>
            <p className="text-muted-foreground mb-6">
              Add products to comparison from the marketplace to see them side by side.
            </p>
            <Link href="/marketplace">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const allSpecifications = Array.from(
    new Set(comparisonProducts.flatMap(p => Object.keys(p.specifications)))
  )

  const allFeatures = Array.from(
    new Set(comparisonProducts.flatMap(p => [
      ...p.badges,
      p.isEcoFriendly ? 'Eco-Friendly' : null,
      p.shipping.freeShipping ? 'Free Shipping' : null,
      p.shipping.pickupAvailable ? 'Pickup Available' : null,
    ].filter(Boolean)))
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Comparison</h1>
            <p className="text-muted-foreground">
              Compare {comparisonProducts.length} product(s) side by side
            </p>
          </div>
          <Button
            variant="outline"
            onClick={clearComparison}
            className="mt-4 sm:mt-0"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Products Row */}
            <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `repeat(${comparisonProducts.length + 1}, 1fr)` }}>
              {/* Header Column */}
              <div className="p-4">
                <h3 className="font-semibold text-lg">Products</h3>
              </div>
              
              {/* Product Cards */}
              {comparisonProducts.map((product) => (
                <Card key={product.id} className="relative">
                  <CardContent className="p-4">
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="text-center">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        width={120}
                        height={120}
                        className="mx-auto mb-4 object-cover rounded-lg"
                      />
                      <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                      
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="text-sm text-muted-foreground">{product.vendor}</span>
                        {product.vendorVerified && (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-1 mb-3">
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
                        <span className="text-xs text-muted-foreground">({product.reviews})</span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="text-xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>

                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.images[0],
                            vendor: product.vendor,
                            category: product.category
                          })
                          toast({
                            title: "Added to cart!",
                            description: `${product.name} has been added to your cart.`,
                          })
                        }}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add to Cart
                      </Button>

                      <Link href={`/product/${product.id}`}>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Specifications</h3>
              
              {allSpecifications.map((spec) => (
                <div 
                  key={spec}
                  className="grid gap-4 py-3 border-b"
                  style={{ gridTemplateColumns: `repeat(${comparisonProducts.length + 1}, 1fr)` }}
                >
                  <div className="font-medium">{spec}</div>
                  {comparisonProducts.map((product) => (
                    <div key={product.id} className="text-muted-foreground">
                      {product.specifications[spec] || '-'}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-4 mt-8">
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              
              {allFeatures.map((feature) => (
                <div 
                  key={feature}
                  className="grid gap-4 py-3 border-b"
                  style={{ gridTemplateColumns: `repeat(${comparisonProducts.length + 1}, 1fr)` }}
                >
                  <div className="font-medium">{feature}</div>
                  {comparisonProducts.map((product) => (
                    <div key={product.id}>
                      {feature === 'Eco-Friendly' ? (
                        <Badge variant={product.isEcoFriendly ? "default" : "outline"}>
                          {product.isEcoFriendly ? 'Yes' : 'No'}
                        </Badge>
                      ) : feature === 'Free Shipping' ? (
                        <Badge variant={product.shipping.freeShipping ? "default" : "outline"}>
                          {product.shipping.freeShipping ? 'Yes' : 'No'}
                        </Badge>
                      ) : feature === 'Pickup Available' ? (
                        <Badge variant={product.shipping.pickupAvailable ? "default" : "outline"}>
                          {product.shipping.pickupAvailable ? 'Yes' : 'No'}
                        </Badge>
                      ) : (
                        <Badge variant={product.badges.includes(feature!) ? "default" : "outline"}>
                          {product.badges.includes(feature!) ? 'Yes' : 'No'}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Shipping */}
            <div className="space-y-4 mt-8">
              <h3 className="text-xl font-semibold mb-4">Shipping & Delivery</h3>
              
              {['Delivery Time', 'Free Shipping', 'Pickup Available'].map((field) => (
                <div 
                  key={field}
                  className="grid gap-4 py-3 border-b"
                  style={{ gridTemplateColumns: `repeat(${comparisonProducts.length + 1}, 1fr)` }}
                >
                  <div className="font-medium">{field}</div>
                  {comparisonProducts.map((product) => (
                    <div key={product.id} className="text-muted-foreground">
                      {field === 'Delivery Time' && product.shipping.deliveryTime}
                      {field === 'Free Shipping' && (product.shipping.freeShipping ? 'Yes' : 'No')}
                      {field === 'Pickup Available' && (product.shipping.pickupAvailable ? 'Yes' : 'No')}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="/marketplace">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
          <Button onClick={clearComparison}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Comparison
          </Button>
        </div>
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