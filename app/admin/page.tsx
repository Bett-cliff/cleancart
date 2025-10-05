"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Store, Package, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useVendorStore } from "@/contexts/vendor-context"

export default function AdminDashboard() {
  const { vendors } = useVendorStore()
  
  const totalVendors = vendors.length
  const pendingVendors = vendors.filter(v => v.status === 'pending').length
  const approvedVendors = vendors.filter(v => v.status === 'approved').length

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your marketplace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Vendors</p>
                <p className="text-2xl font-bold">{totalVendors}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold">{pendingVendors}</p>
              </div>
              <Store className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved Vendors</p>
                <p className="text-2xl font-bold">{approvedVendors}</p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">KSh 1.2M</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your marketplace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/vendors">
              <Button className="w-full justify-between">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Vendors
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <Button variant="outline" className="w-full justify-between" disabled>
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Manage Products
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" className="w-full justify-between" disabled>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </div>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Vendor Applications</CardTitle>
            <CardDescription>Latest vendor signups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendors.slice(0, 3).map(vendor => (
                <div key={vendor.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{vendor.businessName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    vendor.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : vendor.status === 'rejected' 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vendor.status}
                  </span>
                </div>
              ))}
              
              {vendors.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No vendor applications yet.
                </p>
              )}

              {vendors.length > 3 && (
                <Link href="/admin/vendors">
                  <Button variant="outline" className="w-full">
                    View All Vendors
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}