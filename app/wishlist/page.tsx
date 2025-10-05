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
  Heart,
  Share2,
  Scale,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useWishlist } from "@/contexts/wishlist-context"
import { useComparison } from "@/contexts/comparison-context"
import { mockProducts, formatPrice, getProductById } from "@/lib/product-utils"
import { Product } from "@/lib/product-types"

export default function WishlistPage() {
  const { toast } = useToast()
  const { addToCart } = useAddToCart()
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToComparison } = useComparison()

  const wishlistProducts = wishlist
    .map(item => getProductById(item.productId))
    .filter((product): product is Product => product !== undefined)

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Save your favorite products here to easily find them later.
            </p>
            <Link href="/marketplace">
              <Button>
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistProducts.length} item(s) saved for later
            </p>
          </div>
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="mt-4 sm:mt-0"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="relative">
                  {/* Product Image */}
                  <Link href={`/product/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                      </div>

                      {/* Remove from Wishlist */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          removeFromWishlist(product.id)
                        }}
                        className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                      >
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </button>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                      <span className="text-xs text-muted-foreground ml-1">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-bold text-primary">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
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
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          addToComparison(product.id)
                          toast({
                            title: "Added to comparison!",
                            description: "Product added to comparison list.",
                          })
                        }}
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
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <Button onClick={clearWishlist}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Wishlist
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