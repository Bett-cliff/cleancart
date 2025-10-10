"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal,
  Tag,
  DollarSign,
  Star,
  Truck,
  Leaf,
  Sparkles
} from "lucide-react"

interface FilterOptions {
  categories: string[]
  priceRange: [number, number]
  minRating: number
  vendors: string[]
  delivery: string[]
  features: string[]
}

interface ProductSearchProps {
  onSearch: (query: string, filters: FilterOptions) => void
  onFiltersChange: (filters: FilterOptions) => void
  initialQuery?: string
}

const categories = [
  "All-Purpose Cleaners",
  "Disinfectants",
  "Floor Care",
  "Bathroom Cleaners",
  "Kitchen Cleaners",
  "Equipment & Tools",
  "Commercial Grade",
  "Eco-Friendly"
]

const vendors = [
  "Sparkle Pro Clean",
  "Eco Clean Solutions", 
  "Industrial Clean KE",
  "Home Sparkle Supplies"
]

const features = [
  "Eco Certified",
  "Professional Grade",
  "Quick Dry",
  "Streak-Free",
  "Concentrated",
  "Biodegradable"
]

const deliveryOptions = [
  "Same Day",
  "Tomorrow", 
  "2-3 Days",
  "Next Week"
]

export default function ProductSearch({ 
  onSearch, 
  onFiltersChange, 
  initialQuery = "" 
}: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 10000],
    minRating: 0,
    vendors: [],
    delivery: [],
    features: []
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery, filters)
  }

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const toggleCategory = (category: string) => {
    const updatedCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    updateFilters({ categories: updatedCategories })
  }

  const toggleVendor = (vendor: string) => {
    const updatedVendors = filters.vendors.includes(vendor)
      ? filters.vendors.filter(v => v !== vendor)
      : [...filters.vendors, vendor]
    updateFilters({ vendors: updatedVendors })
  }

  const toggleFeature = (feature: string) => {
    const updatedFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature]
    updateFilters({ features: updatedFeatures })
  }

  const toggleDelivery = (delivery: string) => {
    const updatedDelivery = filters.delivery.includes(delivery)
      ? filters.delivery.filter(d => d !== delivery)
      : [...filters.delivery, delivery]
    updateFilters({ delivery: updatedDelivery })
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      categories: [],
      priceRange: [0, 10000],
      minRating: 0,
      vendors: [],
      delivery: [],
      features: []
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFilterCount = 
    filters.categories.length +
    filters.vendors.length +
    filters.features.length +
    filters.delivery.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card className="border-emerald-100">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search eco-cleaners, natural disinfectants, green equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 border-emerald-200 focus:border-emerald-300"
              />
            </div>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="relative border-emerald-200 text-emerald-600 hover:bg-emerald-50"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs w-5 h-5 p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {(filters.categories.length > 0 || filters.vendors.length > 0 || filters.features.length > 0 || filters.delivery.length > 0 || filters.minRating > 0) && (
        <Card className="border-emerald-100 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Active Filters:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="ml-auto text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
              >
                <X className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.categories.map(category => (
                <Badge key={category} variant="secondary" className="bg-white text-emerald-700 border-emerald-200">
                  <Tag className="w-3 h-3 mr-1" />
                  {category}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => toggleCategory(category)}
                  />
                </Badge>
              ))}
              {filters.vendors.map(vendor => (
                <Badge key={vendor} variant="secondary" className="bg-white text-blue-700 border-blue-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {vendor}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => toggleVendor(vendor)}
                  />
                </Badge>
              ))}
              {filters.features.map(feature => (
                <Badge key={feature} variant="secondary" className="bg-white text-green-700 border-green-200">
                  <Leaf className="w-3 h-3 mr-1" />
                  {feature}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => toggleFeature(feature)}
                  />
                </Badge>
              ))}
              {filters.delivery.map(delivery => (
                <Badge key={delivery} variant="secondary" className="bg-white text-orange-700 border-orange-200">
                  <Truck className="w-3 h-3 mr-1" />
                  {delivery}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => toggleDelivery(delivery)}
                  />
                </Badge>
              ))}
              {filters.minRating > 0 && (
                <Badge variant="secondary" className="bg-white text-yellow-700 border-yellow-200">
                  <Star className="w-3 h-3 mr-1" />
                  {filters.minRating}+ Stars
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => updateFilters({ minRating: 0 })}
                  />
                </Badge>
              )}
              {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) && (
                <Badge variant="secondary" className="bg-white text-purple-700 border-purple-200">
                  <DollarSign className="w-3 h-3 mr-1" />
                  KSh {filters.priceRange[0]} - {filters.priceRange[1]}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => updateFilters({ priceRange: [0, 10000] })}
                  />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <Card className="border-emerald-100">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`cat-${category}`}
                        checked={filters.categories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor={`cat-${category}`} className="ml-2 text-sm text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Price Range
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) => updateFilters({ 
                        priceRange: [Number(e.target.value), filters.priceRange[1]] 
                      })}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) => updateFilters({ 
                        priceRange: [filters.priceRange[0], Number(e.target.value)] 
                      })}
                      className="text-sm"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    KSh {filters.priceRange[0]} - {filters.priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-emerald-600" />
                  Minimum Rating
                </h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="radio"
                        id={`rating-${rating}`}
                        name="minRating"
                        checked={filters.minRating === rating}
                        onChange={() => updateFilters({ minRating: rating })}
                        className="w-4 h-4 text-emerald-600 border-gray-300"
                      />
                      <label htmlFor={`rating-${rating}`} className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                        {rating}+ Stars
                        <div className="flex">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rating-0"
                      name="minRating"
                      checked={filters.minRating === 0}
                      onChange={() => updateFilters({ minRating: 0 })}
                      className="w-4 h-4 text-emerald-600 border-gray-300"
                    />
                    <label htmlFor="rating-0" className="ml-2 text-sm text-gray-700">
                      Any Rating
                    </label>
                  </div>
                </div>
              </div>

              {/* Vendors */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Vendors
                </h3>
                <div className="space-y-2">
                  {vendors.map(vendor => (
                    <div key={vendor} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`vendor-${vendor}`}
                        checked={filters.vendors.includes(vendor)}
                        onChange={() => toggleVendor(vendor)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor={`vendor-${vendor}`} className="ml-2 text-sm text-gray-700">
                        {vendor}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Additional Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
              
              {/* Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  Features
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {features.map(feature => (
                    <div key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`feature-${feature}`}
                        checked={filters.features.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-gray-700">
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  Delivery
                </h3>
                <div className="space-y-2">
                  {deliveryOptions.map(delivery => (
                    <div key={delivery} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`delivery-${delivery}`}
                        checked={filters.delivery.includes(delivery)}
                        onChange={() => toggleDelivery(delivery)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor={`delivery-${delivery}`} className="ml-2 text-sm text-gray-700">
                        {delivery}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Filter Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button 
                onClick={clearAllFilters}
                variant="outline" 
                className="flex-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
              <Button 
                onClick={() => setShowFilters(false)}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}