"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  ArrowLeft,
  Save,
  Eye,
  Loader2
} from "lucide-react"

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
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const productId = params.id as string

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`${API_BASE}/api/products/${productId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success && result.data) {
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

  const handleSave = async () => {
    if (!product) return

    try {
      setIsSaving(true)
      
      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Product updated successfully')
        router.push('/vendor/products')
      } else {
        throw new Error(result.message || 'Failed to update product')
      }
    } catch (err) {
      console.error('❌ Error updating product:', err)
      alert('Failed to update product. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The product you are trying to edit does not exist.'}</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-1">Update product information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => router.push(`/vendor/products/${productId}`)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update product name, description, and category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Product Name</label>
              <Input
                value={product.name}
                onChange={(e) => setProduct({...product, name: e.target.value})}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <Textarea
                value={product.description}
                onChange={(e) => setProduct({...product, description: e.target.value})}
                placeholder="Enter product description"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Category</label>
              <Input
                value={product.category}
                onChange={(e) => setProduct({...product, category: e.target.value})}
                placeholder="Enter product category"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
            <CardDescription>Update pricing and stock information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Price (KSh)</label>
              <Input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({...product, price: Number(e.target.value)})}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Original Price (KSh)</label>
              <Input
                type="number"
                value={product.originalPrice || ''}
                onChange={(e) => setProduct({...product, originalPrice: Number(e.target.value) || undefined})}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Stock Quantity</label>
              <Input
                type="number"
                value={product.stock}
                onChange={(e) => setProduct({...product, stock: Number(e.target.value)})}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}