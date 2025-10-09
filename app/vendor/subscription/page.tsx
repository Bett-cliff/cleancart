"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Crown,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  Download,
  ArrowRight,
  Zap,
  Star,
  Users,
  Package,
  BarChart3,
  Shield,
  Mail,
  Phone,
  HelpCircle,
  Plus,
  Edit,
  Home,
  ShoppingCart,
  Warehouse,
  Megaphone,
  DollarSign,
  Truck,
  MessageSquare,
  Settings
} from "lucide-react"

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
    icon: Users,
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

// Mock subscription data
const subscriptionData = {
  currentPlan: {
    name: "Pro Plan",
    price: 2999,
    billingCycle: "monthly",
    status: "active",
    nextBillingDate: "2024-02-20",
    features: [
      "Up to 100 products",
      "Advanced analytics",
      "Priority support",
      "Custom domain",
      "API access"
    ],
    limits: {
      products: 100,
      storage: 10, // GB
      staffAccounts: 3
    },
    usage: {
      products: 24,
      storage: 2.3,
      staffAccounts: 1
    }
  },
  plans: [
    {
      id: "starter",
      name: "Starter",
      price: 999,
      billingCycle: "monthly",
      popular: false,
      description: "Perfect for small businesses starting out",
      features: [
        "Up to 25 products",
        "Basic analytics",
        "Email support",
        "Standard features"
      ],
      limits: {
        products: 25,
        storage: 2,
        staffAccounts: 1
      }
    },
    {
      id: "pro",
      name: "Pro",
      price: 2999,
      billingCycle: "monthly",
      popular: true,
      description: "Ideal for growing businesses",
      features: [
        "Up to 100 products",
        "Advanced analytics",
        "Priority support",
        "Custom domain",
        "API access"
      ],
      limits: {
        products: 100,
        storage: 10,
        staffAccounts: 3
      }
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 7999,
      billingCycle: "monthly",
      popular: false,
      description: "For large-scale operations",
      features: [
        "Unlimited products",
        "Advanced analytics +",
        "24/7 phone support",
        "Multiple custom domains",
        "Advanced API access",
        "Custom integrations"
      ],
      limits: {
        products: 999,
        storage: 50,
        staffAccounts: 10
      }
    }
  ],
  billingHistory: [
    {
      id: "INV-0012",
      date: "2024-01-20",
      amount: 2999,
      status: "paid",
      description: "Pro Plan - Monthly"
    },
    {
      id: "INV-0011",
      date: "2023-12-20",
      amount: 2999,
      status: "paid",
      description: "Pro Plan - Monthly"
    },
    {
      id: "INV-0010",
      date: "2023-11-20",
      amount: 2999,
      status: "paid",
      description: "Pro Plan - Monthly"
    },
    {
      id: "INV-0009",
      date: "2023-10-20",
      amount: 999,
      status: "paid",
      description: "Starter Plan - Monthly"
    }
  ],
  paymentMethod: {
    type: "mpesa",
    lastFour: "2547",
    expiry: "12/2025",
    isDefault: true
  }
}

export default function SubscriptionPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const tabs = [
    { id: "overview", label: "Plan Overview" },
    { id: "billing", label: "Billing History" },
    { id: "payment", label: "Payment Methods" }
  ]

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`
  }

  const calculateUsagePercentage = (used: number, total: number) => {
    return Math.min(Math.round((used / total) * 100), 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage < 70) return "bg-green-500"
    if (percentage < 90) return "bg-yellow-500"
    return "bg-red-500"
  }

  const { currentPlan, plans, billingHistory, paymentMethod } = subscriptionData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription</h1>
          <p className="text-gray-600 mt-1">Manage your plan, billing, and payments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Invoice
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Update Payment
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

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Current Plan Card */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Crown className="w-6 h-6" />
                    Current Plan: {currentPlan.name}
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    You're on the {currentPlan.name} billed monthly
                  </CardDescription>
                </div>
                <Badge className="bg-green-600 text-white">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">
                    {formatCurrency(currentPlan.price)}
                  </div>
                  <p className="text-sm text-green-700">per month</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">
                    {currentPlan.nextBillingDate}
                  </div>
                  <p className="text-sm text-green-700">Next billing</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">
                    {currentPlan.usage.products}/{currentPlan.limits.products}
                  </div>
                  <p className="text-sm text-green-700">Products used</p>
                </div>
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="border-green-300 text-green-700 hover:bg-green-100"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Products Usage */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4" />
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Used</span>
                    <span className="font-medium">
                      {currentPlan.usage.products} / {currentPlan.limits.products}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(
                        calculateUsagePercentage(currentPlan.usage.products, currentPlan.limits.products)
                      )}`}
                      style={{ 
                        width: `${calculateUsagePercentage(currentPlan.usage.products, currentPlan.limits.products)}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {currentPlan.limits.products - currentPlan.usage.products} products remaining
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Storage Usage */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <BarChart3 className="w-4 h-4" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Used</span>
                    <span className="font-medium">
                      {currentPlan.usage.storage}GB / {currentPlan.limits.storage}GB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(
                        calculateUsagePercentage(currentPlan.usage.storage, currentPlan.limits.storage)
                      )}`}
                      style={{ 
                        width: `${calculateUsagePercentage(currentPlan.usage.storage, currentPlan.limits.storage)}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {currentPlan.limits.storage - currentPlan.usage.storage}GB storage available
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Staff Accounts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  Staff Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Used</span>
                    <span className="font-medium">
                      {currentPlan.usage.staffAccounts} / {currentPlan.limits.staffAccounts}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(
                        calculateUsagePercentage(currentPlan.usage.staffAccounts, currentPlan.limits.staffAccounts)
                      )}`}
                      style={{ 
                        width: `${calculateUsagePercentage(currentPlan.usage.staffAccounts, currentPlan.limits.staffAccounts)}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {currentPlan.limits.staffAccounts - currentPlan.usage.staffAccounts} accounts available
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plan Features */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Features</CardTitle>
              <CardDescription>
                Features included in your current plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>
                Choose the plan that fits your business needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`relative border-2 ${
                      plan.popular 
                        ? 'border-green-300 bg-green-50' 
                        : plan.id === currentPlan.name.toLowerCase()
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-green-600 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    {plan.id === currentPlan.name.toLowerCase() && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Current Plan
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {plan.id === 'enterprise' && <Zap className="w-5 h-5 text-yellow-600" />}
                        {plan.id === 'pro' && <Crown className="w-5 h-5 text-purple-600" />}
                        {plan.id === 'starter' && <Package className="w-5 h-5 text-blue-600" />}
                        {plan.name}
                      </CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-gray-900">
                          {formatCurrency(plan.price)}
                        </span>
                        <span className="text-gray-600">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        className={`w-full ${
                          plan.id === currentPlan.name.toLowerCase()
                            ? 'bg-gray-600 hover:bg-gray-700'
                            : plan.popular
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        disabled={plan.id === currentPlan.name.toLowerCase()}
                      >
                        {plan.id === currentPlan.name.toLowerCase() ? 'Current Plan' : 'Upgrade Plan'}
                        {!plan.id === currentPlan.name.toLowerCase() && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Billing History Tab */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                Your recent invoices and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{invoice.id}</h4>
                        <p className="text-sm text-gray-500">{invoice.description}</p>
                        <p className="text-xs text-gray-400">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </p>
                      <Badge 
                        variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                        className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Billing Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Plan</span>
                  <span className="font-medium">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Cost</span>
                  <span className="font-medium">{formatCurrency(currentPlan.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Billing</span>
                  <span className="font-medium">{currentPlan.nextBillingDate}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-3">
                  <span>Total This Year</span>
                  <span>{formatCurrency(currentPlan.price * 12)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Email Support</p>
                    <p className="text-sm text-blue-700">billing@cleancart.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Phone Support</p>
                    <p className="text-sm text-green-700">+254 700 123 456</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">Help Center</p>
                    <p className="text-sm text-purple-700">Documentation & FAQs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === "payment" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Current Payment Method */}
              <div className="p-4 border rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        M-Pesa •••• {paymentMethod.lastFour}
                      </h4>
                      <p className="text-sm text-gray-500">Expires {paymentMethod.expiry}</p>
                      {paymentMethod.isDefault && (
                        <Badge variant="default" className="bg-green-100 text-green-800 mt-1">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add Payment Method */}
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Payment Method</h3>
                <p className="text-gray-600 mb-4">
                  Add a new credit card, debit card, or mobile money account
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Your business billing details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <p className="text-gray-900">CleanCart Vendor Store</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-900">vendor@cleancart.com</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <p className="text-gray-900">+254 712 345 678</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax ID
                    </label>
                    <p className="text-gray-900">P0512345678</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing Address
                    </label>
                    <p className="text-gray-900">
                      123 Business Street<br />
                      Nairobi, Kenya<br />
                      00100
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-6">
                <Edit className="w-4 h-4 mr-2" />
                Edit Billing Information
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Secure Billing</h4>
              <p className="text-sm text-blue-700">
                Your payment information is encrypted and secure. We use industry-standard 
                security measures to protect your data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}