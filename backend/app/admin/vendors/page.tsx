"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { Building, Mail, Phone, MapPin, Check, X, Clock, Search } from "lucide-react"
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
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchVendors()
  }, [])

  useEffect(() => {
    const filtered = vendors.filter(vendor =>
      vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredVendors(filtered)
  }, [searchTerm, vendors])

  const fetchVendors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/vendors')
      const result = await response.json()
      
      if (response.ok) {
        setVendors(result.vendors)
        setFilteredVendors(result.vendors)
      } else {
        toast({
          title: "Error fetching vendors",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
      toast({
        title: "Connection Error",
        description: "Cannot connect to server",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateVendorStatus = async (vendorId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/vendors/${vendorId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()
      
      if (response.ok) {
        toast({
          title: `Vendor ${status}`,
          description: `Vendor has been ${status} successfully`,
        })
        fetchVendors() // Refresh the list
      } else {
        toast({
          title: "Update Failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating vendor status:', error)
      toast({
        title: "Connection Error",
        description: "Cannot connect to server",
        variant: "destructive",
      })
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

  const pendingVendors = vendors.filter(v => v.status === 'pending')
  const approvedVendors = vendors.filter(v => v.status === 'approved')
  const rejectedVendors = vendors.filter(v => v.status === 'rejected')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
          <p className="text-gray-600">Approve or reject vendor applications</p>
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
              placeholder="Search vendors by name, email, or status..."
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
              Manage vendor applications and approval status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredVendors.length === 0 ? (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No vendors found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVendors.map((vendor) => (
                  <div key={vendor._id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{vendor.businessName}</h3>
                          <Badge variant="secondary" className={getStatusColor(vendor.status)}>
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(vendor.status)}
                              <span className="capitalize">{vendor.status}</span>
                            </span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{vendor.email}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{vendor.phone || 'Not provided'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{vendor.address || 'Not provided'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">{vendor.businessType}</span>
                          </div>
                        </div>

                        {vendor.businessDescription && (
                          <p className="text-sm text-gray-600 mt-2">{vendor.businessDescription}</p>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                          Applied: {new Date(vendor.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex space-x-2 mt-4 md:mt-0">
                        {vendor.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateVendorStatus(vendor._id, 'approved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateVendorStatus(vendor._id, 'rejected')}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {vendor.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateVendorStatus(vendor._id, 'rejected')}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Revoke
                          </Button>
                        )}
                        {vendor.status === 'rejected' && (
                          <Button
                            size="sm"
                            onClick={() => updateVendorStatus(vendor._id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        )}
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