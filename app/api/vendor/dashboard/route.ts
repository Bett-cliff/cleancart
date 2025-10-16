// app/api/vendor/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock data for development
const mockDashboardData = {
  stats: {
    totalRevenue: 245231,
    totalOrders: 1234,
    productsSold: 892,
    newCustomers: 156,
    pendingOrders: 24,
    lowStockProducts: 8
  },
  performanceMetrics: {
    conversionRate: 3.2,
    averageOrderValue: 2450,
    customerSatisfaction: 4.8
  },
  recentActivity: [
    {
      id: "1",
      type: "order" as const,
      message: "New order #ORD-0012 received",
      time: "5 minutes ago",
      amount: 4250,
      status: "success" as const
    },
    {
      id: "2",
      type: "product" as const,
      message: "Product 'Organic Soap' is low in stock",
      time: "1 hour ago",
      amount: null,
      status: "warning" as const
    },
    {
      id: "3",
      type: "customer" as const,
      message: "New customer registration - Sarah M.",
      time: "2 hours ago",
      amount: null,
      status: "info" as const
    },
    {
      id: "4",
      type: "order" as const,
      message: "Order #ORD-0011 marked as delivered",
      time: "3 hours ago",
      amount: 8750,
      status: "success" as const
    },
    {
      id: "5",
      type: "review" as const,
      message: "New 5-star review received",
      time: "4 hours ago",
      amount: null,
      status: "success" as const
    }
  ],
  topProducts: [
    { name: "Organic Lavender Soap", sales: 45, revenue: 67500 },
    { name: "Bamboo Toothbrush Set", sales: 32, revenue: 25600 },
    { name: "Natural Deodorant", sales: 28, revenue: 22400 },
    { name: "Reusable Coffee Cup", sales: 21, revenue: 31500 }
  ],
  salesData: [
    { day: "Mon", sales: 12, revenue: 18500 },
    { day: "Tue", sales: 18, revenue: 26700 },
    { day: "Wed", sales: 15, revenue: 22500 },
    { day: "Thu", sales: 22, revenue: 34100 },
    { day: "Fri", sales: 25, revenue: 41200 },
    { day: "Sat", sales: 30, revenue: 49500 },
    { day: "Sun", sales: 24, revenue: 37800 }
  ]
};

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

    // Return mock data for now
    return NextResponse.json({ data: mockDashboardData });

  } catch (error) {
    console.error('Dashboard API error:', error);
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

    // Return refreshed mock data
    const refreshedData = {
      ...mockDashboardData,
      refreshedAt: new Date().toISOString()
    };

    return NextResponse.json({ data: refreshedData });

  } catch (error) {
    console.error('Dashboard refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}