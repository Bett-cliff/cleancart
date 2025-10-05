import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Shield, Eye, Lock, Database, UserCheck } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">CleanCart</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/marketplace" className="text-foreground hover:text-primary transition-colors">
                Shop
              </Link>
              <Link href="/vendors" className="text-foreground hover:text-primary transition-colors">
                Vendors
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how CleanCart collects, uses, and protects your
            personal information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: December 2024</p>
        </div>

        {/* Quick Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Quick Overview
            </CardTitle>
            <CardDescription>Here's what you need to know about how we handle your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Data Protection</h3>
                <p className="text-sm text-muted-foreground">
                  We use industry-standard encryption and security measures to protect your information
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <UserCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Your Control</h3>
                <p className="text-sm text-muted-foreground">
                  You can access, update, or delete your personal data at any time through your account
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Minimal Collection</h3>
                <p className="text-sm text-muted-foreground">
                  We only collect data necessary to provide and improve our services
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="prose prose-gray max-w-none">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Personal Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Name, email address, and phone number when you create an account</li>
                    <li>Billing and shipping addresses for order processing</li>
                    <li>Payment information (processed securely through our payment partners)</li>
                    <li>Business information for vendor accounts (business registration, tax details)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Pages visited, products viewed, and search queries</li>
                    <li>Device information (browser type, operating system, IP address)</li>
                    <li>Location data (with your permission) for delivery and local vendor recommendations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Service Delivery:</strong> Process orders, manage payments, and coordinate deliveries
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Communication:</strong> Send order updates, customer support responses, and important
                      account notifications
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Platform Improvement:</strong> Analyze usage patterns to enhance user experience and
                      platform functionality
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Marketing:</strong> Send promotional offers and product recommendations (with your
                      consent)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Information Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We do not sell your personal information. We may share your data in these limited circumstances:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>With Vendors:</strong> Order details and delivery information to fulfill your purchases
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Service Providers:</strong> Payment processors, delivery partners, and technology service
                      providers
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Legal Requirements:</strong> When required by law or to protect our rights and users'
                      safety
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We implement comprehensive security measures to protect your information:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                      <li>SSL encryption for all data transmission</li>
                      <li>Secure database storage with access controls</li>
                      <li>Regular security audits and updates</li>
                      <li>Multi-factor authentication for admin access</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Operational Safeguards</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                      <li>Limited employee access on need-to-know basis</li>
                      <li>Regular staff training on data protection</li>
                      <li>Incident response procedures</li>
                      <li>Data backup and recovery systems</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Under Kenya's Data Protection Act (2019), you have the following rights:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Access:</strong> Request a copy of your personal data we hold
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Correction:</strong> Update or correct inaccurate personal information
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Portability:</strong> Receive your data in a structured, machine-readable format
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong>Opt-out:</strong> Unsubscribe from marketing communications at any time
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar technologies to improve your experience:
                </p>
                <div className="space-y-3">
                  <div>
                    <strong>Essential Cookies:</strong> Required for basic site functionality (login, shopping cart)
                  </div>
                  <div>
                    <strong>Analytics Cookies:</strong> Help us understand how users interact with our platform
                  </div>
                  <div>
                    <strong>Marketing Cookies:</strong> Used to show relevant advertisements (with your consent)
                  </div>
                </div>
                <p className="text-muted-foreground mt-4 text-sm">
                  You can manage cookie preferences through your browser settings or our cookie consent banner.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We retain your personal information only as long as necessary to provide our services and comply with
                  legal obligations:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-4">
                  <li>Account information: Until you delete your account or request deletion</li>
                  <li>Transaction records: 7 years for tax and accounting purposes</li>
                  <li>Marketing data: Until you opt-out or we determine it's no longer relevant</li>
                  <li>Usage analytics: Aggregated and anonymized after 2 years</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have questions about this privacy policy or want to exercise your rights, contact us:
                </p>
                <div className="space-y-2">
                  <div>
                    <strong>Email:</strong> privacy@cleancart.co.ke
                  </div>
                  <div>
                    <strong>Phone:</strong> +254 700 123 456
                  </div>
                  <div>
                    <strong>Address:</strong> CleanCart Privacy Office, Westlands Business District, Nairobi, Kenya
                  </div>
                </div>
                <p className="text-muted-foreground mt-4 text-sm">
                  We will respond to your request within 30 days as required by Kenyan law.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
