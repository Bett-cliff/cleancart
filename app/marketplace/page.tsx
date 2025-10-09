"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Star, 
  Package,
  Truck,
  Shield,
  HeadphonesIcon,
  ArrowRight,
  Flame,
  Clock,
  Award,
  ShoppingCart,
  CheckCircle,
  Sparkles,
  Droplets,
  SprayCan,
  Leaf,
  Home,
  Wrench,
  TrendingUp,
  Users,
  Target,
  Zap,
  Filter,
  Heart,
  Eye,
  Share2,
  TruckIcon,
  RotateCcw,
  Crown,
  TrendingDown,
  Calendar,
  MapPin,
  Phone,
  MessageCircle,
  BookOpen,
  BarChart3,
  ShoppingBag,
  UserCheck,
  FileText,
  Calculator,
  Bell,
  Download,
  Settings,
  UsersIcon,
  CreditCard,
  ShieldCheck,
  Menu
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

// Enhanced vendors data with more details
const cleaningVendors = [
  {
    id: "sparkle-pro-clean",
    name: "Sparkle Pro Clean",
    description: "Commercial-grade cleaning supplies for offices, hotels, and institutions",
    rating: 4.8,
    reviewCount: 342,
    location: "Nairobi, Kenya",
    totalProducts: 156,
    categories: ["Commercial Cleaners", "Disinfectants", "Equipment"],
    isVerified: true,
    deliveryTime: "1-2 days",
    specialty: "Commercial Cleaning",
    responseRate: "98%",
    joinedDate: "2022",
    followerCount: "1.2K",
    isPremium: true
  },
  {
    id: "eco-clean-solutions",
    name: "Eco Clean Solutions",
    description: "Eco-friendly cleaning products that are safe for families and the environment",
    rating: 4.9,
    reviewCount: 278,
    location: "Mombasa, Kenya",
    totalProducts: 89,
    categories: ["Eco-Friendly", "Natural Cleaners", "Green Products"],
    isVerified: true,
    deliveryTime: "2-3 days",
    specialty: "Eco-Friendly",
    responseRate: "95%",
    joinedDate: "2021",
    followerCount: "2.4K",
    isPremium: false
  },
  {
    id: "industrial-clean-ke",
    name: "Industrial Clean KE",
    description: "Heavy-duty cleaning equipment and industrial-grade chemicals",
    rating: 4.7,
    reviewCount: 156,
    location: "Nairobi, Kenya",
    totalProducts: 234,
    categories: ["Industrial", "Machines", "Chemicals"],
    isVerified: true,
    deliveryTime: "3-5 days",
    specialty: "Industrial Grade",
    responseRate: "92%",
    joinedDate: "2020",
    followerCount: "3.1K",
    isPremium: true
  },
  {
    id: "home-sparkle-supplies",
    name: "Home Sparkle Supplies",
    description: "Complete range of household cleaning products for everyday use",
    rating: 4.6,
    reviewCount: 432,
    location: "Kisumu, Kenya",
    totalProducts: 187,
    categories: ["Household", "Kitchen", "Bathroom"],
    isVerified: true,
    deliveryTime: "2-4 days",
    specialty: "Household Essentials",
    responseRate: "96%",
    joinedDate: "2023",
    followerCount: "890",
    isPremium: false
  }
]

// Enhanced categories with more data
const cleaningCategories = [
  { name: "All-Purpose Cleaners", icon: SprayCan, color: "text-emerald-600", bgColor: "bg-emerald-50", count: "124 products", trending: true },
  { name: "Disinfectants", icon: Droplets, color: "text-green-600", bgColor: "bg-green-50", count: "89 products", trending: false },
  { name: "Floor Care", icon: Home, color: "text-lime-600", bgColor: "bg-lime-50", count: "67 products", trending: true },
  { name: "Bathroom Cleaners", icon: Droplets, color: "text-teal-600", bgColor: "bg-teal-50", count: "98 products", trending: false },
  { name: "Kitchen Cleaners", icon: Sparkles, color: "text-amber-600", bgColor: "bg-amber-50", count: "112 products", trending: true },
  { name: "Equipment & Tools", icon: Wrench, color: "text-cyan-600", bgColor: "bg-cyan-50", count: "203 products", trending: false },
  { name: "Commercial Grade", icon: Award, color: "text-violet-600", bgColor: "bg-violet-50", count: "45 products", trending: true },
  { name: "Eco-Friendly", icon: Leaf, color: "text-emerald-600", bgColor: "bg-emerald-50", count: "76 products", trending: true }
]

// Enhanced deals with more features
const cleaningDeals = [
  { 
    id: 1, 
    name: "Multi-Surface Cleaner 5L - Professional Grade", 
    originalPrice: 2500, 
    price: 1899, 
    discount: 24, 
    image: "/api/placeholder/200/200", 
    sold: 78, 
    total: 150,
    features: ["5L Concentrate", "All Surfaces", "Professional Grade", "Eco Certified"],
    type: "Cleaner",
    rating: 4.8,
    reviewCount: 124,
    delivery: "Tomorrow",
    isAmazonChoice: true,
    isBestSeller: false,
    stock: "In stock",
    coupon: "SAVE100"
  },
  { 
    id: 2, 
    name: "Hospital-Grade Disinfectant Spray", 
    originalPrice: 3200, 
    price: 2299, 
    discount: 28, 
    image: "/api/placeholder/200/200", 
    sold: 145, 
    total: 200,
    features: ["Kills 99.9% Germs", "5L Bottle", "Fast Acting", "No Rinse"],
    type: "Disinfectant",
    rating: 4.9,
    reviewCount: 89,
    delivery: "Today",
    isAmazonChoice: false,
    isBestSeller: true,
    stock: "Only 5 left",
    coupon: "CLEAN15"
  },
  { 
    id: 3, 
    name: "Professional Microfiber Cloth Set", 
    originalPrice: 1800, 
    price: 1299, 
    discount: 28, 
    image: "/api/placeholder/200/200", 
    sold: 234, 
    total: 300,
    features: ["24 Pieces", "Lint-Free", "Streak-Free", "Machine Washable"],
    type: "Equipment",
    rating: 4.7,
    reviewCount: 267,
    delivery: "Tomorrow",
    isAmazonChoice: true,
    isBestSeller: true,
    stock: "In stock",
    coupon: null
  },
  { 
    id: 4, 
    name: "Floor Polish & Cleaner Concentrate", 
    originalPrice: 2200, 
    price: 1599, 
    discount: 27, 
    image: "/api/placeholder/200/200", 
    sold: 89, 
    total: 150,
    features: ["For All Floors", "5L Bottle", "Shine & Protect", "Quick Dry"],
    type: "Floor Care",
    rating: 4.6,
    reviewCount: 156,
    delivery: "2-3 days",
    isAmazonChoice: false,
    isBestSeller: false,
    stock: "In stock",
    coupon: "FLOOR20"
  }
]

// Recently viewed products (simulated data)
const recentlyViewed = [
  { id: 5, name: "Glass Cleaner Spray", price: 850, image: "/api/placeholder/100/100", viewedAt: "2 hours ago" },
  { id: 6, name: "Antibacterial Wipes", price: 1200, image: "/api/placeholder/100/100", viewedAt: "1 day ago" },
  { id: 7, name: "Carpet Cleaner", price: 2100, image: "/api/placeholder/100/100", viewedAt: "3 days ago" }
]

// Advertisement data
const featuredAds = [
  {
    id: 1,
    title: "Premium Supplier Program",
    description: "Get featured placement and premium visibility for your cleaning products",
    cta: "Join Now",
    badge: "Featured",
    icon: TrendingUp,
    gradient: "from-purple-500 to-pink-500",
    stats: "2.5x more views"
  },
  {
    id: 2,
    title: "Bulk Order Discounts",
    description: "Special wholesale pricing for businesses and institutions",
    cta: "Learn More",
    badge: "Save Up to 30%",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
    stats: "500+ Business Clients"
  },
  {
    id: 3,
    title: "New Product Launch",
    description: "Be the first to list innovative cleaning solutions",
    cta: "List Products",
    badge: "Limited Time",
    icon: Zap,
    gradient: "from-orange-500 to-red-500",
    stats: "Get Early Access"
  }
]

// Navigation items
const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Products", href: "/products", icon: ShoppingBag },
  { name: "Suppliers", href: "/suppliers", icon: Users },
  { name: "Categories", href: "/categories", icon: Package },
  { name: "Deals", href: "/deals", icon: Flame },
  { name: "Sell", href: "/sell", icon: TrendingUp }
]

// Enhanced Vendor Card Component
const VendorCard = ({ vendor }: { vendor: any }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-emerald-100 bg-white">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 relative">
              <Leaf className="w-5 h-5 text-white" />
              {vendor.isPremium && (
                <div className="absolute -top-1 -right-1">
                  <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors">
                {vendor.name}
              </h3>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-600">{vendor.rating} ({vendor.reviewCount})</span>
              </div>
            </div>
          </div>
          {vendor.isVerified && (
            <Badge className="bg-emerald-500 text-white text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {vendor.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
            {vendor.specialty}
          </Badge>
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
            {vendor.responseRate} Response
          </Badge>
          {vendor.isPremium && (
            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
              Premium
            </Badge>
          )}
        </div>

        <div className="space-y-1 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            <span>{vendor.totalProducts} products • {vendor.followerCount} followers</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>Delivery in {vendor.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{vendor.location} • Since {vendor.joinedDate}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/vendor/${vendor.id}/store`} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm py-2">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Visit Store
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Enhanced Deal Card Component with Amazon-style features
const DealCard = ({ deal }: { deal: any }) => {
  const progress = (deal.sold / deal.total) * 100
  
  const typeColors = {
    Cleaner: { bg: "from-emerald-500 to-emerald-600", text: "text-emerald-600" },
    Disinfectant: { bg: "from-green-500 to-green-600", text: "text-green-600" },
    Equipment: { bg: "from-lime-500 to-lime-600", text: "text-lime-600" },
    "Floor Care": { bg: "from-teal-500 to-teal-600", text: "text-teal-600" }
  }
  
  const colors = typeColors[deal.type as keyof typeof typeColors] || typeColors.Cleaner

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 bg-white relative">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        <Badge className="bg-red-500 text-white text-xs">
          -{deal.discount}%
        </Badge>
        {deal.isAmazonChoice && (
          <Badge className="bg-blue-500 text-white text-xs">
            <Crown className="w-3 h-3 mr-1" />
            EcoClean's Choice
          </Badge>
        )}
        {deal.isBestSeller && (
          <Badge className="bg-orange-500 text-white text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Best Seller
          </Badge>
        )}
        {deal.coupon && (
          <Badge className="bg-purple-500 text-white text-xs">
            <TrendingDown className="w-3 h-3 mr-1" />
            Save {deal.coupon}
          </Badge>
        )}
      </div>

      <CardContent className="p-3">
        <Link href={`/product/${deal.id}`}>
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 overflow-hidden border border-gray-200 relative cursor-pointer">
            <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            {/* Stock Status */}
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="text-xs bg-white/90 backdrop-blur-sm">
                {deal.stock}
              </Badge>
            </div>
          </div>
        </Link>

        <div className="space-y-2">
          {/* Rating and Reviews */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium">{deal.rating}</span>
            </div>
            <span className="text-xs text-gray-500">({deal.reviewCount})</span>
            {deal.delivery === "Today" && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <TruckIcon className="w-3 h-3 mr-1" />
                Today
              </Badge>
            )}
          </div>

          <Link href={`/product/${deal.id}`}>
            <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors cursor-pointer">
              {deal.name}
            </h3>
          </Link>
          
          <div className="space-y-1">
            {deal.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                {feature}
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">KSh {deal.price}</span>
            <span className="text-sm text-gray-500 line-through">KSh {deal.originalPrice}</span>
            <span className="text-xs text-red-500 font-semibold">Save KSh {deal.originalPrice - deal.price}</span>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <TruckIcon className="w-3 h-3" />
            <span>Delivery {deal.delivery}</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Sold: {deal.sold}</span>
              <span>Left: {deal.total - deal.sold}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={() => addToCart(deal)}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Link href={`/product/${deal.id}`} className="flex-1">
              <Button variant="outline" className="w-full text-sm">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Recently Viewed Component
const RecentlyViewedCard = ({ product }: { product: any }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 bg-white">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors mb-1">
              {product.name}
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-emerald-600">KSh {product.price}</span>
              <span className="text-xs text-gray-500">{product.viewedAt}</span>
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
              <ShoppingCart className="w-3 h-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Advertisement Card Component
const AdCard = ({ ad }: { ad: any }) => {
  const Icon = ad.icon
  
  return (
    <div className={`bg-gradient-to-r ${ad.gradient} rounded-xl p-6 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer`}>
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
              {ad.badge}
            </Badge>
          </div>
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
        <p className="text-white/90 mb-4 text-sm">{ad.description}</p>
        
        <div className="flex items-center justify-between">
          <Button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold">
            {ad.cta}
          </Button>
          <span className="text-white/80 text-sm font-medium">{ad.stats}</span>
        </div>
      </div>
    </div>
  )
}

// Add to cart function
const addToCart = (product: any) => {
  console.log('Added to cart:', product)
  alert(`Added ${product.name} to cart!`)
}

// Fixed Navbar Component
const FixedNavbar = ({ cartItemsCount }: { cartItemsCount: number }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Fixed Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-lg' 
          : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isScrolled ? 'bg-emerald-600' : 'bg-white/20'
              }`}>
                <Leaf className={`w-5 h-5 ${isScrolled ? 'text-white' : 'text-white'}`} />
              </div>
              <span className={`font-bold text-xl ${
                isScrolled ? 'text-emerald-600' : 'text-white'
              }`}>
                EcoClean
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-1 transition-colors ${
                      isScrolled 
                        ? 'text-gray-700 hover:text-emerald-600' 
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Search Bar (Desktop) */}
              <div className="hidden lg:block relative">
                <Search className={`absolute left-3 top-2.5 h-4 w-4 ${
                  isScrolled ? 'text-gray-400' : 'text-white/70'
                }`} />
                <Input
                  placeholder="Search products..."
                  className={`pl-10 pr-4 py-2 text-sm border-0 focus:ring-2 focus:ring-emerald-300 rounded-full ${
                    isScrolled 
                      ? 'bg-gray-100 text-gray-900 placeholder-gray-500' 
                      : 'bg-white/10 text-white placeholder-white/70 backdrop-blur-sm'
                  }`}
                />
              </div>

              {/* Cart */}
              <Link href="/cart">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`relative ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className={`absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center ${
                      isScrolled 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-white text-emerald-600'
                    }`}>
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              <Button 
                variant="ghost" 
                size="icon"
                className={`${
                  isScrolled 
                    ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Users className="w-5 h-5" />
              </Button>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon"
                className={`md:hidden ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50' 
                    : 'text-white hover:bg-white/20'
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-3">
            <div className="relative">
              <Search className={`absolute left-3 top-2.5 h-4 w-4 ${
                isScrolled ? 'text-gray-400' : 'text-white/70'
              }`} />
              <Input
                placeholder="Search products..."
                className={`pl-10 pr-4 py-2 text-sm border-0 focus:ring-2 focus:ring-emerald-300 rounded-full ${
                  isScrolled 
                    ? 'bg-gray-100 text-gray-900 placeholder-gray-500' 
                    : 'bg-white/10 text-white placeholder-white/70 backdrop-blur-sm'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t ${
            isScrolled ? 'border-emerald-100 bg-white' : 'border-white/20 bg-emerald-600'
          }`}>
            <div className="container mx-auto px-4 py-3">
              <div className="grid grid-cols-2 gap-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                        isScrolled 
                          ? 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600' 
                          : 'text-white hover:bg-white/20'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16"></div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </>
  )
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [cartItemsCount, setCartItemsCount] = useState(3)

  const handleAddToCart = (product: any) => {
    setCartItemsCount(prev => prev + 1)
    addToCart(product)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Fixed Navbar */}
      <FixedNavbar cartItemsCount={cartItemsCount} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">EcoClean Kenya</h1>
            <p className="text-xl mb-6 opacity-90">Kenya's Green Cleaning Supplies Marketplace</p>
            <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
              Source eco-friendly cleaning products, equipment, and supplies from verified green suppliers across Kenya
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search eco-cleaners, natural disinfectants, green equipment..."
                  className="pl-12 pr-4 py-3 text-lg border-0 focus:ring-2 focus:ring-emerald-300 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="absolute right-2 top-1.5 bg-white text-emerald-600 hover:bg-gray-100 rounded-full font-semibold">
                  Search
                </Button>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <Link href="/cart">
                  <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    View Cart ({cartItemsCount})
                  </Button>
                </Link>
                <Link href="/product/commercial-multi-surface-cleaner">
                  <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <Eye className="w-4 h-4 mr-2" />
                    Sample Product
                  </Button>
                </Link>
                <Link href="/vendor/sparkle-pro-clean/store">
                  <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <Users className="w-4 h-4 mr-2" />
                    Sample Vendor
                  </Button>
                </Link>
              </div>
              
              {/* ✅ Advanced Search Filters */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Filter className="w-4 h-4 mr-2" />
                  All Filters
                </Button>
                <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <TruckIcon className="w-4 h-4 mr-2" />
                  Same Day Delivery
                </Button>
                <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Award className="w-4 h-4 mr-2" />
                  Eco Certified
                </Button>
                <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Best Sellers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your existing content remains exactly the same */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ✅ Premium Advertisement Banner */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="text-center lg:text-left mb-6 lg:mb-0">
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm mb-4">
                    🚀 LIMITED TIME OFFER
                  </Badge>
                  <h2 className="text-3xl font-bold mb-2">Become a Featured Supplier</h2>
                  <p className="text-lg opacity-90 mb-4 max-w-2xl">
                    Get your products featured on our homepage and reach thousands of professional buyers across Kenya
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      <span>2.5x More Visibility</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>Premium Badge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Priority Support</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-6">
                    Apply Now
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/20 font-semibold">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Stats Section */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-lg p-6 border border-emerald-100 shadow-sm">
              <Package className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-600 mb-1">1,200+</div>
              <div className="text-sm text-emerald-700">Eco Products</div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-green-100 shadow-sm">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600 mb-1">50+</div>
              <div className="text-sm text-green-700">Green Suppliers</div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-lime-100 shadow-sm">
              <Truck className="w-8 h-8 text-lime-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-lime-600 mb-1">47</div>
              <div className="text-sm text-lime-700">Counties Covered</div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-teal-100 shadow-sm">
              <Award className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-teal-600 mb-1">4.8/5</div>
              <div className="text-sm text-teal-700">Eco Rating</div>
            </div>
          </div>
        </section>

        {/* ✅ Recently Viewed Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
            <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentlyViewed.map((product) => (
              <RecentlyViewedCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ✅ Featured Advertisements */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Supplier Opportunities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Grow your cleaning business with our premium supplier programs and features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </section>

        {/* ✅ Enhanced Categories Section with Trending Badges */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Green Cleaning Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our comprehensive range of eco-friendly and sustainable cleaning supplies
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cleaningCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <div 
                  key={index}
                  className="group text-center p-6 rounded-lg border border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer bg-white relative"
                >
                  {category.trending && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs">
                      Trending
                    </Badge>
                  )}
                  <div className={`w-16 h-16 ${category.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform border`}>
                    <Icon className={`w-8 h-8 ${category.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-emerald-600 block mb-1">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {category.count}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* ✅ Sidebar Advertisement */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-2xl font-bold mb-2">Sell Your Products Here</h3>
                <p className="text-purple-100 mb-4">
                  Join Kenya's fastest-growing cleaning supplies marketplace
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>10,000+ Buyers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>0% Commission*</span>
                  </div>
                </div>
              </div>
              <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold whitespace-nowrap">
                Start Selling Today
              </Button>
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Flash Deals Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full">
              <Flame className="w-5 h-5" />
              <span className="font-bold">GREEN DEALS</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold text-sm">23:59:45</span>
            </div>
            <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 ml-auto">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {cleaningDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </section>

        {/* ✅ Enhanced Featured Vendors Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Award className="w-6 h-6 text-emerald-600" />
              <h2 className="text-3xl font-bold text-gray-900">Trusted Green Suppliers</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Partner with Kenya's most reliable eco-friendly cleaning products suppliers
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cleaningVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </section>

        {/* Quick Navigation Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Navigation</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore different parts of our marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/product/commercial-multi-surface-cleaner">
              <Card className="group hover:shadow-lg transition-all cursor-pointer border-emerald-200 hover:border-emerald-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                    <Eye className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">View Product Page</h3>
                  <p className="text-sm text-gray-600">See a detailed product page with all features</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/vendor/sparkle-pro-clean/store">
              <Card className="group hover:shadow-lg transition-all cursor-pointer border-emerald-200 hover:border-emerald-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                    <Users className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Visit Vendor Store</h3>
                  <p className="text-sm text-gray-600">Explore a complete vendor storefront</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/cart">
              <Card className="group hover:shadow-lg transition-all cursor-pointer border-emerald-200 hover:border-emerald-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                    <ShoppingCart className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">View Shopping Cart</h3>
                  <p className="text-sm text-gray-600">Check out your shopping cart with {cartItemsCount} items</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* ✅ Bottom Advertisement Banner */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Cleaning Business?</h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto">
              Join hundreds of successful suppliers already selling on EcoClean Kenya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-3">
                Become a Supplier
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/20 font-semibold">
                Contact Sales Team
              </Button>
            </div>
            <div className="flex justify-center gap-6 mt-6 text-sm text-orange-100">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Dedicated Support</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Marketing Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Trust Badges with More Features */}
        <section className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-8 mb-12 border border-emerald-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Truck className="w-12 h-12 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Carbon-Neutral Delivery</h3>
              <p className="text-gray-600 text-sm">Same-day & scheduled delivery options</p>
            </div>
            <div className="flex flex-col items-center">
              <Leaf className="w-12 h-12 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Eco Certified</h3>
              <p className="text-gray-600 text-sm">All products meet environmental standards</p>
            </div>
            <div className="flex flex-col items-center">
              <HeadphonesIcon className="w-12 h-12 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Green Experts</h3>
              <p className="text-gray-600 text-sm">24/7 professional cleaning advice</p>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="w-12 h-12 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">30-day money-back guarantee</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}