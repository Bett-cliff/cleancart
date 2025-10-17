"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  ArrowLeft,
  Edit,
  Eye,
  ShoppingCart,
  Star,
  Truck,
  Calendar,
  Tag,
  DollarSign,
  Warehouse,
  Loader2
} from "lucide-react"
import Link from "next/link"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const productId = params.id as string

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log('🔄 Fetching product details for:', productId)
        
        const response = await fetch(`${API_BASE}/api/products/${productId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success && result.data) {
          console.log('✅ Product details loaded:', result.data)
          setProduct(result.data)
        } else {
          throw new Error(result.message || 'Product not found')
        }
      } catch (err) {
        console.error('❌ Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "In Stock", variant: "default" as const },
      low_stock: { label: "Low Stock", variant: "secondary" as const },
      out_of_stock: { label: "Out of Stock", variant: "destructive" as const },
      archived: { label: "Archived", variant: "outline" as const },
      draft: { label: "Draft", variant: "outline" as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.back()} className="bg-green-600 hover:bg-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/vendor/products')} className="bg-green-600 hover:bg-green-700">
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-1">Product details and information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/vendor/products/edit/${product._id}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Product
            </Button>
          </Link>
          <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View Live
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Basic details about your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Product Name</label>
                  <p className="text-lg font-semibold text-gray-900">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{product.category}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Price</label>
                  <p className="text-2xl font-bold text-green-600">KSh {product.price.toLocaleString()}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      KSh {product.originalPrice.toLocaleString()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Stock Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Package className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{product.stock} units available</p>
                    {getStatusBadge(product.status)}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-700 mt-1 whitespace-pre-wrap">{product.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
                <CardDescription>Product specifications and features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <span className="text-sm font-medium text-gray-600">{spec.key}</span>
                      <span className="text-sm text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Product Variants</CardTitle>
                <CardDescription>Different versions of this product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{variant.name}</h4>
                          <p className="text-sm text-gray-600">SKU: {variant.sku}</p>
                          {variant.attributes && (
                            <div className="flex gap-2 mt-2">
                              {variant.attributes.size && (
                                <Badge variant="outline">Size: {variant.attributes.size}</Badge>
                              )}
                              {variant.attributes.color && (
                                <Badge variant="outline">Color: {variant.attributes.color}</Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">KSh {variant.price.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{variant.stock} in stock</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Status</span>
                {getStatusBadge(product.status)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Visibility</span>
                <Badge variant={product.isFeatured ? "default" : "outline"}>
                  {product.isFeatured ? "Featured" : "Standard"}
                </Badge>
              </div>
              {product.isEcoFriendly && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Eco-Friendly</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    🌱 Eco-Friendly
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Total Orders</span>
                </div>
                <span className="font-semibold text-gray-900">{product.reviewCount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Rating</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {product.rating || 'No ratings'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <span className="font-semibold text-gray-900">
                  KSh {((product.reviewCount || 0) * product.price).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Created</span>
                </div>
                <span className="text-sm text-gray-900">{formatDate(product.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Last Updated</span>
                </div>
                <span className="text-sm text-gray-900">{formatDate(product.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}