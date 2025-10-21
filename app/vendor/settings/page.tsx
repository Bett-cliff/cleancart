"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  User,
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Bell,
  CreditCard,
  Truck,
  Package,
  Download,
  Upload,
  Save,
  Edit,
  Camera,
  CheckCircle,
  XCircle,
  Plus,
  Home,
  ShoppingCart,
  Warehouse,
  Megaphone,
  DollarSign,
  Star,
  Crown,
  MessageCircle,
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
    icon: MessageCircle,
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

// Empty settings data - will be populated from API
const settingsData = {
  profile: {
    businessName: "CleanCart Vendor Store",
    email: "vendor@cleancart.com",
    phone: "+254 712 345 678",
    ownerName: "John Doe",
    bio: "We provide high-quality eco-friendly products for conscious consumers.",
    avatar: "/api/placeholder/100/100"
  },
  store: {
    name: "EcoFriendly Store",
    description: "Your one-stop shop for sustainable living products",
    domain: "ecofriendly.cleancart.com",
    currency: "KES",
    timezone: "Africa/Nairobi",
    language: "English"
  },
  notifications: {
    email: {
      orders: true,
      products: true,
      marketing: false,
      security: true
    },
    push: {
      orders: true,
      products: false,
      marketing: false,
      security: true
    }
  },
  shipping: {
    methods: [
      { name: "Standard Delivery", cost: 200, enabled: true },
      { name: "Express Delivery", cost: 500, enabled: true },
      { name: "Pickup", cost: 0, enabled: false }
    ],
    locations: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"]
  },
  security: {
    twoFactor: false,
    lastLogin: "2024-01-20 14:30",
    loginAlerts: true
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(settingsData)

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "store", label: "Store", icon: Store },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard }
  ]

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleShippingMethodChange = (index: number, field: string, value: any) => {
    const updatedMethods = [...formData.shipping.methods]
    updatedMethods[index] = { ...updatedMethods[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        methods: updatedMethods
      }
    }))
  }

  const handleSave = () => {
    // In real app, this would make an API call
    console.log("Saving settings:", formData)
    setIsEditing(false)
    // Show success message
  }

  const handleCancel = () => {
    setFormData(settingsData)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and store preferences</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Settings
            </Button>
          )}
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Business Profile
                  </CardTitle>
                  <CardDescription>
                    Manage your business information and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-500" />
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 p-1 bg-green-600 text-white rounded-full">
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Profile Picture</h3>
                      <p className="text-sm text-gray-500">JPG, PNG or WebP. Max 5MB.</p>
                      {isEditing && (
                        <Button variant="outline" size="sm" className="mt-2">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.profile.businessName}
                        onChange={(e) => handleInputChange("profile", "businessName", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name</Label>
                      <Input
                        id="ownerName"
                        value={formData.profile.ownerName}
                        onChange={(e) => handleInputChange("profile", "ownerName", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.profile.email}
                        onChange={(e) => handleInputChange("profile", "email", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.profile.phone}
                        onChange={(e) => handleInputChange("profile", "phone", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Business Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Business Description</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={formData.profile.bio}
                      onChange={(e) => handleInputChange("profile", "bio", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Tell customers about your business..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    How customers can reach you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="contact@yourbusiness.com"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        placeholder="https://yourbusiness.com"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Business Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Business Street"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Nairobi"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Store Settings Tab */}
          {activeTab === "store" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Store Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your store appearance and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name *</Label>
                      <Input
                        id="storeName"
                        value={formData.store.name}
                        onChange={(e) => handleInputChange("store", "name", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="domain">Store Domain</Label>
                      <Input
                        id="domain"
                        value={formData.store.domain}
                        onChange={(e) => handleInputChange("store", "domain", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeDescription">Store Description</Label>
                    <Textarea
                      id="storeDescription"
                      rows={3}
                      value={formData.store.description}
                      onChange={(e) => handleInputChange("store", "description", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Describe what makes your store unique..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                        value={formData.store.currency}
                        onChange={(e) => handleInputChange("store", "currency", e.target.value)}
                        disabled={!isEditing}
                      >
                        <option value="KES">Kenyan Shilling (KES)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                        value={formData.store.timezone}
                        onChange={(e) => handleInputChange("store", "timezone", e.target.value)}
                        disabled={!isEditing}
                      >
                        <option value="Africa/Nairobi">East Africa Time (Nairobi)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time (New York)</option>
                        <option value="Europe/London">Greenwich Mean Time (London)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                        value={formData.store.language}
                        onChange={(e) => handleInputChange("store", "language", e.target.value)}
                        disabled={!isEditing}
                      >
                        <option value="English">English</option>
                        <option value="Swahili">Swahili</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Store Appearance */}
              <Card>
                <CardHeader>
                  <CardTitle>Store Appearance</CardTitle>
                  <CardDescription>
                    Customize how your store looks to customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">CC</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Store Logo</h4>
                        <p className="text-sm text-gray-500">Recommended: 200x200px, PNG or SVG</p>
                        {isEditing && (
                          <Button variant="outline" size="sm" className="mt-2">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Logo
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primaryColor"
                            type="color"
                            defaultValue="#16a34a"
                            disabled={!isEditing}
                            className="w-20"
                          />
                          <Input
                            value="#16a34a"
                            disabled={!isEditing}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="secondaryColor"
                            type="color"
                            defaultValue="#15803d"
                            disabled={!isEditing}
                            className="w-20"
                          />
                          <Input
                            value="#15803d"
                            disabled={!isEditing}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about important events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(formData.notifications.email).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Receive email alerts for {key} updates
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleInputChange("notifications", `email.${key}`, e.target.checked)}
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500 disabled:bg-gray-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Push Notifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(formData.notifications.push).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Receive push notifications for {key} updates
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleInputChange("notifications", `push.${key}`, e.target.checked)}
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500 disabled:bg-gray-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping Tab */}
          {activeTab === "shipping" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Methods
                  </CardTitle>
                  <CardDescription>
                    Configure your shipping options and costs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.shipping.methods.map((method, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={method.enabled}
                            onChange={(e) => handleShippingMethodChange(index, "enabled", e.target.checked)}
                            disabled={!isEditing}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-500">
                              Cost: KSh {method.cost.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {isEditing && (
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {isEditing && (
                    <Button variant="outline" className="w-full mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Shipping Method
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Locations */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Locations</CardTitle>
                  <CardDescription>
                    Areas where you offer shipping
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.shipping.locations.map((location, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {location}
                        {isEditing && (
                          <XCircle className="w-3 h-3 cursor-pointer" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input placeholder="Add new location..." />
                      <Button variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={formData.security.twoFactor ? "default" : "outline"}>
                      {formData.security.twoFactor ? "Enabled" : "Disabled"}
                    </Badge>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        {formData.security.twoFactor ? "Disable" : "Enable"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Login Alerts */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Login Alerts</h4>
                    <p className="text-sm text-gray-500">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.security.loginAlerts}
                    onChange={(e) => handleInputChange("security", "loginAlerts", e.target.checked)}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>

                {/* Last Login */}
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-2">Last Login</h4>
                  <p className="text-sm text-gray-600">
                    {formData.security.lastLogin} from Nairobi, Kenya
                  </p>
                </div>

                {/* Password Change */}
                {isEditing && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Change Password</h4>
                    <div className="space-y-3">
                      <Input type="password" placeholder="Current Password" />
                      <Input type="password" placeholder="New Password" />
                      <Input type="password" placeholder="Confirm New Password" />
                      <Button variant="outline">Update Password</Button>
                    </div>
                  </div>
                )}

                {/* Account Actions */}
                {isEditing && (
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                    <p className="text-sm text-red-700 mb-3">
                      Permanent actions that cannot be undone
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-100">
                        Export Account Data
                      </Button>
                      <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-100">
                        Deactivate Account
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Billing & Subscription
                </CardTitle>
                <CardDescription>
                  Manage your billing information and subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Plan */}
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-900">Current Plan</h4>
                      <p className="text-green-700">Pro Plan - KSh 2,999/month</p>
                    </div>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                </div>

                {/* Billing Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Billing Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Business Name" disabled={!isEditing} />
                    <Input placeholder="Tax ID" disabled={!isEditing} />
                    <Input placeholder="Billing Address" disabled={!isEditing} />
                    <Input placeholder="City" disabled={!isEditing} />
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Payment Methods</h4>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">M-Pesa •••• 2547</p>
                          <p className="text-sm text-gray-500">Expires 12/2025</p>
                        </div>
                      </div>
                      {isEditing && (
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Billing History */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Billing History</h4>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice History
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}