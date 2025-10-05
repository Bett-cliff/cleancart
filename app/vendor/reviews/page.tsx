"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
import {
  Star,
  Filter,
  Search,
  MessageCircle,
  ThumbsUp,
  Flag,
  MoreHorizontal,
  Eye,
  Calendar,
  User,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock reviews data
const mockReviews = [
  {
    id: 'REV-001',
    customer: {
      name: 'Sarah Wanjiku',
      email: 'sarah.w@email.com',
      location: 'Nairobi',
      avatar: '/placeholder-avatar.jpg'
    },
    product: {
      id: 1,
      name: 'Eco-Friendly All-Purpose Cleaner',
      image: '/placeholder-cleaner.jpg',
      price: 850
    },
    rating: 5,
    title: 'Excellent Eco-Friendly Cleaner!',
    comment: 'This cleaner works wonders on all surfaces. Love that it\'s eco-friendly and smells amazing. Will definitely buy again!',
    images: ['/placeholder-review-1.jpg', '/placeholder-review-2.jpg'],
    date: '2024-06-15T14:30:00Z',
    status: 'published',
    helpful: 3,
    vendorResponse: {
      text: 'Thank you for your wonderful feedback, Sarah! We\'re thrilled to hear you love our eco-friendly cleaner. We appreciate you choosing sustainable options!',
      date: '2024-06-16T09:15:00Z'
    },
    orderId: 'ORD-002'
  },
  {
    id: 'REV-002',
    customer: {
      name: 'John Mwangi',
      email: 'john.mwangi@email.com',
      location: 'Mombasa',
      avatar: '/placeholder-avatar.jpg'
    },
    product: {
      id: 2,
      name: 'Professional Pressure Washer',
      image: '/placeholder-pressure-washer.jpg',
      price: 45000
    },
    rating: 4,
    title: 'Powerful and Reliable',
    comment: 'Great pressure washer for commercial use. Powerful enough for tough cleaning jobs. Delivery was fast too.',
    images: [],
    date: '2024-06-14T11:20:00Z',
    status: 'published',
    helpful: 1,
    vendorResponse: null,
    orderId: 'ORD-001'
  },
  {
    id: 'REV-003',
    customer: {
      name: 'Grace Achieng',
      email: 'grace.achieng@email.com',
      location: 'Kisumu',
      avatar: '/placeholder-avatar.jpg'
    },
    product: {
      id: 3,
      name: 'Natural Floor Cleaner',
      image: '/placeholder-floor-cleaner.jpg',
      price: 750
    },
    rating: 3,
    title: 'Good but could be better',
    comment: 'The cleaner works okay but the scent is too strong for my liking. Wish there were more fragrance options.',
    images: ['/placeholder-review-3.jpg'],
    date: '2024-06-13T16:45:00Z',
    status: 'published',
    helpful: 0,
    vendorResponse: {
      text: 'Thank you for your feedback, Grace! We\'re working on introducing more fragrance options. Your input helps us improve our products.',
      date: '2024-06-14T10:30:00Z'
    },
    orderId: 'ORD-003'
  },
  {
    id: 'REV-004',
    customer: {
      name: 'David Kimani',
      email: 'david.kimani@email.com',
      location: 'Nakuru',
      avatar: '/placeholder-avatar.jpg'
    },
    product: {
      id: 4,
      name: 'Glass Cleaning Solution',
      image: '/placeholder-glass-cleaner.jpg',
      price: 700
    },
    rating: 2,
    title: 'Leaves streaks',
    comment: 'Not happy with this product. It leaves streaks on my windows and mirrors. Expected better results.',
    images: [],
    date: '2024-06-12T09:15:00Z',
    status: 'published',
    helpful: 2,
    vendorResponse: null,
    orderId: 'ORD-004'
  },
  {
    id: 'REV-005',
    customer: {
      name: 'Michael Ochieng',
      email: 'm.ochieng@email.com',
      location: 'Eldoret',
      avatar: '/placeholder-avatar.jpg'
    },
    product: {
      id: 5,
      name: 'Eco Dish Soap',
      image: '/placeholder-dish-soap.jpg',
      price: 700
    },
    rating: 5,
    title: 'Best dish soap ever!',
    comment: 'Gentle on hands but tough on grease. Love the natural ingredients and eco-friendly packaging.',
    images: ['/placeholder-review-4.jpg'],
    date: '2024-06-11T13:20:00Z',
    status: 'published',
    helpful: 5,
    vendorResponse: null,
    orderId: 'ORD-005'
  },
  {
    id: 'REV-006',
    customer: {
      name: 'Anonymous',
      email: '',
      location: 'Nairobi',
      avatar: '/placeholder-avatar.jpg'
    },
    product: {
      id: 1,
      name: 'Eco-Friendly All-Purpose Cleaner',
      image: '/placeholder-cleaner.jpg',
      price: 850
    },
    rating: 1,
    title: 'Product leaked during delivery',
    comment: 'Very disappointed. The bottle arrived leaking and half empty. Poor packaging quality.',
    images: ['/placeholder-review-5.jpg'],
    date: '2024-06-10T17:30:00Z',
    status: 'pending',
    helpful: 0,
    vendorResponse: null,
    orderId: 'ORD-006'
  }
]

export default function VendorReviewsPage() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState(mockReviews)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRating, setSelectedRating] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')

  const stats = {
    total: reviews.length,
    average: (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1),
    fiveStar: reviews.filter(r => r.rating === 5).length,
    pending: reviews.filter(r => r.status === 'pending').length,
    withResponse: reviews.filter(r => r.vendorResponse !== null).length
  }

  const ratings = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' },
  ]

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'pending', label: 'Pending' },
    { value: 'flagged', label: 'Flagged' },
  ]

  const getRatingBadge = (rating: number) => {
    const colors = {
      5: 'bg-green-500',
      4: 'bg-blue-500',
      3: 'bg-yellow-500',
      2: 'bg-orange-500',
      1: 'bg-red-500'
    }
    return (
      <Badge className={`${colors[rating as keyof typeof colors]} text-white flex items-center gap-1`}>
        <Star className="w-3 h-3 fill-current" />
        {rating}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: 'Published', variant: 'default' as const, icon: CheckCircle2 },
      pending: { label: 'Pending Review', variant: 'secondary' as const, icon: Clock },
      flagged: { label: 'Flagged', variant: 'destructive' as const, icon: Flag },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const, icon: MoreHorizontal }
    const IconComponent = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const handleSubmitResponse = async (reviewId: string) => {
    if (!responseText.trim()) {
      toast({
        title: "Response Required",
        description: "Please write a response before submitting.",
        variant: "destructive",
      })
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? {
              ...review,
              vendorResponse: {
                text: responseText,
                date: new Date().toISOString()
              }
            }
          : review
      ))

      setRespondingTo(null)
      setResponseText('')
      
      toast({
        title: "Response Published!",
        description: "Your response has been published successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to Submit",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    }
  }

  const handleFlagReview = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, status: 'flagged' as const }
        : review
    ))
    
    toast({
      title: "Review Flagged",
      description: "Our team will review this content shortly.",
    })
  }

  const handleApproveReview = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, status: 'published' as const }
        : review
    ))
    
    toast({
      title: "Review Approved",
      description: "The review is now visible to customers.",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRating = selectedRating === 'all' || review.rating === parseInt(selectedRating)
    const matchesStatus = selectedStatus === 'all' || review.status === selectedStatus
    
    return matchesSearch && matchesRating && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Customer Reviews</h1>
            <p className="text-muted-foreground">
              Manage and respond to customer feedback
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats.average}</p>
                <div className="flex justify-center my-2">
                  {renderStars(Number(stats.average))}
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats.fiveStar}</p>
                <p className="text-sm text-muted-foreground">5-Star Reviews</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{stats.withResponse}</p>
                <p className="text-sm text-muted-foreground">With Response</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search reviews..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
                {/* Rating Filter */}
                <select
                  className="border rounded-lg px-3 py-2 text-sm"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                >
                  {ratings.map(rating => (
                    <option key={rating.value} value={rating.value}>
                      {rating.label}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  className="border rounded-lg px-3 py-2 text-sm"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>

                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search criteria' : 'No reviews match your current filters'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Review Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold">{review.customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {review.customer.location} • {formatDate(review.date)}
                          </p>
                        </div>
                      </div>
                      {getRatingBadge(review.rating)}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(review.status)}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{review.helpful}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{review.product.name}</p>
                      <p className="text-xs text-muted-foreground">Order: {review.orderId}</p>
                    </div>
                    <Link href={`/vendor/orders/${review.orderId}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3 mr-1" />
                        View Order
                      </Button>
                    </Link>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                    <p className="text-muted-foreground mb-3">{review.comment}</p>
                    
                    {/* Review Images */}
                    {review.images.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.images.map((image, index) => (
                          <div key={index} className="w-16 h-16 border rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Vendor Response */}
                  {review.vendorResponse && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-blue-900">Your Response</span>
                        <span className="text-xs text-blue-700">
                          {formatDate(review.vendorResponse.date)}
                        </span>
                      </div>
                      <p className="text-blue-800">{review.vendorResponse.text}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    {!review.vendorResponse && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRespondingTo(respondingTo === review.id ? null : review.id)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {respondingTo === review.id ? 'Cancel' : 'Respond'}
                      </Button>
                    )}
                    
                    {review.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveReview(review.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFlagReview(review.id)}
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Flag
                    </Button>

                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Response Form */}
                  {respondingTo === review.id && (
                    <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                      <label className="block text-sm font-medium mb-2">
                        Write your response
                      </label>
                      <Textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Thank the customer for their feedback and address any concerns..."
                        rows={3}
                        className="mb-3"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSubmitResponse(review.id)}
                          disabled={!responseText.trim()}
                        >
                          Submit Response
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setRespondingTo(null)
                            setResponseText('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredReviews.length > 0 && (
          <div className="flex justify-between items-center mt-8">
            <p className="text-sm text-muted-foreground">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/cleancart-logo.png" alt="CleanCart Logo" width={32} height={32} className="w-8 h-8" />
                <span className="text-xl font-bold">CleanCart</span>
              </div>
              <p className="text-muted-foreground">Kenya's premier eco-friendly cleaning supplies marketplace</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Shop</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Household Cleaners</div>
                <div>Industrial Equipment</div>
                <div>Eco-Friendly Products</div>
                <div>Waste Management</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Vendors</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Become a Vendor</div>
                <div>Vendor Dashboard</div>
                <div>Pricing Plans</div>
                <div>Support</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>About Us</div>
                <div>Contact</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CleanCart. All rights reserved. Built for a cleaner Kenya.</p>
          </div>
        </div>
      </footer>

      {/* Floating Help Desk Widget */}
      <HelpDesk />
    </div>
  )
}