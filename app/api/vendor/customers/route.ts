// app/api/vendor/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getVendorFromToken, createUnauthorizedResponse } from '@/lib/vendor-auth-utils';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Proper authentication helper using token verification
async function authenticateVendor(request: NextRequest) {
  const vendor = await getVendorFromToken(request);
  if (!vendor) {
    return null;
  }
  return {
    id: vendor.id,
    name: vendor.businessName,
    email: vendor.email,
    storeId: vendor.id
  };
}

// Fetch vendor customers from backend
async function fetchVendorCustomers(vendorId: string) {
  try {
    // For now, return empty array since we don't have a customers endpoint
    // In a real app, you'd fetch customers who have ordered from this vendor
    return [];
  } catch (error) {
    console.error('Error fetching vendor customers:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const vendor = await authenticateVendor(request);
    if (!vendor) {
      console.log('❌ No authenticated vendor found - returning 401');
      return createUnauthorizedResponse();
    }

    console.log('🔄 Fetching customers for vendor:', vendor.id);

    // Fetch real data from backend
    const customers = await fetchVendorCustomers(vendor.id);

    // Calculate statistics from real data
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c: any) => c.status === 'active').length;
    const newCustomers = customers.filter((c: any) => c.status === 'new').length;
    const totalRevenue = customers.reduce((sum: number, customer: any) => sum + (customer.totalSpent || 0), 0);
    const averageOrderValue = customers.length > 0 
      ? Math.round(customers.reduce((sum: number, customer: any) => sum + (customer.averageOrderValue || 0), 0) / customers.length)
      : 0;

    const stats = {
      totalCustomers,
      activeCustomers,
      newCustomers,
      totalRevenue,
      averageOrderValue
    };

    console.log('📊 Customer stats calculated:', stats);

    return NextResponse.json({ 
      success: true,
      data: {
        customers,
        stats
      },
      message: `Loaded ${totalCustomers} customers for ${vendor.name}`
    });

  } catch (error) {
    console.error('Customers API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        data: {
          customers: [],
          stats: {
            totalCustomers: 0,
            activeCustomers: 0,
            newCustomers: 0,
            totalRevenue: 0,
            averageOrderValue: 0
          }
        }
      },
      { status: 500 }
    );
  }
}