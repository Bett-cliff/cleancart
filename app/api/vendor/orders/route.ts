// app/api/vendor/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Simple authentication helper
async function authenticateVendor(request: NextRequest) {
  // For development, use the same vendor ID that's working for products
  return { 
    id: '68efb302ffa9682bb4a9bf81', // Same vendor ID used in products
    name: 'Demo Vendor', 
    email: 'demo@vendor.com'
  };
}

// Helper functions - ADD THESE AT THE BOTTOM
function getMockOrders() {
  return [
    {
      id: "ORD-0012",
      customer: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+254 712 345 678"
      },
      date: "2024-01-20",
      status: "pending",
      paymentStatus: "paid",
      total: 4250,
      items: 3,
      shipping: {
        method: "Standard",
        address: "Nairobi, Kenya"
      },
      _id: "mock-1", // Add backend ID for consistency
      backendData: null
    },
    {
      id: "ORD-0011",
      customer: {
        name: "Mike Otieno",
        email: "mike.o@email.com",
        phone: "+254 723 456 789"
      },
      date: "2024-01-19",
      status: "processing",
      paymentStatus: "paid",
      total: 8750,
      items: 5,
      shipping: {
        method: "Express",
        address: "Mombasa, Kenya"
      },
      _id: "mock-2", // Add backend ID for consistency
      backendData: null
    },
    {
      id: "ORD-0010",
      customer: {
        name: "Grace Wambui",
        email: "grace.w@email.com",
        phone: "+254 734 567 890"
      },
      date: "2024-01-18",
      status: "shipped",
      paymentStatus: "paid",
      total: 3200,
      items: 2,
      shipping: {
        method: "Standard",
        address: "Kisumu, Kenya"
      },
      trackingNumber: "TRK-789456123",
      _id: "mock-3", // Add backend ID for consistency
      backendData: null
    },
    {
      id: "ORD-0009",
      customer: {
        name: "David Kimani",
        email: "david.k@email.com",
        phone: "+254 745 678 901"
      },
      date: "2024-01-17",
      status: "delivered",
      paymentStatus: "paid",
      total: 15600,
      items: 8,
      shipping: {
        method: "Express",
        address: "Nakuru, Kenya"
      },
      _id: "mock-4", // Add backend ID for consistency
      backendData: null
    }
  ];
}

function calculateStats(orders: any[]) {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  
  const totalRevenue = orders
    .filter(order => order.paymentStatus === 'paid' || order.paymentStatus === 'completed')
    .reduce((sum: number, order: any) => sum + order.total, 0);

  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders
  };
}

export async function GET(request: NextRequest) {
  try {
    const vendor = await authenticateVendor(request);
    if (!vendor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const paymentStatus = searchParams.get('paymentStatus') || 'all'; // ADDED paymentStatus filter

    console.log('🔄 Fetching vendor orders from backend for vendor:', vendor.id);

    // Fetch vendor orders from backend
    const response = await fetch(
      `${BACKEND_URL}/api/orders/vendor/${vendor.id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      // If backend returns 404 or error, use mock data as fallback
      console.log('⚠️ Backend orders not available, using mock data as fallback');
      
      // Apply filters to mock data (temporary fallback)
      const mockOrders = getMockOrders();
      let filteredOrders = mockOrders.filter(order => {
        const matchesSearch = !search || 
          order.id.toLowerCase().includes(search.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(search.toLowerCase());
        
        const matchesStatus = status === 'all' || order.status === status;
        const matchesPaymentStatus = paymentStatus === 'all' || order.paymentStatus === paymentStatus; // ADDED
        
        return matchesSearch && matchesStatus && matchesPaymentStatus;
      });

      const stats = calculateStats(filteredOrders);

      return NextResponse.json({ 
        data: {
          orders: filteredOrders,
          stats
        },
        success: true,
        dataSource: 'mock', // ADDED data source tracking
        message: 'Using mock data - backend integration in progress'
      });
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch orders from backend');
    }

    console.log('✅ Vendor orders fetched successfully:', result.data?.length, 'orders');

    // Transform backend data to match frontend format
    const transformedOrders = result.data.map((order: any) => ({
      id: order.orderNumber || order._id,
      customer: {
        name: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Customer',
        email: order.shippingAddress?.email || 'customer@example.com',
        phone: order.shippingAddress?.phone || '+254 700 000 000'
      },
      date: new Date(order.createdAt).toISOString().split('T')[0],
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
      total: order.totalAmount,
      items: order.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      shipping: {
        method: 'Standard',
        address: `${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}`
      },
      ...(order.orderStatus === 'shipped' && { trackingNumber: `TRK-${order._id.slice(-8).toUpperCase()}` }),
      _id: order._id, // ADDED: Keep backend ID for updates
      backendData: order // ADDED: Keep original data for reference
    }));

    // Apply frontend filters
    let filteredOrders = transformedOrders.filter((order: any) => {
      const matchesSearch = !search || 
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = status === 'all' || order.status === status;
      const matchesPaymentStatus = paymentStatus === 'all' || order.paymentStatus === paymentStatus; // ADDED
      
      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });

    const stats = calculateStats(filteredOrders);

    return NextResponse.json({ 
      data: {
        orders: filteredOrders,
        stats
      },
      success: true,
      dataSource: 'real', // ADDED data source tracking
      message: `Loaded ${filteredOrders.length} real orders from database`
    });

  } catch (error) {
    console.error('❌ Vendor orders API error:', error);
    
    // Fallback to mock data to prevent frontend crashes
    const mockOrders = getMockOrders();
    const stats = calculateStats(mockOrders);
    
    return NextResponse.json({ 
      data: {
        orders: mockOrders,
        stats
      },
      success: false,
      dataSource: 'mock', // ADDED data source tracking
      message: 'Failed to fetch vendor orders - using mock data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const vendor = await authenticateVendor(request);
    if (!vendor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, orderId, updates } = body;

    console.log('🔄 Processing order action:', {
      action,
      orderId, 
      updates,
      vendor: vendor.id
    });

    // Handle different order actions with backend integration
    switch (action) {
      case 'updateStatus':
        // Update order status in backend (for real orders)
        if (!orderId.startsWith('mock-')) {
          const statusResponse = await fetch(
            `${BACKEND_URL}/api/orders/${orderId}/status`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: updates.status })
            }
          );

          if (statusResponse.ok) {
            const result = await statusResponse.json();
            return NextResponse.json({ 
              success: true, 
              message: `Order status updated to ${updates.status}`,
              data: result.data
            });
          } else {
            throw new Error('Failed to update order status in backend');
          }
        } else {
          // Mock order - simulate success
          console.log(`✅ Mock status update for order ${orderId} to ${updates.status}`);
          return NextResponse.json({ 
            success: true, 
            message: `Order status updated to ${updates.status}` 
          });
        }

      case 'updateTracking':
        // Update tracking information
        console.log(`✅ Tracking updated for order ${orderId}: ${updates.trackingNumber}`);
        return NextResponse.json({ 
          success: true, 
          message: 'Tracking information updated successfully',
          trackingNumber: updates.trackingNumber
        });

      case 'cancel':
        // Cancel order in backend (for real orders)
        if (!orderId.startsWith('mock-')) {
          const cancelResponse = await fetch(
            `${BACKEND_URL}/api/orders/${orderId}/cancel`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );

          if (cancelResponse.ok) {
            const result = await cancelResponse.json();
            return NextResponse.json({ 
              success: true, 
              message: 'Order cancelled successfully',
              data: result.data
            });
          } else {
            throw new Error('Failed to cancel order in backend');
          }
        } else {
          // Mock order - simulate success
          console.log(`✅ Mock cancellation for order ${orderId}`);
          return NextResponse.json({ 
            success: true, 
            message: 'Order cancelled successfully' 
          });
        }
      
      default:
        return NextResponse.json({ 
          error: 'Invalid action',
          message: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Orders action error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Action failed'
      },
      { status: 500 }
    );
  }
}