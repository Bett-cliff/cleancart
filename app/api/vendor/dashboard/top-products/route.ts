// app/api/vendor/dashboard/top-products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getVendorFromToken, createUnauthorizedResponse } from '@/lib/vendor-auth-utils'

const emptyTopProducts = []

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
    const limit = parseInt(searchParams.get('limit') || '5')

    const limitedProducts = emptyTopProducts.slice(0, limit)

    return NextResponse.json(limitedProducts)

  } catch (error) {
    console.error('Top Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}