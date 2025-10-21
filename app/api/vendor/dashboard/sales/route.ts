// app/api/vendor/dashboard/sales/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getVendorFromToken, createUnauthorizedResponse } from '@/lib/vendor-auth-utils'

const emptySalesData = [
  { day: "Mon", sales: 0, revenue: 0 },
  { day: "Tue", sales: 0, revenue: 0 },
  { day: "Wed", sales: 0, revenue: 0 },
  { day: "Thu", sales: 0, revenue: 0 },
  { day: "Fri", sales: 0, revenue: 0 },
  { day: "Sat", sales: 0, revenue: 0 },
  { day: "Sun", sales: 0, revenue: 0 }
]

async function authenticateVendor(request: NextRequest) {
  const vendor = await getVendorFromToken(request);
  if (!vendor) {
    return null;
  }
  return {
    id: vendor.id,
    name: vendor.businessName,
    storeId: vendor.id
  };
}

export async function GET(request: NextRequest) {
  try {
    const vendor = await authenticateVendor(request)
    if (!vendor) {
      console.log('❌ No authenticated vendor found - returning 401');
      return createUnauthorizedResponse();
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    // In production, you'd filter data based on the range
    // For now, return empty data since vendor has no orders
    return NextResponse.json(emptySalesData)

  } catch (error) {
    console.error('Sales API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}