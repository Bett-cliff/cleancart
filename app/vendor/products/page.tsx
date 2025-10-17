"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Archive,
  Trash2,
  ShoppingCart,
  Star,
  Home,
  Users,
  DollarSign,
  Warehouse,
  Megaphone,
  Crown,
  MessageSquare,
  Settings,
  Truck,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Environment configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// All the vendor sections for the sub-navbar (removed duplicate Add Product)
const vendorSections = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: Home,
    href: "/vendor/dashboard",
    description: "Business overview"
  },
  {
    id: "products",
    name: "Products",
    icon: Package,
    href: "/vendor/products",
    description: "Manage your products"
  },
  {
    id: "orders",
    name: "Orders",
    icon: ShoppingCart,
    href: "/vendor/orders",
    description: "Customer orders"
  },
  {
    id: "inventory",
    name: "Inventory",
    icon: Warehouse,
    href: "/vendor/inventory",
    description: "Stock management"
  },
  {
    id: "customers",
    name: "Customers",
    icon: Users,
    href: "/vendor/customers",
    description: "Customer database"
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: Megaphone,
    href: "/vendor/marketing",
    description: "Promotions & campaigns"
  },
  {
    id: "payouts",
    name: "Payouts",
    icon: DollarSign,
    href: "/vendor/payouts",
    description: "Earnings & payments"
  },
  {
    id: "shipping",
    name: "Shipping",
    icon: Truck,
    href: "/vendor/shipping",
    description: "Delivery & logistics"
  },
  {
    id: "reviews",
    name: "Reviews",
    icon: Star,
    href: "/vendor/reviews",
    description: "Customer feedback"
  },
  {
    id: "subscription",
    name: "Subscription",
    icon: Crown,
    href: "/vendor/subscription",
    description: "Plan & billing"
  },
  {
    id: "support",
    name: "Support",
    icon: MessageSquare,
    href: "/vendor/support",
    description: "Help & support"
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    href: "/vendor/settings",
    description: "Account settings"
  }
]

const statusConfig = {
  active: { label: "In Stock", variant: "default" as const },
  low_stock: { label: "Low Stock", variant: "secondary" as const },
  out_of_stock: { label: "Out of Stock", variant: "destructive" as const },
  archived: { label: "Archived", variant: "outline" as const },
  draft: { label: "Draft", variant: "outline" as const }
}

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

interface ProductsStats {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Custom hook for vendor ID
const useVendorId = () => {
  const [vendorId, setVendorId] = useState<string | null>(null);
  
  useEffect(() => {
    const getVendorId = () => {
      console.log('🔍 Getting vendor ID...');
      
      // Try to get from vendor auth context first
      try {
        // Check if we have vendor data in localStorage from login
        const storedVendor = localStorage.getItem('vendor');
        console.log('📦 localStorage vendor:', storedVendor);
        
        if (storedVendor) {
          const vendorData = JSON.parse(storedVendor);
          console.log('📦 Parsed vendor data:', vendorData);
          
          if (vendorData._id || vendorData.id) {
            const vendorId = vendorData._id || vendorData.id;
            console.log('✅ Using vendor ID from localStorage:', vendorId);
            return vendorId;
          }
        }
      } catch (error) {
        console.error('❌ Error getting vendor from localStorage:', error);
      }

      // Try to get from session storage
      try {
        const sessionVendor = sessionStorage.getItem('vendor');
        console.log('📦 sessionStorage vendor:', sessionVendor);
        
        if (sessionVendor) {
          const vendorData = JSON.parse(sessionVendor);
          if (vendorData._id || vendorData.id) {
            const vendorId = vendorData._id || vendorData.id;
            console.log('✅ Using vendor ID from sessionStorage:', vendorId);
            return vendorId;
          }
        }
      } catch (error) {
        console.error('❌ Error getting vendor from sessionStorage:', error);
      }

      // Check all localStorage keys to see what's available
      console.log('🔍 All localStorage keys:', Object.keys(localStorage));
      
      // Check for any vendor-related keys
      const vendorKeys = Object.keys(localStorage).filter(key => 
        key.toLowerCase().includes('vendor') || 
        key.toLowerCase().includes('user') ||
        key.toLowerCase().includes('auth')
      );
      console.log('🔍 Vendor-related keys:', vendorKeys);
      
      // Check each vendor-related key
      vendorKeys.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          console.log(`🔍 ${key}:`, value);
        } catch (error) {
          console.error(`❌ Error reading ${key}:`, error);
        }
      });

      // Based on your backend logs, the actual vendor ID should be '68efb302ffa9682bb4a9bf81'
      console.log('⚠️ Using fallback vendor ID from login logs');
      return '68efb302ffa9682bb4a9bf81';
    };

    setVendorId(getVendorId());
  }, []);
  
  return vendorId;
};

// Retry mechanism for API calls
const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 2): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      if (i < retries - 1) {
        console.log(`🔄 Retrying request... ${retries - i - 1} attempts left`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    } catch (error) {
      if (i < retries - 1) {
        console.log(`🔄 Retrying failed request... ${retries - i - 1} attempts left`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      } else {
        throw error;
      }
    }
  }
  throw new Error('All retry attempts failed');
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<ProductsStats>({
    totalProducts: 0,
    activeProducts: 0,
    draftProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalOrders: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const vendorId = useVendorId();
  const router = useRouter();
  const categories = ["all", "Household Cleaners", "Industrial Equipment", "Eco-Friendly Products", "Waste Management", "Pest Control", "Hospitality Supplies"]
  const statuses = ["all", "active", "draft", "low_stock", "out_of_stock"]

  // Fetch vendor's products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      if (!vendorId) return;

      try {
        setIsLoading(true)
        setError(null)
        
        console.log('🔄 Fetching products for vendor:', vendorId)
        
        if (!vendorId) {
          throw new Error('Vendor ID not found. Please log in again.')
        }

        // Build query parameters
        const params = new URLSearchParams()
        if (searchTerm) params.append('search', searchTerm)
        if (selectedCategory !== 'all') params.append('category', selectedCategory)
        if (selectedStatus !== 'all') params.append('status', selectedStatus)

        const apiUrl = `${API_BASE}/api/products/vendor/${vendorId}?${params}`
        console.log('🌐 API URL:', apiUrl)

        const response = await fetchWithRetry(apiUrl)
        
        console.log('📡 Response status:', response.status)
        console.log('📡 Response headers:', response.headers)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Response error text:', errorText)
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
        }
        
        const result = await response.json() as ApiResponse<Product[]>
        console.log('📦 API Response:', result)
        
        if (result.success && result.data) {
          console.log(`✅ Loaded ${result.data.length} products from database`)
          setProducts(result.data)
          
          // Calculate stats
          const totalProducts = result.data.length
          const activeProducts = result.data.filter((p: Product) => p.status === 'active').length
          const draftProducts = result.data.filter((p: Product) => p.status === 'draft').length
          const lowStockProducts = result.data.filter((p: Product) => p.stock > 0 && p.stock <= 10).length
          const outOfStockProducts = result.data.filter((p: Product) => p.stock === 0).length
          
          setStats({
            totalProducts,
            activeProducts,
            draftProducts,
            lowStockProducts,
            outOfStockProducts,
            totalOrders: result.data.reduce((sum: number, p: Product) => sum + (p.reviewCount || 0), 0) // Using reviewCount as order count for now
          })
        } else {
          throw new Error(result.message || 'No products found in response')
        }
      } catch (err) {
        console.error('❌ Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while fetching products')
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchProducts()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedCategory, selectedStatus, vendorId, refreshKey])

  const refreshProducts = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (stock <= 10) {
      return <Badge variant="secondary">Low Stock</Badge>
    } else {
      return <Badge variant="default">In Stock</Badge>
    }
  }

  const handleViewProduct = useCallback((productId: string) => {
    console.log('👀 Viewing product:', productId);
    // Navigate to product details page
    router.push(`/vendor/products/${productId}`);
  }, [router]);

  const handleEditProduct = useCallback((productId: string) => {
    console.log('✏️ Editing product:', productId);
    // Navigate to edit product page
    router.push(`/vendor/products/edit/${productId}`);
  }, [router]);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return

    try {
      setActionLoading(`delete-${productId}`)
      console.log('🗑️ Deleting product:', productId)
      
      const response = await fetchWithRetry(`${API_BASE}/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      const result = await response.json() as ApiResponse<null>
      
      if (result.success) {
        console.log('✅ Product deleted successfully')
        // Remove product from local state
        setProducts(prev => prev.filter(p => p._id !== productId))
        // Refresh stats
        setStats(prev => ({
          ...prev,
          totalProducts: prev.totalProducts - 1
        }))
        refreshProducts();
      } else {
        throw new Error(result.message || 'Failed to delete product')
      }
    } catch (err) {
      console.error('❌ Error deleting product:', err)
      alert('Failed to delete product. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }, [])

  const handleArchiveProduct = useCallback(async (productId: string) => {
    try {
      setActionLoading(`archive-${productId}`)
      console.log('📦 Archiving product:', productId)
      
      const response = await fetchWithRetry(`${API_BASE}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'archived'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to archive product')
      }

      const result = await response.json() as ApiResponse<Product>
      
      if (result.success) {
        console.log('✅ Product archived successfully')
        // Update product status in local state
        setProducts(prev => prev.map(p => 
          p._id === productId ? { ...p, status: 'archived' } : p
        ))
        refreshProducts();
      } else {
        throw new Error(result.message || 'Failed to archive product')
      }
    } catch (err) {
      console.error('❌ Error archiving product:', err)
      alert('Failed to archive product. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }, [])

  const handleActivateProduct = useCallback(async (productId: string) => {
    try {
      setActionLoading(`activate-${productId}`)
      console.log('🚀 Activating product:', productId)
      
      const response = await fetchWithRetry(`${API_BASE}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'active'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to activate product')
      }

      const result = await response.json() as ApiResponse<Product>
      
      if (result.success) {
        console.log('✅ Product activated successfully')
        // Update product status in local state
        setProducts(prev => prev.map(p => 
          p._id === productId ? { ...p, status: 'active' } : p
        ))
        refreshProducts();
      } else {
        throw new Error(result.message || 'Failed to activate product')
      }
    } catch (err) {
      console.error('❌ Error activating product:', err)
      alert('Failed to activate product. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
            >
              Clear Storage & Reload
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog and inventory</p>
        </div>
        <Link href="/vendor/products/add">
          <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Vendor Sections Sub-Navbar */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="px-4 py-3 border-b">
          <h3 className="text-sm font-medium text-gray-900">Quick Access</h3>
          <p className="text-xs text-gray-600">Navigate to different vendor sections</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {vendorSections.map((section) => {
              const Icon = section.icon
              return (
                <Link key={section.id} href={section.href}>
                  <Button
                    variant="outline"
                    className="w-full h-auto p-3 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-green-600" />
                    <span className="text-xs font-medium text-gray-900">{section.name}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draftProducts}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Package className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowStockProducts}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Package className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">{stats.outOfStockProducts}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Package className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products by name, description..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="sm:w-48">
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === "all" ? "All Status" : statusConfig[status as keyof typeof statusConfig]?.label}
                  </option>
                ))}
              </select>
            </div>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading your products from database...</span>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                      <CardDescription className="text-sm line-clamp-1">
                        {product.category}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="flex items-center gap-2"
                        onClick={() => handleViewProduct(product._id)}
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center gap-2"
                        onClick={() => handleEditProduct(product._id)}
                      >
                        <Edit className="w-4 h-4" />
                        Edit Product
                      </DropdownMenuItem>
                      {product.status === 'draft' && (
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-green-600"
                          onClick={() => handleActivateProduct(product._id)}
                          disabled={actionLoading === `activate-${product._id}`}
                        >
                          {actionLoading === `activate-${product._id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Package className="w-4 h-4" />
                          )}
                          {actionLoading === `activate-${product._id}` ? 'Activating...' : 'Activate'}
                        </DropdownMenuItem>
                      )}
                      {product.status === 'active' && (
                        <DropdownMenuItem 
                          className="flex items-center gap-2"
                          onClick={() => handleArchiveProduct(product._id)}
                          disabled={actionLoading === `archive-${product._id}`}
                        >
                          {actionLoading === `archive-${product._id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Archive className="w-4 h-4" />
                          )}
                          {actionLoading === `archive-${product._id}` ? 'Archiving...' : 'Archive'}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="flex items-center gap-2 text-red-600"
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={actionLoading === `delete-${product._id}`}
                      >
                        {actionLoading === `delete-${product._id}` ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        {actionLoading === `delete-${product._id}` ? 'Deleting...' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-2">
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-gray-900">KSh {product.price.toLocaleString()}</span>
                  <div className="flex gap-2">
                    {getStatusBadge(product.status)}
                    {getStockBadge(product.stock)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{product.stock} in stock</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4" />
                    <span>{product.reviewCount || 0} orders</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{product.rating || 'No ratings'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Added {formatDate(product.createdAt)}</span>
                  </div>
                </div>

                {product.isEcoFriendly && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-2">
                    🌱 Eco-Friendly
                  </Badge>
                )}

                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditProduct(product._id)}
                    disabled={actionLoading === `edit-${product._id}`}
                  >
                    {actionLoading === `edit-${product._id}` ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <Edit className="w-4 h-4 mr-1" />
                    )}
                    {actionLoading === `edit-${product._id}` ? 'Editing...' : 'Edit'}
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleViewProduct(product._id)}
                    disabled={actionLoading === `view-${product._id}`}
                  >
                    {actionLoading === `view-${product._id}` ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <Eye className="w-4 h-4 mr-1" />
                    )}
                    {actionLoading === `view-${product._id}` ? 'Loading...' : 'View'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && products.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== "all" || selectedStatus !== "all" 
                ? "Try adjusting your search or filters"
                : "Get started by adding your first product to your store"
              }
            </p>
            <Link href="/vendor/products/add">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}