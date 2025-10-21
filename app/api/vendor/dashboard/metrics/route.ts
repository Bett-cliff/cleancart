// app/api/vendor/dashboard/metrics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getVendorFromToken, createUnauthorizedResponse } from '@/lib/vendor-auth-utils'

const emptyMetrics = {
  conversionRate: 0,
  averageOrderValue: 0,
  customerSatisfaction: 0
}

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

    return NextResponse.json(emptyMetrics)

  } catch (error) {
    console.error('Metrics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}