// app/api/vendor/dashboard/activity/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getVendorFromToken, createUnauthorizedResponse } from '@/lib/vendor-auth-utils'

const emptyActivity = []

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
    const limit = parseInt(searchParams.get('limit') || '10')

    const limitedActivity = emptyActivity.slice(0, limit)

    return NextResponse.json(limitedActivity)

  } catch (error) {
    console.error('Activity API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}