"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, User, Search, ArrowRight, Leaf, Lightbulb, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const blogPosts = [
    {
      id: 1,
      title: "10 Eco-Friendly Cleaning Tips for a Greener Home",
      excerpt: "Discover simple ways to make your cleaning routine more sustainable while keeping your home spotless.",
      author: "Sarah Wanjiku",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Tips & Tricks",
      image: "/blog-eco-tips.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "The Rise of Green Cleaning in Kenya's Hospitality Industry",
      excerpt: "How hotels and restaurants across Kenya are embracing sustainable cleaning practices.",
      author: "David Kimani",
      date: "2024-01-12",
      readTime: "7 min read",
      category: "Industry News",
      image: "/blog-hospitality.jpg",
      featured: false,
    },
    {
      id: 3,
      title: "DIY Natural Cleaning Solutions You Can Make at Home",
      excerpt: "Learn how to create effective, non-toxic cleaning products using common household items.",
      author: "Grace Achieng",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "DIY",
      image: "/blog-diy-cleaning.jpg",
      featured: false,
    },
    {
      id: 4,
      title: "Understanding Cleaning Product Labels: What to Look For",
      excerpt: "A comprehensive guide to reading and understanding cleaning product ingredients and certifications.",
      author: "Michael Ochieng",
      date: "2024-01-08",
      readTime: "8 min read",
      category: "Education",
      image: "/blog-product-labels.jpg",
      featured: false,
    },
    {
      id: 5,
      title: "The Environmental Impact of Traditional Cleaning Products",
      excerpt: "Exploring how conventional cleaners affect our environment and what alternatives exist.",
      author: "Jane Muthoni",
      date: "2024-01-05",
      readTime: "9 min read",
      category: "Environment",
      image: "/blog-environmental-impact.jpg",
      featured: false,
    },
    {
      id: 6,
      title: "Building a Sustainable Cleaning Business in Kenya",
      excerpt: "Tips and strategies for entrepreneurs looking to start eco-friendly cleaning services.",
      author: "Peter Kariuki",
      date: "2024-01-03",
      readTime: "10 min read",
      category: "Business",
      image: "/blog-sustainable-business.jpg",
      featured: false,
    },
  ]

  const categories = ["All", "Tips & Tricks", "Industry News", "DIY", "Education", "Environment", "Business"]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center space-x-2">
                  <Image src="/cleancart-logo.png" alt="CleanCart Logo" width={32} height={32} className="w-8 h-8" />
                  <span className="text-xl font-bold text-foreground">CleanCart</span>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">
                Shop
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/blog" className="text-primary font-medium">
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Lightbulb className="w-3 h-3 mr-1" />
            CleanCart Blog
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Clean Living Insights</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover eco-friendly cleaning tips, industry insights, and sustainable living advice from our community of
            experts and enthusiasts.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <TrendingUp className="w-5 h-5 text-primary mr-2" />
              <h2 className="text-2xl font-bold">Featured Article</h2>
            </div>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <Image
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    width={600}
                    height={400}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge className="mb-4">{featuredPost.category}</Badge>
                  <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>

                  <div className="flex items-center text-sm text-muted-foreground mb-6">
                    <User className="w-4 h-4 mr-1" />
                    <span className="mr-4">{featuredPost.author}</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="mr-4">{new Date(featuredPost.date).toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{featuredPost.readTime}</span>
                  </div>

                  <Button>
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 left-4">{post.category}</Badge>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <User className="w-3 h-3 mr-1" />
                  <span className="mr-3">{post.author}</span>
                  <Calendar className="w-3 h-3 mr-1" />
                  <span className="mr-3">{new Date(post.date).toLocaleDateString()}</span>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{post.readTime}</span>
                </div>

                <Button variant="ghost" className="p-0 h-auto font-semibold text-primary">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <Leaf className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Stay Updated with Clean Living Tips</h3>
              <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter and get the latest eco-friendly cleaning tips, product updates, and
                exclusive offers delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input placeholder="Enter your email" className="bg-primary-foreground text-foreground" />
                <Button variant="secondary">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
