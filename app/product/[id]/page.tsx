"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { useAddToCart } from "@/hooks/use-add-to-cart"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
import {
  Star,
  Heart,
  ShoppingCart,
  MapPin,
  CheckCircle,
  Scale,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Share2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useWishlist } from "@/contexts/wishlist-context"
import { useRecentlyViewed } from "@/contexts/recently-viewed-context"
import { useComparison } from "@/contexts/comparison-context"
import { mockProducts, formatPrice, getProductById } from "@/lib/product-utils"
import { Product, ProductVariant } from "@/lib/product-types"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ProductDetailPage() {
  const { toast } = useToast()
  const { addToCart } = useAddToCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToRecentlyViewed } = useRecentlyViewed()
  const { addToComparison, isInComparison } = useComparison()
  
  const params = useParams()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (productId) {
      const foundProduct = getProductById(productId)
      setProduct(foundProduct || null)
      if (foundProduct) {
        setSelectedVariant(foundProduct.variants[0] || null)
        addToRecentlyViewed(productId)
        setLoading(false)
      }
    }
  }, [productId, addToRecentlyViewed])

  const handleAddToWishlist = () => {
    if (!product) return
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: "Product has been removed from your wishlist.",
      })
    } else {
      addToWishlist(product.id)
      toast({
        title: "Added to wishlist!",
        description: "Product has been saved to your wishlist.",
      })
    }
  }

  const handleAddToComparison = () => {
    if (!product) return
    
    addToComparison(product.id)
    toast({
      title: "Added to comparison!",
      description: "Product has been added to comparison list.",
    })
  }

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return
    
    addToCart({
      id: product.id,
      name: product.name,
      price: selectedVariant.price,
      image: product.images[0],
      vendor: product.vendor,
      category: product.category,
      variantId: selectedVariant.id,
      quantity: quantity
    })
    
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleShare = async () => {
    if (!product) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Product link has been copied to clipboard.",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/marketplace">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const finalPrice = selectedVariant?.price || product.price
  const finalOriginalPrice = selectedVariant?.originalPrice || product.originalPrice

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/marketplace" className="hover:text-foreground">Marketplace</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                {product.badges.map((badge, index) => (
                  <Badge key={index} className="text-xs bg-primary/90">
                    {badge}
                  </Badge>
                ))}
                {product.isEcoFriendly && (
                  <Badge className="text-xs bg-green-500">Eco-Friendly</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 relative rounded border-2 overflow-hidden ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Vendor Info */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-muted-foreground">Sold by</span>
                <span className="font-medium">{product.vendor}</span>
                {product.vendorVerified && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{product.location}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} • {product.reviews} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(finalPrice)}
                </span>
                {finalOriginalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(finalOriginalPrice)}
                  </span>
                )}
                {finalOriginalPrice && (
                  <Badge variant="secondary" className="text-sm">
                    Save {formatPrice(finalOriginalPrice - finalPrice)}
                  </Badge>
                )}
              </div>
              {product.shipping.freeShipping && (
                <div className="flex items-center gap-2 text-green-600">
                  <Truck className="w-4 h-4" />
                  <span className="text-sm">Free shipping to Nairobi</span>
                </div>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Select Option:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedVariant?.id === variant.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium">{variant.name}</div>
                        <div className="text-sm">
                          {formatPrice(variant.price)}
                          {variant.originalPrice && (
                            <span className="text-muted-foreground line-through ml-1">
                              {formatPrice(variant.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                    >
                      -
                    </button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {selectedVariant?.stock || product.stock} available
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.stock && !product.stock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleAddToWishlist}
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        isInWishlist(product.id) 
                          ? "fill-red-500 text-red-500" 
                          : ""
                      }`} 
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleAddToComparison}
                  >
                    <Scale className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Shipping & Trust */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-muted-foreground" />
                    <span>Delivery: {product.shipping.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                    <span>Secure Payment</span>
                  </div>
                  {product.shipping.pickupAvailable && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>Pickup Available</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    <span>7-Day Returns</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b">
            <nav className="flex space-x-8">
              {['Description', 'Specifications', 'Reviews', 'Shipping'].map((tab) => (
                <button
                  key={tab}
                  className="py-4 px-1 border-b-2 border-transparent hover:border-muted-foreground text-muted-foreground hover:text-foreground transition-colors"
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {/* Description */}
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold mb-4">Product Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
              
              {/* Specifications */}
              <h3 className="text-xl font-semibold mt-8 mb-4">Specifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              <h3 className="text-xl font-semibold mt-8 mb-4">Shipping & Returns</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>• Delivery within {product.shipping.deliveryTime}</p>
                <p>• {product.shipping.freeShipping ? 'Free shipping available' : 'Shipping costs calculated at checkout'}</p>
                <p>• {product.shipping.pickupAvailable ? 'Pickup available from vendor location' : 'No pickup available'}</p>
                <p>• 7-day return policy for unused items</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t">
        <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Recently viewed products would go here */}
          <div className="text-center text-muted-foreground py-8">
            <Eye className="w-8 h-8 mx-auto mb-2" />
            <p>Your recently viewed products will appear here</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4 sm:px-6 lg:px-8">
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