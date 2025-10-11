// app/api/vendor/dashboard/sales/route.ts
import { NextRequest, NextResponse } from 'next/server'

const mockSalesData = [
  { day: "Mon", sales: 12, revenue: 18500 },
  { day: "Tue", sales: 18, revenue: 26700 },
  { day: "Wed", sales: 15, revenue: 22500 },
  { day: "Thu", sales: 22, revenue: 34100 },
  { day: "Fri", sales: 25, revenue: 41200 },
  { day: "Sat", sales: 30, revenue: 49500 },
  { day: "Sun", sales: 24, revenue: 37800 }
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
    const range = searchParams.get('range') || '7d'

    // In production, you'd filter data based on the range
    // For now, return the weekly data
    return NextResponse.json(mockSalesData)

  } catch (error) {
    console.error('Sales API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}