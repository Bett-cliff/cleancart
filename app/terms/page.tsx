import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, FileText, Scale, AlertTriangle, CreditCard, Truck } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
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
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            These terms govern your use of CleanCart's marketplace platform and services.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: December 2024</p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-destructive/20 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-destructive mb-2">Important Notice</h3>
                <p className="text-sm text-muted-foreground">
                  By using CleanCart, you agree to these terms. Please read them carefully. If you don't agree with any
                  part of these terms, you may not use our services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. About CleanCart</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                CleanCart operates as a multi-vendor marketplace connecting cleaning supply vendors with customers
                across Kenya. We provide the platform and technology, while vendors are responsible for their products
                and services.
              </p>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Key Points:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>CleanCart is a platform facilitator, not a direct seller</li>
                  <li>Vendors are independent businesses responsible for their products</li>
                  <li>We facilitate transactions but don't manufacture or warehouse products</li>
                  <li>Customer contracts are primarily with individual vendors</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                2. Account Registration and Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Accounts</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>You must be 18 years or older to create an account</li>
                  <li>Provide accurate and complete information during registration</li>
                  <li>Keep your account credentials secure and confidential</li>
                  <li>You're responsible for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized account access</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Vendor Accounts</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Must provide valid business registration and tax compliance documents</li>
                  <li>Agree to additional vendor terms and commission structure</li>
                  <li>Maintain accurate product listings and inventory information</li>
                  <li>Respond to customer inquiries within 24 hours</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                3. Orders and Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Order Process</h4>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    1. <strong>Product Selection:</strong> Browse and select products from verified vendors
                  </p>
                  <p>
                    2. <strong>Order Placement:</strong> Add items to cart and proceed through secure checkout
                  </p>
                  <p>
                    3. <strong>Payment Processing:</strong> Pay via M-PESA, Visa, or MasterCard
                  </p>
                  <p>
                    4. <strong>Order Confirmation:</strong> Receive confirmation and tracking information
                  </p>
                  <p>
                    5. <strong>Vendor Fulfillment:</strong> Vendor processes and ships your order
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Pricing and Payments</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>All prices are in Kenyan Shillings (KSh) and include applicable taxes</li>
                  <li>Prices may change without notice, but confirmed orders honor original pricing</li>
                  <li>Payment is processed immediately upon order confirmation</li>
                  <li>CleanCart collects payment and remits to vendors after commission deduction</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Vendor Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Product Compliance</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Ensure all products meet Kenyan safety and quality standards</li>
                  <li>Provide accurate product descriptions, images, and specifications</li>
                  <li>Maintain adequate inventory levels for listed products</li>
                  <li>Clearly mark any hazardous or restricted products</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Order Fulfillment</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Process orders within 24 hours of confirmation</li>
                  <li>Ship products within stated delivery timeframes</li>
                  <li>Provide tracking information when available</li>
                  <li>Handle customer service inquiries professionally</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Returns and Refunds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Return Policy</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Returns accepted within 7-14 days of delivery (varies by product category)</li>
                  <li>Products must be unused and in original packaging</li>
                  <li>Consumable products (chemicals, liquids) may not be returnable</li>
                  <li>Customer responsible for return shipping costs unless product is defective</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Refund Process</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Refunds processed within 5-7 business days of approved return</li>
                  <li>Refunds issued to original payment method</li>
                  <li>CleanCart mediates disputes between customers and vendors</li>
                  <li>Final refund decisions rest with individual vendors</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                The following activities are strictly prohibited on CleanCart:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">General Prohibitions</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Selling counterfeit or unauthorized products</li>
                    <li>Misrepresenting product information or capabilities</li>
                    <li>Manipulating reviews or ratings</li>
                    <li>Circumventing platform fees or commission structure</li>
                    <li>Spamming or sending unsolicited communications</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Security Violations</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Attempting to hack or compromise platform security</li>
                    <li>Creating multiple accounts to circumvent restrictions</li>
                    <li>Sharing account credentials with unauthorized parties</li>
                    <li>Interfering with other users' access to the platform</li>
                    <li>Collecting user data without proper authorization</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="w-5 h-5 mr-2" />
                7. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Important:</strong> CleanCart acts as a marketplace platform. We facilitate connections
                  between vendors and customers but are not responsible for the quality, safety, or legality of products
                  sold by vendors.
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <strong>Platform Limitations:</strong> We provide the platform "as is" without warranties of any kind
                </div>
                <div>
                  <strong>Vendor Responsibility:</strong> Vendors are solely responsible for their products and customer
                  service
                </div>
                <div>
                  <strong>Damage Limitations:</strong> Our liability is limited to the amount paid for CleanCart
                  services
                </div>
                <div>
                  <strong>Force Majeure:</strong> We're not liable for delays or failures due to circumstances beyond
                  our control
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Internal Resolution</h4>
                  <p className="text-muted-foreground text-sm">
                    We encourage users to first attempt resolution directly with the other party. CleanCart provides a
                    messaging system and dispute mediation services to facilitate resolution.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Formal Disputes</h4>
                  <p className="text-muted-foreground text-sm">
                    Unresolved disputes will be handled according to Kenyan law. Both parties agree to attempt mediation
                    before pursuing legal action.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update these terms periodically to reflect changes in our services or legal requirements. We'll
                notify users of significant changes via email or platform notifications. Continued use of CleanCart
                after changes constitutes acceptance of the updated terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">For questions about these terms or to report violations:</p>
              <div className="space-y-2">
                <div>
                  <strong>Email:</strong> legal@cleancart.co.ke
                </div>
                <div>
                  <strong>Phone:</strong> +254 700 123 456
                </div>
                <div>
                  <strong>Address:</strong> CleanCart Legal Department, Westlands Business District, Nairobi, Kenya
                </div>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
                These terms are governed by the laws of Kenya. Any legal proceedings will be conducted in Kenyan courts.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
