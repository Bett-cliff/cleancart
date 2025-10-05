"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { CheckCircle, Store, Users, TrendingUp, Shield, Clock, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function VendorLandingPage() {
  const router = useRouter()

  const features = [
    {
      icon: Store,
      title: "Easy Store Setup",
      description: "Get your business online in minutes with our intuitive vendor dashboard"
    },
    {
      icon: TrendingUp,
      title: "Grow Your Sales",
      description: "Reach thousands of customers looking for eco-friendly cleaning products"
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Manage orders, track shipments, and build customer relationships"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Get paid securely through M-PESA and other payment methods"
    },
    {
      icon: Clock,
      title: "Time Saving Tools",
      description: "Automate inventory, orders, and shipping with our smart tools"
    },
    {
      icon: Star,
      title: "Build Your Brand",
      description: "Showcase your products and build a reputation with customer reviews"
    }
  ]

  const benefits = [
    "Zero setup fees - start selling immediately",
    "Commission-based pricing - pay only when you sell",
    "Real-time inventory and order management",
    "Direct M-PESA payouts to your phone",
    "Marketing and promotion tools",
    "Dedicated vendor support team",
    "Access to analytics and business insights"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold">CleanCart Vendor</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/vendor/login">
                <Button variant="outline">Vendor Login</Button>
              </Link>
              <Link href="/vendor/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Vendor Program
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sell Your Products on
            <span className="text-green-600 block">CleanCart Kenya</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join Kenya's fastest-growing marketplace for eco-friendly cleaning supplies. 
            Reach thousands of customers and grow your business with our powerful vendor tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => router.push('/vendor/register')}
            >
              Start Selling Today
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => router.push('/vendor/login')}
            >
              Vendor Login
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our vendor platform provides all the tools you need to manage and grow your cleaning products business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-green-50 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Sell on CleanCart?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We've built the perfect platform for Kenyan businesses to thrive in the eco-friendly market. 
                Join hundreds of successful vendors already growing with us.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
                  <CardDescription>
                    Join our marketplace in just a few minutes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold">1</span>
                      </div>
                      <span className="text-sm">Create your vendor account</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-semibold">2</span>
                      </div>
                      <span className="text-sm">Add your products and pricing</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-semibold">3</span>
                      </div>
                      <span className="text-sm">Start receiving orders and earning</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => router.push('/vendor/register')}
                  >
                    Apply to Become a Vendor
                  </Button>
                  
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/vendor/login" className="text-blue-600 hover:underline font-medium">
                      Sign in here
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the movement towards cleaner, greener Kenya. Sell your eco-friendly products to customers who care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
              onClick={() => router.push('/vendor/register')}
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-3"
              onClick={() => router.push('/vendor/login')}
            >
              Vendor Login
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}