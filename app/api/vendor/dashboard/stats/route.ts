// app/api/vendor/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Mock stats data
const mockStats = {
  totalRevenue: 245231,
  totalOrders: 1234,
  productsSold: 892,
  newCustomers: 156,
  pendingOrders: 24,
  lowStockProducts: 8
}

async function authenticateVendor(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!token) return null
  
  try {
    const vendor = { id: '1', name: 'Demo Vendor', storeId: 'store-123' }
    return vendor
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const vendor = await authenticateVendor(request)
    if (!vendor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(mockStats)

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}