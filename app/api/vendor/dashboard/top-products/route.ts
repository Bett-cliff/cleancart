// app/api/vendor/dashboard/top-products/route.ts
import { NextRequest, NextResponse } from 'next/server'

const mockTopProducts = [
  { name: "Organic Lavender Soap", sales: 45, revenue: 67500 },
  { name: "Bamboo Toothbrush Set", sales: 32, revenue: 25600 },
  { name: "Natural Deodorant", sales: 28, revenue: 22400 },
  { name: "Reusable Coffee Cup", sales: 21, revenue: 31500 },
  { name: "Eco-friendly Detergent", sales: 18, revenue: 23400 }
]

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

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')

    const limitedProducts = mockTopProducts.slice(0, limit)

    return NextResponse.json(limitedProducts)

  } catch (error) {
    console.error('Top Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}