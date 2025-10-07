"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Building, Mail, Phone, MapPin, Calendar, Package, LogOut, User, Shield } from "lucide-react"

interface VendorData {
  _id: string
  businessName: string
  email: string
  phone: string
  address: string
  businessDescription?: string
  status: 'pending' | 'approved' | 'rejected'
  businessType: string
  createdAt: string
}

export default function VendorDashboardPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [vendor, setVendor] = useState<VendorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('vendorToken')
      const vendorData = localStorage.getItem('vendorData')

      if (!token || !vendorData) {
        toast({
          title: "Authentication Required",
          description: "Please login to access the dashboard",
          variant: "destructive",
        })
        router.push("/vendor/login")
        return
      }

      try {
        const parsedVendor = JSON.parse(vendorData)
        setVendor(parsedVendor)
      } catch (error) {
        console.error('Error parsing vendor data:', error)
        handleLogout()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  const handleLogout = () => {
    localStorage.removeItem('vendorToken')
    localStorage.removeItem('vendorData')
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
    router.push("/vendor/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Vendor Data</h2>
          <p className="text-gray-600 mb-4">Unable to load vendor information</p>
          <Button onClick={handleLogout}>Return to Login</Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved'
      case 'pending':
        return 'Pending Review'
      case 'rejected':
        return 'Rejected'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CleanCart Vendor</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{vendor.businessName}</p>
                <p className="text-xs text-gray-500">Vendor Account</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {vendor.businessName}!
          </h1>
          <p className="text-gray-600">
            Manage your business profile and track your application status
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Account Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getStatusColor(vendor.status)}`}>
                  <span className="font-medium">{getStatusText(vendor.status)}</span>
                </div>
                
                {vendor.status === 'pending' && (
                  <p className="mt-3 text-sm text-gray-600">
                    Your application is under review. We'll notify you once it's approved. 
                    This usually takes 1-2 business days.
                  </p>
                )}
                
                {vendor.status === 'approved' && (
                  <p className="mt-3 text-sm text-green-700">
                    Your account has been approved! You can now start adding products and services to the marketplace.
                  </p>
                )}
                
                {vendor.status === 'rejected' && (
                  <p className="mt-3 text-sm text-red-700">
                    Your application was not approved. Please contact support for more information.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  <span>Business Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Business Name</p>
                      <p className="text-sm text-gray-600">{vendor.businessName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{vendor.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{vendor.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Address</p>
                      <p className="text-sm text-gray-600">{vendor.address}</p>
                    </div>
                  </div>
                </div>
                
                {vendor.businessDescription && (
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Description</p>
                      <p className="text-sm text-gray-600">{vendor.businessDescription}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  disabled={vendor.status !== 'approved'}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Add Products
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  disabled={vendor.status !== 'approved'}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Type:</span>
                  <span className="font-medium capitalize">{vendor.businessType}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-medium">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Account ID:</span>
                  <span className="font-medium font-mono text-xs">
                    {vendor._id.slice(-8)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-900 mb-1">Need Help?</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    Contact our support team for assistance with your vendor account
                  </p>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}