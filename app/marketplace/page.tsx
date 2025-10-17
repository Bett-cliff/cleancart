"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
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
  Heart,
  Eye,
  TruckIcon,
  RotateCcw,
  Crown,
  MapPin,
  Phone,
  MessageCircle,
  ShoppingBag,
  UserCheck,
  Bell,
  Download,
  UsersIcon,
  CreditCard,
  ShieldCheck,
  Megaphone,
  Rocket,
  BarChart3,
  Calendar,
  Gift,
  TrendingDown,
  FileText,
  Calculator,
  Loader2,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useCart } from "@/app/contexts/CartContext"
import FixedNavbar from "@/app/components/FixedNavbar"
import ProductSearch from "@/app/components/search/ProductSearch"
import { useRouter } from "next/navigation"

// Environment configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Interface for product data
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: string;
  category: string;
  images: string[];
  vendorId: string;
  vendor: {
    _id: string;
    businessName: string;
    businessEmail: string;
    phoneNumber: string;
    location: string;
    isVerified: boolean;
    rating: number;
    reviewCount: number;
    joinedDate: string;
    description: string;
    specialties: string[];
  };
  specifications: Array<{ key: string; value: string }>;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  isEcoFriendly: boolean;
  isFeatured: boolean;
  variants: Array<{
    name: string;
    price: number;
    stock: number;
    sku: string;
    attributes: {
      size?: string;
      color?: string;
    };
  }>;
}

// Interface for transformed product data
interface Deal {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  discount: number;
  image: string;
  sold: number;
  total: number;
  features: string[];
  type: string;
  category: string;
  rating: number;
  reviewCount: number;
  delivery: string;
  vendor: string;
  vendorId: string;
  vendorDetails: {
    businessName: string;
    isVerified: boolean;
    rating: number;
    location: string;
    joinedDate: string;
  };
  isAmazonChoice: boolean;
  isBestSeller: boolean;
  stock: string;
  coupon: string | null;
  isSponsored?: boolean;
  adLabel?: string;
  lastUpdated: string;
}

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

// Enhanced advertisement data
const premiumAds = {
  // Top banner ads
  bannerAds: [
    {
      id: 1,
      title: "🚀 Featured Supplier Spotlight",
      description: "Get premium homepage placement and 2.5x more customer views",
      cta: "Apply Now",
      badge: "LIMITED SPOTS",
      icon: TrendingUp,
      gradient: "from-purple-600 to-pink-600",
      price: "KSh 5,000/week",
      features: ["Homepage Placement", "Premium Badge", "Priority Support"],
      position: "top-banner"
    }
  ],
  
  // Sidebar ads
  sidebarAds: [
    {
      id: 2,
      title: "📈 Boost Your Sales",
      description: "Featured product placement in search results",
      cta: "Learn More",
      badge: "HOT DEAL",
      icon: Zap,
      gradient: "from-orange-500 to-red-500",
      stats: "3x More Clicks"
    },
    {
      id: 3,
      title: "🏆 Verified Supplier",
      description: "Get the trusted verification badge for your store",
      cta: "Get Verified",
      badge: "TRENDING",
      icon: ShieldCheck,
      gradient: "from-blue-500 to-cyan-500",
      stats: "67% More Trust"
    },
    {
      id: 4,
      title: "💰 Special Commission Rates",
      description: "Limited time offer for new suppliers",
      cta: "View Rates",
      badge: "EXCLUSIVE",
      icon: TrendingDown,
      gradient: "from-green-500 to-emerald-500",
      stats: "0% First Month"
    },
    {
      id: 5,
      title: "📊 Sales Analytics Pro",
      description: "Advanced insights for your business growth",
      cta: "Try Free",
      badge: "NEW",
      icon: BarChart3,
      gradient: "from-indigo-500 to-purple-500",
      stats: "Free 30 Days"
    }
  ],
  
  // In-feed ads (disguised as products)
  sponsoredProducts: [
    {
      id: "sponsored-1",
      name: "🌟 SPONSORED: Professional Cleaning Kit",
      originalPrice: 8500,
      price: 5999,
      discount: 29,
      description: "Complete professional cleaning kit with premium tools",
      vendor: "Featured Partner",
      vendorId: "sponsored",
      vendorDetails: {
        businessName: "Featured Partner",
        isVerified: true,
        rating: 4.9,
        location: "Nairobi",
        joinedDate: "2023"
      },
      rating: 4.9,
      reviewCount: 124,
      delivery: "Today",
      isSponsored: true,
      adLabel: "Sponsored",
      features: ["10+ Tools Included", "Professional Grade", "Lifetime Support"],
      lastUpdated: new Date().toISOString()
    }
  ],
  
  // Category-specific ads
  categoryAds: [
    {
      id: 6,
      title: "🏢 Commercial Cleaning Solutions",
      description: "Specialized products for offices, hotels, and institutions",
      cta: "Explore Business",
      badge: "BUSINESS",
      icon: Users,
      gradient: "from-indigo-500 to-purple-500",
      category: "Commercial Grade"
    }
  ],

  // Premium supplier ads
  supplierAds: [
    {
      id: 7,
      title: "💎 Premium Supplier Program",
      description: "Join our exclusive network of top-rated suppliers",
      cta: "Join Now",
      badge: "EXCLUSIVE",
      icon: Crown,
      gradient: "from-amber-500 to-yellow-500",
      benefits: ["Featured Placement", "Dedicated Manager", "Marketing Support"]
    }
  ],

  // Supplier tools ads
  supplierTools: [
    {
      id: 8,
      title: "📦 Bulk Order Management",
      description: "Handle large orders efficiently with our enterprise tools",
      cta: "Get Tools",
      badge: "ENTERPRISE",
      icon: Package,
      gradient: "from-blue-600 to-cyan-600",
      features: ["Bulk Pricing", "Order Tracking", "Inventory Sync"]
    },
    {
      id: 9,
      title: "🎯 Targeted Advertising",
      description: "Reach your ideal customers with precision marketing",
      cta: "Start Campaign",
      badge: "PREMIUM",
      icon: Target,
      gradient: "from-pink-500 to-rose-500",
      features: ["Customer Segmentation", "Performance Analytics", "ROI Tracking"]
    }
  ]
}

// Additional sidebar products to fill white space
const sidebarProducts = [
  {
    id: "sidebar-1",
    name: "Quick-Dry Microfiber Cloths",
    price: 699,
    rating: 4.6,
    delivery: "Tomorrow",
    vendor: "QuickClean Supplies",
    vendorId: "quickclean",
    image: "/api/placeholder/60/60"
  },
  {
    id: "sidebar-2", 
    name: "Eco Dish Soap Refill",
    price: 450,
    rating: 4.8,
    delivery: "Today",
    vendor: "GreenLife Products",
    vendorId: "greenlife",
    image: "/api/placeholder/60/60"
  },
  {
    id: "sidebar-3",
    name: "Stain Remover Pen",
    price: 299,
    rating: 4.4,
    delivery: "Tomorrow", 
    vendor: "Spotless Solutions",
    vendorId: "spotless",
    image: "/api/placeholder/60/60"
  }
]

// Recently viewed products (simulated data)
const recentlyViewed = [
  { 
    id: "9", 
    name: "Glass Cleaner Spray", 
    price: 850, 
    image: "/api/placeholder/100/100", 
    viewedAt: "2 hours ago", 
    vendor: "Sparkle Pro Clean", 
    vendorId: "sparkle-pro-clean",
    type: "Cleaner", 
    features: ["Streak-Free", "Quick Dry"], 
    delivery: "Tomorrow", 
    stock: "In stock" 
  },
  { 
    id: "10", 
    name: "Antibacterial Wipes", 
    price: 1200, 
    image: "/api/placeholder/100/100", 
    viewedAt: "1 day ago", 
    vendor: "Eco Clean Solutions", 
    vendorId: "eco-clean-solutions",
    type: "Disinfectant", 
    features: ["Kills 99.9% Germs", "Biodegradable"], 
    delivery: "Today", 
    stock: "In stock" 
  },
  { 
    id: "11", 
    name: "Carpet Cleaner", 
    price: 2100, 
    image: "/api/placeholder/100/100", 
    viewedAt: "3 days ago", 
    vendor: "Industrial Clean KE", 
    vendorId: "industrial-clean-ke",
    type: "Equipment", 
    features: ["Deep Clean", "Stain Removal"], 
    delivery: "2-3 days", 
    stock: "In stock" 
  }
]

// Fetch products function with real-time updates
const fetchProducts = async (lastUpdate?: string) => {
  try {
    console.log('🔄 Fetching products from API...');
    
    const url = lastUpdate 
      ? `${API_BASE}/api/products?lastUpdate=${lastUpdate}`
      : `${API_BASE}/api/products`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('📦 API Response received');
    
    if (result.success && result.data) {
      console.log(`✅ Loaded ${result.data.length} products from database`);
      return {
        success: true,
        products: result.data,
        lastUpdate: result.lastUpdate || new Date().toISOString()
      };
    } else {
      throw new Error(result.message || 'No products found in response');
    }
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
};

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

// Enhanced Deal Card Component with Cart Integration
const DealCard = ({ deal }: { deal: Deal }) => {
  const { addToCart } = useCart()
  const [showNotification, setShowNotification] = useState(false)
  const router = useRouter()
  
  const progress = (deal.sold / deal.total) * 100
  
  const typeColors = {
    Cleaner: { bg: "from-emerald-500 to-emerald-600", text: "text-emerald-600" },
    Disinfectant: { bg: "from-green-500 to-green-600", text: "text-green-600" },
    Equipment: { bg: "from-lime-500 to-lime-600", text: "text-lime-600" },
    "Floor Care": { bg: "from-teal-500 to-teal-600", text: "text-teal-600" }
  }
  
  const colors = typeColors[deal.type as keyof typeof typeColors] || typeColors.Cleaner

  const handleAddToCart = () => {
    addToCart({
      id: deal.id,
      name: deal.name,
      price: deal.price,
      vendor: deal.vendor,
      vendorId: deal.vendorId,
      delivery: deal.delivery,
      image: deal.image
    })
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
  }

  const handleViewDetails = () => {
    const productData = {
      id: deal.id,
      name: deal.name,
      price: deal.price,
      originalPrice: deal.originalPrice,
      discount: deal.discount,
      description: "Professional-grade cleaning product that effectively removes dirt, grime, and stains. Eco-certified and safe for families and pets.",
      image: deal.image,
      category: deal.category,
      rating: deal.rating,
      reviewCount: deal.reviewCount,
      features: deal.features,
      vendor: deal.vendor,
      vendorId: deal.vendorId,
      vendorDetails: deal.vendorDetails,
      inStock: deal.stock === "In stock" || deal.stock === "Only 5 left" || deal.stock === "Only 3 left",
      sold: deal.sold,
      total: deal.total,
      delivery: deal.delivery,
      coupon: deal.coupon,
      isAmazonChoice: deal.isAmazonChoice,
      isBestSeller: deal.isBestSeller,
      lastUpdated: deal.lastUpdated
    }
    
    console.log('🛒 Navigating to product:', productData.name)
    localStorage.setItem('currentProduct', JSON.stringify(productData))
    router.push(`/product/${deal.id}`)
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 bg-white relative">
      {/* Add to Cart Notification */}
      {showNotification && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
          <CheckCircle className="w-4 h-4 inline mr-2" />
          Added to Cart!
        </div>
      )}

      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        <Badge className="bg-red-500 text-white text-xs">
          -{deal.discount}%
        </Badge>
        {deal.isAmazonChoice && (
          <Badge className="bg-blue-500 text-white text-xs">
            <Crown className="w-3 h-3 mr-1" />
            CleanCart's Choice
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
            Save {deal.coupon}
          </Badge>
        )}
      </div>

      <CardContent className="p-3">
        {/* Vendor Info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-2 h-2 text-white" />
            </div>
            <span className="text-xs font-medium text-emerald-700">{deal.vendor}</span>
          </div>
          {deal.vendorDetails.isVerified && (
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
              Verified
            </Badge>
          )}
        </div>

        {/* Make the entire image area clickable for view details */}
        <div 
          className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 overflow-hidden border border-gray-200 relative cursor-pointer"
          onClick={handleViewDetails}
        >
          <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          {/* Stock Status */}
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="text-xs bg-white/90 backdrop-blur-sm">
              {deal.stock}
            </Badge>
          </div>

          {/* Last Updated */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs bg-black/70 text-white backdrop-blur-sm">
              Updated {getTimeAgo(deal.lastUpdated)}
            </Badge>
          </div>
        </div>

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

          {/* Product Name - Clickable for details */}
          <h3 
            className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors cursor-pointer"
            onClick={handleViewDetails}
          >
            {deal.name}
          </h3>
          
          <div className="space-y-1">
            {deal.features.slice(0, 2).map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                {feature}
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">KSh {deal.price.toLocaleString()}</span>
            <span className="text-sm text-gray-500 line-through">KSh {deal.originalPrice.toLocaleString()}</span>
            <span className="text-xs text-red-500 font-semibold">Save KSh {(deal.originalPrice - deal.price).toLocaleString()}</span>
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

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button 
              onClick={handleViewDetails}
              variant="outline" 
              className="flex-1 text-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Recently Viewed Component with Cart Integration
const RecentlyViewedCard = ({ product }: { product: any }) => {
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      vendor: product.vendor,
      vendorId: product.vendorId,
      delivery: product.delivery,
      image: product.image
    })
  }

  const handleViewDetails = () => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      vendor: product.vendor,
      vendorId: product.vendorId,
      delivery: product.delivery,
      features: product.features,
      stock: product.stock,
      description: "Quality product with excellent performance and reliability.",
      image: product.image,
      category: product.type,
      rating: 4.5,
      reviewCount: 50,
      inStock: product.stock === "In stock"
    }
    
    console.log('🛒 Navigating to product:', productData.name)
    localStorage.setItem('currentProduct', JSON.stringify(productData))
    router.push(`/product/${product.id}`)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 bg-white">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
            onClick={handleViewDetails}
          >
            <Sparkles className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs font-medium text-emerald-700">{product.vendor}</span>
            </div>
            <h4 
              className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors mb-1 cursor-pointer"
              onClick={handleViewDetails}
            >
              {product.name}
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-emerald-600">KSh {product.price.toLocaleString()}</span>
              <span className="text-xs text-gray-500">{product.viewedAt}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={handleViewDetails}
              >
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// NEW: Sponsored Product Card Component
const SponsoredProductCard = ({ product }: { product: any }) => {
  const { addToCart } = useCart()
  const router = useRouter()
  
  const handleViewDetails = () => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      description: product.description,
      vendor: product.vendor,
      vendorId: product.vendorId,
      vendorDetails: product.vendorDetails,
      rating: product.rating,
      reviewCount: product.reviewCount,
      delivery: product.delivery,
      features: product.features,
      image: "/api/placeholder/200/200",
      category: "Sponsored",
      inStock: true,
      isSponsored: true,
      lastUpdated: product.lastUpdated
    }
    
    console.log('🛒 Navigating to product:', productData.name)
    localStorage.setItem('currentProduct', JSON.stringify(productData))
    router.push(`/product/${product.id}`)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 relative">
      {/* Sponsored Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
          <Star className="w-3 h-3 mr-1 fill-white" />
          {product.adLabel}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
            onClick={handleViewDetails}
          >
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 
              className="font-semibold text-gray-900 text-sm cursor-pointer"
              onClick={handleViewDetails}
            >
              {product.name}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs text-gray-600">{product.rating} ({product.reviewCount})</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600 text-xs line-clamp-2">
            {product.description}
          </p>
          
          <div className="space-y-1">
            {product.features.slice(0, 2).map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                <CheckCircle className="w-3 h-3 text-amber-500" />
                {feature}
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">KSh {product.price.toLocaleString()}</span>
            <span className="text-sm text-gray-500 line-through">KSh {product.originalPrice.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <TruckIcon className="w-3 h-3" />
            <span>Delivery {product.delivery}</span>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                vendor: product.vendor,
                vendorId: product.vendorId,
                delivery: product.delivery,
                image: product.image
              })}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button 
              onClick={handleViewDetails}
              variant="outline" 
              className="flex-1 text-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// NEW: Sidebar Ad Component
const SidebarAd = ({ ad }: { ad: any }) => {
  const Icon = ad.icon
  
  return (
    <Card className={`bg-gradient-to-r ${ad.gradient} border-0 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
            {ad.badge}
          </Badge>
          <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
            <Icon className="w-4 h-4" />
          </div>
        </div>
        
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{ad.title}</h3>
        <p className="text-white/80 text-xs mb-3 line-clamp-2">{ad.description}</p>
        
        <div className="flex items-center justify-between">
          <Button className="bg-white text-gray-900 hover:bg-gray-100 text-xs h-8 px-3">
            {ad.cta}
          </Button>
          <span className="text-white/70 text-xs">{ad.stats}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// NEW: Category-Specific Ad Component
const CategoryAd = ({ ad }: { ad: any }) => {
  const Icon = ad.icon
  
  return (
    <div className={`bg-gradient-to-r ${ad.gradient} rounded-xl p-6 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer`}>
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
            {ad.badge}
          </Badge>
          <Icon className="w-8 h-8 text-white/90" />
        </div>
        
        <h3 className="text-lg font-bold mb-2">{ad.title}</h3>
        <p className="text-white/90 mb-4 text-sm">{ad.description}</p>
        
        <Button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold text-sm">
          {ad.cta}
        </Button>
      </div>
    </div>
  )
}

// NEW: Premium Supplier Ad Component
const PremiumSupplierAd = ({ ad }: { ad: any }) => {
  const Icon = ad.icon
  
  return (
    <div className={`bg-gradient-to-r ${ad.gradient} rounded-2xl p-8 text-white relative overflow-hidden`}>
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm mb-4">
              {ad.badge}
            </Badge>
            <h2 className="text-3xl font-bold mb-3">{ad.title}</h2>
            <p className="text-xl opacity-90 mb-6 max-w-2xl">
              {ad.description}
            </p>
            <div className="flex flex-wrap gap-4">
              {ad.benefits.map((benefit: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <Button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
            <Icon className="w-5 h-5 mr-2" />
            {ad.cta}
          </Button>
        </div>
      </div>
    </div>
  )
}

// NEW: Supplier Tools Ad Component
const SupplierToolsAd = ({ ad }: { ad: any }) => {
  const Icon = ad.icon
  
  return (
    <Card className={`bg-gradient-to-r ${ad.gradient} border-0 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
            {ad.badge}
          </Badge>
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
        <p className="text-white/90 mb-4">{ad.description}</p>
        
        <div className="space-y-2 mb-4">
          {ad.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-white/90" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold">
          {ad.cta}
        </Button>
      </CardContent>
    </Card>
  )
}

// NEW: Sidebar Product Card Component
const SidebarProductCard = ({ product }: { product: any }) => {
  const { addToCart } = useCart()
  const router = useRouter()

  const handleViewDetails = () => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      vendor: product.vendor,
      vendorId: product.vendorId,
      delivery: product.delivery,
      rating: product.rating,
      description: "Popular product with great value and performance.",
      image: product.image,
      category: "General",
      reviewCount: 25,
      inStock: true,
      features: ["Quality", "Reliable", "Value"]
    }
    
    console.log('🛒 Navigating to product:', productData.name)
    localStorage.setItem('currentProduct', JSON.stringify(productData))
    router.push(`/product/${product.id}`)
  }

  return (
    <Card className="group hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 bg-white">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
            onClick={handleViewDetails}
          >
            <Sparkles className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs font-medium text-emerald-700">{product.vendor}</span>
            </div>
            <h4 
              className="font-medium text-gray-900 text-xs line-clamp-2 group-hover:text-emerald-600 transition-colors mb-1 cursor-pointer"
              onClick={handleViewDetails}
            >
              {product.name}
            </h4>
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-600">{product.rating}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-600">KSh {product.price.toLocaleString()}</span>
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={() => addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    vendor: product.vendor,
                    vendorId: product.vendorId,
                    delivery: product.delivery,
                    image: product.image
                  })}
                >
                  <ShoppingCart className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-6 px-2 text-xs"
                  onClick={handleViewDetails}
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MarketplacePage() {
  const { cartItemsCount } = useCart()
  const [allCleaningDeals, setAllCleaningDeals] = useState<Deal[]>([])
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([])
  const [searchResults, setSearchResults] = useState<Deal[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [refreshing, setRefreshing] = useState(false)

  // Fetch products from MongoDB on component mount
  const loadProducts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      
      const response = await fetchProducts(lastUpdate)
      
      if (response.success && response.products) {
        // Transform MongoDB products to deal format
        const transformedDeals: Deal[] = response.products.map((product: Product) => {
          const categoryMap: { [key: string]: string } = {
            "industrial-equipment": "Industrial Equipment",
            "household-cleaners": "Household Cleaners", 
            "eco-friendly": "Eco-Friendly",
            "commercial-cleaners": "Commercial Cleaners",
            "disinfectants": "Disinfectants",
            "floor-care": "Floor Care"
          }
          
          const typeMap: { [key: string]: string } = {
            "industrial-equipment": "Equipment",
            "household-cleaners": "Cleaner",
            "eco-friendly": "Cleaner",
            "commercial-cleaners": "Cleaner",
            "disinfectants": "Disinfectant",
            "floor-care": "Floor Care"
          }
          
          const featuresMap: { [key: string]: string[] } = {
            "industrial-equipment": ["Professional Grade", "Heavy Duty", "Commercial Use", "Durable"],
            "household-cleaners": ["All-Purpose", "Safe for Families", "Effective", "Easy to Use"],
            "eco-friendly": ["Eco-Friendly", "Biodegradable", "Natural Ingredients", "Sustainable"],
            "commercial-cleaners": ["Commercial Grade", "High Concentration", "Cost Effective", "Bulk Packaging"],
            "disinfectants": ["Kills 99.9% Germs", "Hospital Grade", "Quick Action", "Residual Protection"],
            "floor-care": ["Streak-Free", "Quick Drying", "Protective Coating", "Easy Application"]
          }
          
          const category = categoryMap[product.category] || product.category
          const type = typeMap[product.category] || "Cleaner"
          const features = featuresMap[product.category] || ["Quality", "Reliable", "Effective"]
          
          // Create realistic deal data based on product
          const originalPrice = product.originalPrice || Math.round(product.price * (1 + (Math.random() * 0.3 + 0.1))) // 10-40% higher
          const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100)
          const sold = Math.floor(Math.random() * 200) + 50
          const total = sold + Math.floor(Math.random() * 100) + 20
          const rating = product.rating || 4.0 + (Math.random() * 1.0) // 4.0-5.0 rating
          const reviewCount = product.reviewCount || Math.floor(Math.random() * 300) + 50
          const deliveryOptions = ["Today", "Tomorrow", "2-3 days"]
          const delivery = deliveryOptions[Math.floor(Math.random() * deliveryOptions.length)]
          const stockOptions = product.stock > 10 ? ["In stock"] : product.stock > 5 ? ["Only 5 left"] : product.stock > 0 ? ["Only 3 left"] : ["Out of stock"]
          const stock = stockOptions[0]
          const coupons = [null, "SAVE100", "CLEAN15", "FLOOR20", "GREEN10"]
          const coupon = coupons[Math.floor(Math.random() * coupons.length)]
          const isAmazonChoice = Math.random() > 0.7
          const isBestSeller = Math.random() > 0.8
          
          return {
            id: product._id,
            name: product.name,
            originalPrice,
            price: product.price,
            discount,
            image: product.images?.[0] || "/api/placeholder/200/200",
            sold,
            total,
            features,
            type,
            category,
            rating: parseFloat(rating.toFixed(1)),
            reviewCount,
            delivery,
            vendor: product.vendor?.businessName || "Unknown Vendor",
            vendorId: product.vendorId,
            vendorDetails: {
              businessName: product.vendor?.businessName || "Unknown Vendor",
              isVerified: product.vendor?.isVerified || false,
              rating: product.vendor?.rating || 4.0,
              location: product.vendor?.location || "Nairobi, Kenya",
              joinedDate: product.vendor?.joinedDate || "2023"
            },
            isAmazonChoice,
            isBestSeller,
            stock,
            coupon,
            lastUpdated: product.updatedAt || product.createdAt || new Date().toISOString()
          }
        })
        
        if (isRefresh && lastUpdate) {
          // Update existing products or add new ones
          setAllCleaningDeals(prevDeals => {
            const updatedDeals = [...prevDeals]
            transformedDeals.forEach(newDeal => {
              const existingIndex = updatedDeals.findIndex(deal => deal.id === newDeal.id)
              if (existingIndex >= 0) {
                updatedDeals[existingIndex] = newDeal
              } else {
                updatedDeals.push(newDeal)
              }
            })
            return updatedDeals
          })
        } else {
          setAllCleaningDeals(transformedDeals)
        }
        
        setFilteredDeals(transformedDeals)
        setSearchResults(transformedDeals)
        setLastUpdate(response.lastUpdate)
        
        console.log(`✅ ${isRefresh ? 'Refreshed' : 'Loaded'} ${transformedDeals.length} vendor products`)
      } else {
        throw new Error('Failed to load products')
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Error connecting to database')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // Auto-refresh products every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && lastUpdate) {
        loadProducts(true)
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [loading, lastUpdate])

  // Manual refresh function
  const handleRefresh = () => {
    loadProducts(true)
  }

  // Search and filter handler
  const handleSearch = (query: string, filters: any) => {
    setIsSearching(true)
    
    let results = allCleaningDeals

    // Text search
    if (query.trim()) {
      results = results.filter(deal =>
        deal.name.toLowerCase().includes(query.toLowerCase()) ||
        deal.features.some((feature: string) => 
          feature.toLowerCase().includes(query.toLowerCase())
        ) ||
        deal.vendor.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Category filter
    if (filters.categories.length > 0) {
      results = results.filter(deal => 
        filters.categories.includes(deal.category)
      )
    }

    // Vendor filter
    if (filters.vendors.length > 0) {
      results = results.filter(deal => 
        filters.vendors.includes(deal.vendor)
      )
    }

    // Rating filter
    if (filters.minRating > 0) {
      results = results.filter(deal => 
        deal.rating >= filters.minRating
      )
    }

    // Price range filter
    results = results.filter(deal => 
      deal.price >= filters.priceRange[0] && 
      deal.price <= filters.priceRange[1]
    )

    // Features filter
    if (filters.features.length > 0) {
      results = results.filter(deal =>
        filters.features.every((feature: string) =>
          deal.features.some((dealFeature: string) =>
            dealFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
      )
    }

    // Delivery filter
    if (filters.delivery.length > 0) {
      results = results.filter(deal =>
        filters.delivery.some((delivery: string) =>
          deal.delivery.toLowerCase().includes(delivery.toLowerCase())
        )
      )
    }

    setSearchResults(results)
    setFilteredDeals(results)
  }

  const handleFiltersChange = (filters: any) => {
    handleSearch("", filters)
  }

  const clearSearch = () => {
    setFilteredDeals(allCleaningDeals)
    setSearchResults(allCleaningDeals)
    setIsSearching(false)
  }

  // Mix sponsored products with regular products for display
  const getDisplayProducts = () => {
    if (isSearching) {
      return filteredDeals
    }
    
    const products = [...filteredDeals]
    // Insert sponsored product after every 3 regular products
    if (products.length > 3) {
      premiumAds.sponsoredProducts.forEach((sponsored, index) => {
        const insertPosition = (index + 1) * 3
        if (insertPosition <= products.length) {
          products.splice(insertPosition, 0, sponsored as Deal)
        }
      })
    }
    return products
  }

  const displayProducts = getDisplayProducts()

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Marketplace</h2>
            <p className="text-gray-600">Fetching vendor products from database...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && allCleaningDeals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Products</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => loadProducts()} className="bg-emerald-600 hover:bg-emerald-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
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
            <h1 className="text-4xl font-bold mb-4">CleanCart Kenya</h1>
            <p className="text-xl mb-6 opacity-90">Kenya's Smart Shopping Solutions Marketplace</p>
            <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
              Source quality products, equipment, and supplies from verified suppliers across Kenya
            </p>
            {!loading && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-white/90">
                    Showing <strong>{allCleaningDeals.length}</strong> vendor products
                  </p>
                </div>
                <Button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  variant="outline" 
                  className="border-white text-white hover:bg-white/20"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh Products'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🔥 STRATEGIC AD PLACEMENT 1: Top Banner Ad */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm mb-3">
                    🚀 LIMITED SPOTS
                  </Badge>
                  <h2 className="text-2xl font-bold mb-2">Featured Supplier Program</h2>
                  <p className="text-purple-100 mb-4 max-w-2xl">
                    Get premium homepage placement and reach thousands of professional buyers
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>2.5x More Views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Premium Badge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Priority Support</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                    Apply Now
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/20">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Component */}
        <section className="mb-8">
          <ProductSearch 
            onSearch={handleSearch}
            onFiltersChange={handleFiltersChange}
          />
          
          {/* Search Results Header */}
          {isSearching && (
            <div className="flex items-center justify-between mt-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  Found {filteredDeals.length} products
                  {filteredDeals.length !== allCleaningDeals.length && (
                    <button
                      onClick={clearSearch}
                      className="ml-2 text-emerald-600 hover:text-emerald-700 underline text-sm"
                    >
                      Clear search
                    </button>
                  )}
                </p>
              </div>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Enhanced Flash Deals Section */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold">FEATURED DEALS</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-bold text-sm">23:59:45</span>
                </div>
                {!isSearching && (
                  <div className="flex items-center gap-2 ml-auto">
                    <Button 
                      onClick={handleRefresh}
                      disabled={refreshing}
                      variant="ghost" 
                      size="sm"
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                      <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
              
              {displayProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayProducts.map((deal, index) => (
                    deal.isSponsored ? (
                      <SponsoredProductCard key={`sponsored-${index}`} product={deal} />
                    ) : (
                      <DealCard key={deal.id} deal={deal} />
                    )
                  ))}
                </div>
              ) : (
                <Card className="border-emerald-100 bg-emerald-50">
                  <CardContent className="p-8 text-center">
                    <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search criteria or filters to find what you're looking for.
                    </p>
                    <Button 
                      onClick={clearSearch}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Clear Search & Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Only show other sections when not searching */}
            {!isSearching && (
              <>
                {/* 🔥 STRATEGIC AD PLACEMENT 2: Category-Specific Ad */}
                <section className="mb-12">
                  <CategoryAd ad={premiumAds.categoryAds[0]} />
                </section>

                {/* Recently Viewed Section */}
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

                {/* Enhanced Categories Section */}
                <section className="mb-12">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Product Categories</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Browse our comprehensive range of quality products and supplies
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

                {/* 🔥 STRATEGIC AD PLACEMENT 3: Premium Supplier Program */}
                <section className="mb-12">
                  <PremiumSupplierAd ad={premiumAds.supplierAds[0]} />
                </section>

                {/* Enhanced Featured Vendors Section */}
                <section className="mb-12">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Award className="w-6 h-6 text-emerald-600" />
                      <h2 className="text-3xl font-bold text-gray-900">Trusted Suppliers</h2>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Partner with Kenya's most reliable product suppliers
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cleaningVendors.map((vendor) => (
                      <VendorCard key={vendor.id} vendor={vendor} />
                    ))}
                  </div>
                </section>

                {/* 🔥 STRATEGIC AD PLACEMENT 4: Supplier Tools */}
                <section className="mb-12">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Supplier Success Tools</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Everything you need to grow your business on our platform
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {premiumAds.supplierTools.map((tool) => (
                      <SupplierToolsAd key={tool.id} ad={tool} />
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
                    <Link href="/product/1">
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

                {/* 🔥 STRATEGIC AD PLACEMENT 5: Bottom Banner Ad */}
                <section className="mb-12">
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
                    <p className="text-xl mb-6 max-w-2xl mx-auto">
                      Join hundreds of successful suppliers already selling on CleanCart Kenya
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
              </>
            )}
          </div>

          {/* 🔥 STRATEGIC AD PLACEMENT 6: Sidebar Ads - NO WHITE SPACE */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sidebar Ad 1 */}
            <SidebarAd ad={premiumAds.sidebarAds[0]} />
            
            {/* Sidebar Ad 2 */}
            <SidebarAd ad={premiumAds.sidebarAds[1]} />

            {/* Quick Products Section - Fills White Space */}
            <Card className="border-emerald-200 bg-white">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Quick Add to Cart</h3>
                <div className="space-y-3">
                  {sidebarProducts.map((product) => (
                    <SidebarProductCard key={product.id} product={product} />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Sidebar Ad 3 */}
            <SidebarAd ad={premiumAds.sidebarAds[2]} />

            {/* Sidebar Ad 4 */}
            <SidebarAd ad={premiumAds.sidebarAds[3]} />
            
            {/* Marketplace Stats */}
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Marketplace Stats</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Buyers</span>
                    <span className="font-semibold">10,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Order Value</span>
                    <span className="font-semibold">KSh 2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Supplier Growth</span>
                    <span className="font-semibold">+45% MoM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Products</span>
                    <span className="font-semibold">{allCleaningDeals.length}+</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Supplier Actions */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">For Suppliers</h3>
                <div className="space-y-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                    <Megaphone className="w-3 h-3 mr-2" />
                    Advertise Here
                  </Button>
                  <Button variant="outline" className="w-full text-xs h-8">
                    <TrendingUp className="w-3 h-3 mr-2" />
                    Boost Products
                  </Button>
                  <Button variant="outline" className="w-full text-xs h-8">
                    <Rocket className="w-3 h-3 mr-2" />
                    Get Featured
                  </Button>
                  <Button variant="outline" className="w-full text-xs h-8">
                    <BarChart3 className="w-3 h-3 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Supplier Resources */}
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Supplier Resources</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-white rounded border border-purple-100 cursor-pointer hover:bg-purple-50 transition-colors">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>Seller Guidelines</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded border border-purple-100 cursor-pointer hover:bg-purple-50 transition-colors">
                    <Calculator className="w-4 h-4 text-purple-600" />
                    <span>Pricing Calculator</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded border border-purple-100 cursor-pointer hover:bg-purple-50 transition-colors">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Promo Calendar</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded border border-purple-100 cursor-pointer hover:bg-purple-50 transition-colors">
                    <Gift className="w-4 h-4 text-purple-600" />
                    <span>Seasonal Offers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Trust Badges */}
        <section className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-8 mb-12 border border-emerald-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Truck className="w-12 h-12 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Same-day & scheduled delivery options</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600 text-sm">All products meet quality standards</p>
            </div>
            <div className="flex flex-col items-center">
              <HeadphonesIcon className="w-12 h-12 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600 text-sm">24/7 professional customer support</p>
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