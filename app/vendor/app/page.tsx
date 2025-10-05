"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
import { EquipmentSlideshow } from "@/components/equipment-slideshow"
import {
  Search,
  ShoppingCart,
  Users,
  Leaf,
  Smartphone,
  Star,
  ArrowRight,
  CheckCircle,
  Home,
  Factory,
  Trash2,
  Bug,
  Building2,
  Menu,
  X,
  Bell,
  Heart,
  User,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getProducts } from "./services/api"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { toast } = useToast()

  // Replace hardcoded arrays with state
  const [popularCustomerEquipment, setPopularCustomerEquipment] = useState([])
  const [popularVendorEquipment, setPopularVendorEquipment] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        
        // Fetch all products
        const data = await getProducts()
        const allProducts = data.products

        // Transform backend data to match frontend format
        const transformedProducts = allProducts.map((product, index) => ({
          id: product._id || `temp-${index}`,
          name: product.name,
          price: `KSh ${product.price.toLocaleString()}`,
          originalPrice: product.originalPrice ? `KSh ${product.originalPrice.toLocaleString()}` : undefined,
          image: product.image || "/placeholder.svg",
          rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5-5.0
          reviews: Math.floor(Math.random() * 200) + 50, // Random reviews 50-250
          badge: getBadgeForProduct(product),
          vendor: getVendorForProduct(product),
          description: product.description,
          category: product.category
        }))

        // Split products into different sections
        const industrialProducts = transformedProducts.filter(p => 
          p.category === 'industrial-equipment'
        )
        const householdProducts = transformedProducts.filter(p => 
          p.category === 'household-cleaners'
        )
        const ecoProducts = transformedProducts.filter(p => 
          p.category === 'eco-friendly'
        )

        // Set state for different sections
        setPopularCustomerEquipment([
          ...industrialProducts.slice(0, 3),
          ...ecoProducts.slice(0, 1),
          ...householdProducts.slice(0, 2)
        ])
        
        setPopularVendorEquipment([
          ...industrialProducts.slice(3, 6),
          ...householdProducts.slice(2, 4)
        ])
        
        setFeaturedProducts(householdProducts.slice(0, 4))

      } catch (error) {
        console.error('Failed to fetch products:', error)
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [toast])

  // Helper functions
  const getBadgeForProduct = (product) => {
    const badges = {
      'industrial-equipment': ['Popular', 'Professional', 'Heavy Duty', 'Best Seller'],
      'household-cleaners': ['Best Seller', 'Eco Choice', 'Professional', 'New'],
      'eco-friendly': ['Eco-Friendly', 'Sustainable', 'Green Choice']
    }
    const categoryBadges = badges[product.category] || ['Popular']
    return categoryBadges[Math.floor(Math.random() * categoryBadges.length)]
  }

  const getVendorForProduct = (product) => {
    const vendors = [
      'CleanTech Solutions', 'PowerClean Kenya', 'FloorMaster Pro', 
      'EcoSteam Ltd', 'CarpetCare Pro', 'WindowShine Co',
      'RoboClean Africa', 'IndustrialClean Ltd', 'UltraClean Tech',
      'SteamPower Kenya', 'AutoClean Systems', 'DeepClean Pro'
    ]
    return vendors[Math.floor(Math.random() * vendors.length)]
  }

  const addToCart = (productName: string) => {
    toast({
      title: "Added to cart!",
      description: `${productName} has been added to your cart.`,
    })
  }

  const addToWishlist = (productName: string) => {
    toast({
      title: "Added to wishlist!",
      description: `${productName} has been saved to your wishlist.`,
    })
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Image src="/cleancart-logo.png" alt="CleanCart Logo" width={32} height={32} className="w-8 h-8" />
              <span className="text-xl font-bold text-foreground">CleanCart</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
                Home
              </Link>
              <Link href="/marketplace" className="text-foreground hover:text-primary transition-colors font-medium">
                Shop
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium">
                About
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
                Contact
              </Link>
              <Link href="/blog" className="text-foreground hover:text-primary transition-colors font-medium">
                Blog
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-background/95 backdrop-blur animate-in slide-in-from-top-2 duration-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/marketplace"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  Shop
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  Contact
                </Link>
                <Link
                  href="/blog"
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  Blog
                </Link>
                <div className="border-t pt-2 mt-2">
                  <Link href="/auth/login" className="w-full block">
                    <Button variant="outline" size="sm" className="w-full mb-2 bg-transparent">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="w-full block">
                    <Button size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Promotional Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm animate-in fade-in duration-500">
        <span className="font-medium">
          🎉 New Year Sale: Get 20% off all eco-friendly products! Use code: GREEN2024
        </span>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/cleancart-logo.png"
              alt="CleanCart Logo"
              width={120}
              height={120}
              className="w-24 h-24 md:w-30 md:h-30 animate-in zoom-in duration-500 delay-200"
            />
          </div>

          <Badge variant="secondary" className="mb-4 animate-in fade-in duration-500 delay-300">
            <Leaf className="w-3 h-3 mr-1" />
            Kenya's First Eco-Friendly Cleaning Marketplace
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            Clean Supplies,
            <span className="text-primary"> Cleaner Future</span>
          </h1>

          <div className="text-2xl md:text-3xl font-semibold text-primary mb-6 italic animate-in fade-in duration-500 delay-500">
            Keep it clean, keep it green
          </div>

          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto animate-in fade-in duration-500 delay-600">
            Connect with trusted vendors across Kenya for sustainable cleaning supplies. Shop eco-friendly products with
            M-PESA payments and fast delivery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700">
            <Link href="/marketplace">
              <Button size="lg" className="text-lg px-8 hover:scale-105 transition-transform duration-200">
                Start Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/vendor/register">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent hover:scale-105 transition-transform duration-200"
              >
                Become a Vendor
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative animate-in fade-in duration-500 delay-800">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search for cleaning supplies..." className="pl-10 h-12 text-base" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose CleanCart?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're revolutionizing how Kenya shops for cleaning supplies with our eco-friendly marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Eco-Friendly Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover sustainable cleaning products that are safe for your family and the environment
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>M-PESA Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Pay securely with M-PESA, Visa, or MasterCard. Fast, reliable payments you can trust
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Trusted Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Shop from verified vendors across Kenya with transparent ratings and reviews
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Equipment Slideshows */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-16">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading popular equipment...</p>
              </div>
            ) : (
              <EquipmentSlideshow
                title="Popular Equipment - Customer Favorites"
                subtitle="Most purchased cleaning equipment by our customers"
                equipment={popularCustomerEquipment}
                autoPlay={true}
              />
            )}
          </div>

          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading vendor picks...</p>
              </div>
            ) : (
              <EquipmentSlideshow
                title="Top Selling Equipment - Vendor Picks"
                subtitle="Best-selling professional equipment from our trusted vendors"
                equipment={popularVendorEquipment}
                autoPlay={true}
              />
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-lg">Discover our most popular eco-friendly cleaning supplies</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading featured products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 text-xs">{product.badge}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => addToWishlist(product.name)}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-primary">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="text-xs hover:scale-105 transition-transform duration-200"
                        onClick={() => addToCart(product.name)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg">Find exactly what you need from our comprehensive selection</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Household Cleaners", icon: Home },
              { name: "Industrial Equipment", icon: Factory },
              { name: "Eco-Friendly Products", icon: Leaf },
              { name: "Waste Management", icon: Trash2 },
              { name: "Pest Control", icon: Bug },
              { name: "Hospitality Supplies", icon: Building2 },
            ].map((category) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={category.name}
                  className="hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-200">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm">{category.name}</h3>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-primary-foreground/80">Trusted Vendors</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">1,000+</div>
              <div className="text-primary-foreground/80">Products Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-primary-foreground/80">Payment Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-primary-foreground/80">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                For Vendors
              </Badge>
              <h2 className="text-3xl font-bold mb-6">Grow Your Business with CleanCart</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join Kenya's fastest-growing cleaning supplies marketplace. Set up your storefront in under 30 minutes
                and start selling to customers nationwide.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Quick 30-minute storefront setup",
                  "Flexible subscription plans starting free",
                  "Automated M-PESA payouts",
                  "Built-in analytics dashboard",
                  "Marketing and promotional tools",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <Link href="/vendor/register">
                <Button size="lg">
                  Start Selling Today
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="bg-muted/30 rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-8 text-center">Choose Your Plan</h3>
              <div className="grid gap-6">
                {/* Free Plan */}
                <Card className="relative">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">Free Plan</CardTitle>
                    <div className="text-3xl font-bold text-primary">KSh 0</div>
                    <CardDescription>Perfect for getting started</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Up to 10 products</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Basic storefront</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">M-PESA payments</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Email support</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Pro Plan */}
                <Card className="relative border-primary">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">Pro Plan</CardTitle>
                    <div className="text-3xl font-bold text-primary">KSh 2,500</div>
                    <CardDescription>For growing businesses</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Up to 100 products</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Advanced analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Priority support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Marketing tools</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Bulk upload</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Premium Plan */}
                <Card className="relative bg-primary text-primary-foreground">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">Premium Plan</CardTitle>
                    <div className="text-3xl font-bold">KSh 5,000</div>
                    <CardDescription className="text-primary-foreground/80">Everything you need</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      <span className="text-sm">Unlimited products</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      <span className="text-sm">Advanced analytics & reports</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      <span className="text-sm">24/7 phone support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      <span className="text-sm">Custom branding</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      <span className="text-sm">API access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      <span className="text-sm">Dedicated account manager</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground text-lg">Join thousands of satisfied customers and vendors</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Wanjiku",
                role: "Hotel Manager",
                content:
                  "CleanCart has transformed how we source cleaning supplies. The eco-friendly options are exactly what our guests expect.",
                rating: 5,
              },
              {
                name: "David Kimani",
                role: "Cleaning Supplies Vendor",
                content:
                  "Setting up my store was incredibly easy. The M-PESA integration means I get paid instantly. Highly recommended!",
                rating: 5,
              },
              {
                name: "Grace Achieng",
                role: "Homeowner",
                content:
                  "Love the sustainable products available here. Fast delivery and great customer service. Will definitely shop again.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Clean Shopping?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join CleanCart today and discover sustainable cleaning supplies from trusted vendors across Kenya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <Button size="lg" className="text-lg px-8">
                Start Shopping Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

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