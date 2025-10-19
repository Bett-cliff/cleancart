// app/vendor/products/edit/[id]/page.tsx
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
  Save,
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle
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
}

interface Message {
  type: 'success' | 'error' | 'info';
  text: string;
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState<string[]>([])
  const [message, setMessage] = useState<Message | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    isEcoFriendly: false,
    isFeatured: false,
    status: "active"
  })

  // Show message and auto-hide after delay
  const showMessage = (type: Message['type'], text: string, duration: number = 5000) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage(null);
    }, duration);
  }

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_BASE}/api/products/${productId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }

        const result = await response.json()
        
        if (result.success) {
          setProduct(result.data)
          setFormData({
            name: result.data.name,
            description: result.data.description,
            price: result.data.price,
            stock: result.data.stock,
            category: result.data.category,
            isEcoFriendly: result.data.isEcoFriendly,
            isFeatured: result.data.isFeatured,
            status: result.data.status
          })
          showMessage('success', 'Product loaded successfully', 3000)
        } else {
          throw new Error(result.message || 'Failed to fetch product')
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        const errorMsg = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMsg)
        showMessage('error', errorMsg)
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Handle image upload using base64
  const handleImageUpload = async (files: FileList) => {
    const newImages: string[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showMessage('error', `${file.name} is not an image file. Please upload PNG, JPG, or WEBP files only.`)
        continue
      }

      // Validate file size (2MB limit for base64)
      if (file.size > 2 * 1024 * 1024) {
        showMessage('error', `${file.name} is too large. Maximum size is 2MB for images.`)
        continue
      }

      try {
        setUploadingImages(prev => [...prev, file.name])
        
        // Convert image to base64
        const base64Image = await convertToBase64(file)
        newImages.push(base64Image)
        
        showMessage('success', `Image "${file.name}" uploaded successfully`, 3000)
        
      } catch (err) {
        console.error('❌ Error converting image:', err)
        showMessage('error', `Failed to process ${file.name}. Please try another image.`)
      } finally {
        setUploadingImages(prev => prev.filter(name => name !== file.name))
      }
    }

    if (newImages.length > 0) {
      setProduct(prev => prev ? {
        ...prev,
        images: [...prev.images, ...newImages]
      } : null)
      showMessage('success', `Added ${newImages.length} new image${newImages.length > 1 ? 's' : ''} to product`)
    }
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleImageUpload(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Remove image
  const removeImage = (index: number) => {
    if (product) {
      const newImages = [...product.images]
      newImages.splice(index, 1)
      setProduct({
        ...product,
        images: newImages
      })
      showMessage('info', 'Image removed from product')
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!product) return

    // Basic validation
    if (!formData.name.trim()) {
      showMessage('error', 'Product name is required')
      return
    }

    if (!formData.description.trim()) {
      showMessage('error', 'Product description is required')
      return
    }

    if (formData.price <= 0) {
      showMessage('error', 'Product price must be greater than 0')
      return
    }

    if (formData.stock < 0) {
      showMessage('error', 'Stock quantity cannot be negative')
      return
    }

    if (!formData.category) {
      showMessage('error', 'Please select a category')
      return
    }

    try {
      setIsSaving(true)
      showMessage('info', 'Saving product changes...')
      
      const updateData = {
        ...formData,
        images: product.images
      }

      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (result.success) {
        showMessage('success', 'Product updated successfully!')
        
        // Wait a moment before redirecting so user can see the success message
        setTimeout(() => {
          router.push('/vendor/products')
        }, 1500)
      } else {
        throw new Error(result.message || 'Failed to update product')
      }
    } catch (err) {
      console.error('❌ Error updating product:', err)
      const errorMsg = err instanceof Error ? err.message : 'An error occurred while saving'
      setError(errorMsg)
      showMessage('error', errorMsg)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2">Loading product...</span>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/vendor/products">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
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
          <Link href="/vendor/products">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <div className={`rounded-lg p-4 border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : message.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center gap-3">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : message.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            )}
            <span className="font-medium">{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="ml-auto hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/vendor/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">Update your product information and images</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Upload images (stored as base64 in database)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Upload Area */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer bg-gray-50"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleImageUpload(e.target.files)
                      }
                    }}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      Click to upload or drag & drop
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, WEBP up to 2MB
                    </span>
                  </div>
                </div>

                {/* Uploading Indicator */}
                {uploadingImages.length > 0 && (
                  <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-600">Processing Images...</p>
                    {uploadingImages.map((fileName, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-blue-700">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {fileName}
                      </div>
                    ))}
                  </div>
                )}

                {/* Current Images */}
                {product.images.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-600">
                        Current Images
                      </p>
                      <Badge variant="outline">
                        {product.images.length} image{product.images.length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {product.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeImage(index)
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Images State */}
                {product.images.length === 0 && uploadingImages.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">No images uploaded yet</p>
                    <p className="text-xs text-gray-500">Upload product images to display here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>
                  Update your product details and specifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Product Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Description *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price (KSh) *</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Stock Quantity *</label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Household Cleaners">Household Cleaners</option>
                    <option value="Industrial Equipment">Industrial Equipment</option>
                    <option value="Eco-Friendly Products">Eco-Friendly Products</option>
                    <option value="Waste Management">Waste Management</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="Hospitality Supplies">Hospitality Supplies</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isEcoFriendly}
                      onChange={(e) => setFormData(prev => ({ ...prev, isEcoFriendly: e.target.checked }))}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium">Eco-Friendly Product</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium">Featured Product</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end mt-6">
              <Link href="/vendor/products">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}