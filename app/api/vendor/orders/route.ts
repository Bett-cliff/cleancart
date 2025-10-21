import { NextRequest, NextResponse } from 'next/server';
import { getVendorFromToken, createUnauthorizedResponse } from '@/lib/vendor-auth-utils';

const MARKETPLACE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Vendor Orders API - Starting request');
    
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
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query for vendor orders
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    if (status !== 'all') {
      queryParams.append('status', status);
    }

    // Fetch vendor orders from backend
    const ordersResponse = await fetch(
      `${MARKETPLACE_API_URL}/api/orders/vendor/${vendorId}?${queryParams}`
    );

    let ordersData;
    if (!ordersResponse.ok) {
      // If vendor-specific endpoint fails, try to get all orders and filter
      console.log('⚠️ Vendor orders endpoint failed, fetching all orders...');
      const allOrdersResponse = await fetch(`${MARKETPLACE_API_URL}/api/orders`);
      if (!allOrdersResponse.ok) {
        throw new Error('Failed to fetch orders from backend');
      }
      const allOrdersData = await allOrdersResponse.json();
      
      // Filter orders for this vendor
      ordersData = {
        success: true,
        data: allOrdersData.data.filter((order: any) => 
          order.items?.some((item: any) => item.vendorId === vendorId) ||
          order.vendorOrders?.some((vo: any) => vo.vendorId === vendorId) ||
          order.orderItems?.some((item: any) => item.vendorId === vendorId)
        ) || [],
        pagination: allOrdersData.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        }
      };
    } else {
      ordersData = await ordersResponse.json();
      if (!ordersData.success) {
        throw new Error(ordersData.message || 'Failed to fetch orders');
      }
    }

    // Transform orders to frontend format
    const transformedOrders = ordersData.data.map(transformOrder).filter(Boolean);
    
    // Calculate stats
    const stats = calculateStats(transformedOrders);

    console.log(`✅ Found ${transformedOrders.length} orders for vendor ${vendor.businessName}`);

    return NextResponse.json({
      success: true,
      data: {
        orders: transformedOrders,
        stats,
        pagination: ordersData.pagination || {
          page,
          limit,
          total: transformedOrders.length,
          totalPages: Math.ceil(transformedOrders.length / limit)
        }
      },
      message: `Loaded ${transformedOrders.length} orders for ${vendor.businessName}`
    });

  } catch (error) {
    console.error('❌ Vendor orders API error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch vendor orders',
        data: {
          orders: [],
          stats: getEmptyStats(),
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
          }
        }
      },
      { status: 500 }
    );
  }
}

// Transform order to frontend format (handles both old and new structures)
function transformOrder(order: any): any {
  if (!order) return null;

  // Handle different order structures
  const items = order.items || order.orderItems || [];
  const vendorOrders = order.vendorOrders || [];
  
  // Extract customer information
  let customer = {
    name: 'Customer',
    email: 'customer@example.com',
    phone: '+254 700 000 000'
  };

  if (order.shippingAddress) {
    customer = {
      name: `${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`.trim() || 'Customer',
      email: order.shippingAddress.email || 'customer@example.com',
      phone: order.shippingAddress.phone || '+254 700 000 000'
    };
  }

  // Calculate total items
  const totalItems = items.reduce((sum: number, item: any) => sum + (item.quantity || item.qty || 0), 0);

  return {
    id: order._id || order.id,
    orderId: order.orderNumber || `ORD-${(order._id || order.id).toString().slice(-8).toUpperCase()}`,
    customer,
    date: new Date(order.createdAt || new Date()).toISOString().split('T')[0],
    status: order.orderStatus || order.status || 'pending',
    paymentStatus: order.paymentStatus || 'pending',
    total: order.totalAmount || order.totalPrice || 0,
    items: totalItems,
    shipping: {
      method: 'Standard',
      address: formatShippingAddress(order.shippingAddress)
    },
    trackingNumber: vendorOrders[0]?.shippingTracking,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || new Date().toISOString(),
    itemsDetail: items.map((item: any) => ({
      productId: item.productId?._id || item.product || item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity || item.qty,
      image: item.image || '/api/placeholder/200/200',
    })),
    shippingAddress: order.shippingAddress,
    notes: order.notes
  };
}

function formatShippingAddress(address: any): string {
  if (!address) return 'Address not specified';
  
  const parts = [
    address.address,
    address.city,
    address.county || address.state,
    address.postalCode
  ].filter(Boolean);
  
  return parts.join(', ') || 'Address not specified';
}

function calculateStats(orders: any[]) {
  const validOrders = orders.filter(order => order != null);
  const totalOrders = validOrders.length;
  const paidOrders = validOrders.filter(o => o.paymentStatus === 'completed' || o.paymentStatus === 'paid').length;
  const pendingPaymentOrders = validOrders.filter(o => o.paymentStatus === 'pending').length;
  const pendingOrders = validOrders.filter(o => o.status === 'pending').length;
  const processingOrders = validOrders.filter(o => o.status === 'processing' || o.status === 'confirmed').length;
  const shippedOrders = validOrders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = validOrders.filter(o => o.status === 'delivered' || o.status === 'completed').length;
  const cancelledOrders = validOrders.filter(o => o.status === 'cancelled').length;
  
  const totalRevenue = validOrders
    .filter(order => order.paymentStatus === 'completed' || order.paymentStatus === 'paid')
    .reduce((sum: number, order: any) => sum + (order.total || 0), 0);

  const averageOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;

  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    paidOrders,
    pendingPaymentOrders,
    revenueThisMonth: totalRevenue, // Simplified for now
    averageOrderValue
  };
}

function getEmptyStats() {
  return {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    paidOrders: 0,
    pendingPaymentOrders: 0,
    revenueThisMonth: 0,
    averageOrderValue: 0
  };
}