"use client"

import { useVendorStore } from '@/contexts/vendor-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AdminVendorsPage() {
  const { vendors, approveVendor } = useVendorStore()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Applications</h1>
      
      <div className="grid gap-4">
        {vendors.map(vendor => (
          <Card key={vendor.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{vendor.businessName}</CardTitle>
                  <CardDescription>{vendor.email} • {vendor.phone}</CardDescription>
                </div>
                <Badge variant={
                  vendor.status === 'approved' ? 'default' : 
                  vendor.status === 'rejected' ? 'destructive' : 'secondary'
                }>
                  {vendor.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{vendor.description}</p>
              <p className="text-sm mb-4">Address: {vendor.address}</p>
              <p className="text-sm text-muted-foreground mb-4">
                Applied on: {new Date(vendor.createdAt).toLocaleDateString()}
              </p>
              
              {vendor.status === 'pending' && (
                <Button onClick={() => approveVendor(vendor.id)}>
                  Approve Vendor
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        
        {vendors.length === 0 && (
          <p className="text-muted-foreground">No vendor applications yet.</p>
        )}
      </div>
    </div>
  )
}