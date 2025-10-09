"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Megaphone,
  Plus,
  Users,
  TrendingUp,
  Mail,
  Gift,
  Calendar,
  Eye,
  Edit,
  Share2,
  BarChart3,
  Target,
  Home,
  Package,
  ShoppingCart,
  DollarSign,
  Warehouse,
  Crown,
  MessageSquare,
  Settings,
  Truck,
  Star
} from "lucide-react"

// Mock marketing data
const marketingData = {
  campaigns: [
    {
      id: 1,
      name: "Summer Sale 2024",
      type: "discount",
      status: "active",
      audience: "all_customers",
      budget: 5000,
      spent: 3200,
      impressions: 12500,
      clicks: 850,
      conversions: 45,
      startDate: "2024-01-15",
      endDate: "2024-02-15"
    },
    {
      id: 2,
      name: "New Product Launch",
      type: "email",
      status: "scheduled",
      audience: "subscribers",
      budget: 2000,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      startDate: "2024-02-01",
      endDate: "2024-02-28"
    },
    {
      id: 3,
      name: "Loyalty Rewards",
      type: "loyalty",
      status: "completed",
      audience: "returning_customers",
      budget: 3000,
      spent: 2800,
      impressions: 8900,
      clicks: 620,
      conversions: 38,
      startDate: "2023-12-01",
      endDate: "2023-12-31"
    }
  ],
  coupons: [
    {
      id: 1,
      code: "SUMMER20",
      discount: 20,
      type: "percentage",
      uses: 45,
      maxUses: 100,
      status: "active"
    },
    {
      id: 2,
      code: "WELCOME10",
      discount: 10,
      type: "percentage",
      uses: 89,
      maxUses: 200,
      status: "active"
    },
    {
      id: 3,
      code: "FREESHIP",
      discount: 0,
      type: "shipping",
      uses: 23,
      maxUses: 50,
      status: "active"
    }
  ]
}

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

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "campaigns", label: "Campaigns" },
    { id: "coupons", label: "Coupons" },
    { id: "audience", label: "Audience" }
  ]

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`
  }

  const calculateROI = (spent: number, conversions: number, averageOrder: number = 2500) => {
    if (spent === 0) return 0
    const revenue = conversions * averageOrder
    return ((revenue - spent) / spent) * 100
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Tools</h1>
          <p className="text-gray-600 mt-1">Promote your products and grow your business</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          onClick={() => setShowCreateCampaign(true)}
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </div>

      {/* Vendor Sections Sub-Navbar - ADDED THIS SECTION */}
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
          {/* Marketing Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Megaphone className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reach</p>
                    <p className="text-2xl font-bold text-gray-900">12.5K</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">3.6%</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">KSh 6,000</p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Campaign</h3>
              <p className="text-sm text-gray-600">Send targeted emails to customers</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Coupon</h3>
              <p className="text-sm text-gray-600">Generate discount codes</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Audience Segments</h3>
              <p className="text-sm text-gray-600">Create customer groups</p>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">View campaign performance</p>
            </Card>
          </div>

          {/* Recent Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>
                Your most recent marketing activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketingData.campaigns.slice(0, 2).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Megaphone className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={
                            campaign.status === 'active' ? 'default' :
                            campaign.status === 'scheduled' ? 'secondary' : 'outline'
                          }>
                            {campaign.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{campaign.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                      </p>
                      <p className="text-sm text-gray-500">{campaign.conversions} conversions</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === "campaigns" && (
        <Card>
          <CardHeader>
            <CardTitle>Marketing Campaigns</CardTitle>
            <CardDescription>
              Create and manage your marketing campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketingData.campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Megaphone className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                        <Badge variant={
                          campaign.status === 'active' ? 'default' :
                          campaign.status === 'scheduled' ? 'secondary' : 'outline'
                        }>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="capitalize">{campaign.type}</span>
                        <span>•</span>
                        <span className="capitalize">{campaign.audience.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{campaign.startDate} to {campaign.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Campaign Metrics */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                      </p>
                      <p className="text-sm text-gray-500">Budget</p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{campaign.conversions}</p>
                      <p className="text-sm text-gray-500">Conversions</p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {calculateROI(campaign.spent, campaign.conversions).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-500">ROI</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coupons Tab */}
      {activeTab === "coupons" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Discount Coupons</CardTitle>
              <CardDescription>
                Create and manage discount codes for your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketingData.coupons.map((coupon) => (
                  <Card key={coupon.id} className="relative">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Gift className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-bold text-2xl text-gray-900 mb-2">{coupon.code}</h3>
                        <p className="text-lg font-semibold text-green-600 mb-3">
                          {coupon.type === 'shipping' ? 'FREE SHIPPING' : `${coupon.discount}% OFF`}
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>Used {coupon.uses} of {coupon.maxUses} times</p>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            {coupon.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <div className="absolute top-3 right-3">
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Create Coupon Button */}
              <div className="mt-6 text-center">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Coupon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Audience Tab */}
      {activeTab === "audience" && (
        <Card>
          <CardHeader>
            <CardTitle>Audience Segments</CardTitle>
            <CardDescription>
              Target specific customer groups with your marketing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">All Customers</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">892</p>
                <p className="text-sm text-gray-600">Everyone who has purchased</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Returning Customers</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">245</p>
                <p className="text-sm text-gray-600">Made 2+ purchases</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Subscribers</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">1,234</p>
                <p className="text-sm text-gray-600">Newsletter subscribers</p>
              </Card>
            </div>

            {/* Create Segment */}
            <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Custom Segment</h3>
              <p className="text-gray-600 mb-4">
                Target customers based on purchase history, location, and behavior
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Segment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}