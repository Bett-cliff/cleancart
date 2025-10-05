import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Users, Target, Award, MapPin, Mail, Phone, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Image src="/cleancart-logo.png" alt="CleanCart Logo" width={32} height={32} className="w-8 h-8" />
              <Link href="/">
                <span className="text-xl font-bold text-foreground cursor-pointer">CleanCart</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/marketplace" className="text-foreground hover:text-primary transition-colors">
                Shop
              </Link>
              <Link href="/about" className="text-primary font-medium">
                About
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/blog" className="text-foreground hover:text-primary transition-colors">
                Blog
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/cleancart-logo.png"
              alt="CleanCart Logo"
              width={96}
              height={96}
              className="w-20 h-20 md:w-24 md:h-24"
            />
          </div>

          <Badge variant="secondary" className="mb-4">
            <Leaf className="w-3 h-3 mr-1" />
            About CleanCart
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Revolutionizing Kenya's
            <span className="text-primary"> Cleaning Industry</span>
          </h1>

          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-3xl mx-auto">
            CleanCart is Kenya's first dedicated marketplace for eco-friendly cleaning supplies, connecting trusted
            vendors with customers who care about sustainability and quality.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  To provide accessible, reliable, and sustainable access to cleaning supplies across Kenya by building
                  a trusted, vendor-friendly marketplace that prioritizes usability, trust, and eco-friendly options. We
                  aim to transform how Kenyans shop for cleaning products while supporting local businesses and
                  environmental sustainability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  To become Kenya's leading marketplace for cleaning supplies, known for our commitment to
                  sustainability, vendor empowerment, and customer satisfaction. We envision a future where every Kenyan
                  has easy access to high-quality, eco-friendly cleaning products that protect both their families and
                  the environment.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Problem We Solve</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Kenya's cleaning supplies market was fragmented and inefficient before CleanCart
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-destructive/20 rounded"></div>
                </div>
                <h3 className="font-semibold mb-2">Fragmented Market</h3>
                <p className="text-muted-foreground text-sm">
                  Small suppliers struggled to reach reliable customers, limiting their growth potential
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-destructive/20 rounded"></div>
                </div>
                <h3 className="font-semibold mb-2">Inconsistent Access</h3>
                <p className="text-muted-foreground text-sm">
                  Buyers faced inconsistent availability and pricing across different suppliers
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-destructive/20 rounded"></div>
                </div>
                <h3 className="font-semibold mb-2">Limited Eco Options</h3>
                <p className="text-muted-foreground text-sm">
                  Eco-friendly product options were hard to find in one centralized location
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Solution</h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              CleanCart centralizes supply and demand, making it faster and cheaper for customers to buy and easier for
              vendors to sell at scale
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Multi-Vendor Marketplace",
                description: "Vendors create storefronts, list products, and manage orders in one platform",
              },
              {
                title: "Secure Payments",
                description: "M-PESA and card payments with 98% success rate and instant vendor payouts",
              },
              {
                title: "Mobile-First Design",
                description: "Progressive Web App for seamless mobile shopping and push notifications",
              },
              {
                title: "Eco-Friendly Focus",
                description: "Dedicated section for sustainable products with green certification badges",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-foreground/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-primary-foreground/80 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg">
              Passionate professionals dedicated to transforming Kenya's cleaning industry
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Cliff Bett</h3>
                <p className="text-muted-foreground text-sm mb-3">Founder & CEO</p>
                <p className="text-sm">
                  Visionary leader with 10+ years in e-commerce and sustainable business practices
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Sarah Wanjiku</h3>
                <p className="text-muted-foreground text-sm mb-3">Head of Operations</p>
                <p className="text-sm">Operations expert ensuring smooth vendor onboarding and customer satisfaction</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">David Kimani</h3>
                <p className="text-muted-foreground text-sm mb-3">Technology Lead</p>
                <p className="text-sm">
                  Tech innovator building scalable solutions for Kenya's digital marketplace future
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg">The principles that guide everything we do at CleanCart</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Leaf,
                title: "Sustainability",
                description: "Promoting eco-friendly products and practices for a cleaner Kenya",
              },
              {
                icon: Users,
                title: "Community",
                description: "Supporting local vendors and building lasting customer relationships",
              },
              {
                icon: CheckCircle,
                title: "Trust",
                description: "Transparent processes, verified vendors, and reliable service delivery",
              },
              {
                icon: Target,
                title: "Innovation",
                description: "Leveraging technology to solve real problems in the cleaning industry",
              },
            ].map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground text-lg">Have questions? We'd love to hear from you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Office Location</h3>
                <p className="text-muted-foreground text-sm">
                  Nairobi, Kenya
                  <br />
                  Westlands Business District
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-muted-foreground text-sm">
                  hello@cleancart.co.ke
                  <br />
                  support@cleancart.co.ke
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground text-sm">
                  +254 700 123 456
                  <br />
                  Mon-Fri, 8AM-6PM EAT
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the CleanCart Community?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Whether you're a customer looking for quality cleaning supplies or a vendor ready to grow your business,
            we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/vendor/register">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Become a Vendor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}