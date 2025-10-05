import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, ShoppingCart, Share2, MapPin, Truck, Shield, ArrowLeft, Plus, Minus } from "lucide-react"

// This would typically come from a database or API
const getProduct = async (id: string) => {
  // Mock product data - in real app, fetch from database
  const products = {
    "1": {
      id: 1,
      name: "Eco-Friendly All-Purpose Cleaner",
      vendor: "Green Clean Kenya",
      price: "KSh 1,250",
      originalPrice: "KSh 1,500",
      rating: 4.8,
      reviews: 124,
      images: [
        "/eco-friendly-cleaner.jpg",
        "/eco-friendly-cleaner-2.jpg",
        "/eco-friendly-cleaner-3.jpg",
        "/eco-friendly-cleaner-4.jpg",
      ],
      isEcoFriendly: true,
      location: "Nairobi",
      inStock: true,
      stockCount: 45,
      discount: 17,
      category: "household",
      description:
        "Our premium eco-friendly all-purpose cleaner is formulated with natural ingredients that are safe for your family and the environment. This powerful cleaner effectively removes dirt, grease, and grime from multiple surfaces without leaving harmful residues.",
      specifications: [
        "Volume: 500ml bottle",
        "Formula: 100% biodegradable",
        "Scent: Fresh citrus",
        "Surface compatibility: Multi-surface safe",
        "Ingredients: Plant-based surfactants",
        "Packaging: Recyclable bottle",
      ],
      features: [
        "Non-toxic and safe for children and pets",
        "Effective on kitchen counters, bathrooms, and floors",
        "Concentrated formula - dilute for different cleaning tasks",
        "Pleasant natural citrus fragrance",
        "Cruelty-free and not tested on animals",
        "Made in Kenya with locally sourced ingredients",
      ],
      tags: ["eco-friendly", "natural", "biodegradable", "non-toxic"],
      freeShipping: true,
      fastDelivery: true,
      warranty: "30-day satisfaction guarantee",
      certifications: ["EcoMark Certified", "Kenya Bureau of Standards"],
    },
  }

  return products[id as keyof typeof products] || null
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Image src="/cleancart-logo.png" alt="CleanCart Logo" width={32} height={32} className="w-8 h-8" />
              <span className="text-xl font-bold text-foreground">CleanCart</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <span className="text-muted-foreground">/</span>
            </li>
            <li>
              <Link href="/marketplace" className="text-muted-foreground hover:text-primary">
                Marketplace
              </Link>
            </li>
            <li>
              <span className="text-muted-foreground">/</span>
            </li>
            <li>
              <span className="text-foreground font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>

        <Link
          href="/marketplace"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Marketplace
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 border-2 border-transparent hover:border-primary"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-lg text-muted-foreground">by {product.vendor}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-primary">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">{product.originalPrice}</span>
                )}
              </div>
              {product.discount && (
                <Badge className="bg-destructive text-destructive-foreground">Save {product.discount}%</Badge>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Ships from {product.location}</span>
              </div>
              {product.freeShipping && (
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Free shipping</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600">{product.warranty}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium">Stock:</span>
                <Badge variant={product.inStock ? "secondary" : "outline"}>
                  {product.inStock ? `${product.stockCount} available` : "Out of stock"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="sm" className="rounded-r-none">
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="px-4 py-2 border-x">1</div>
                <Button variant="ghost" size="sm" className="rounded-l-none">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button size="lg" className="flex-1" disabled={!product.inStock}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm">Secure payment with M-PESA, Visa & MasterCard</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Fast delivery within 2-3 business days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
            <TabsTrigger value="vendor">Vendor Info</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <h4 className="font-semibold mb-3">Key Features:</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, index) => {
                    const [key, value] = spec.split(": ")
                    return (
                      <div key={index} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Certifications:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert) => (
                      <Badge key={cert} variant="outline">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{product.rating}</div>
                    <div className="flex items-center justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">{product.reviews} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center space-x-2 mb-1">
                        <span className="text-sm w-8">{stars}★</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">
                          {stars === 5 ? 87 : stars === 4 ? 25 : stars === 3 ? 6 : stars === 2 ? 4 : 2}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="mb-6" />

                <div className="space-y-6">
                  {[
                    {
                      name: "Sarah M.",
                      rating: 5,
                      date: "2 days ago",
                      comment:
                        "Excellent product! Works great on all surfaces and smells amazing. Will definitely buy again.",
                    },
                    {
                      name: "John K.",
                      rating: 4,
                      date: "1 week ago",
                      comment: "Good quality cleaner. A bit pricey but worth it for the eco-friendly formula.",
                    },
                    {
                      name: "Mary W.",
                      rating: 5,
                      date: "2 weeks ago",
                      comment: "Love that it's made locally and works so well. Great for families with kids.",
                    },
                  ].map((review, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.name}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? "fill-primary text-primary" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendor" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{product.vendor}</h3>
                    <p className="text-muted-foreground mb-4">
                      Trusted eco-friendly cleaning supplies vendor based in {product.location}. Specializing in
                      natural, biodegradable products that are safe for families and the environment.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">4.8</div>
                        <div className="text-sm text-muted-foreground">Vendor Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">45</div>
                        <div className="text-sm text-muted-foreground">Products</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">2+</div>
                        <div className="text-sm text-muted-foreground">Years Active</div>
                      </div>
                    </div>
                    <Button variant="outline">Visit Store</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src="/placeholder.svg" alt="Related product" className="w-full h-48 object-cover rounded-t-lg" />
                  <Badge className="absolute top-2 left-2 text-xs">Eco</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">Related Eco Product {i}</h3>
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm ml-1">4.{5 + i}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">KSh {800 + i * 100}</span>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
