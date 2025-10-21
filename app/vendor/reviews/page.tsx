"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Star,
  Search,
  Filter,
  MessageCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  User,
  Package,
  Calendar,
  Home,
  ShoppingCart,
  Warehouse,
  Megaphone,
  DollarSign,
  Truck,
  Crown,
  MessageSquare,
  Settings
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    icon: User,
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

// Empty reviews data structure
const emptyReviewsData = {
  summary: {
    averageRating: 0,
    totalReviews: 0,
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0
  },
  reviews: []
}

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")
  const [reviewsData, setReviewsData] = useState(emptyReviewsData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const statuses = ["all", "published", "pending", "hidden"]
  const ratings = ["all", "5", "4", "3", "2", "1"]

  // Fetch reviews data
  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Get vendor token for authentication
        const token = typeof window !== 'undefined' ? localStorage.getItem('vendor_token') : null
        
        if (!token) {
          setError('No authentication token found')
          setReviewsData(emptyReviewsData)
          return
        }

        const response = await fetch('/api/vendor/reviews', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch reviews data')
        }

        const result = await response.json()
        if (result.success && result.data) {
          setReviewsData(result.data)
        } else {
          setReviewsData(emptyReviewsData)
        }
      } catch (err) {
        console.error('Error fetching reviews data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setReviewsData(emptyReviewsData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviewsData()
  }, [])

  const filteredReviews = reviewsData.reviews.filter(review => {
    const matchesSearch = review.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || review.status === selectedStatus
    const matchesRating = selectedRating === "all" || review.rating.toString() === selectedRating
    
    return matchesSearch && matchesStatus && matchesRating
  })

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const config = {
      published: { label: "Published", variant: "default" as const, color: "bg-green-100 text-green-800" },
      pending: { label: "Pending", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      hidden: { label: "Hidden", variant: "outline" as const, color: "bg-gray-100 text-gray-800" }
    }
    const statusConfig = config[status as keyof typeof config]
    return (
      <Badge variant={statusConfig.variant} className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-gray-600 mt-1">Manage and respond to customer feedback</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Vendor Sections Sub-Navbar - Quick Access */}
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

      {/* Review Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span className="text-3xl font-bold text-gray-900">{reviewsData.summary.averageRating}</span>
            </div>
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-xs text-gray-500 mt-1">{reviewsData.summary.totalReviews} reviews</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviewsData.summary[`${rating}Star` as keyof typeof reviewsData.summary] as number
                const percentage = (count / reviewsData.summary.totalReviews) * 100
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium text-gray-900">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                )
              })}
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
                  placeholder="Search reviews, customers, or products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                    {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div className="sm:w-48">
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
              >
                {ratings.map(rating => (
                  <option key={rating} value={rating}>
                    {rating === "all" ? "All Ratings" : `${rating} Star${rating !== "1" ? "s" : ""}`}
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

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>
            {filteredReviews.length} reviews found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{review.customer.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(review.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Hide
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Respond
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                  <p className="text-gray-700">{review.comment}</p>
                </div>

                {/* Product Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{review.product.name}</p>
                    <p className="text-sm text-gray-500">Product reviewed</p>
                  </div>
                </div>

                {/* Review Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{review.helpful} people found this helpful</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Respond
                    </Button>
                    {review.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Response Area (if responded) */}
                {review.status === 'published' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-green-900">Store Owner</span>
                          <Badge variant="outline" className="bg-white text-green-700">
                            Response
                          </Badge>
                        </div>
                        <p className="text-green-800">
                          Thank you for your valuable feedback! We're thrilled to hear you're enjoying our product.
                          We'll take your packaging suggestion into consideration for future improvements.
                        </p>
                        <p className="text-xs text-green-600 mt-2">Responded on 2024-01-21</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedStatus !== "all" || selectedRating !== "all" 
                  ? "Try adjusting your search or filters"
                  : "No customer reviews yet"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}