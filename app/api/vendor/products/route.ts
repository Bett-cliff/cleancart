// app/api/vendor/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock data for development
const mockProducts = [
  {
    id: "1",
    name: "Organic Lavender Soap",
    description: "Handmade organic soap with lavender essential oils",
    price: 450,
    stock: 24,
    status: "active",
    category: "Personal Care",
    image: "/api/placeholder/80/80",
    rating: 4.8,
    orders: 156,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Bamboo Toothbrush Set",
    description: "Eco-friendly bamboo toothbrush 4-pack",
    price: 1200,
    stock: 0,
    status: "out_of_stock",
    category: "Personal Care",
    image: "/api/placeholder/80/80",
    rating: 4.6,
    orders: 89,
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    name: "Natural Deodorant",
    description: "Aluminum-free natural deodorant",
    price: 680,
    stock: 8,
    status: "low_stock",
    category: "Personal Care",
    image: "/api/placeholder/80/80",
    rating: 4.4,
    orders: 203,
    createdAt: "2024-01-05"
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
    const category = searchParams.get('category') || 'all';
    const status = searchParams.get('status') || 'all';

    // Apply filters to mock data
    let filteredProducts = mockProducts.filter(product => {
      const matchesSearch = !search || 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = category === 'all' || product.category === category;
      const matchesStatus = status === 'all' || product.status === status;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Calculate statistics
    const totalProducts = filteredProducts.length;
    const lowStockProducts = filteredProducts.filter(p => p.status === 'low_stock').length;
    const outOfStockProducts = filteredProducts.filter(p => p.status === 'out_of_stock').length;
    const totalOrders = filteredProducts.reduce((sum, product) => sum + product.orders, 0);

    const stats = {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalOrders
    };

    return NextResponse.json({ 
      data: {
        products: filteredProducts,
        stats
      }
    });

  } catch (error) {
    console.error('Products API error:', error);
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
    const { action, productId } = body;

    // Mock actions
    switch (action) {
      case 'delete':
      case 'archive':
        // In a real app, you'd update the database
        // For now, just return success
        return NextResponse.json({ success: true });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Products action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}