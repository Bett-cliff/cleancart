// app/api/vendor/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getVendorFromToken, createUnauthorizedResponse } from '@/lib/vendor-auth-utils'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

// Fetch vendor products from backend
async function fetchVendorProducts(vendorId: string) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/products/vendor/${vendorId}?limit=1000`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    return [];
  }
}

// Fetch vendor orders from backend
async function fetchVendorOrders(vendorId: string) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/orders/vendor/${vendorId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result.success ? result.data : [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    return [];
  }
}

// Calculate real statistics from backend data
function calculateRealStats(products: any[], orders: any[]) {
  // Calculate total revenue from paid orders
  const paidOrders = orders.filter((order: any) => 
    order.paymentStatus === 'paid' || order.paymentStatus === 'completed'
  );
  const totalRevenue = paidOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
  
  // Calculate products sold (total quantity from all orders)
  const productsSold = orders.reduce((sum: number, order: any) => {
    if (order.items) {
      return sum + order.items.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0);
    }
    return sum;
  }, 0);
  
  // Count low stock products (stock < 10)
  const lowStockProducts = products.filter((product: any) => product.stock < 10).length;
  
  // Count unique customers
  const uniqueCustomers = new Set(orders.map((order: any) => order.customerId || order.customer)).size;
  
  // Count pending orders
  const pendingOrders = orders.filter((order: any) => 
    order.orderStatus === 'pending' || order.orderStatus === 'confirmed'
  ).length;

  return {
    totalRevenue,
    totalOrders: orders.length,
    productsSold,
    newCustomers: uniqueCustomers,
    pendingOrders,
    lowStockProducts
  };
}

export async function GET(request: NextRequest) {
  try {
    const vendor = await authenticateVendor(request)
    if (!vendor) {
      console.log('❌ No authenticated vendor found - returning 401');
      return createUnauthorizedResponse();
    }

    console.log('🔄 Fetching real stats for vendor:', vendor.id);

    // Fetch real data from backend
    const [products, orders] = await Promise.all([
      fetchVendorProducts(vendor.id),
      fetchVendorOrders(vendor.id)
    ]);

    // Calculate real statistics
    const stats = calculateRealStats(products, orders);

    console.log('📊 Real stats calculated:', stats);

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}