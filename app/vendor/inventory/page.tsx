"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Package,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  RefreshCw,
  MoreHorizontal,
  Home,
  ShoppingCart,
  Users,
  DollarSign,
  Warehouse,
  Megaphone,
  Crown,
  MessageSquare,
  Settings,
  Truck,
  Star,
  Loader2,
  Image as ImageIcon,
  Eye,
  Edit,
  History,
  FileText
} from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

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
  in_stock: { label: "In Stock", variant: "default" as const, color: "text-green-600 bg-green-50 border-green-200" },
  low_stock: { label: "Low Stock", variant: "secondary" as const, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  out_of_stock: { label: "Out of Stock", variant: "destructive" as const, color: "text-red-600 bg-red-50 border-red-200" }
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
  sku?: string;
}

interface InventoryStats {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

interface StockModalState {
  isOpen: boolean;
  type: 'add' | 'update' | 'restock' | null;
  productId: string | null;
  productName: string;
  currentStock: number;
  inputValue: string;
}

interface StockHistoryItem {
  _id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  change: number;
  type: 'manual' | 'sale' | 'restock' | 'adjustment' | 'quick_add' | 'quick_remove';
  reason?: string;
  changedBy: string;
  changedAt: string;
  productPrice: number;
  valueChange: number;
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [stockModal, setStockModal] = useState<StockModalState>({
    isOpen: false,
    type: null,
    productId: null,
    productName: '',
    currentStock: 0,
    inputValue: ''
  })
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [selectedProductHistory, setSelectedProductHistory] = useState<Product | null>(null)
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [stockHistoryData, setStockHistoryData] = useState<{[key: string]: StockHistoryItem[]}>({})
  const [isDownloading, setIsDownloading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const statuses = ["all", "in_stock", "low_stock", "out_of_stock"]

  // Improved vendor ID retrieval with better logging
  const getVendorId = () => {
    // Try multiple sources for vendor ID
    const sources = [
      // 1. Check localStorage
      () => {
        const storedVendor = localStorage.getItem('vendor');
        if (storedVendor) {
          try {
            const vendorData = JSON.parse(storedVendor);
            const vendorId = vendorData._id || vendorData.id;
            if (vendorId) {
              console.log('✅ Found vendor ID from localStorage:', vendorId);
              return vendorId;
            }
          } catch (error) {
            console.error('Error parsing vendor data from localStorage:', error);
          }
        }
        return null;
      },
      // 2. Check sessionStorage  
      () => {
        const sessionVendor = sessionStorage.getItem('vendor');
        if (sessionVendor) {
          try {
            const vendorData = JSON.parse(sessionVendor);
            const vendorId = vendorData._id || vendorData.id;
            if (vendorId) {
              console.log('✅ Found vendor ID from sessionStorage:', vendorId);
              return vendorId;
            }
          } catch (error) {
            console.error('Error parsing vendor data from sessionStorage:', error);
          }
        }
        return null;
      },
      // 3. Check vendor auth context (if available)
      () => {
        // If you have a vendor auth context hook, use it here
        // const { vendor } = useVendorAuth();
        // return vendor?._id;
        return null;
      }
    ];

    for (const source of sources) {
      const vendorId = source();
      if (vendorId) {
        return vendorId;
      }
    }

    console.warn('⚠️ Using fallback vendor ID from login logs');
    return '68efb302ffa9682bb4a9bf81'; // Fallback
  }

  // Calculate inventory stats based on current products
  const calculateStats = (productsList: Product[]) => {
    const totalProducts = productsList.length
    const lowStock = productsList.filter(p => p.stock > 0 && p.stock <= 10).length
    const outOfStock = productsList.filter(p => p.stock === 0).length
    const totalValue = productsList.reduce((sum, p) => sum + (p.price * p.stock), 0)
    
    setStats({
      totalProducts,
      lowStock,
      outOfStock,
      totalValue
    })
  }

  // Fetch vendor's products from backend
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const vendorId = getVendorId()
      console.log('🔄 Fetching inventory products for vendor:', vendorId)
      
      if (!vendorId) {
        throw new Error('Vendor ID not found. Please log in again.')
      }

      const apiUrl = `${API_BASE}/api/products/vendor/${vendorId}`
      console.log('🌐 API URL:', apiUrl)

      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Response error text:', errorText)
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('📦 API Response received:', result)
      
      if (result.success && result.data) {
        console.log(`✅ Loaded ${result.data.length} products for inventory`)
        setProducts(result.data)
        calculateStats(result.data)
      } else {
        throw new Error(result.message || 'No products found in response')
      }
    } catch (err) {
      console.error('❌ Error fetching inventory products:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while fetching products')
    } finally {
      setIsLoading(false)
    }
  }

  // Add stock history record
  const addStockHistoryRecord = (productId: string, productName: string, previousStock: number, newStock: number, type: StockHistoryItem['type'], reason?: string, productPrice?: number) => {
    const change = newStock - previousStock
    const price = productPrice || products.find(p => p._id === productId)?.price || 0
    const valueChange = change * price
    
    const historyRecord: StockHistoryItem = {
      _id: `${productId}-${Date.now()}`,
      productId,
      productName,
      previousStock,
      newStock,
      change,
      type,
      reason: reason || getDefaultReason(type, change),
      changedBy: 'Vendor',
      changedAt: new Date().toISOString(),
      productPrice: price,
      valueChange
    }

    setStockHistoryData(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), historyRecord]
    }))

    console.log(`📝 Added stock history record:`, historyRecord)
  }

  // Get default reason based on action type
  const getDefaultReason = (type: StockHistoryItem['type'], change: number) => {
    switch (type) {
      case 'quick_add':
        return `Quick add ${Math.abs(change)} units`
      case 'quick_remove':
        return `Quick remove ${Math.abs(change)} units`
      case 'manual':
        return `Manual stock update`
      case 'restock':
        return `Bulk restock`
      case 'adjustment':
        return `Stock adjustment`
      default:
        return `Stock ${change > 0 ? 'increase' : 'decrease'}`
    }
  }

  // Fetch stock history for a product
  const fetchStockHistory = async (productId: string) => {
    try {
      setIsHistoryLoading(true)
      console.log('📊 Fetching stock history for product:', productId)

      // Use local history data first (real vendor actions)
      const localHistory = stockHistoryData[productId] || []
      
      if (localHistory.length > 0) {
        setStockHistory(localHistory)
        console.log(`✅ Loaded ${localHistory.length} real history records from local storage`)
        return
      }

      // If no local history, try to fetch from backend API
      const response = await fetch(`${API_BASE}/api/products/${productId}/stock-history`)
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.length > 0) {
          setStockHistory(result.data)
          console.log(`✅ Loaded ${result.data.length} history records from API`)
        } else {
          // If no history endpoint exists or no data, generate initial mock data
          generateInitialHistory(productId)
        }
      } else {
        // If endpoint doesn't exist, generate initial mock data
        generateInitialHistory(productId)
      }
    } catch (error) {
      console.error('❌ Error fetching stock history:', error)
      // Use local history or generate initial mock data
      const localHistory = stockHistoryData[productId] || []
      if (localHistory.length === 0) {
        generateInitialHistory(productId)
      } else {
        setStockHistory(localHistory)
      }
    } finally {
      setIsHistoryLoading(false)
    }
  }

  // Generate initial stock history data (only if no real data exists)
  const generateInitialHistory = (productId: string) => {
    const product = products.find(p => p._id === productId)
    if (!product) return

    const initialHistory: StockHistoryItem[] = [
      {
        _id: `${productId}-initial`,
        productId: productId,
        productName: product.name,
        previousStock: 0,
        newStock: product.stock,
        change: product.stock,
        type: 'restock',
        reason: 'Initial product setup',
        changedBy: 'System',
        changedAt: product.createdAt,
        productPrice: product.price,
        valueChange: product.stock * product.price
      }
    ]

    setStockHistory(initialHistory)
    console.log(`📊 Generated initial history record`)
  }

  // Handle view stock history
  const handleViewHistory = async (productId: string) => {
    const product = products.find(p => p._id === productId)
    if (!product) return

    setSelectedProductHistory(product)
    setHistoryModalOpen(true)
    setDropdownOpen(null) // Close dropdown
    
    // Fetch the stock history
    await fetchStockHistory(productId)
  }

  // Close history modal
  const closeHistoryModal = () => {
    setHistoryModalOpen(false)
    setSelectedProductHistory(null)
    setStockHistory([])
  }

  // Download stock history as CSV
  const downloadStockHistory = async () => {
    if (!selectedProductHistory || stockHistory.length === 0) return

    try {
      setIsDownloading(true)
      
      // Create CSV content
      const headers = ['Date', 'Time', 'Product Name', 'Previous Stock', 'New Stock', 'Change', 'Type', 'Reason', 'Changed By', 'Product Price', 'Value Change']
      const csvData = stockHistory.map(record => [
        new Date(record.changedAt).toLocaleDateString(),
        new Date(record.changedAt).toLocaleTimeString(),
        `"${record.productName.replace(/"/g, '""')}"`,
        record.previousStock,
        record.newStock,
        record.change,
        record.type.replace('_', ' '),
        `"${(record.reason || '').replace(/"/g, '""')}"`,
        record.changedBy,
        record.productPrice,
        record.valueChange
      ])

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `stock-history-${selectedProductHistory.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: "Download Complete",
        description: `Stock history for "${selectedProductHistory.name}" has been downloaded.`,
        variant: "default",
      })
      
    } catch (error) {
      console.error('❌ Error downloading stock history:', error)
      toast({
        title: "Download Failed",
        description: "Failed to download stock history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // Download stock history as PDF
  const downloadStockHistoryPDF = async () => {
    if (!selectedProductHistory || stockHistory.length === 0) return

    try {
      setIsDownloading(true)
      
      // Create PDF content using simple HTML approach
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('Could not open print window')
      }

      const productName = selectedProductHistory.name
      const currentDate = new Date().toLocaleDateString()
      
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Stock History - ${productName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #2d3748; }
            .header .subtitle { color: #666; margin: 5px 0; }
            .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th { background: #2d3748; color: white; padding: 10px; text-align: left; }
            .table td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
            .table tr:nth-child(even) { background: #f8f9fa; }
            .positive { color: #10b981; }
            .negative { color: #ef4444; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Stock History Report</h1>
            <div class="subtitle">${productName}</div>
            <div class="subtitle">Generated on ${currentDate}</div>
          </div>
          
          <div class="summary">
            <div class="summary-row"><strong>Product:</strong> ${productName}</div>
            <div class="summary-row"><strong>Total Records:</strong> ${stockHistory.length}</div>
            <div class="summary-row"><strong>Current Stock:</strong> ${selectedProductHistory.stock} units</div>
            <div class="summary-row"><strong>Current Value:</strong> KSh ${(selectedProductHistory.price * selectedProductHistory.stock).toLocaleString()}</div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Previous</th>
                <th>New</th>
                <th>Change</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Value Impact</th>
              </tr>
            </thead>
            <tbody>
              ${stockHistory.map(record => `
                <tr>
                  <td>${new Date(record.changedAt).toLocaleString()}</td>
                  <td>${record.previousStock}</td>
                  <td>${record.newStock}</td>
                  <td class="${record.change > 0 ? 'positive' : record.change < 0 ? 'negative' : ''}">
                    ${record.change > 0 ? '+' : ''}${record.change}
                  </td>
                  <td>${record.type.replace('_', ' ')}</td>
                  <td>${record.reason || '-'}</td>
                  <td class="${record.valueChange > 0 ? 'positive' : record.valueChange < 0 ? 'negative' : ''}">
                    ${record.valueChange > 0 ? '+' : ''}KSh ${Math.abs(record.valueChange).toLocaleString()}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Generated by Vendor Inventory System</p>
            <p>Page generated on ${new Date().toLocaleString()}</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => {
                window.close();
              }, 500);
            }
          </script>
        </body>
        </html>
      `

      printWindow.document.write(pdfContent)
      printWindow.document.close()

      toast({
        title: "PDF Generated",
        description: `Stock history PDF for "${productName}" is being prepared.`,
        variant: "default",
      })

    } catch (error) {
      console.error('❌ Error generating PDF:', error)
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // Download all inventory as CSV
  const downloadInventoryCSV = async () => {
    try {
      setIsDownloading(true)
      
      const inventoryData = filteredProducts.length > 0 ? filteredProducts : products
      
      if (inventoryData.length === 0) {
        toast({
          title: "No Data",
          description: "No inventory items found to download.",
          variant: "destructive",
        })
        return
      }

      // Create CSV content
      const headers = [
        'Product ID', 'Product Name', 'SKU', 'Category', 'Price', 'Stock', 
        'Status', 'Stock Value', 'Eco Friendly', 'Featured', 'Rating', 
        'Review Count', 'Created Date', 'Last Updated'
      ]
      
      const csvData = inventoryData.map(product => [
        product._id,
        `"${product.name.replace(/"/g, '""')}"`,
        product.sku || `PRO-${product._id.slice(-6).toUpperCase()}`,
        product.category,
        product.price,
        product.stock,
        getStockStatus(product.stock),
        formatCurrency(product.price * product.stock).replace('KSh ', ''),
        product.isEcoFriendly ? 'Yes' : 'No',
        product.isFeatured ? 'Yes' : 'No',
        product.rating,
        product.reviewCount,
        new Date(product.createdAt).toLocaleDateString(),
        new Date(product.updatedAt).toLocaleDateString()
      ])

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `inventory-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: "Inventory Exported",
        description: `${inventoryData.length} inventory items downloaded as CSV.`,
        variant: "default",
      })
      
    } catch (error) {
      console.error('❌ Error downloading inventory:', error)
      toast({
        title: "Export Failed",
        description: "Failed to export inventory. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // Download all inventory as PDF report
  const downloadInventoryPDF = async () => {
    try {
      setIsDownloading(true)
      
      const inventoryData = filteredProducts.length > 0 ? filteredProducts : products
      
      if (inventoryData.length === 0) {
        toast({
          title: "No Data",
          description: "No inventory items found to download.",
          variant: "destructive",
        })
        return
      }

      // Create PDF content
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('Could not open print window')
      }

      const currentDate = new Date().toLocaleDateString()
      const totalValue = inventoryData.reduce((sum, p) => sum + (p.price * p.stock), 0)
      
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Inventory Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #2d3748; }
            .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .summary-item { display: flex; justify-content: space-between; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            .table th { background: #2d3748; color: white; padding: 8px; text-align: left; }
            .table td { padding: 6px 8px; border-bottom: 1px solid #ddd; }
            .table tr:nth-child(even) { background: #f8f9fa; }
            .low-stock { color: #f59e0b; }
            .out-of-stock { color: #ef4444; }
            .in-stock { color: #10b981; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 11px; }
            @media print {
              body { margin: 0; font-size: 10px; }
              .table { font-size: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Inventory Report</h1>
            <div>Generated on ${currentDate}</div>
          </div>
          
          <div class="summary">
            <div class="summary-item"><strong>Total Products:</strong> ${inventoryData.length}</div>
            <div class="summary-item"><strong>In Stock:</strong> ${inventoryData.filter(p => p.stock > 10).length}</div>
            <div class="summary-item"><strong>Low Stock:</strong> ${inventoryData.filter(p => p.stock > 0 && p.stock <= 10).length}</div>
            <div class="summary-item"><strong>Out of Stock:</strong> ${inventoryData.filter(p => p.stock === 0).length}</div>
            <div class="summary-item"><strong>Total Value:</strong> KSh ${totalValue.toLocaleString()}</div>
            <div class="summary-item"><strong>Filter Applied:</strong> ${filteredProducts.length > 0 ? 'Yes' : 'No'}</div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Stock Value</th>
              </tr>
            </thead>
            <tbody>
              ${inventoryData.map(product => {
                const status = getStockStatus(product.stock)
                const statusClass = status === 'out_of_stock' ? 'out-of-stock' : status === 'low_stock' ? 'low-stock' : 'in-stock'
                return `
                  <tr>
                    <td>${product.name}</td>
                    <td>${product.sku || `PRO-${product._id.slice(-6).toUpperCase()}`}</td>
                    <td>${product.category}</td>
                    <td>KSh ${product.price.toLocaleString()}</td>
                    <td class="${statusClass}">${product.stock}</td>
                    <td class="${statusClass}">${statusConfig[status]?.label}</td>
                    <td>KSh ${(product.price * product.stock).toLocaleString()}</td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Generated by Vendor Inventory System</p>
            <p>Page generated on ${new Date().toLocaleString()}</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => {
                window.close();
              }, 500);
            }
          </script>
        </body>
        </html>
      `

      printWindow.document.write(pdfContent)
      printWindow.document.close()

      toast({
        title: "PDF Report Generated",
        description: `Inventory report with ${inventoryData.length} items is being prepared.`,
        variant: "default",
      })

    } catch (error) {
      console.error('❌ Error generating inventory PDF:', error)
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate inventory report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // Handle CSV import
  const handleImport = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.csv'
    fileInput.style.display = 'none'
    
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        setIsImporting(true)
        
        const text = await file.text()
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length <= 1) {
          throw new Error('CSV file is empty or has no data rows')
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
        
        // Validate required headers
        const requiredHeaders = ['name', 'stock', 'price']
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
        
        if (missingHeaders.length > 0) {
          throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`)
        }

        const importedProducts = []
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
          const product: any = {}
          
          headers.forEach((header, index) => {
            if (values[index]) {
              switch (header) {
                case 'name':
                  product.name = values[index]
                  break
                case 'stock':
                  product.stock = parseInt(values[index]) || 0
                  break
                case 'price':
                  product.price = parseFloat(values[index]) || 0
                  break
                case 'category':
                  product.category = values[index]
                  break
                case 'sku':
                  product.sku = values[index]
                  break
                case 'description':
                  product.description = values[index]
                  break
              }
            }
          })
          
          if (product.name && !isNaN(product.stock) && !isNaN(product.price)) {
            importedProducts.push(product)
          }
        }

        if (importedProducts.length === 0) {
          throw new Error('No valid products found in the CSV file')
        }

        // Simulate API call to import products
        const vendorId = getVendorId()
        const importPromises = importedProducts.map(product => 
          fetch(`${API_BASE}/api/products`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...product,
              vendorId,
              status: product.stock === 0 ? 'out_of_stock' : product.stock <= 10 ? 'low_stock' : 'active'
            }),
          })
        )

        await Promise.all(importPromises)
        
        toast({
          title: "Import Successful",
          description: `Successfully imported ${importedProducts.length} products from CSV.`,
          variant: "default",
        })
        
        // Refresh the products list
        await fetchProducts()
        
      } catch (error) {
        console.error('❌ Error importing CSV:', error)
        toast({
          title: "Import Failed",
          description: error instanceof Error ? error.message : "Failed to import products. Please check your CSV format.",
          variant: "destructive",
        })
      } finally {
        setIsImporting(false)
        document.body.removeChild(fileInput)
      }
    }
    
    document.body.appendChild(fileInput)
    fileInput.click()
  }

  // Handle export with format selection
  const handleExport = () => {
    // Create a dropdown for export options
    const exportData = filteredProducts.length > 0 ? filteredProducts : products
    
    if (exportData.length === 0) {
      toast({
        title: "No Data",
        description: "No inventory items found to export.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Export Options",
      description: `Preparing to export ${exportData.length} items...`,
      variant: "default",
    })

    // Small delay to show the toast, then open download
    setTimeout(() => {
      downloadInventoryCSV()
    }, 500)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const getStockStatus = (stock: number): 'in_stock' | 'low_stock' | 'out_of_stock' => {
    if (stock === 0) return 'out_of_stock'
    if (stock <= 10) return 'low_stock'
    return 'in_stock'
  }

  const getMinStockLevel = (stock: number): number => {
    // Calculate min stock based on current stock level
    if (stock === 0) return 10 // Default minimum for out of stock items
    return Math.max(5, Math.floor(stock * 0.3)) // 30% of current stock or minimum 5
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === "all" || getStockStatus(product.stock) === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getStockLevelColor = (current: number, min: number) => {
    if (current === 0) return "text-red-600"
    if (current <= min) return "text-yellow-600"
    return "text-green-600"
  }

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatChange = (change: number) => {
    return change > 0 ? `+${change}` : change.toString()
  }

  const getChangeColor = (change: number) => {
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
  }

  const getChangeIcon = (change: number) => {
    return change > 0 ? '🔼' : change < 0 ? '🔽' : '➡️'
  }

  // Open stock modal
  const openStockModal = (type: 'add' | 'update' | 'restock', productId: string, productName: string, currentStock: number) => {
    let defaultValue = ""
    
    switch (type) {
      case 'add':
        defaultValue = "10"
        break
      case 'update':
        defaultValue = currentStock.toString()
        break
      case 'restock':
        defaultValue = "50"
        break
    }

    setStockModal({
      isOpen: true,
      type,
      productId,
      productName,
      currentStock,
      inputValue: defaultValue
    })
    setDropdownOpen(null) // Close dropdown when opening modal
  }

  // Close stock modal
  const closeStockModal = () => {
    setStockModal({
      isOpen: false,
      type: null,
      productId: null,
      productName: '',
      currentStock: 0,
      inputValue: ''
    })
  }

  // Handle stock action with correct API endpoint
  const handleStockAction = async () => {
    const { type, productId, productName, currentStock, inputValue } = stockModal

    if (!productId || !type) {
      console.error('❌ Missing product ID or action type')
      return
    }

    // Validate input
    if (!inputValue.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a quantity.",
        variant: "destructive",
      })
      return
    }

    const quantity = parseInt(inputValue)

    if (isNaN(quantity) || quantity < 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid positive number for quantity.",
        variant: "destructive",
      })
      return
    }

    if (quantity === 0 && type === 'add') {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a quantity greater than zero to add stock.",
        variant: "destructive",
      })
      return
    }

    let newStock: number
    let actionDescription: string
    let successTitle: string
    let historyType: StockHistoryItem['type'] = 'manual'

    switch (type) {
      case 'add':
        newStock = currentStock + quantity
        actionDescription = `Added ${quantity} units to "${productName}". New stock: ${newStock}.`
        successTitle = "Stock Added"
        historyType = 'manual'
        break
      case 'update':
        newStock = quantity
        actionDescription = `Stock for "${productName}" has been updated to ${newStock}.`
        successTitle = "Stock Updated"
        historyType = 'adjustment'
        break
      case 'restock':
        newStock = quantity
        actionDescription = `"${productName}" has been restocked to ${newStock} units.`
        successTitle = "Restock Successful"
        historyType = 'restock'
        break
      default:
        return
    }

    try {
      setActionLoading(`${type}-${productId}`)
      console.log(`🔄 ${type}ing stock for product:`, productId, 'New stock:', newStock)
      
      // Prepare the update data
      const updateData = {
        stock: newStock,
        status: newStock === 0 ? 'out_of_stock' : newStock <= 10 ? 'low_stock' : 'active'
      }

      console.log('📦 Sending update data:', updateData)

      // Use the correct API endpoint - update the product directly
      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      console.log('📡 Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ API Response:', result)
        
        if (result.success) {
          toast({
            title: successTitle,
            description: actionDescription,
            variant: "default",
          })
          
          // Update local state immediately for better UX
          const updatedProducts = products.map(p => 
            p._id === productId 
              ? { ...p, stock: newStock, status: updateData.status }
              : p
          )
          setProducts(updatedProducts)
          calculateStats(updatedProducts) // Recalculate total value
          
          // Add to stock history
          addStockHistoryRecord(
            productId, 
            productName, 
            currentStock, 
            newStock, 
            historyType,
            `${type} stock: ${quantity} units`,
            products.find(p => p._id === productId)?.price
          )
          
          closeStockModal()
        } else {
          throw new Error(result.message || `Failed to ${type} stock`)
        }
      } else {
        const errorText = await response.text()
        console.error('❌ Server error:', errorText)
        throw new Error(`Server responded with ${response.status}: ${errorText}`)
      }
    } catch (error) {
      console.error(`❌ Error ${type}ing stock:`, error)
      toast({
        title: `${type === 'add' ? 'Add Stock' : type === 'update' ? 'Update Stock' : 'Restock'} Failed`,
        description: error instanceof Error ? error.message : `Failed to ${type} stock. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  // Handle view product details
  const handleViewProduct = (productId: string) => {
    console.log('👀 Viewing product:', productId)
    setDropdownOpen(null) // Close dropdown before navigation
    router.push(`/vendor/products/${productId}`)
  }

  // Handle edit product
  const handleEditProduct = (productId: string) => {
    console.log('✏️ Editing product:', productId)
    setDropdownOpen(null) // Close dropdown before navigation
    router.push(`/vendor/products/edit/${productId}`)
  }

  // Handle quick stock adjustment with correct API endpoint
  const handleQuickStock = async (productId: string, productName: string, adjustment: number) => {
    try {
      setActionLoading(`quick-${productId}`)
      setDropdownOpen(null) // Close dropdown when action starts
      
      const product = products.find(p => p._id === productId)
      if (!product) return

      const previousStock = product.stock
      const newStock = Math.max(0, product.stock + adjustment)
      
      const updateData = {
        stock: newStock,
        status: newStock === 0 ? 'out_of_stock' : newStock <= 10 ? 'low_stock' : 'active'
      }

      // Use correct endpoint
      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast({
            title: "Stock Updated",
            description: `${adjustment > 0 ? 'Added' : 'Removed'} ${Math.abs(adjustment)} units from "${productName}". New stock: ${newStock}.`,
            variant: "default",
          })
          
          // Update local state without full refresh
          const updatedProducts = products.map(p => 
            p._id === productId 
              ? { ...p, stock: newStock, status: updateData.status }
              : p
          )
          setProducts(updatedProducts)
          calculateStats(updatedProducts) // Recalculate total value
          
          // Add to stock history
          addStockHistoryRecord(
            productId,
            productName,
            previousStock,
            newStock,
            adjustment > 0 ? 'quick_add' : 'quick_remove',
            `Quick ${adjustment > 0 ? 'add' : 'remove'} ${Math.abs(adjustment)} units`,
            product.price
          )
        } else {
          throw new Error(result.message || 'Failed to update stock')
        }
      } else {
        throw new Error('Failed to update stock')
      }
    } catch (error) {
      console.error('Error updating stock:', error)
      toast({
        title: "Update Failed",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  // Button handlers for top action buttons
  const handleAddStockBulk = () => {
    toast({
      title: "Add Stock Feature",
      description: "Bulk stock addition feature will be available soon.",
      variant: "default",
    })
  }

  const getModalConfig = () => {
    const { type, productName, currentStock } = stockModal
    
    switch (type) {
      case 'add':
        return {
          title: "Add Stock",
          description: `Enter quantity to add to "${productName}":`,
          label: "Quantity to Add",
          placeholder: "10"
        }
      case 'update':
        return {
          title: "Update Stock",
          description: `Enter new stock quantity for "${productName}":`,
          label: "New Stock Quantity",
          placeholder: currentStock.toString()
        }
      case 'restock':
        return {
          title: "Restock Product",
          description: `Enter restock quantity for "${productName}":`,
          label: "Restock Quantity",
          placeholder: "50"
        }
      default:
        return {
          title: "Manage Stock",
          description: "Enter quantity:",
          label: "Quantity",
          placeholder: "0"
        }
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Inventory</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your product inventory</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Import Button */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            onClick={handleImport}
            disabled={isImporting}
          >
            {isImporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {isImporting ? 'Importing...' : 'Import'}
          </Button>

          {/* Export Button */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            onClick={handleExport}
            disabled={isDownloading || products.length === 0}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isDownloading ? 'Exporting...' : 'Export'}
          </Button>

          {/* Download PDF Report Button */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            onClick={downloadInventoryPDF}
            disabled={isDownloading || products.length === 0}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            {isDownloading ? 'Generating...' : 'PDF Report'}
          </Button>

          <Button 
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-colors"
            onClick={handleAddStockBulk}
          >
            <Plus className="w-4 h-4" />
            Add Stock
          </Button>
        </div>
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
                <a key={section.id} href={section.href}>
                  <Button
                    variant="outline"
                    className="w-full h-auto p-3 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-green-600" />
                    <span className="text-xs font-medium text-gray-900">{section.name}</span>
                  </Button>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stock Management Modal */}
      <Dialog open={stockModal.isOpen} onOpenChange={closeStockModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getModalConfig().title}</DialogTitle>
            <DialogDescription>
              {getModalConfig().description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">{getModalConfig().label}</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={stockModal.inputValue}
                onChange={(e) => setStockModal(prev => ({ ...prev, inputValue: e.target.value }))}
                placeholder={getModalConfig().placeholder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleStockAction()
                  }
                }}
              />
            </div>
            {stockModal.type === 'add' && (
              <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                <div><strong>Current stock:</strong> {stockModal.currentStock} units</div>
                <div><strong>Quantity to add:</strong> {parseInt(stockModal.inputValue) || 0} units</div>
                <div><strong>New stock will be:</strong> {stockModal.currentStock + (parseInt(stockModal.inputValue) || 0)} units</div>
                <div><strong>Value impact:</strong> {formatCurrency((parseInt(stockModal.inputValue) || 0) * (products.find(p => p._id === stockModal.productId)?.price || 0))}</div>
              </div>
            )}
            {stockModal.type === 'update' && (
              <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                <div><strong>Current stock:</strong> {stockModal.currentStock} units</div>
                <div><strong>New stock will be:</strong> {parseInt(stockModal.inputValue) || 0} units</div>
                <div><strong>Value impact:</strong> {formatCurrency((parseInt(stockModal.inputValue) || 0 - stockModal.currentStock) * (products.find(p => p._id === stockModal.productId)?.price || 0))}</div>
              </div>
            )}
            {stockModal.type === 'restock' && (
              <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                <div><strong>Current stock:</strong> {stockModal.currentStock} units</div>
                <div><strong>Restocking to:</strong> {parseInt(stockModal.inputValue) || 0} units</div>
                <div><strong>Value impact:</strong> {formatCurrency((parseInt(stockModal.inputValue) || 0 - stockModal.currentStock) * (products.find(p => p._id === stockModal.productId)?.price || 0))}</div>
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeStockModal}>
              Cancel
            </Button>
            <Button 
              onClick={handleStockAction}
              disabled={actionLoading !== null}
              className="bg-green-600 hover:bg-green-700 transition-colors"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {stockModal.type === 'add' ? 'Adding...' : stockModal.type === 'update' ? 'Updating...' : 'Restocking...'}
                </>
              ) : (
                stockModal.type === 'add' ? 'Add Stock' : stockModal.type === 'update' ? 'Update Stock' : 'Restock'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock History Modal */}
      <Dialog open={historyModalOpen} onOpenChange={closeHistoryModal}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Stock History - {selectedProductHistory?.name}
            </DialogTitle>
            <DialogDescription>
              Track all stock changes and adjustments for this product. Total value changes based on your actual actions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Download Buttons */}
            {stockHistory.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadStockHistory}
                  disabled={isDownloading}
                  className="flex items-center gap-2"
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isDownloading ? 'Downloading...' : 'Download CSV'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadStockHistoryPDF}
                  disabled={isDownloading}
                  className="flex items-center gap-2"
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  {isDownloading ? 'Generating...' : 'Download PDF'}
                </Button>
                <div className="text-xs text-blue-600 ml-auto flex items-center">
                  <FileText className="w-3 h-3 mr-1" />
                  {stockHistory.length} records available
                </div>
              </div>
            )}

            {isHistoryLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                <span className="ml-2 text-gray-600">Loading stock history...</span>
              </div>
            ) : stockHistory.length > 0 ? (
              <div className="space-y-3">
                {stockHistory.map((history) => (
                  <div key={history._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg`}>
                        {getChangeIcon(history.change)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {formatChange(history.change)} units
                          </span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {history.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{history.reason}</p>
                        <p className="text-xs text-gray-400">
                          Changed by: {history.changedBy} • {formatDate(history.changedAt)}
                        </p>
                        {history.valueChange !== 0 && (
                          <p className={`text-xs font-medium ${getChangeColor(history.valueChange)}`}>
                            Value: {formatChange(history.valueChange > 0 ? history.valueChange : -history.valueChange)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        <span className="line-through mr-2">{history.previousStock}</span>
                        <span className="font-semibold">→ {history.newStock}</span>
                      </div>
                      <div className={`text-sm font-medium ${getChangeColor(history.change)}`}>
                        {formatChange(history.change)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Stock History</h3>
                <p className="text-gray-600">
                  No stock changes recorded for this product yet. Make your first stock adjustment to see history here.
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {stockHistory.length > 0 && `Total records: ${stockHistory.length}`}
            </div>
            <Button variant="outline" onClick={closeHistoryModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading inventory data from database...</span>
        </div>
      )}

      {/* Inventory Summary */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
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
                    <p className="text-sm font-medium text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-600" />
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
                      placeholder="Search products by name or SKU..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Status Filter */}
                <div className="sm:w-48">
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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

                <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>
                {filteredProducts.length} products found • Total Value: {formatCurrency(stats.totalValue)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProducts.map((product) => {
                  const minStock = getMinStockLevel(product.stock)
                  const stockStatus = getStockStatus(product.stock)
                  const stockValue = product.price * product.stock
                  const isCurrentDropdownOpen = dropdownOpen === product._id
                  const productHistory = stockHistoryData[product._id] || []
                  
                  return (
                    <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Product Image - Using actual product images */}
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500">
                            SKU: {product.sku || `PRO-${product._id.slice(-6).toUpperCase()}`}
                          </p>
                          <p className="text-xs text-gray-400">
                            Updated: {formatDate(product.updatedAt)}
                          </p>
                          {productHistory.length > 0 && (
                            <p className="text-xs text-blue-600">
                              {productHistory.length} stock change{productHistory.length !== 1 ? 's' : ''} recorded
                            </p>
                          )}
                          {product.isEcoFriendly && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs mt-1">
                              🌱 Eco-Friendly
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Stock Information */}
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getStockLevelColor(product.stock, minStock)}`}>
                            {product.stock}
                          </p>
                          <p className="text-sm text-gray-500">Min: {minStock}</p>
                        </div>

                        {/* Stock Value */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(stockValue)}</p>
                          <p className="text-sm text-gray-500">Stock Value</p>
                        </div>

                        {/* Status */}
                        <div className="w-24">
                          {getStatusBadge(stockStatus)}
                        </div>

                        {/* Actions - FIXED: Proper dropdown state management */}
                        <DropdownMenu 
                          open={isCurrentDropdownOpen} 
                          onOpenChange={(open) => setDropdownOpen(open ? product._id : null)}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="hover:bg-gray-100 transition-colors"
                              disabled={actionLoading !== null}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {/* View Product Details */}
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => handleViewProduct(product._id)}
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </DropdownMenuItem>
                            
                            {/* Edit Product */}
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => handleEditProduct(product._id)}
                            >
                              <Edit className="w-4 h-4" />
                              Edit Product
                            </DropdownMenuItem>
                            
                            {/* Stock Management Section */}
                            <div className="border-t my-1"></div>
                            
                            {/* Add Stock */}
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => openStockModal('add', product._id, product.name, product.stock)}
                              disabled={actionLoading !== null}
                            >
                              {actionLoading === `add-${product._id}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Plus className="w-4 h-4" />
                              )}
                              {actionLoading === `add-${product._id}` ? 'Adding...' : 'Add Stock'}
                            </DropdownMenuItem>
                            
                            {/* Update Stock */}
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => openStockModal('update', product._id, product.name, product.stock)}
                              disabled={actionLoading !== null}
                            >
                              {actionLoading === `update-${product._id}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <RefreshCw className="w-4 h-4" />
                              )}
                              {actionLoading === `update-${product._id}` ? 'Updating...' : 'Update Stock'}
                            </DropdownMenuItem>
                            
                            {/* Quick Stock Adjustments */}
                            <div className="border-t my-1"></div>
                            <div className="px-2 py-1 text-xs text-gray-500">Quick Adjust</div>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => handleQuickStock(product._id, product.name, 1)}
                              disabled={actionLoading !== null}
                            >
                              <Plus className="w-4 h-4 text-green-600" />
                              Add 1 Unit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => handleQuickStock(product._id, product.name, 5)}
                              disabled={actionLoading !== null}
                            >
                              <Plus className="w-4 h-4 text-green-600" />
                              Add 5 Units
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer text-red-600 hover:bg-gray-50 transition-colors"
                              onClick={() => handleQuickStock(product._id, product.name, -1)}
                              disabled={actionLoading !== null || product.stock <= 0}
                            >
                              <Package className="w-4 h-4" />
                              Remove 1 Unit
                            </DropdownMenuItem>
                            
                            {/* View History - FIXED: Now working properly */}
                            <div className="border-t my-1"></div>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => handleViewHistory(product._id)}
                            >
                              <History className="w-4 h-4" />
                              View History ({productHistory.length})
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedStatus !== "all" 
                      ? "Try adjusting your search or filters"
                      : "No products in inventory"
                    }
                  </p>
                  <a href="/vendor/products/add">
                    <Button className="bg-green-600 hover:bg-green-700 text-white transition-colors">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Product
                    </Button>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Alerts */}
          {stats.lowStock > 0 || stats.outOfStock > 0 ? (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900">
                  <AlertTriangle className="w-5 h-5" />
                  Stock Alerts
                </CardTitle>
                <CardDescription className="text-yellow-700">
                  Products that need attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products
                    .filter(product => getStockStatus(product.stock) !== 'in_stock')
                    .map((product) => (
                      <div key={product._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-600">
                              {getStockStatus(product.stock) === 'out_of_stock' 
                                ? 'Out of stock' 
                                : `Low stock: ${product.stock} remaining (min: ${getMinStockLevel(product.stock)})`
                              }
                            </p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-yellow-600 hover:bg-yellow-700 text-white transition-colors"
                          onClick={() => openStockModal('restock', product._id, product.name, product.stock)}
                          disabled={actionLoading !== null}
                        >
                          {actionLoading === `restock-${product._id}` ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                          ) : (
                            <Plus className="w-4 h-4 mr-1" />
                          )}
                          {actionLoading === `restock-${product._id}` ? 'Restocking...' : 'Restock'}
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <CheckCircle className="w-5 h-5" />
                  All Stock Levels Good
                </CardTitle>
                <CardDescription className="text-green-700">
                  All products have sufficient stock levels
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </>
      )}
    </div>
  )
}