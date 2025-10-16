// app/api/vendor/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock data for development
const mockOrders = [
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
    }
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
    }
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
    trackingNumber: "TRK-789456123"
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
    }
  }
];

// Simple authentication helper - accept any token for development
async function authenticateVendor(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  // For development, accept any token
  if (token) {
    try {
      // Mock vendor authentication - accept any valid token format
      const vendor = { 
        id: '1', 
        name: 'Demo Vendor', 
        email: 'demo@vendor.com',
        storeId: 'store-123' 
      };
      return vendor;
    } catch (error) {
      return null;
    }
  }

  // If no token, still return mock vendor for development
  const vendor = { 
    id: '1', 
    name: 'Demo Vendor', 
    email: 'demo@vendor.com',
    storeId: 'store-123' 
  };
  return vendor;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const vendor = await authenticateVendor(request);
    if (!vendor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const paymentStatus = searchParams.get('paymentStatus') || 'all';

    // Apply filters to mock data
    let filteredOrders = mockOrders.filter(order => {
      const matchesSearch = !search || 
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = status === 'all' || order.status === status;
      const matchesPaymentStatus = paymentStatus === 'all' || order.paymentStatus === paymentStatus;
      
      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });

    // Calculate statistics
    const totalOrders = filteredOrders.length;
    const pendingOrders = filteredOrders.filter(o => o.status === 'pending').length;
    const processingOrders = filteredOrders.filter(o => o.status === 'processing').length;
    const shippedOrders = filteredOrders.filter(o => o.status === 'shipped').length;
    const totalRevenue = filteredOrders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0);

    const stats = {
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      shippedOrders
    };

    return NextResponse.json({ 
      data: {
        orders: filteredOrders,
        stats
      }
    });

  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const vendor = await authenticateVendor(request);
    if (!vendor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, orderId, updates } = body;

    // Mock update actions
    switch (action) {
      case 'updateStatus':
      case 'updateTracking':
      case 'cancel':
        // In a real app, you'd update the database
        // For now, just return success
        return NextResponse.json({ success: true });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Orders action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}