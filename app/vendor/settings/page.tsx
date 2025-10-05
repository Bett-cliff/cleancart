"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { HelpDesk } from "@/components/help-desk"
import {
  Save,
  Upload,
  Building2,
  User,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Store,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

// Mock vendor data
const mockVendorData = {
  business: {
    name: "EcoClean Solutions Kenya",
    email: "business@ecoclean.co.ke",
    phone: "+254712345678",
    registration: "CPT/2024/12345",
    kraPin: "A012345678X",
    description: "Leading provider of eco-friendly cleaning solutions in Kenya. We specialize in sustainable cleaning products that are safe for your family and the environment.",
    category: "Eco-Friendly Products",
    established: "2020"
  },
  storefront: {
    name: "EcoClean Kenya",
    description: "Your trusted partner for sustainable cleaning supplies",
    logo: "/placeholder-logo.jpg",
    banner: "/placeholder-banner.jpg",
    theme: "green",
    socialLinks: {
      website: "https://ecoclean.co.ke",
      facebook: "ecocleankenya",
      instagram: "ecoclean_ke",
      twitter: "ecocleankenya"
    }
  },
  contact: {
    person: "John Kamau",
    email: "john@ecoclean.co.ke",
    phone: "+254712345678",
    address: {
      street: "123 Green Street",
      city: "Nairobi",
      county: "Nairobi",
      postalCode: "00100"
    }
  },
  payout: {
    method: "mpesa",
    mpesaTill: "123456",
    mpesaPaybill: "123456",
    bankName: "",
    bankAccount: "",
    bankBranch: ""
  },
  notifications: {
    email: true,
    sms: true,
    orderUpdates: true,
    lowStock: true,
    newReviews: true,
    marketing: false
  },
  verification: {
    status: "verified",
    verifiedAt: "2024-01-15",
    documents: {
      id: "verified",
      businessRegistration: "verified",
      kraPin: "verified"
    }
  }
}

export default function VendorSettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('business')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(mockVendorData)

  const tabs = [
    { id: 'business', name: 'Business Info', icon: Building2 },
    { id: 'storefront', name: 'Storefront', icon: Store },
    { id: 'contact', name: 'Contact', icon: User },
    { id: 'payout', name: 'Payout', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
  ]

  const handleInputChange = (section: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleNestedInputChange = (section: string, parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [parent]: {
          ...prev[section as keyof typeof prev][parent as keyof typeof prev[typeof section]],
          [field]: value
        }
      }
    }))
  }

  const handleSave = async (section: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Settings Updated!",
        description: `${section.replace(/([A-Z])/g, ' $1')} settings have been saved successfully.`,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (field: string, files: FileList | null) => {
    if (files && files[0]) {
      // In a real app, you would upload to cloud storage and get URL
      const imageUrl = URL.createObjectURL(files[0])
      setFormData(prev => ({
        ...prev,
        storefront: {
          ...prev.storefront,
          [field]: imageUrl
        }
      }))
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'business':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Business Information</h3>
              <p className="text-muted-foreground mb-6">
                Update your official business details and description.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.business.name}
                    onChange={(e) => handleInputChange('business', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="businessEmail">Business Email *</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={formData.business.email}
                    onChange={(e) => handleInputChange('business', 'email', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessPhone">Business Phone *</Label>
                  <Input
                    id="businessPhone"
                    value={formData.business.phone}
                    onChange={(e) => handleInputChange('business', 'phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="established">Year Established</Label>
                  <Input
                    id="established"
                    value={formData.business.established}
                    onChange={(e) => handleInputChange('business', 'established', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registration">Business Registration No. *</Label>
                  <Input
                    id="registration"
                    value={formData.business.registration}
                    onChange={(e) => handleInputChange('business', 'registration', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="kraPin">KRA PIN *</Label>
                  <Input
                    id="kraPin"
                    value={formData.business.kraPin}
                    onChange={(e) => handleInputChange('business', 'kraPin', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={formData.business.description}
                  onChange={(e) => handleInputChange('business', 'description', e.target.value)}
                  rows={4}
                  placeholder="Tell customers about your business, mission, and values..."
                />
              </div>

              <div>
                <Label htmlFor="category">Business Category</Label>
                <select
                  id="category"
                  value={formData.business.category}
                  onChange={(e) => handleInputChange('business', 'category', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="Household Cleaners">Household Cleaners</option>
                  <option value="Industrial Equipment">Industrial Equipment</option>
                  <option value="Eco-Friendly Products">Eco-Friendly Products</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Pest Control">Pest Control</option>
                </select>
              </div>
            </div>

            <Button 
              onClick={() => handleSave('business')}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Business Information
            </Button>
          </div>
        )

      case 'storefront':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Storefront Customization</h3>
              <p className="text-muted-foreground mb-6">
                Customize how your store appears to customers.
              </p>
            </div>

            <div className="grid gap-6">
              {/* Store Logo */}
              <div>
                <Label>Store Logo</Label>
                <div className="flex items-center gap-6 mt-2">
                  <div className="w-20 h-20 border rounded-lg overflow-hidden">
                    <img
                      src={formData.storefront.logo}
                      alt="Store logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('logo', e.target.files)}
                      className="max-w-xs"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Recommended: 200x200px, PNG or JPG
                    </p>
                  </div>
                </div>
              </div>

              {/* Store Banner */}
              <div>
                <Label>Store Banner</Label>
                <div className="mt-2">
                  <div className="w-full h-32 border rounded-lg overflow-hidden mb-3">
                    <img
                      src={formData.storefront.banner}
                      alt="Store banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('banner', e.target.files)}
                    className="max-w-xs"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended: 1200x300px, PNG or JPG
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Store Name *</Label>
                  <Input
                    id="storeName"
                    value={formData.storefront.name}
                    onChange={(e) => handleInputChange('storefront', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="storeTheme">Store Theme</Label>
                  <select
                    id="storeTheme"
                    value={formData.storefront.theme}
                    onChange={(e) => handleInputChange('storefront', 'theme', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  value={formData.storefront.description}
                  onChange={(e) => handleInputChange('storefront', 'description', e.target.value)}
                  rows={3}
                  placeholder="Brief description that appears on your store page..."
                />
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold mb-4">Social Media Links</h4>
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Website URL"
                      value={formData.storefront.socialLinks.website}
                      onChange={(e) => handleNestedInputChange('storefront', 'socialLinks', 'website', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Facebook className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Facebook username"
                      value={formData.storefront.socialLinks.facebook}
                      onChange={(e) => handleNestedInputChange('storefront', 'socialLinks', 'facebook', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Instagram username"
                      value={formData.storefront.socialLinks.instagram}
                      onChange={(e) => handleNestedInputChange('storefront', 'socialLinks', 'instagram', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Twitter className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Twitter username"
                      value={formData.storefront.socialLinks.twitter}
                      onChange={(e) => handleNestedInputChange('storefront', 'socialLinks', 'twitter', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => handleSave('storefront')}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Storefront Settings
            </Button>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <p className="text-muted-foreground mb-6">
                Update your primary contact details and business address.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contact.person}
                    onChange={(e) => handleInputChange('contact', 'person', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                />
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Business Address</h4>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={formData.contact.address.street}
                      onChange={(e) => handleNestedInputChange('contact', 'address', 'street', e.target.value)}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.contact.address.city}
                        onChange={(e) => handleNestedInputChange('contact', 'address', 'city', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="county">County *</Label>
                      <Input
                        id="county"
                        value={formData.contact.address.county}
                        onChange={(e) => handleNestedInputChange('contact', 'address', 'county', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={formData.contact.address.postalCode}
                        onChange={(e) => handleNestedInputChange('contact', 'address', 'postalCode', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => handleSave('contact')}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Contact Information
            </Button>
          </div>
        )

      case 'payout':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Payout Settings</h3>
              <p className="text-muted-foreground mb-6">
                Configure how you receive payments from CleanCart.
              </p>
            </div>

            <div className="grid gap-6">
              <div>
                <Label>Payout Method *</Label>
                <div className="grid gap-2 mt-2">
                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="payoutMethod"
                      value="mpesa"
                      checked={formData.payout.method === "mpesa"}
                      onChange={(e) => handleInputChange('payout', 'method', e.target.value)}
                      className="text-primary"
                    />
                    <div>
                      <p className="font-medium">M-PESA</p>
                      <p className="text-sm text-muted-foreground">Fast payments to your M-PESA account</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="payoutMethod"
                      value="bank"
                      checked={formData.payout.method === "bank"}
                      onChange={(e) => handleInputChange('payout', 'method', e.target.value)}
                      className="text-primary"
                    />
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-sm text-muted-foreground">Direct to your bank account</p>
                    </div>
                  </label>
                </div>
              </div>

              {formData.payout.method === "mpesa" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mpesaTill">M-PESA Till Number</Label>
                    <Input
                      id="mpesaTill"
                      value={formData.payout.mpesaTill}
                      onChange={(e) => handleInputChange('payout', 'mpesaTill', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mpesaPaybill">M-PESA Paybill</Label>
                    <Input
                      id="mpesaPaybill"
                      value={formData.payout.mpesaPaybill}
                      onChange={(e) => handleInputChange('payout', 'mpesaPaybill', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {formData.payout.method === "bank" && (
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.payout.bankName}
                      onChange={(e) => handleInputChange('payout', 'bankName', e.target.value)}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bankAccount">Account Number</Label>
                      <Input
                        id="bankAccount"
                        value={formData.payout.bankAccount}
                        onChange={(e) => handleInputChange('payout', 'bankAccount', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankBranch">Branch Code</Label>
                      <Input
                        id="bankBranch"
                        value={formData.payout.bankBranch}
                        onChange={(e) => handleInputChange('payout', 'bankBranch', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Payout Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Payouts are processed every Friday</li>
                  <li>• Minimum payout amount: KSh 1,000</li>
                  <li>• Processing time: 1-2 business days</li>
                  <li>• Transaction fees: 1.5% for M-PESA, 2% for bank transfers</li>
                </ul>
              </div>
            </div>

            <Button 
              onClick={() => handleSave('payout')}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Payout Settings
            </Button>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <p className="text-muted-foreground mb-6">
                Choose how you want to receive notifications from CleanCart.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Notification Channels</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notifications.email}
                      onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
                      className="rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notifications.sms}
                      onChange={(e) => handleInputChange('notifications', 'sms', e.target.checked)}
                      className="rounded"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Notification Types</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-muted-foreground">New orders and status changes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notifications.orderUpdates}
                      onChange={(e) => handleInputChange('notifications', 'orderUpdates', e.target.checked)}
                      className="rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <div>
                      <p className="font-medium">Low Stock Alerts</p>
                      <p className="text-sm text-muted-foreground">When products are running low</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notifications.lowStock}
                      onChange={(e) => handleInputChange('notifications', 'lowStock', e.target.checked)}
                      className="rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <div>
                      <p className="font-medium">New Reviews</p>
                      <p className="text-sm text-muted-foreground">When customers leave reviews</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notifications.newReviews}
                      onChange={(e) => handleInputChange('notifications', 'newReviews', e.target.checked)}
                      className="rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <div>
                      <p className="font-medium">Marketing Updates</p>
                      <p className="text-sm text-muted-foreground">Promotions and platform updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notifications.marketing}
                      onChange={(e) => handleInputChange('notifications', 'marketing', e.target.checked)}
                      className="rounded"
                    />
                  </label>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => handleSave('notifications')}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Notification Settings
            </Button>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Security & Verification</h3>
              <p className="text-muted-foreground mb-6">
                Manage your account security and verification status.
              </p>
            </div>

            <div className="grid gap-6">
              {/* Verification Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Verification Status
                    {formData.verification.status === 'verified' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Account Status</span>
                      <Badge variant={formData.verification.status === 'verified' ? 'default' : 'destructive'}>
                        {formData.verification.status === 'verified' ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                    {formData.verification.verifiedAt && (
                      <div className="flex justify-between items-center">
                        <span>Verified On</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(formData.verification.verifiedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Document Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Document Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(formData.verification.documents).map(([doc, status]) => (
                      <div key={doc} className="flex justify-between items-center">
                        <span className="capitalize">{doc.replace(/([A-Z])/g, ' $1')}</span>
                        <Badge variant={status === 'verified' ? 'default' : 'secondary'}>
                          {status === 'verified' ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Vendor Settings</h1>
            <p className="text-muted-foreground">
              Manage your business profile, storefront, and account settings
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm font-medium">{tab.name}</span>
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6">
                  {renderTabContent()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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

// Add missing Badge component
const Badge = ({ variant = 'default', children, className = '' }: { variant?: 'default' | 'secondary' | 'destructive', children: React.ReactNode, className?: string }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors"
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground"
  }
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}