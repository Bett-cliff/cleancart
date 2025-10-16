// app/api/vendor/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock data for development
const mockCustomers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+254 712 345 678",
    location: "Nairobi, Kenya",
    joinDate: "2023-11-15",
    totalOrders: 12,
    totalSpent: 45200,
    lastOrder: "2024-01-20",
    status: "active",
    loyaltyTier: "gold",
    averageOrderValue: 3767
  },
  {
    id: "2",
    name: "Mike Otieno",
    email: "mike.o@email.com",
    phone: "+254 723 456 789",
    location: "Mombasa, Kenya",
    joinDate: "2023-12-01",
    totalOrders: 8,
    totalSpent: 28750,
    lastOrder: "2024-01-19",
    status: "active",
    loyaltyTier: "silver",
    averageOrderValue: 3594
  },
  {
    id: "3",
    name: "Grace Wambui",
    email: "grace.w@email.com",
    phone: "+254 734 567 890",
    location: "Kisumu, Kenya",
    joinDate: "2024-01-05",
    totalOrders: 3,
    totalSpent: 9600,
    lastOrder: "2024-01-18",
    status: "active",
    loyaltyTier: "bronze",
    averageOrderValue: 3200
  },
  {
    id: "4",
    name: "David Kimani",
    email: "david.k@email.com",
    phone: "+254 745 678 901",
    location: "Nakuru, Kenya",
    joinDate: "2023-10-20",
    totalOrders: 15,
    totalSpent: 67800,
    lastOrder: "2024-01-17",
    status: "active",
    loyaltyTier: "gold",
    averageOrderValue: 4520
  },
  {
    id: "5",
    name: "Lisa Adhiambo",
    email: "lisa.a@email.com",
    phone: "+254 756 789 012",
    location: "Eldoret, Kenya",
    joinDate: "2024-01-10",
    totalOrders: 1,
    totalSpent: 5400,
    lastOrder: "2024-01-16",
    status: "new",
    loyaltyTier: "bronze",
    averageOrderValue: 5400
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
    const loyaltyTier = searchParams.get('loyalty') || 'all';

    // Apply filters to mock data
    let filteredCustomers = mockCustomers.filter(customer => {
      const matchesSearch = !search || 
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.location.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = status === 'all' || customer.status === status;
      const matchesLoyalty = loyaltyTier === 'all' || customer.loyaltyTier === loyaltyTier;
      
      return matchesSearch && matchesStatus && matchesLoyalty;
    });

    // Calculate statistics
    const totalCustomers = filteredCustomers.length;
    const activeCustomers = filteredCustomers.filter(c => c.status === 'active').length;
    const newCustomers = filteredCustomers.filter(c => c.status === 'new').length;
    const totalRevenue = filteredCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const averageOrderValue = filteredCustomers.length > 0 
      ? Math.round(filteredCustomers.reduce((sum, customer) => sum + customer.averageOrderValue, 0) / filteredCustomers.length)
      : 0;

    const stats = {
      totalCustomers,
      activeCustomers,
      newCustomers,
      totalRevenue,
      averageOrderValue
    };

    return NextResponse.json({ 
      data: {
        customers: filteredCustomers,
        stats
      }
    });

  } catch (error) {
    console.error('Customers API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}