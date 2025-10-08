"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
import {
  ArrowLeft,
  Package,
  Upload,
  Plus,
  Trash2,
  Save,
  X,
  Check,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AddProductPage() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    description: "",
    category: "",
    brand: "",
    
    // Pricing & Inventory
    price: "",
    originalPrice: "",
    stock: "",
    sku: "",
    
    // Media
    images: [] as File[],
    
    // Variants
    hasVariants: false,
    variants: [
      {
        id: 1,
        name: "",
        price: "",
        originalPrice: "",
        stock: "",
        sku: "",
        attributes: {
          size: "",
          color: "",
        }
      }
    ],
    
    // Specifications
    specifications: [
      { key: "Ingredients", value: "" },
      { key: "Scent", value: "" },
      { key: "Surface Type", value: "" },
    ],
    
    // Shipping
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    
    // SEO
    metaTitle: "",
    metaDescription: "",
    
    // Settings
    status: "draft",
    isEcoFriendly: false,
    isFeatured: false,
  })

  const categories = [
    "Household Cleaners",
    "Industrial Equipment",
    "Eco-Friendly Products",
    "Waste Management",
    "Pest Control",
    "Hospitality Supplies"
  ]

  const steps = [
    { id: 1, name: "Basic Info", description: "Product name and description" },
    { id: 2, name: "Pricing & Inventory", description: "Price, stock, and variants" },
    { id: 3, name: "Media", description: "Product images" },
    { id: 4, name: "Specifications", description: "Product details and features" },
    { id: 5, name: "Shipping & SEO", description: "Delivery and search optimization" },
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleVariantChange = (index: number, field: string, value: string) => {
    const updatedVariants = [...formData.variants]
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      updatedVariants[index] = {
        ...updatedVariants[index],
        [parent]: {
          ...updatedVariants[index][parent as keyof typeof updatedVariants[0]],
          [child]: value
        }
      }
    } else {
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value
      }
    }
    setFormData(prev => ({ ...prev, variants: updatedVariants }))
  }

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: prev.variants.length + 1,
          name: "",
          price: "",
          originalPrice: "",
          stock: "",
          sku: "",
          attributes: {
            size: "",
            color: "",
          }
        }
      ]
    }))
  }

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      const updatedVariants = formData.variants.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, variants: updatedVariants }))
    }
  }

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - formData.images.length)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, images: updatedImages }))
  }

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedSpecs = [...formData.specifications]
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: value
    }
    setFormData(prev => ({ ...prev, specifications: updatedSpecs }))
  }

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        { key: "", value: "" }
      ]
    }))
  }

  const removeSpecification = (index: number) => {
    const updatedSpecs = formData.specifications.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, specifications: updatedSpecs }))
  }

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Product Created!",
        description: "Your product has been successfully added to your store.",
      })
      
      // Redirect to products list
      // router.push('/vendor/products')
    } catch (error) {
      toast({
        title: "Failed to Create Product",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <p className="text-muted-foreground mb-6">
                Enter the basic details about your product.
              </p>
            </div>

            <div className="grid gap-6">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Eco-Friendly All-Purpose Cleaner"
                />
              </div>

              <div>
                <Label htmlFor="description">Product Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your product features, benefits, and usage..."
                  rows={5}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    placeholder="Your product brand"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isEcoFriendly"
                  checked={formData.isEcoFriendly}
                  onChange={(e) => handleInputChange("isEcoFriendly", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isEcoFriendly" className="cursor-pointer">
                  This is an eco-friendly product
                </Label>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Pricing & Inventory</h3>
              <p className="text-muted-foreground mb-6">
                Set your product pricing and inventory details.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price (KSh) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="850"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (KSh)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="EC-500-001"
                />
              </div>

              {/* Variants */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">Product Variants</h4>
                    <p className="text-sm text-muted-foreground">
                      Add different sizes, colors, or other variations
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange("hasVariants", !formData.hasVariants)}
                  >
                    {formData.hasVariants ? "Remove Variants" : "Add Variants"}
                  </Button>
                </div>

                {formData.hasVariants && (
                  <div className="space-y-4">
                    {formData.variants.map((variant, index) => (
                      <div key={variant.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium">Variant {index + 1}</h5>
                          {formData.variants.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVariant(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid gap-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Variant Name</Label>
                              <Input
                                value={variant.name}
                                onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                                placeholder="e.g., 500ml Bottle"
                              />
                            </div>
                            <div>
                              <Label>SKU</Label>
                              <Input
                                value={variant.sku}
                                onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                                placeholder="EC-500-001"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <Label>Price (KSh)</Label>
                              <Input
                                type="number"
                                value={variant.price}
                                onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                                placeholder="850"
                              />
                            </div>
                            <div>
                              <Label>Original Price (KSh)</Label>
                              <Input
                                type="number"
                                value={variant.originalPrice}
                                onChange={(e) => handleVariantChange(index, "originalPrice", e.target.value)}
                                placeholder="1000"
                              />
                            </div>
                            <div>
                              <Label>Stock</Label>
                              <Input
                                type="number"
                                value={variant.stock}
                                onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                                placeholder="25"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Size</Label>
                              <Input
                                value={variant.attributes.size}
                                onChange={(e) => handleVariantChange(index, "attributes.size", e.target.value)}
                                placeholder="e.g., 500ml, 1L"
                              />
                            </div>
                            <div>
                              <Label>Color</Label>
                              <Input
                                value={variant.attributes.color}
                                onChange={(e) => handleVariantChange(index, "attributes.color", e.target.value)}
                                placeholder="e.g., Blue, Green"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addVariant}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Variant
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Images</h3>
              <p className="text-muted-foreground mb-6">
                Upload high-quality images of your product. You can add up to 5 images.
              </p>
            </div>

            <div className="grid gap-6">
              {/* Image Upload Area */}
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Upload Product Images</h4>
                <p className="text-muted-foreground mb-4">
                  Drag and drop images here, or click to browse
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="max-w-xs mx-auto"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, JPEG up to 5MB each
                </p>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-4">Uploaded Images ({formData.images.length}/5)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg border overflow-hidden">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                              Main
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
              <p className="text-muted-foreground mb-6">
                Add detailed specifications and features of your product.
              </p>
            </div>

            <div className="space-y-4">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Label>Specification Name</Label>
                    <Input
                      value={spec.key}
                      onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                      placeholder="e.g., Ingredients, Capacity, Warranty"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Value</Label>
                    <Input
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      placeholder="e.g., Plant-based, 2 years"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSpecification(index)}
                    className="mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addSpecification}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Specification
              </Button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Shipping & SEO</h3>
              <p className="text-muted-foreground mb-6">
                Configure shipping details and search engine optimization.
              </p>
            </div>

            <div className="grid gap-6">
              {/* Shipping */}
              <div className="space-y-4">
                <h4 className="font-semibold">Shipping Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      placeholder="0.5"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="length">Length (cm)</Label>
                      <Input
                        id="length"
                        value={formData.dimensions.length}
                        onChange={(e) => handleInputChange("dimensions", {
                          ...formData.dimensions,
                          length: e.target.value
                        })}
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <Label htmlFor="width">Width (cm)</Label>
                      <Input
                        id="width"
                        value={formData.dimensions.width}
                        onChange={(e) => handleInputChange("dimensions", {
                          ...formData.dimensions,
                          width: e.target.value
                        })}
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        value={formData.dimensions.height}
                        onChange={(e) => handleInputChange("dimensions", {
                          ...formData.dimensions,
                          height: e.target.value
                        })}
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div className="space-y-4">
                <h4 className="font-semibold">Search Engine Optimization</h4>
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                    placeholder="Optimized title for search engines"
                  />
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                    placeholder="Brief description for search engine results"
                    rows={3}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h4 className="font-semibold">Product Status</h4>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === "draft"}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                    />
                    Save as Draft
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === "active"}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                    />
                    Publish Now
                  </label>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/vendor/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
              <h1 className="text-3xl font-bold">Add New Product</h1>
              <p className="text-muted-foreground">
                Create a new product listing for your store
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-full h-0.5 mt-5 ${
                      currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1]?.name}</CardTitle>
              <CardDescription>{steps[currentStep - 1]?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button onClick={handleNextStep}>
                    {currentStep === steps.length ? "Create Product" : "Next Step"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* REMOVED: Footer section */}

      {/* Floating Help Desk Widget */}
      <HelpDesk />
    </div>
  )
}