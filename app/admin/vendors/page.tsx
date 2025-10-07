"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { Building, Mail, Phone, MapPin, Check, X, Clock, Search, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Vendor {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  businessName: string
  businessDescription?: string
  businessType: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export default function AdminVendorsPage() {
  const { toast } = useToast()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [updatingVendor, setUpdatingVendor] = useState<string | null>(null)

  useEffect(() => {
    fetchVendors()
  }, [])

  useEffect(() => {
    const filtered = vendors.filter(vendor => {
      const searchLower = searchTerm.toLowerCase()
      return (
        (vendor.businessName?.toLowerCase() || '').includes(searchLower) ||
        (vendor.email?.toLowerCase() || '').includes(searchLower) ||
        (vendor.status?.toLowerCase() || '').includes(searchLower) ||
        (vendor.phone?.toLowerCase() || '').includes(searchLower) ||
        (vendor.address?.toLowerCase() || '').includes(searchLower)
      )
    })
    setFilteredVendors(filtered)
  }, [searchTerm, vendors])

  const fetchVendors = async () => {
    try {
      setIsRefreshing(true)
      console.log('🔄 Fetching vendors from API...')
      const response = await fetch('http://localhost:5000/api/auth/vendors')
      console.log('📡 API Response status:', response.status)
      
      const result = await response.json()
      console.log('📦 API Response data:', result)
      
      if (response.ok) {
        setVendors(result.vendors || [])
        setFilteredVendors(result.vendors || [])
        console.log('✅ Vendors loaded successfully:', result.vendors?.length)
      } else {
        console.error('❌ Failed to fetch vendors:', result.error)
        toast({
          title: "Error fetching vendors",
          description: result.error || "Failed to load vendors",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('❌ Error fetching vendors:', error)
      toast({
        title: "Connection Error",
        description: "Cannot connect to server. Please check if backend is running.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const updateVendorStatus = async (vendorId: string, status: 'approved' | 'rejected') => {
    try {
      setUpdatingVendor(vendorId)
      console.log(`🔄 Updating vendor ${vendorId} to status: ${status}`)
      
      const response = await fetch(`http://localhost:5000/api/auth/vendors/${vendorId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      console.log('📡 Status update response:', response.status)
      const result = await response.json()
      console.log('📦 Status update result:', result)
      
      if (response.ok) {
        toast({
          title: `Vendor ${status}`,
          description: `Vendor has been ${status} successfully`,
        })
        // Update local state immediately for better UX
        setVendors(prev => prev.map(vendor => 
          vendor._id === vendorId ? { ...vendor, status } : vendor
        ))
        console.log('✅ Vendor status updated successfully')
      } else {
        console.error('❌ Status update failed:', result.error)
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update vendor status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('❌ Error updating vendor status:', error)
      toast({
        title: "Connection Error",
        description: "Cannot connect to server",
        variant: "destructive",
      })
    } finally {
      setUpdatingVendor(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'rejected':
        return <X className="w-4 h-4" />
      default:
        return null
    }
  }

  const getDisplayValue = (value: string | undefined | null, fallback: string = 'Not provided'): string => {
    return value?.trim() || fallback
  }

  const getStatusActions = (vendor: Vendor) => {
    const isUpdating = updatingVendor === vendor._id

    switch (vendor.status) {
      case 'pending':
        return (
          <>
            <Button
              size="sm"
              onClick={() => updateVendorStatus(vendor._id, 'approved')}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-1" />
              )}
              {isUpdating ? 'Updating...' : 'Approve'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateVendorStatus(vendor._id, 'rejected')}
              className="text-red-600 border-red-600 hover:bg-red-50"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <X className="w-4 h-4 mr-1" />
              )}
              {isUpdating ? 'Updating...' : 'Reject'}
            </Button>
          </>
        )
      case 'approved':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateVendorStatus(vendor._id, 'rejected')}
            className="text-red-600 border-red-600 hover:bg-red-50"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <X className="w-4 h-4 mr-1" />
            )}
            {isUpdating ? 'Updating...' : 'Revoke'}
          </Button>
        )
      case 'rejected':
        return (
          <Button
            size="sm"
            onClick={() => updateVendorStatus(vendor._id, 'approved')}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-1" />
            )}
            {isUpdating ? 'Updating...' : 'Approve'}
          </Button>
        )
      default:
        return null
    }
  }

  const pendingVendors = vendors.filter(v => v.status === 'pending')
  const approvedVendors = vendors.filter(v => v.status === 'approved')
  const rejectedVendors = vendors.filter(v => v.status === 'rejected')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading vendors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
            <p className="text-gray-600">Approve or reject vendor applications</p>
          </div>
          <Button
            onClick={fetchVendors}
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingVendors.length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{approvedVendors.length}</p>
                </div>
                <Check className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedVendors.length}</p>
                </div>
                <X className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search vendors by name, email, phone, address, or status..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Vendors List */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Applications</CardTitle>
            <CardDescription>
              Manage vendor applications and approval status. Total: {vendors.length} vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredVendors.length === 0 ? (
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  {vendors.length === 0 ? 'No vendors found' : 'No vendors match your search'}
                </p>
                <p className="text-gray-400 text-sm">
                  {vendors.length === 0 
                    ? 'Vendor applications will appear here once they register.' 
                    : 'Try adjusting your search terms.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredVendors.map((vendor) => (
                  <div key={vendor._id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
                          <h3 className="font-semibold text-xl text-gray-900 mb-2 sm:mb-0">
                            {getDisplayValue(vendor.businessName, 'Unnamed Business')}
                          </h3>
                          <Badge variant="secondary" className={getStatusColor(vendor.status)}>
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(vendor.status)}
                              <span className="capitalize font-medium">{vendor.status}</span>
                            </span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700">{getDisplayValue(vendor.email)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700">{getDisplayValue(vendor.phone)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700">{getDisplayValue(vendor.address)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700 capitalize">{getDisplayValue(vendor.businessType, 'general')}</span>
                          </div>
                        </div>

                        {vendor.businessDescription && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-900 mb-1">Description:</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                              {vendor.businessDescription}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <span>Applied: {new Date(vendor.createdAt).toLocaleDateString()}</span>
                          <span>Updated: {new Date(vendor.updatedAt).toLocaleDateString()}</span>
                          <span>ID: {vendor._id.slice(-8)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4 lg:mt-0 lg:ml-6 lg:flex-nowrap">
                        {getStatusActions(vendor)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}