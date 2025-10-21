import { NextRequest, NextResponse } from 'next/server';
import { getVendorFromToken, createUnauthorizedResponse } from '@/lib/vendor-auth-utils';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Vendor Products API - Starting request');
    
    // Get the authenticated vendor from the token
    const vendor = await getVendorFromToken(request);
    
    if (!vendor) {
      console.log('❌ No authenticated vendor found - returning 401');
      return createUnauthorizedResponse();
    }

    const vendorId = vendor.id;
    console.log(`👤 Authenticated vendor: ${vendor.businessName} (${vendorId})`);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const status = searchParams.get('status') || 'all';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '50';

    // Build query string for backend
    const queryParams = new URLSearchParams({
      search,
      category,
      status,
      page,
      limit
    });

    console.log('🔄 Fetching vendor products from backend:', `${BACKEND_URL}/api/products/vendor/${vendorId}?${queryParams}`);

    // Fetch from real backend
    const response = await fetch(
      `${BACKEND_URL}/api/products/vendor/${vendorId}?${queryParams}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Ensure fresh data
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend response error:', response.status, errorText);
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Vendor products fetched successfully:', data.data?.length, 'products');
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Vendor products API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch vendor products',
        error: error instanceof Error ? error.message : 'Unknown error',
        // Fallback empty data to prevent frontend crashes
        data: [],
        pagination: { page: 1, limit: 50, total: 0, pages: 0 }
      },
      { status: 500 }
    );
  }
}