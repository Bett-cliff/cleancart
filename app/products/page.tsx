"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, Plus, Edit, Trash2, Package, Star, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchProducts, type Product } from "@/lib/api"

// Map MongoDB categories to display categories
const categoryMap: { [key: string]: string } = {
  "industrial-equipment": "Industrial",
  "household-cleaners": "Household",
  "eco-friendly": "Eco-Friendly"
}

// Map MongoDB categories to eco labels
const ecoLabelMap: { [key: string]: string } = {
  "eco-friendly": "Eco-Friendly",
  "household-cleaners": "Natural",
  "industrial-equipment": "Professional"
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [ecoFilter, setEcoFilter] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from MongoDB on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const response = await fetchProducts()
        if (response.success && response.products) {
          setProducts(response.products)
        } else {
          setError("Failed to load products")
        }
      } catch (err) {
        setError("Error connecting to server")
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filter products based on user selections
  const filteredProducts = products.filter((product) => {
    const displayCategory = categoryMap[product.category] || product.category
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || displayCategory === selectedCategory
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && product.price < 500) ||
      (priceRange === "medium" && product.price >= 500 && product.price < 1500) ||
      (priceRange === "high" && product.price >= 1500)
    const matchesEco = !ecoFilter || product.category === "eco-friendly"

    return matchesSearch && matchesCategory && matchesPrice && matchesEco
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading products from database...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Failed to load products</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/cleancart-logo.png" alt="CleanCart Logo" width={40} height={40} className="rounded-lg" />
              <span className="text-xl font-bold text-primary">CleanCart</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-muted-foreground hover:text-primary">
                Home
              </Link>
              <Link href="/marketplace" className="text-muted-foreground hover:text-primary">
                Marketplace
              </Link>
              <Link href="/products" className="text-primary font-medium">
                Products
              </Link>
              <Link href="/orders" className="text-muted-foreground hover:text-primary">
                Orders
              </Link>
              <Link href="/analytics" className="text-muted-foreground hover:text-primary">
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
            <p className="text-muted-foreground mt-2">
              Managing {products.length} products from MongoDB database
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Household">Household</SelectItem>
                      <SelectItem value="Eco-Friendly">Eco-Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="low">Under KSh 500</SelectItem>
                      <SelectItem value="medium">KSh 500 - 1,500</SelectItem>
                      <SelectItem value="high">Over KSh 1,500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Eco-Friendly Filter */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="eco-filter" checked={ecoFilter} onCheckedChange={setEcoFilter} />
                  <label htmlFor="eco-filter" className="text-sm font-medium">
                    Eco-Friendly Only
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select defaultValue="name">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="price">Sort by Price</SelectItem>
                    <SelectItem value="stock">Sort by Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search terms
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const displayCategory = categoryMap[product.category] || product.category
                  const ecoLabel = ecoLabelMap[product.category] || "Standard"
                  const isEcoFriendly = product.category === "eco-friendly"
                  
                  return (
                    <Card key={product._id} className="group hover:shadow-lg transition-shadow">
                      <CardHeader className="p-0">
                        <div className="relative">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          {isEcoFriendly && (
                            <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                              <Leaf className="w-3 h-3 mr-1" />
                              {ecoLabel}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-bold text-primary">
                            KSh {product.price.toLocaleString()}
                          </span>
                          <Badge variant={product.inStock ? "outline" : "destructive"} className="text-xs">
                            <Package className="w-3 h-3 mr-1" />
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {displayCategory}
                        </Badge>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <div className="flex space-x-2 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-destructive hover:text-destructive bg-transparent"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}