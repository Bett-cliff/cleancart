const MARKETPLACE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getVendorFromToken(request: Request) {
  try {
    console.log('🔐 getVendorFromToken: Starting token verification');
    
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    if (!token) {
      console.log('❌ getVendorFromToken: No vendor token found');
      return null;
    }

    console.log('🔑 getVendorFromToken: Token found, verifying with backend...');

    // Verify token with your backend
    const response = await fetch(`${MARKETPLACE_API_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ getVendorFromToken: Token verified successfully', {
        vendor: data.vendor?.businessName,
        vendorId: data.vendor?.id
      });
      return data.vendor;
    } else {
      console.log('❌ getVendorFromToken: Token verification failed', response.status);
      return null;
    }
    
  } catch (error) {
    console.error('❌ getVendorFromToken: Error verifying token:', error);
    return null;
  }
}

export function createUnauthorizedResponse() {
  return new Response(
    JSON.stringify({
      success: false,
      message: 'Vendor authentication required',
      data: null
    }),
    {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}