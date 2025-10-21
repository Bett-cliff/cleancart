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
  Loader2,
  X,
  SlidersHorizontal,
  Image as ImageIcon,
  FileText
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Environment configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// All the vendor sections for the sub-navbar
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
  customerReviews?: Array<{
    _id: string;
    customerName: string;
    rating: number;
    comment: string;
    createdAt: string;
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
        const storedVendor = localStorage.getItem('vendor_data');
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
        const sessionVendor = sessionStorage.getItem('vendor_data');
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
      
      console.warn('⚠️ No vendor ID found in storage');
      return null;
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

// Advanced Filters Component
const AdvancedFilters = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange 
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
}) => {
  const priceRanges = [
    { label: "Any Price", value: "all" },
    { label: "Under KSh 1,000", value: "0-1000" },
    { label: "KSh 1,000 - 5,000", value: "1000-5000" },
    { label: "KSh 5,000 - 10,000", value: "5000-10000" },
    { label: "Over KSh 10,000", value: "10000+" }
  ];

  const stockRanges = [
    { label: "Any Stock", value: "all" },
    { label: "Out of Stock", value: "0" },
    { label: "Low Stock (1-10)", value: "1-10" },
    { label: "Medium Stock (11-50)", value: "11-50" },
    { label: "High Stock (50+)", value: "50+" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>
            Refine your product search with advanced filters
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">Price Range</label>
            <Select
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">Stock Level</label>
            <Select
              value={filters.stockRange}
              onValueChange={(value) => onFiltersChange({ ...filters, stockRange: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select stock level" />
              </SelectTrigger>
              <SelectContent>
                {stockRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Eco-Friendly Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Eco-Friendly</label>
            <Select
              value={filters.ecoFriendly}
              onValueChange={(value) => onFiltersChange({ ...filters, ecoFriendly: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by eco-friendly" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="yes">Eco-Friendly Only</SelectItem>
                <SelectItem value="no">Non Eco-Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Featured Products */}
          <div>
            <label className="text-sm font-medium mb-2 block">Featured Status</label>
            <Select
              value={filters.featured}
              onValueChange={(value) => onFiltersChange({ ...filters, featured: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="yes">Featured Only</SelectItem>
                <SelectItem value="no">Non Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onFiltersChange({
            priceRange: 'all',
            stockRange: 'all',
            ecoFriendly: 'all',
            featured: 'all'
          })}>
            Reset Filters
          </Button>
          <Button onClick={onClose}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default"
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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
  
  // New state for enhanced features
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: 'all',
    stockRange: 'all',
    ecoFriendly: 'all',
    featured: 'all'
  })
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    action: 'archive' | 'delete' | 'activate' | null;
    productId: string | null;
    productName: string;
  }>({
    isOpen: false,
    action: null,
    productId: null,
    productName: ''
  })

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
        
        // Add advanced filters
        if (advancedFilters.priceRange !== 'all') params.append('priceRange', advancedFilters.priceRange)
        if (advancedFilters.stockRange !== 'all') params.append('stockRange', advancedFilters.stockRange)
        if (advancedFilters.ecoFriendly !== 'all') params.append('ecoFriendly', advancedFilters.ecoFriendly)
        if (advancedFilters.featured !== 'all') params.append('featured', advancedFilters.featured)

        // Use Next.js API route that derives vendorId from the auth token
        const apiUrl = `/api/vendor/products?${params}`
        console.log('🌐 API URL:', apiUrl)

        // Attach auth token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('vendor_token') : null
        const response = await fetchWithRetry(apiUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        })
        
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
            totalOrders: result.data.reduce((sum: number, p: Product) => sum + (p.reviewCount || 0), 0)
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
  }, [searchTerm, selectedCategory, selectedStatus, vendorId, refreshKey, advancedFilters])

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
    router.push(`/vendor/products/${productId}`);
  }, [router]);

  const handleEditProduct = useCallback((productId: string) => {
    console.log('✏️ Editing product:', productId);
    router.push(`/vendor/products/edit/${productId}`);
  }, [router]);

  const showConfirmation = (action: 'archive' | 'delete' | 'activate', productId: string, productName: string) => {
    setConfirmationModal({
      isOpen: true,
      action,
      productId,
      productName
    });
  };

  const handleConfirmation = async () => {
    const { action, productId } = confirmationModal;
    if (!action || !productId) return;

    try {
      setActionLoading(`${action}-${productId}`);
      
      let url = `${API_BASE}/api/products/${productId}`;
      let method = 'PUT';
      let body = null;

      switch (action) {
        case 'delete':
          method = 'DELETE';
          break;
        case 'archive':
          body = { status: 'archived' };
          break;
        case 'activate':
          body = { status: 'active' };
          break;
      }

      const response = await fetchWithRetry(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} product`);
      }

      const result = await response.json() as ApiResponse<Product | null>;
      
      if (result.success) {
        console.log(`✅ Product ${action}ed successfully`);
        
        // Update local state based on action
        if (action === 'delete') {
          setProducts(prev => prev.filter(p => p._id !== productId));
          setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
        } else {
          setProducts(prev => prev.map(p => 
            p._id === productId ? { ...p, status: action === 'archive' ? 'archived' : 'active' } : p
          ));
        }
        
        refreshProducts();
      } else {
        throw new Error(result.message || `Failed to ${action} product`);
      }
    } catch (err) {
      console.error(`❌ Error ${action}ing product:`, err);
      alert(`Failed to ${action} product. Please try again.`);
    } finally {
      setActionLoading(null);
      setConfirmationModal({ isOpen: false, action: null, productId: null, productName: '' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getConfirmationConfig = () => {
    const { action, productName } = confirmationModal;
    
    switch (action) {
      case 'delete':
        return {
          title: 'Delete Product',
          description: `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
          confirmText: 'Delete',
          variant: 'destructive' as const
        };
      case 'archive':
        return {
          title: 'Archive Product',
          description: `Are you sure you want to archive "${productName}"? Archived products won't be visible to customers.`,
          confirmText: 'Archive',
          variant: 'default' as const
        };
      case 'activate':
        return {
          title: 'Activate Product',
          description: `Are you sure you want to activate "${productName}"? This will make it visible to customers.`,
          confirmText: 'Activate',
          variant: 'default' as const
        };
      default:
        return {
          title: 'Confirm Action',
          description: 'Are you sure you want to proceed?',
          confirmText: 'Confirm',
          variant: 'default' as const
        };
    }
  };

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
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="w-5 h-5 text-yellow-600" />
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

            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowAdvancedFilters(true)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
        onConfirm={handleConfirmation}
        {...getConfirmationConfig()}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading your products from database...</span>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && (
        <div className="space-y-8">
          {/* Draft Products Section */}
          {products.filter(p => p.status === 'draft').length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-yellow-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">Draft Products</h2>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {products.filter(p => p.status === 'draft').length} draft{products.filter(p => p.status === 'draft').length > 1 ? 's' : ''}
                </Badge>
              </div>
              <p className="text-gray-600 mb-6">Continue editing your unfinished products</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter(p => p.status === 'draft').map((product) => (
                  <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-yellow-200">
                    <CardHeader className="p-4 pb-2 bg-yellow-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-white" />
                            )}
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
                              onClick={() => handleEditProduct(product._id)}
                            >
                              <Edit className="w-4 h-4" />
                              Continue Editing
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 text-green-600"
                              onClick={() => showConfirmation('activate', product._id, product.name)}
                              disabled={actionLoading === `activate-${product._id}`}
                            >
                              {actionLoading === `activate-${product._id}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Package className="w-4 h-4" />
                              )}
                              {actionLoading === `activate-${product._id}` ? 'Activating...' : 'Publish Now'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 text-red-600"
                              onClick={() => showConfirmation('delete', product._id, product.name)}
                              disabled={actionLoading === `delete-${product._id}`}
                            >
                              {actionLoading === `delete-${product._id}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              {actionLoading === `delete-${product._id}` ? 'Deleting...' : 'Delete Draft'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-2">
                      {/* Draft Status Banner */}
                      <div className="mb-3 p-2 bg-yellow-100 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">Draft - Not visible to customers</span>
                        </div>
                      </div>

                      {/* Product Images Preview */}
                      {product.images && product.images.length > 0 && (
                        <div className="mb-3">
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {product.images.slice(0, 3).map((image, index) => (
                              <div key={index} className="flex-shrink-0 w-16 h-16 rounded border overflow-hidden">
                                <img 
                                  src={image} 
                                  alt={`${product.name} ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {product.images.length > 3 && (
                              <div className="flex-shrink-0 w-16 h-16 rounded border bg-gray-100 flex items-center justify-center">
                                <span className="text-xs text-gray-600">+{product.images.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
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
                          {actionLoading === `edit-${product._id}` ? 'Editing...' : 'Continue Editing'}
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => showConfirmation('activate', product._id, product.name)}
                          disabled={actionLoading === `activate-${product._id}`}
                        >
                          {actionLoading === `activate-${product._id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                          ) : (
                            <Package className="w-4 h-4 mr-1" />
                          )}
                          {actionLoading === `activate-${product._id}` ? 'Publishing...' : 'Publish'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Active Products Section */}
          {products.filter(p => p.status === 'active').length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">Active Products</h2>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {products.filter(p => p.status === 'active').length} active
                </Badge>
              </div>
              <p className="text-gray-600 mb-6">Products currently visible to customers</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter(p => p.status === 'active').map((product) => (
                  <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-white" />
                            )}
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
                            {/* REMOVED: View Live Button */}
                            <DropdownMenuItem 
                              className="flex items-center gap-2"
                              onClick={() => showConfirmation('archive', product._id, product.name)}
                              disabled={actionLoading === `archive-${product._id}`}
                            >
                              {actionLoading === `archive-${product._id}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Archive className="w-4 h-4" />
                              )}
                              {actionLoading === `archive-${product._id}` ? 'Archiving...' : 'Archive'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 text-red-600"
                              onClick={() => showConfirmation('delete', product._id, product.name)}
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
                      {/* Product Images Preview */}
                      {product.images && product.images.length > 0 && (
                        <div className="mb-3">
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {product.images.slice(0, 3).map((image, index) => (
                              <div key={index} className="flex-shrink-0 w-16 h-16 rounded border overflow-hidden">
                                <img 
                                  src={image} 
                                  alt={`${product.name} ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {product.images.length > 3 && (
                              <div className="flex-shrink-0 w-16 h-16 rounded border bg-gray-100 flex items-center justify-center">
                                <span className="text-xs text-gray-600">+{product.images.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
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

                      {product.isFeatured && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mb-2 ml-2">
                          ⭐ Featured
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
                          {actionLoading === `view-${product._id}` ? 'Loading...' : 'View Details'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
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