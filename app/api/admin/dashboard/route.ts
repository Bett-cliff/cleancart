// app/api/admin/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock data for admin dashboard
const mockAdminData = {
  stats: {
    totalVendors: 24,
    pendingVendors: 5,
    approvedVendors: 18,
    totalRevenue: 1245000,
    totalProducts: 156,
    totalOrders: 892,
    activeCustomers: 2341
  },
  recentVendors: [
    {
      id: "1",
      businessName: "EcoClean Supplies",
      email: "contact@ecoclean.com",
      status: "approved",
      createdAt: "2024-01-20",
      products: 12,
      revenue: 245000
    },
    {
      id: "2", 
      businessName: "Green Home Solutions",
      email: "info@greenhome.com",
      status: "pending",
      createdAt: "2024-01-19",
      products: 8,
      revenue: 0
    },
    {
      id: "3",
      businessName: "Natural Living Store",
      email: "hello@naturalliving.com", 
      status: "approved",
      createdAt: "2024-01-18",
      products: 15,
      revenue: 187000
    },
    {
      id: "4",
      businessName: "Organic Wellness Co.",
      email: "support@organicwellness.com",
      status: "rejected", 
      createdAt: "2024-01-17",
      products: 0,
      revenue: 0
    },
    {
      id: "5",
      businessName: "Sustainable Goods",
      email: "team@sustainablegoods.com",
      status: "pending",
      createdAt: "2024-01-16", 
      products: 6,
      revenue: 0
    }
  ],
  platformStats: {
    monthlyRevenue: 245000,
    growthRate: 12.5,
    topCategories: ["Personal Care", "Home Cleaning", "Kitchen", "Fashion"],
    vendorDistribution: {
      approved: 18,
      pending: 5,
      rejected: 1
    }
  }
};

// Simple authentication helper for admin
async function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  // For development, accept any token
  if (token) {
    try {
      // Mock admin authentication
      const admin = { 
        id: '1', 
        name: 'Admin User', 
        email: 'admin@cleancart.com',
        role: 'admin'
      };
      return admin;
    } catch (error) {
      return null;
    }
  }

  // If no token, still return mock admin for development
  const admin = { 
    id: '1', 
    name: 'Admin User', 
    email: 'admin@cleancart.com',
    role: 'admin'
  };
  return admin;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const admin = await authenticateAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return mock admin data
    return NextResponse.json({ 
      data: mockAdminData
    });

  } catch (error) {
    console.error('Admin dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}